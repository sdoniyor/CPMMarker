require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { Pool } = require("pg");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

bot.onText(/\/start (.+)/, async (msg, match) => {
  const telegramId = msg.from.id;
  const userId = match[1]; // это из ?start=ID

  await pool.query(
    "UPDATE users SET telegram_id=$1 WHERE id=$2",
    [telegramId, userId]
  );

  bot.sendMessage(msg.chat.id, "✅ Telegram подключён!");
});