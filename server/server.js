// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const { Pool } = require("pg");

// const app = express();

// /* ================= MIDDLEWARE ================= */
// app.use(cors({
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// /* ================= DB (NEON SAFE) ================= */
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     require: true,
//     rejectUnauthorized: false
//   }
// });

// /* DB CONNECT LOG */
// pool.connect()
//   .then(() => console.log("✅ DB CONNECTED"))
//   .catch(err => console.log("❌ DB ERROR:", err.message));

// /* ================= HEALTH ================= */
// app.get("/", (req, res) => {
//   res.json({ status: "Backend working 🚀" });
// });

// /* ================= SAFE QUERY ================= */
// const safeQuery = async (query, params = []) => {
//   try {
//     return await pool.query(query, params);
//   } catch (err) {
//     console.log("DB ERROR:", err.message);
//     return { rows: [] };
//   }
// };

// /* ================= AUTH ================= */

// // REGISTER
// app.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "Missing fields" });
//     }

//     const exists = await safeQuery(
//       "SELECT id FROM users WHERE email=$1",
//       [email]
//     );

//     if (exists.rows.length > 0) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     const result = await safeQuery(
//       `INSERT INTO users (name, email, password, money, level)
//        VALUES ($1, $2, $3, 1000, 1)
//        RETURNING id, name, email, money, level`,
//       [name, email, password]
//     );

//     res.json({
//       success: true,
//       user: result.rows[0] || null
//     });

//   } catch (err) {
//     console.log("REGISTER ERROR:", err.message);
//     res.status(500).json({ error: "server error" });
//   }
// });

// // LOGIN
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     console.log("LOGIN:", req.body);

//     if (!email || !password) {
//       return res.status(400).json({ error: "Missing fields" });
//     }

//     const result = await safeQuery(
//       `SELECT id, name, email, money, level
//        FROM users
//        WHERE email=$1 AND password=$2`,
//       [email, password]
//     );

//     const user = result.rows[0];

//     if (!user) {
//       return res.status(400).json({ error: "Invalid credentials" });
//     }

//     res.json({
//       success: true,
//       user,
//       token: "fake-" + user.id
//     });

//   } catch (err) {
//     console.log("LOGIN ERROR:", err.message);
//     res.status(500).json({ error: "server error" });
//   }
// });

// /* ================= PROFILE ================= */
// app.get("/profile/:id", async (req, res) => {
//   const result = await safeQuery(
//     "SELECT id, name, email, avatar, level, money FROM users WHERE id=$1",
//     [req.params.id]
//   );

//   res.json(result.rows[0] || {});
// });

// /* ================= CARS ================= */
// app.get("/cars", async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT id, name, brand, dvigatel, power, speed, price, image_url, premium
//       FROM cars
//       WHERE user_id IS NULL
//     `);

//     res.json(result.rows);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "server error" });
//   }
// });

// /* ================= GARAGE ================= */
// app.get("/garage/:userId", async (req, res) => {
//   const result = await safeQuery(
//     "SELECT * FROM cars WHERE user_id=$1",
//     [req.params.userId]
//   );

//   res.json(result.rows || []);
// });

// /* ================= BUY ================= */
// app.post("/buy", async (req, res) => {
//   try {
//     const { userId, carId } = req.body;

//     const user = await safeQuery("SELECT * FROM users WHERE id=$1", [userId]);
//     const car = await safeQuery("SELECT * FROM cars WHERE id=$1", [carId]);

//     if (!user.rows[0] || !car.rows[0]) {
//       return res.status(404).json({ error: "not found" });
//     }

//     if (user.rows[0].money < car.rows[0].price) {
//       return res.status(400).json({ error: "not enough money" });
//     }

//     await safeQuery(
//       "UPDATE users SET money = money - $1 WHERE id=$2",
//       [car.rows[0].price, userId]
//     );

//     await safeQuery(
//       "UPDATE cars SET user_id=$1 WHERE id=$2",
//       [userId, carId]
//     );

//     res.json({ success: true });

//   } catch (err) {
//     console.log("BUY ERROR:", err.message);
//     res.status(500).json({ error: "server error" });
//   }
// });

// /* ================= WHEEL ================= */
// app.post("/wheel/spin", async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (!userId) {
//       return res.status(400).json({ error: "No userId" });
//     }

//     const result = await safeQuery("SELECT * FROM wheel_items");
//     const items = result.rows;

//     if (!items.length) {
//       return res.status(400).json({ error: "wheel empty" });
//     }

