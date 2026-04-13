
// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const { Pool } = require("pg");
// const TelegramBot = require("node-telegram-bot-api");

// const app = express();

// /* ================= MIDDLEWARE ================= */
// app.use(cors({
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// }));

// app.use(express.json({ limit: "20mb" }));

// /* ================= DB ================= */
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
// });

// const q = async (text, params) => {
//   try {
//     return await pool.query(text, params);
//   } catch (e) {
//     console.log("DB ERROR:", e.message);
//     return { rows: [] };
//   }
// };

// /* ================= TELEGRAM BOT (IN SERVER) ================= */
// const bot = new TelegramBot(process.env.BOT_TOKEN, {
//   polling: true,
// });

// bot.onText(/\/start (.+)/, async (msg, match) => {
//   const telegramId = msg.from.id;
//   const userId = match[1];

//   try {
//     await q(
//       "UPDATE users SET telegram_id=$1 WHERE id=$2",
//       [telegramId, userId]
//     );

//     bot.sendMessage(msg.chat.id, "✅ Telegram успешно подключён к аккаунту!");
//   } catch (err) {
//     console.log("TG ERROR:", err.message);
//   }
// });

// bot.on("message", (msg) => {
//   console.log("TG MESSAGE:", msg.text);
// });

// /* ================= HEALTH ================= */
// app.get("/", (req, res) => {
//   res.json({ status: "OK 🚀" });
// });

// /* ================= PROFILE ================= */
// app.get("/profile/:id", async (req, res) => {
//   const user = await q("SELECT * FROM users WHERE id=$1", [req.params.id]);
//   res.json(user.rows[0] || {});
// });

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

// app.post("/buy", async (req, res) => {
//   const { userId, carId } = req.body;

//   const user = (await q("SELECT * FROM users WHERE id=$1", [userId])).rows[0];
//   const car = (await q("SELECT * FROM cars WHERE id=$1", [carId])).rows[0];

//   if (!user || !car) {
//     return res.status(404).json({ error: "not found" });
//   }

//   if (user.money < car.price) {
//     return res.status(400).json({ error: "no money" });
//   }

//   await q("UPDATE users SET money = money - $1 WHERE id=$2", [
//     car.price,
//     userId,
//   ]);

//   await q("UPDATE cars SET user_id=$1 WHERE id=$2", [
//     userId,
//     carId,
//   ]);

//   res.json({ success: true });
// });

// /* ================= WHEEL ================= */
// app.get("/wheel", async (req, res) => {
//   const items = await q("SELECT * FROM wheel_items ORDER BY id");
//   res.json(items.rows);
// });

// app.post("/wheel/spin", async (req, res) => {
//   const { userId } = req.body;

//   const items = (await q("SELECT * FROM wheel_items")).rows;

//   let total = items.reduce((s, i) => s + Number(i.chance), 0);
//   let r = Math.random() * total;

//   let win = items[0];
//   let index = 0;

//   for (let i = 0; i < items.length; i++) {
//     r -= Number(items[i].chance);
//     if (r <= 0) {
//       win = items[i];
//       index = i;
//       break;
//     }
//   }

//   if (win.type === "money") {
//     await q(
//       "UPDATE users SET money = money + $1 WHERE id=$2",
//       [win.value, userId]
//     );
//   }

//   if (win.type === "car") {
//     await q(
//       "UPDATE cars SET user_id=$1 WHERE id=$2",
//       [userId, win.value]
//     );
//   }

//   if (win.type === "promo") {
//     await q(
//       "UPDATE users SET level = level + 1 WHERE id=$1",
//       [userId]
//     );
//   }

//   res.json({
//     success: true,
//     win,
//     index,
//   });
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

//   if (promo.type === "spin") {
//     await q(
//       "UPDATE users SET used_promo=true WHERE id=$1",
//       [userId]
//     );
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

// /* ================= START SERVER ================= */
// app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
//   console.log("🚀 SERVER RUNNING");
// });




require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

/* ================= MIDDLEWARE ================= */
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

/* ================= TELEGRAM BOT ================= */
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

/* ================= CONNECT TG ================= */
bot.onText(/\/start (.+)/, async (msg, match) => {
  const telegramId = msg.from.id;
  const userId = match?.[1];

  if (!userId) {
    return bot.sendMessage(msg.chat.id, "❌ Invalid start link");
  }

  try {
    await q(
      "UPDATE users SET telegram_id=$1 WHERE id=$2",
      [telegramId, userId]
    );

    bot.sendMessage(
      msg.chat.id,
      "✅ Telegram successfully connected!"
    );
  } catch (e) {
    console.log("TG ERROR:", e.message);
  }
});

/* ================= SEND ORDER TO TG ================= */
app.post("/order-to-tg", async (req, res) => {
  const { user, car, configs } = req.body;

  if (!car || !configs) {
    return res.status(400).json({ error: "invalid data" });
  }

  const text = `
🚗 NEW ORDER

👤 User: ${user?.name || "Unknown"}
🆔 ID: ${user?.id || "-"}

🚘 Car: ${car.brand} ${car.name}

⚙️ CONFIG:
• HP: ${configs.hp || "-"}
• Tuning: ${configs.tuning || "-"}
• Wheels: ${configs.wheels || "-"}
`;

  try {
    await bot.sendMessage(process.env.CHAT_ID, text);
    res.json({ success: true });
  } catch (e) {
    console.log("TG SEND ERROR:", e.message);
    res.status(500).json({ error: "telegram failed" });
  }
});

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.json({ status: "OK 🚀" });
});

/* ================= PROFILE ================= */
app.get("/profile/:id", async (req, res) => {
  const user = await q(
    "SELECT * FROM users WHERE id=$1",
    [req.params.id]
  );

  res.json(user.rows[0] || {});
});

app.post("/update-avatar", async (req, res) => {
  const { userId, avatar } = req.body;

  const result = await q(
    "UPDATE users SET avatar=$1 WHERE id=$2 RETURNING *",
    [avatar, userId]
  );

  res.json({
    success: true,
    user: result.rows[0],
  });
});

/* ================= CARS ================= */
app.get("/cars", async (req, res) => {
  const cars = await q("SELECT * FROM cars WHERE user_id IS NULL");
  res.json(cars.rows);
});

/* ================= BUY ================= */
app.post("/buy", async (req, res) => {
  const { userId, carId } = req.body;

  const user = (
    await q("SELECT * FROM users WHERE id=$1", [userId])
  ).rows[0];

  const car = (
    await q("SELECT * FROM cars WHERE id=$1", [carId])
  ).rows[0];

  if (!user || !car) {
    return res.status(404).json({ error: "not found" });
  }

  await q(
    "UPDATE cars SET user_id=$1 WHERE id=$2",
    [userId, carId]
  );

  res.json({ success: true });
});

/* ================= PROMO ================= */
app.post("/promo/redeem", async (req, res) => {
  const { userId, code } = req.body;

  const promo = (
    await q("SELECT * FROM promo_codes WHERE code=$1", [code])
  ).rows[0];

  if (!promo) {
    return res.status(400).json({ error: "invalid promo" });
  }

  const used = promo.used_by || [];

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

  res.json({
    success: true,
    type: promo.type,
    value: promo.value,
  });
});

/* ================= START ================= */
app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log("🚀 SERVER RUNNING");
});