const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { q } = require("../db");

const router = express.Router();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start (.+)/, async (msg, match) => {
  const userId = match[1];
  const telegram_id = msg.from.id;
  const username = msg.from.username || null;

  await q(
    `UPDATE users 
     SET telegram_id=$1, telegram_username=$2 
     WHERE id=$3`,
    [telegram_id, username, userId]
  );

  bot.sendMessage(telegram_id, "✅ Connected!");
});

/* ORDER */
router.post("/order", async (req, res) => {
  const { user, car } = req.body;

  await bot.sendMessage(
    process.env.CHAT_ID,
    `🚗 ${user.name} bought ${car.name}`
  );

  res.json({ success: true });
});

module.exports = router;