//     let total = items.reduce((s, i) => s + Number(i.chance || 0), 0);
//     let r = Math.random() * total;

//     let win = items[0];
//     let winIndex = 0; // ✅ ВОТ ЧТО У ТЕБЯ НЕ ХВАТАЛО

//     for (let i = 0; i < items.length; i++) {
//       r -= Number(items[i].chance || 0);
//       if (r <= 0) {
//         win = items[i];
//         winIndex = i;
//         break;
//       }
//     }

//     console.log("WIN:", win, "INDEX:", winIndex);

//     // 💰 награды безопасно
//     if (win.type === "money" && win.value) {
//       await safeQuery(
//         "UPDATE users SET money = money + $1 WHERE id=$2",
//         [win.value, userId]
//       );
//     }

//     if (win.type === "car" && win.value) {
//       await safeQuery(
//         "UPDATE cars SET user_id=$1 WHERE id=$2",
//         [userId, win.value]
//       );
//     }

//     if (win.type === "promo") {
//       await safeQuery(
//         "UPDATE users SET level = level + 1 WHERE id=$1",
//         [userId]
//       );
//     }

//     // ✅ теперь всё ок
//     res.json({
//       success: true,
//       index: winIndex,
//       win
//     });

//   } catch (err) {
//     console.log("WHEEL ERROR FULL:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// /* ================= START ================= */
// app.listen(5000, "0.0.0.0", () => {
//   console.log("🚀 SERVER RUNNING ON PORT 5000");
// });









require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= DB ================= */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log("✅ DB CONNECTED"))
  .catch(err => console.log("❌ DB ERROR:", err.message));

/* ================= SAFE QUERY ================= */
const safeQuery = async (query, params = []) => {
  try {
    return await pool.query(query, params);
  } catch (err) {
    console.log("DB ERROR:", err.message);
    return { rows: [] };
  }
};

/* ================= HEALTH ================= */
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
    console.log("REGISTER ERROR:", err.message);
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

    const result = await safeQuery(
      `SELECT id, name, email, money, level
       FROM users
       WHERE email=$1 AND password=$2`,
      [email, password]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({
      success: true,
      user,
      token: "fake-" + user.id
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err.message);
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
  try {
    const result = await pool.query(`
      SELECT id, name, brand, dvigatel, power, speed, price, image_url, premium
      FROM cars
      WHERE user_id IS NULL
    `);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});

/* ================= GARAGE ================= */
app.get("/garage/:userId", async (req, res) => {
  const result = await safeQuery(
    "SELECT * FROM cars WHERE user_id=$1",
    [req.params.userId]
  );

  res.json(result.rows);
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
    console.log("BUY ERROR:", err.message);
    res.status(500).json({ error: "server error" });
  }
});

/* ================= WHEEL (GET ITEMS) ================= */
/* ================= WHEEL ================= */
app.get("/wheel", async (req, res) => {
  const result = await safeQuery("SELECT * FROM wheel_items ORDER BY id ASC");
  res.json(result.rows);
});

app.post("/wheel/spin", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "No userId" });
    }

    const result = await safeQuery("SELECT * FROM wheel_items");
    const items = result.rows;

    if (!items.length) {
      return res.status(400).json({ error: "wheel empty" });
    }

    // 🎯 RNG (weighted)
    let total = items.reduce((s, i) => s + Number(i.chance || 0), 0);
    let r = Math.random() * total;

    let win = items[0];

    for (let i = 0; i < items.length; i++) {
      r -= Number(items[i].chance || 0);
      if (r <= 0) {
        win = items[i];
        break;
      }
    }

    // 💰 rewards
    if (win.type === "money") {
      await safeQuery(
        "UPDATE users SET money = money + $1 WHERE id=$2",
        [win.value, userId]
      );
    }

    if (win.type === "car") {
      await safeQuery(
        "UPDATE cars SET user_id=$1 WHERE id=$2",
        [userId, win.value]
      );
    }

    if (win.type === "promo") {
      await safeQuery(
        "UPDATE users SET level = level + 1 WHERE id=$1",
        [userId]
      );
    }

    return res.json({
      success: true,
      winId: win.id,   // 🔥 ВАЖНО
      win
    });

  } catch (err) {
    console.log("WHEEL ERROR:", err.message);
    res.status(500).json({ error: "server error" });
  }
});

/* ================= START ================= */
app.listen(5000, "0.0.0.0", () => {
  console.log("🚀 SERVER RUNNING ON PORT 5000");
});
