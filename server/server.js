
// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const { Pool } = require("pg");
// const TelegramBot = require("node-telegram-bot-api");

// const app = express();

// /* ================= MIDDLEWARE ================= */
// app.use(cors({ origin: "*" }));
// app.use(express.json({ limit: "20mb" }));

// /* ================= DB ================= */
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.DATABASE_URL
//     ? { rejectUnauthorized: false }
//     : false,
// });

// const q = async (text, params) => {
//   try {
//     return await pool.query(text, params);
//   } catch (e) {
//     console.log("DB ERROR:", e.message);
//     return { rows: [] };
//   }
// };

// /* ================= TELEGRAM BOT ================= */
// let bot;

// try {
//   if (process.env.BOT_TOKEN) {
//     bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
//     console.log("🤖 Telegram bot started");
//   }
// } catch (e) {
//   console.log("BOT INIT ERROR:", e.message);
// }

// /* ================= CONFIGS ================= */
// app.get("/configs", async (req, res) => {
//   try {
//     const result = await q("SELECT * FROM global_car_configs");

//     const rows = result.rows || [];

//     res.json({
//       power: rows.filter(i => i.type === "power"),
//       tuning: rows.filter(i => i.type === "tuning"),
//       wheels: rows.filter(i => i.type === "wheels"),
//     });

//   } catch (e) {
//     console.log("CONFIG ERROR:", e.message);
//     res.json({ power: [], tuning: [], wheels: [] });
//   }
// });

// /* ================= TELEGRAM CONNECT ================= */
// if (bot) {
//   bot.onText(/\/start (.+)/, async (msg, match) => {
//     const telegramId = msg.from.id;
//     const userId = match?.[1];

//     if (!userId) {
//       return bot.sendMessage(msg.chat.id, "❌ Invalid start link");
//     }

//     try {
//       await q(
//         "UPDATE users SET telegram_id=$1 WHERE id=$2",
//         [telegramId, userId]
//       );

//       bot.sendMessage(msg.chat.id, "✅ Telegram connected!");
//     } catch (e) {
//       console.log("TG ERROR:", e.message);
//     }
//   });
// }

// /* ================= ORDER TO TG (FIXED) ================= */
// app.post("/order-to-tg", async (req, res) => {
//   try {
//     const { user, car, configs, total } = req.body;

//     if (!bot) {
//       return res.status(500).json({ error: "bot not initialized" });
//     }

//     const chatId = process.env.CHAT_ID;

//     if (!chatId) {
//       return res.status(500).json({ error: "CHAT_ID missing" });
//     }

//     const text = `
// 🚗 NEW ORDER

// 👤 User: ${user?.name || "Unknown"}
// 🧾 Username: ${user?.username ? "@" + user.username : "none"}
// 🆔 TG ID: ${user?.tg_id || "unknown"}

// 🚘 Car: ${car?.brand || ""} ${car?.name || ""}

// ⚙️ CONFIGS:
// ${Array.isArray(configs) && configs.length
//   ? configs.map(c => "• " + c).join("\n")
//   : "• none"}

// 💰 TOTAL: ${total || 0} $
// `;

//     await bot.sendMessage(chatId, text);

//     return res.json({ success: true });

//   } catch (err) {
//     console.log("🔥 ORDER ERROR:", err);

//     return res.status(500).json({
//       error: "telegram send failed",
//       detail: err.message
//     });
//   }
// });

// /* ================= HEALTH ================= */
// app.get("/", (req, res) => {
//   res.json({ status: "OK 🚀" });
// });

// /* ================= PROFILE ================= */
// app.get("/profile/:id", async (req, res) => {
//   const user = await q(
//     "SELECT * FROM users WHERE id=$1",
//     [req.params.id]
//   );

//   res.json(user.rows[0] || {});
// });

// /* ================= AVATAR ================= */
// app.post("/update-avatar", async (req, res) => {
//   const { userId, avatar } = req.body;

//   const result = await q(
//     "UPDATE users SET avatar=$1 WHERE id=$2 RETURNING *",
//     [avatar, userId]
//   );

//   res.json({
//     success: true,
//     user: result.rows[0] || null,
//   });
// });

// /* ================= CARS ================= */
// app.get("/cars", async (req, res) => {
//   const cars = await q("SELECT * FROM cars WHERE user_id IS NULL");
//   res.json(cars.rows);
// });

// /* ================= BUY ================= */
// app.post("/buy", async (req, res) => {
//   const { userId, carId } = req.body;

//   const user = (await q("SELECT * FROM users WHERE id=$1", [userId])).rows[0];
//   const car = (await q("SELECT * FROM cars WHERE id=$1", [carId])).rows[0];

//   if (!user || !car) {
//     return res.status(404).json({ error: "not found" });
//   }

//   await q(
//     "UPDATE cars SET user_id=$1 WHERE id=$2",
//     [userId, carId]
//   );

//   res.json({ success: true });
// });

// /* ================= PROMO ================= */
// app.post("/promo/redeem", async (req, res) => {
//   const { userId, code } = req.body;

//   const promo = (await q(
//     "SELECT * FROM promo_codes WHERE code=$1",
//     [code]
//   )).rows[0];

//   if (!promo) {
//     return res.status(400).json({ error: "invalid promo" });
//   }

//   const used = promo.used_by || [];

