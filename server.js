require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

/* ================= CORS FIX (ВАЖНО ДЛЯ ТЕЛЕФОНА) ================= */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/images", express.static("images"));

/* ================= DB ================= */
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.json({ status: "Backend working 🚀" });
});

/* ================= AUTH ================= */

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const exists = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const result = await pool.query(
      `INSERT INTO users (name, email, password, money, level)
       VALUES ($1, $2, $3, 1000, 1)
       RETURNING id, name, email, money, level`,
      [name, email, password]
    );

    res.json({
      success: true,
      user: result.rows[0],
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ error: "server error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await pool.query(
      "SELECT id, name, email, money, level FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({
      success: true,
      user,
      token: "fake-token-" + user.id,
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ error: "server error" });
  }
});

/* ================= PROFILE ================= */
app.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT id, name, email, avatar, level, money FROM users WHERE id=$1",
      [id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

/* ================= AVATAR ================= */
app.post("/update-avatar", async (req, res) => {
  try {
    const { userId, avatar } = req.body;

    await pool.query(
      "UPDATE users SET avatar=$1 WHERE id=$2",
      [avatar, userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

/* ================= CARS ================= */
app.get("/cars", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cars WHERE user_id IS NULL"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

/* ================= BUY CAR ================= */
app.post("/buy", async (req, res) => {
  try {
    const { userId, carId } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE id=$1", [userId]);
    const car = await pool.query("SELECT * FROM cars WHERE id=$1", [carId]);

    if (!user.rows[0] || !car.rows[0]) {
      return res.status(404).json({ error: "not found" });
    }

    if (user.rows[0].money < car.rows[0].price) {
      return res.status(400).json({ error: "not enough money" });
    }

    await pool.query(
      "UPDATE users SET money = money - $1 WHERE id=$2",
      [car.rows[0].price, userId]
    );

    await pool.query(
      "UPDATE cars SET user_id=$1 WHERE id=$2",
      [userId, carId]
    );

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

/* ================= GARAGE ================= */
app.get("/garage/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      "SELECT * FROM cars WHERE user_id=$1",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

/* ================= WHEEL ================= */
app.get("/wheel", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM wheel_items");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

app.post("/wheel/spin", async (req, res) => {
  try {
    const { userId } = req.body;

    const result = await pool.query("SELECT * FROM wheel_items");
    const items = result.rows;

    if (!items.length) {
      return res.status(400).json({ error: "wheel empty" });
    }

    let total = items.reduce((s, i) => s + i.chance, 0);

    let r = Math.random() * total;
    let index = 0;

    for (let i = 0; i < items.length; i++) {
      r -= items[i].chance;
      if (r <= 0) {
        index = i;
        break;
      }
    }

    const win = items[index];

    if (win.type === "money") {
      await pool.query(
        "UPDATE users SET money = money + $1 WHERE id=$2",
        [win.value, userId]
      );
    }

    if (win.type === "car") {
      await pool.query(
        "UPDATE cars SET user_id=$1 WHERE id=$2",
        [userId, win.value]
      );
    }

    if (win.type === "promo") {
      await pool.query(
        "UPDATE users SET level = level + 1 WHERE id=$1",
        [userId]
      );
    }

    res.json({
      success: true,
      win,
      index
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

/* ================= START ================= */
app.listen(5000, "0.0.0.0", () => {
  console.log("SERVER RUNNING ON http://localhost:5000 🚀");
});