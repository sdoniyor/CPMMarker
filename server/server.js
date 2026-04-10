require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

/* ================= DB (NEON SAFE) ================= */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

/* проверка подключения */
pool.connect()
  .then(() => console.log("✅ DB CONNECTED"))
  .catch(err => console.log("❌ DB ERROR:", err.message));

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.json({ status: "Backend working 🚀" });
});

/* ================= SAFE QUERY WRAPPER ================= */
const safeQuery = async (query, params = []) => {
  try {
    return await pool.query(query, params);
  } catch (err) {
    console.log("DB ERROR:", err.message);
    return { rows: [] }; // ❗ чтобы фронт НЕ падал
  }
};

/* ================= AUTH ================= */

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await safeQuery(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const result = await safeQuery(
      `INSERT INTO users (name, email, password, money, level)
       VALUES ($1, $2, $3, 1000, 1)
       RETURNING id, name, email, money, level`,
      [name, email, password]
    );

    res.json({ success: true, user: result.rows[0] });

  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await safeQuery(
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
      token: "fake-token-" + user.id
    });

  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

/* ================= PROFILE ================= */
app.get("/profile/:id", async (req, res) => {
  const result = await safeQuery(
    "SELECT id, name, email, avatar, level, money FROM users WHERE id=$1",
    [req.params.id]
  );

  res.json(result.rows[0] || {});
});

/* ================= CARS ================= */
app.get("/cars", async (req, res) => {
  const result = await safeQuery(
    "SELECT * FROM cars WHERE user_id IS NULL"
  );

  res.json(result.rows || []);
});

/* ================= GARAGE ================= */
app.get("/garage/:userId", async (req, res) => {
  const result = await safeQuery(
    "SELECT * FROM cars WHERE user_id=$1",
    [req.params.userId]
  );

  res.json(result.rows || []);
});

/* ================= BUY ================= */
app.post("/buy", async (req, res) => {
  try {
    const { userId, carId } = req.body;

    const user = await safeQuery("SELECT * FROM users WHERE id=$1", [userId]);
    const car = await safeQuery("SELECT * FROM cars WHERE id=$1", [carId]);

    if (!user.rows[0] || !car.rows[0]) {
      return res.status(404).json({ error: "not found" });
    }

    if (user.rows[0].money < car.rows[0].price) {
      return res.status(400).json({ error: "not enough money" });
    }

    await safeQuery(
      "UPDATE users SET money = money - $1 WHERE id=$2",
      [car.rows[0].price, userId]
    );

    await safeQuery(
      "UPDATE cars SET user_id=$1 WHERE id=$2",
      [userId, carId]
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
});

/* ================= START ================= */
app.listen(5000, "0.0.0.0", () => {
  console.log("🚀 SERVER RUNNING ON PORT 5000");
});