//   if (used.includes(userId)) {
//     return res.status(400).json({ error: "already used" });
//   }

//   if (promo.type === "discount") {
//     await q(
//       "UPDATE users SET discount=$1, discount_cars=$2 WHERE id=$3",
//       [
//         Number(promo.value),
//         JSON.stringify(promo.car_ids || []),
//         userId,
//       ]
//     );
//   }

//   await q(
//     "UPDATE promo_codes SET used_by = array_append(COALESCE(used_by,'{}'), $1) WHERE code=$2",
//     [userId, code]
//   );

//   res.json({
//     success: true,
//     type: promo.type,
//     value: promo.value,
//   });
// });

// /* ================= START ================= */
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, "0.0.0.0", () => {
//   console.log("🚀 SERVER RUNNING ON", PORT);
// });





require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const TelegramBot = require("node-telegram-bot-api");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "20mb" }));

/* ================= DB ================= */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false,
});

const q = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (e) {
    console.log("DB ERROR:", e.message);
    return { rows: [] };
  }
};

/* ================= TELEGRAM (SAFE) ================= */
let bot = null;

if (process.env.BOT_TOKEN) {
  try {
    bot = new TelegramBot(process.env.BOT_TOKEN, {
      polling: false,
    });
    console.log("🤖 Telegram ready");
  } catch (e) {
    console.log("BOT ERROR:", e.message);
  }
}

/* ================= SAFE JSON ================= */
const safeJSON = (val, fallback = []) => {
  try {
    if (!val) return fallback;
    if (Array.isArray(val)) return val;
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

/* ================= CONFIGS ================= */
app.get("/configs", async (req, res) => {
  const result = await q("SELECT * FROM global_car_configs");
  const rows = result.rows || [];

  res.json({
    power: rows.filter(i => i.type === "power"),
    tuning: rows.filter(i => i.type === "tuning"),
    wheels: rows.filter(i => i.type === "wheels"),
  });
});

/* ================= REGISTER ================= */
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "fill all fields" });
  }

  try {
    const exists = await q(
      "SELECT id FROM users WHERE email=$1 OR name=$2",
      [email, name]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({
        error: "email or name already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await q(
      `INSERT INTO users (name, email, password)
       VALUES ($1,$2,$3)
       RETURNING id, name, email`,
      [name, email, hashed]
    );

    return res.json(user.rows[0]);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "register failed" });
  }
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = (await q(
      "SELECT * FROM users WHERE email=$1",
      [email]
    )).rows[0];

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(401).json({ error: "wrong password" });
    }

    delete user.password;

    return res.json(user);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "login failed" });
  }
});

/* ================= PROFILE ================= */
app.get("/profile/:id", async (req, res) => {
  const user = await q(
    "SELECT * FROM users WHERE id=$1",
    [req.params.id]
  );

  const u = user.rows[0] || {};

  u.discount_cars = safeJSON(u.discount_cars, []);
  u.used_promo = safeJSON(u.used_promo, []);

  return res.json(u);
});

/* ================= CARS ================= */
app.get("/cars", async (req, res) => {
  const cars = await q("SELECT * FROM cars WHERE user_id IS NULL");
  res.json(cars.rows);
});

/* ================= BUY ================= */
app.post("/buy", async (req, res) => {
  const { userId, carId } = req.body;

  await q(
    "UPDATE cars SET user_id=$1 WHERE id=$2",
    [userId, carId]
  );

  res.json({ success: true });
});

/* ================= PROMO ================= */
app.post("/promo/redeem", async (req, res) => {
  const { userId, code } = req.body;

  const promo = (await q(
    "SELECT * FROM promo_codes WHERE code=$1",
    [code]
  )).rows[0];

  if (!promo) {
    return res.status(404).json({ error: "invalid promo" });
  }

  const used = safeJSON(promo.used_by, []);

  if (used.includes(userId)) {
    return res.status(400).json({ error: "already used" });
  }

  if (promo.type === "discount") {
    await q(
      "UPDATE users SET discount=$1, discount_cars=$2 WHERE id=$3",
      [
        Number(promo.value),
        JSON.stringify(promo.car_ids || []),
        userId,
      ]
    );
  }

  await q(
    "UPDATE promo_codes SET used_by = array_append(COALESCE(used_by,'{}'), $1) WHERE code=$2",
    [userId, code]
  );

  res.json({ success: true });
});

/* ================= ORDER TO TG ================= */
app.post("/order-to-tg", async (req, res) => {
  try {
    if (!bot) {
      return res.status(500).json({ error: "telegram bot not ready" });
    }

    const { user, car, configs, total } = req.body;

    const chatId = process.env.CHAT_ID;

    const text =
`🚗 NEW ORDER

👤 ${user?.name || "-"}
📧 ${user?.email || "-"}
🆔 ${user?.id || "-"}

🚘 ${car?.brand || ""} ${car?.name || ""}

⚙️ CONFIGS:
${Array.isArray(configs) ? configs.map(c => "• " + c).join("\n") : "none"}

💰 TOTAL: ${total || 0} $`;

    await bot.sendMessage(chatId, text);

    res.json({ success: true });

  } catch (e) {
    console.log("ORDER ERROR:", e.message);
    res.status(500).json({ error: "telegram failed" });
  }
});

/* ================= START ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 SERVER RUNNING ON", PORT);
});