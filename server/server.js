
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

// const q = async (text, params) => {
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
//     if (!val) return fallback;
//     if (Array.isArray(val)) return val;
//     return JSON.parse(val);
//   } catch {
//     return fallback;
//   }
// };

// /* ================= TELEGRAM ================= */
// let bot = null;

// if (process.env.BOT_TOKEN) {
//   try {
//     bot = new TelegramBot(process.env.BOT_TOKEN, {
//       polling: false,
//     });
//     console.log("🤖 Telegram OK");
//   } catch (e) {
//     console.log("BOT ERROR:", e.message);
//   }
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
//     console.log("REGISTER ERROR:", e.message);
//     return res.status(500).json({ error: "register failed" });
//   }
// });

// /* ================= LOGIN ================= */
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

//     return res.json(user);
//   } catch (e) {
//     console.log("LOGIN ERROR:", e.message);
//     return res.status(500).json({ error: "login failed" });
//   }
// });

// /* ================= PROFILE (SAFE ALWAYS JSON) ================= */
// app.get("/profile/:id", async (req, res) => {
//   try {
//     const userRes = await q(
//       "SELECT * FROM users WHERE id=$1",
//       [req.params.id]
//     );

//     const u = userRes.rows[0];

//     if (!u) {
//       return res.json(null);
//     }

//     u.discount_cars = safeJSON(u.discount_cars, []);
//     u.used_promo = safeJSON(u.used_promo, []);

//     delete u.password;

//     return res.json(u);
//   } catch (e) {
//     console.log("PROFILE ERROR:", e.message);
//     return res.status(500).json({ error: "profile error" });
//   }
// });

// /* ================= CARS ================= */
// app.get("/cars", async (req, res) => {
//   try {
//     const cars = await q("SELECT * FROM cars");
//     return res.json(cars.rows || []);
//   } catch {
//     return res.json([]);
//   }
// });

// /* ================= BUY ================= */
// app.post("/buy", async (req, res) => {
//   try {
//     const { userId, carId } = req.body;

//     await q(
//       "UPDATE cars SET user_id=$1 WHERE id=$2",
//       [userId, carId]
//     );

//     return res.json({ success: true });
//   } catch {
//     return res.status(500).json({ error: "buy failed" });
//   }
// });

// /* ================= UPDATE AVATAR (FIXED) ================= */
// app.post("/update-avatar", async (req, res) => {
//   try {
//     const { userId, avatar } = req.body;

//     if (!userId || !avatar) {
//       return res.status(400).json({ error: "missing data" });
//     }

//     await q(
//       "UPDATE users SET avatar=$1 WHERE id=$2",
//       [avatar, userId]
//     );

//     const user = await q(
//       "SELECT id, name, email, avatar, money, level FROM users WHERE id=$1",
//       [userId]
//     );

//     return res.json(user.rows[0] || {});
//   } catch (e) {
//     console.log("AVATAR ERROR:", e.message);
//     return res.status(500).json({ error: "avatar failed" });
//   }
// });

// /* ================= PROMO ================= */
// app.post("/promo/redeem", async (req, res) => {
//   try {
//     const { userId, code } = req.body;

//     const promoRes = await q(
//       "SELECT * FROM promo_codes WHERE code=$1",
//       [code]
//     );

//     const promo = promoRes.rows[0];

//     if (!promo) {
//       return res.status(404).json({ error: "invalid promo" });
//     }

//     const used = safeJSON(promo.used_by, []);

//     if (used.includes(userId)) {
//       return res.status(400).json({ error: "already used" });
//     }

//     if (promo.type === "discount") {
//       await q(
//         "UPDATE users SET discount=$1, discount_cars=$2 WHERE id=$3",
//         [
//           Number(promo.value),
//           JSON.stringify(promo.car_ids || []),
//           userId,
//         ]
//       );
//     }

//     await q(
//       "UPDATE promo_codes SET used_by = array_append(COALESCE(used_by,'{}'), $1) WHERE code=$2",
//       [userId, code]
//     );

//     return res.json({ success: true });
//   } catch (e) {
//     console.log("PROMO ERROR:", e.message);
//     return res.status(500).json({ error: "promo failed" });
//   }
// });

// /* ================= TELEGRAM LINK ================= */
// app.post("/telegram/link", async (req, res) => {
//   try {
//     const { userId, telegram_id } = req.body;

//     if (!userId || !telegram_id) {
//       return res.status(400).json({ error: "missing data" });
//     }

//     const user = await q(
//       "UPDATE users SET telegram_id=$1 WHERE id=$2 RETURNING id, telegram_id",
//       [telegram_id, userId]
//     );

//     if (!user.rows[0]) {
//       return res.status(404).json({ error: "user not found" });
//     }

//     return res.json({
//       success: true,
//       telegram_id: user.rows[0].telegram_id,
//     });

//   } catch (e) {
//     console.log("TG LINK ERROR:", e.message);
//     return res.status(500).json({ error: "telegram link failed" });
//   }
// });

// /* ================= ORDER TO TG ================= */
// app.post("/order-to-tg", async (req, res) => {
//   try {
//     if (!bot) {
//       return res.status(500).json({ error: "bot not ready" });
//     }

//     const { user, car, configs, total } = req.body;

//     const chatId = process.env.CHAT_ID;

//     const text =
// `🚗 NEW ORDER

// 👤 ${user?.name || "-"}
// 📧 ${user?.email || "-"}
// 🆔 ${user?.id || "-"}

// 🚘 ${car?.brand || ""} ${car?.name || ""}

// ⚙️ CONFIGS:
// ${Array.isArray(configs) ? configs.map(c => "• " + c).join("\n") : "none"}

// 💰 TOTAL: ${total || 0} $`;

//     await bot.sendMessage(chatId, text);

