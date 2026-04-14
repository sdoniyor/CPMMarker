const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { q } = require("../db");

const router = express.Router();

/* ================= BOT INIT ================= */
const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

/* ================= CONNECT TELEGRAM ================= */
bot.onText(/\/start (.+)/, async (msg, match) => {
  try {
    const userId = match?.[1];

    if (!userId) return;

    const telegram_id = msg.from.id;
    const username = msg.from.username || null;

    await q(
      `
      UPDATE users 
      SET telegram_id = $1,
          telegram_username = $2
      WHERE id = $3
      `,
      [telegram_id, username, userId]
    );

    bot.sendMessage(telegram_id, "✅ Telegram connected successfully!");
  } catch (e) {
    console.log("TG CONNECT ERROR:", e);
  }
});

/* ================= ORDER FROM FRONTEND ================= */
router.post("/order-to-tg", async (req, res) => {
  try {
    const { user, car, configs, total } = req.body;

    if (!user || !car) {
      return res.status(400).json({
        success: false,
        error: "Missing data",
      });
    }

    const message =
      `🚗 NEW ORDER\n\n` +
      `👤 User: ${user.name || "-"}\n` +
      `📧 Email: ${user.email || "-"}\n` +
      `🆔 TG ID: ${user.tg_id || "-"}\n` +
      `🔗 Username: @${user.username || "-"}\n\n` +
      `🚘 Car: ${car.brand || ""} ${car.name || ""}\n\n` +
      `⚙️ Configs:\n` +
      `${configs?.length ? configs.map(c => "• " + c).join("\n") : "No configs"}\n\n` +
      `💰 TOTAL: $${total || 0}`;

    // отправка в админ чат
    await bot.sendMessage(process.env.CHAT_ID, message);

    res.json({ success: true });
  } catch (e) {
    console.log("ORDER ERROR:", e);
    res.status(500).json({
      success: false,
      error: "Telegram send failed",
    });
  }
});

/* ================= SIMPLE ORDER (OLD SUPPORT) ================= */
router.post("/order", async (req, res) => {
  try {
    const { user, car } = req.body;

    await bot.sendMessage(
      process.env.CHAT_ID,
      `🚗 ${user?.name} bought ${car?.name}`
    );

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;