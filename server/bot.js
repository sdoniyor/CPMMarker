require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

// 🔥 берем токен из env
const token = process.env.TG_BOT_TOKEN;

if (!token) {
  throw new Error("❌ TG_BOT_TOKEN not found in .env");
}

const bot = new TelegramBot(token, {
  polling: true,
});

// /start
bot.onText(/\/start(.*)/, (msg, match) => {
  const param = match[1]; // код если есть

  bot.sendMessage(
    msg.chat.id,
    `👋 Welcome!\n\nYour Telegram ID:\n${msg.from.id}`
  );

  console.log("USER TG:", msg.from.id, "CODE:", param);
});

module.exports = bot;