//     return res.json({ success: true });
//   } catch (e) {
//     console.log("TG ERROR:", e.message);
//     return res.status(500).json({ error: "telegram failed" });
//   }
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
const bcrypt = require("bcrypt");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

/* ================= DB ================= */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false,
});

/* SAFE QUERY */
const q = async (text, params = []) => {
  try {
    return await pool.query(text, params);
  } catch (e) {
    console.log("DB ERROR:", e.message);
    return { rows: [] };
  }
};

/* ================= SAFE JSON ================= */
const safeJSON = (val, fallback = []) => {
  try {
    if (!val || val === "null" || val === "undefined") return fallback;
    if (Array.isArray(val)) return val;
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

/* ================= TELEGRAM ================= */
let bot = null;

if (process.env.BOT_TOKEN) {
  try {
    bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
    console.log("🤖 Telegram OK");
  } catch (e) {
    console.log("BOT ERROR:", e.message);
  }
}

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.json({ ok: true });
});

/* ================= REGISTER ================= */
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "missing fields" });
    }

    const exists = await q(
      "SELECT id FROM users WHERE email=$1 OR name=$2",
      [email, name]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "user already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await q(
      `INSERT INTO users (name, email, password, level, money, avatar, discount, discount_cars, used_promo)
       VALUES ($1,$2,$3,1,0,'',0,'[]','[]')
       RETURNING id, name, email, level, money, avatar`,
      [name, email, hash]
    );

    return res.json(user.rows[0] || {});
  } catch (e) {
    console.log("REGISTER ERROR:", e.message);
    return res.status(500).json({ error: "register failed" });
  }
});

/* ================= LOGIN ================= */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "missing fields" });
    }

    const userRes = await q(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    const user = userRes.rows[0];

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
    console.log("LOGIN ERROR:", e.message);
    return res.status(500).json({ error: "login failed" });
  }
});

/* ================= PROFILE ================= */
app.get("/profile/:id", async (req, res) => {
  try {
    const userRes = await q(
      "SELECT * FROM users WHERE id=$1",
      [req.params.id]
    );

    const u = userRes.rows[0];

    if (!u) return res.json(null);

    u.discount_cars = safeJSON(u.discount_cars, []);
    u.used_promo = safeJSON(u.used_promo, []);

    delete u.password;

    return res.json(u);
  } catch (e) {
    console.log("PROFILE ERROR:", e.message);
    return res.status(500).json({ error: "profile error" });
  }
});

/* ================= CARS ================= */
app.get("/cars", async (req, res) => {
  try {
    const cars = await q("SELECT * FROM cars");
    return res.json(cars.rows || []);
  } catch {
    return res.json([]);
  }
});

/* ================= BUY ================= */
app.post("/buy", async (req, res) => {
  try {
    const { userId, carId } = req.body;

    await q(
      "UPDATE cars SET user_id=$1 WHERE id=$2",
      [userId, carId]
    );

    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "buy failed" });
  }
});

/* ================= UPDATE AVATAR ================= */
app.post("/update-avatar", async (req, res) => {
  try {
    const { userId, avatar } = req.body;

    if (!userId || !avatar) {
      return res.status(400).json({ error: "missing data" });
    }

    await q(
      "UPDATE users SET avatar=$1 WHERE id=$2",
      [avatar, userId]
    );

    const user = await q(
      "SELECT id, name, email, avatar, money, level FROM users WHERE id=$1",
      [userId]
    );

    return res.json(user.rows[0] || {});
  } catch (e) {
    console.log("AVATAR ERROR:", e.message);
    return res.status(500).json({ error: "avatar failed" });
  }
});

/* ================= PROMO ================= */
app.post("/promo/redeem", async (req, res) => {
  try {
    const { userId, code } = req.body;

    const promoRes = await q(
      "SELECT * FROM promo_codes WHERE code=$1",
      [code]
    );

    const promo = promoRes.rows[0];

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

    return res.json({ success: true });
  } catch (e) {
    console.log("PROMO ERROR:", e.message);
    return res.status(500).json({ error: "promo failed" });
  }
});

/* ================= TELEGRAM LINK ================= */
app.post("/telegram/link", async (req, res) => {
  try {
    const { userId, telegram_id } = req.body;

    if (!userId || !telegram_id) {
      return res.status(400).json({ error: "missing data" });
    }

    const user = await q(
      "UPDATE users SET telegram_id=$1 WHERE id=$2 RETURNING id, telegram_id",
      [telegram_id, userId]
    );

    if (!user.rows[0]) {
      return res.status(404).json({ error: "user not found" });
    }

    return res.json({
      success: true,
      telegram_id: user.rows[0].telegram_id,
    });

  } catch (e) {
    console.log("TG LINK ERROR:", e.message);
    return res.status(500).json({ error: "telegram link failed" });
  }
});



if (bot) {
  bot.onText(/\/start (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = match?.[1];

    if (!userId) {
      return bot.sendMessage(chatId, "❌ Invalid link");
    }

    try {
      await q(
        "UPDATE users SET telegram_id=$1 WHERE id=$2",
        [chatId, userId]
      );

      bot.sendMessage(chatId, "✅ Telegram успешно подключён!");
    } catch (e) {
      console.log("BOT ERROR:", e.message);
      bot.sendMessage(chatId, "❌ Ошибка подключения");
    }
  });
}



/* ================= ORDER TO TG ================= */
app.post("/order-to-tg", async (req, res) => {
  try {
    if (!bot) {
      return res.status(500).json({ error: "bot not ready" });
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

    return res.json({ success: true });
  } catch (e) {
    console.log("TG ERROR:", e.message);
    return res.status(500).json({ error: "telegram failed" });
  }
});

/* ================= START ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 SERVER RUNNING ON", PORT);
});