
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

// /* ================= TELEGRAM BOT SAFE INIT ================= */
// let bot;

// try {
//   if (process.env.BOT_TOKEN) {
//     bot = new TelegramBot(process.env.BOT_TOKEN, {
//       polling: true,
//     });
//     console.log("🤖 Telegram bot started");
//   }
// } catch (e) {
//   console.log("BOT INIT ERROR:", e.message);
// }

// /* ================= CONFIGS (FIX 404) ================= */
// app.get("/configs", async (req, res) => {
//   try {
//     const result = await q("SELECT * FROM global_car_configs");

//     const rows = result.rows || [];

//     const power = rows.filter(i => i.type === "power");
//     const tuning = rows.filter(i => i.type === "tuning");
//     const wheels = rows.filter(i => i.type === "wheels");

//     res.json({ power, tuning, wheels });
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

// /* ================= ORDER TO TG ================= */
// app.post("/order-to-tg", async (req, res) => {
//   const { user, car, configs } = req.body;

//   if (!bot) {
//     return res.status(500).json({ error: "bot not running" });
//   }

//   const chatId = process.env.CHAT_ID || "@snrice1";

//   const text = `
// 🚗 NEW ORDER

// 👤 User: ${user?.name || "Unknown"}

// 🚘 Car: ${car?.brand || ""} ${car?.name || ""}

// ⚙️ CONFIG:
// • HP: ${configs?.hp || "-"}
// • Tuning: ${configs?.tuning || "-"}
// • Wheels: ${configs?.wheels || "-"}
// `;

//   try {
//     await bot.sendMessage(chatId, text);
//     res.json({ success: true });
//   } catch (e) {
//     console.log("TG ERROR:", e.message);
//     res.status(500).json({ error: "telegram failed" });
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
let bot;

try {
  if (process.env.BOT_TOKEN) {
    bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
    console.log("🤖 Telegram bot started");
  }
} catch (e) {
  console.log("BOT INIT ERROR:", e.message);
}

/* ================= CONFIGS ================= */
app.get("/configs", async (req, res) => {
  try {
    const result = await q("SELECT * FROM global_car_configs");

    const rows = result.rows || [];

    res.json({
      power: rows.filter(i => i.type === "power"),
      tuning: rows.filter(i => i.type === "tuning"),
      wheels: rows.filter(i => i.type === "wheels"),
    });

  } catch (e) {
    console.log("CONFIG ERROR:", e.message);
    res.json({ power: [], tuning: [], wheels: [] });
  }
});

/* ================= TELEGRAM CONNECT ================= */
if (bot) {
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

      bot.sendMessage(msg.chat.id, "✅ Telegram connected!");
    } catch (e) {
      console.log("TG ERROR:", e.message);
    }
  });
}

/* ================= ORDER TO TG (FIXED) ================= */
app.post("/order-to-tg", async (req, res) => {
  try {
    const { user, car, configs, total } = req.body;

    if (!bot) {
      return res.status(500).json({ error: "bot not running" });
    }

    const chatId = process.env.CHAT_ID || "@snrice1";

    const text = `
🚗 NEW ORDER

👤 User: ${user?.name || "Unknown"}
🧾 Username: ${user?.username ? "@" + user.username : "none"}
🆔 TG ID: ${user?.tg_id || "unknown"}

🚘 Car: ${car?.brand || ""} ${car?.name || ""}

⚙️ CONFIGS:
${Array.isArray(configs) && configs.length
  ? configs.map(c => "• " + c).join("\n")
  : "• No configs"}

💰 TOTAL: ${total || 0} $
`;

    await bot.sendMessage(chatId, text);

    return res.json({ success: true });

  } catch (e) {
    console.log("TG ERROR:", e.message);
    return res.status(500).json({ error: "telegram failed" });
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

/* ================= AVATAR ================= */
app.post("/update-avatar", async (req, res) => {
  const { userId, avatar } = req.body;

  const result = await q(
    "UPDATE users SET avatar=$1 WHERE id=$2 RETURNING *",
    [avatar, userId]
  );

  res.json({
    success: true,
    user: result.rows[0] || null,
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

  const user = (await q("SELECT * FROM users WHERE id=$1", [userId])).rows[0];
  const car = (await q("SELECT * FROM cars WHERE id=$1", [carId])).rows[0];

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

  const promo = (await q(
    "SELECT * FROM promo_codes WHERE code=$1",
    [code]
  )).rows[0];

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
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 SERVER RUNNING ON", PORT);
});