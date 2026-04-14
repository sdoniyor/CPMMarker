
// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const { Pool } = require("pg");
// const bcrypt = require("bcrypt");
// const TelegramBot = require("node-telegram-bot-api");

// const app = express();

// /* ================= MIDDLEWARE ================= */
// app.use(cors({ origin: "*" }));
// app.use(express.json({ limit: "10mb" }));

// /* ================= DB ================= */
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.DATABASE_URL
//     ? { rejectUnauthorized: false }
//     : false,
// });

// const q = async (text, params = []) => {
//   try {
//     return await pool.query(text, params);
//   } catch (e) {
//     console.log("DB ERROR:", e.message);
//     return { rows: [] };
//   }
// };

// /* ================= SAFE JSON ================= */
// const safeJSON = (val, fallback = []) => {
//   try {
//     if (!val || val === "null" || val === "undefined") return fallback;
//     if (Array.isArray(val)) return val;
//     return JSON.parse(val);
//   } catch {
//     return fallback;
//   }
// };

// /* ================= TELEGRAM ================= */
// let bot = null;

// if (process.env.BOT_TOKEN) {
//   bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
//   console.log("🤖 Telegram OK");
// }

// /* ================= HEALTH ================= */
// app.get("/", (req, res) => {
//   res.json({ ok: true });
// });

// /* ================= REGISTER ================= */
// app.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ error: "missing fields" });
//     }

//     const exists = await q(
//       "SELECT id FROM users WHERE email=$1 OR name=$2",
//       [email, name]
//     );

//     if (exists.rows.length > 0) {
//       return res.status(409).json({ error: "user already exists" });
//     }

//     const hash = await bcrypt.hash(password, 10);

//     const user = await q(
//       `INSERT INTO users (name, email, password, level, money, avatar, discount, discount_cars, used_promo)
//        VALUES ($1,$2,$3,1,0,'',0,'[]','[]')
//        RETURNING id, name, email, level, money, avatar`,
//       [name, email, hash]
//     );

//     return res.json(user.rows[0]);
//   } catch (e) {
//     console.log(e.message);
//     return res.status(500).json({ error: "register failed" });
//   }
// });

// /* ================= LOGIN (FIXED) ================= */
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "missing fields" });
//     }

//     const userRes = await q(
//       "SELECT * FROM users WHERE email=$1",
//       [email]
//     );

//     const user = userRes.rows[0];

//     if (!user) {
//       return res.status(404).json({ error: "user not found" });
//     }

//     const ok = await bcrypt.compare(password, user.password);

//     if (!ok) {
//       return res.status(401).json({ error: "wrong password" });
//     }

//     delete user.password;

//     return res.json({
//       user,
//       token: "demo-token"
//     });

//   } catch (e) {
//     console.log(e.message);
//     return res.status(500).json({ error: "login failed" });
//   }
// });

// /* ================= PROFILE ================= */
// app.get("/profile/:id", async (req, res) => {
//   try {
//     const r = await q("SELECT * FROM users WHERE id=$1", [req.params.id]);
//     const u = r.rows[0];

//     if (!u) return res.json(null);

//     u.discount_cars = safeJSON(u.discount_cars, []);
//     u.used_promo = safeJSON(u.used_promo, []);

//     delete u.password;

//     return res.json(u);
//   } catch {
//     return res.status(500).json({ error: "profile error" });
//   }
// });

// /* ================= CARS ================= */
// app.get("/cars", async (req, res) => {
//   const r = await q("SELECT * FROM cars");
//   return res.json(r.rows || []);
// });

// /* ================= CONFIGS (FIXED) ================= */
// app.get("/configs", async (req, res) => {
//   const r = await q("SELECT * FROM global_car_configs");

//   const rows = r.rows || [];

//   return res.json({
//     power: rows.filter(i => i.type === "power"),
//     tuning: rows.filter(i => i.type === "tuning"),
//     wheels: rows.filter(i => i.type === "wheels"),
//   });
// });

// /* ================= AVATAR ================= */
// app.post("/update-avatar", async (req, res) => {
//   try {
//     const { userId, avatar } = req.body;

//     await q(
//       "UPDATE users SET avatar=$1 WHERE id=$2",
//       [avatar, userId]
//     );

//     return res.json({ success: true });
//   } catch {
//     return res.status(500).json({ error: "avatar failed" });
//   }
// });

// /* ================= PROMO ================= */
// app.post("/promo/redeem", async (req, res) => {
//   try {
//     const { userId, code } = req.body;

//     const r = await q("SELECT * FROM promo_codes WHERE code=$1", [code]);
//     const promo = r.rows[0];

//     if (!promo) return res.status(404).json({ error: "invalid promo" });

//     const used = safeJSON(promo.used_by, []);

//     if (used.includes(userId)) {
//       return res.status(400).json({ error: "already used" });
//     }

//     if (promo.type === "discount") {
//       await q(
//         "UPDATE users SET discount=$1, discount_cars=$2 WHERE id=$3",
//         [promo.value, JSON.stringify(promo.car_ids || []), userId]
//       );
//     }

//     return res.json({ success: true });
//   } catch {
//     return res.status(500).json({ error: "promo failed" });
//   }
// });

// /* ================= TELEGRAM LINK (FIXED) ================= */
// app.post("/telegram/link", async (req, res) => {
//   try {
//     const { userId, telegram_id, username } = req.body;

//     const r = await q(
//       `UPDATE users 
//        SET telegram_id=$1, telegram_username=$2 
//        WHERE id=$3
//        RETURNING id, telegram_id, telegram_username`,
//       [telegram_id, username || null, userId]
//     );

//     return res.json({ success: true, user: r.rows[0] });
//   } catch {
//     return res.status(500).json({ error: "telegram link failed" });
//   }
// });

// /* ================= TELEGRAM BOT CONNECT ================= */
// if (bot) {
//   bot.onText(/\/start (.+)/, async (msg, match) => {
//     try {
//       const userId = match[1];
//       const telegram_id = msg.from.id;
//       const username = msg.from.username || null;

//       await q(
//         `UPDATE users 
//          SET telegram_id=$1, telegram_username=$2 
//          WHERE id=$3`,
//         [telegram_id, username, userId]
//       );

//       await bot.sendMessage(
//         telegram_id,
//         "✅ Telegram connected successfully!"
//       );

//       console.log("TG CONNECT:", { userId, telegram_id, username });
//     } catch (e) {
//       console.log(e.message);
//     }
//   });
// }

// /* ================= ORDER TO TG ================= */
// app.post("/order-to-tg", async (req, res) => {
//   try {
//     const { user, car, configs, total } = req.body;

//     const chatId = process.env.CHAT_ID;

//     const text =
// `🚗 NEW ORDER

// 👤 ${user?.name || "-"}
// 🔗 @${user?.username || "no_username"}
// 🆔 ${user?.tg_id || "-"}

// 🚘 ${car?.brand || ""} ${car?.name || ""}

// ⚙️ CONFIGS:
// ${configs?.map(c => "• " + c).join("\n") || "-"}

// 💰 TOTAL: ${total}$`;

//     await bot.sendMessage(chatId, text);

//     return res.json({ success: true });
//   } catch (e) {
//     return res.status(500).json({ error: "telegram failed" });
//   }
// });

// /* ================= START ================= */
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log("🚀 SERVER RUNNING:", PORT);
// });




require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const marketRoutes = require("./routes/market");
const profileRoutes = require("./routes/profile");
const telegramRoutes = require("./routes/telegram");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

/* ================= ROUTES ================= */

/**
 * AUTH
 * /auth/login
 * /auth/register
 */
app.use("/auth", authRoutes);

/**
 * MARKET
 * /market/cars
 * /market/configs
 */
app.use("/market", marketRoutes);

/**
 * PROFILE
 * /profile/:id
 * /profile/update-avatar
 */
app.use("/profile", profileRoutes);

/**
 * TELEGRAM
 * /telegram/...
 */
app.use("/telegram", telegramRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "CPM SERVER RUNNING 🚀",
  });
});

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 SERVER RUNNING ON PORT:", PORT);
});