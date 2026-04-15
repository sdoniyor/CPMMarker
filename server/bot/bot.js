require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const { q } = require("../db");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

/* ================= START ================= */
bot.onText(/\/start(?: (.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  const code = match?.[1];

  if (!code) {
    return bot.sendMessage(
      chatId,
      "👋 Welcome!\nGo to site and connect Telegram first."
    );
  }

  try {
    const linkRes = await q(
      "SELECT * FROM telegram_links WHERE code=$1",
      [code]
    );

    const link = linkRes.rows[0];

    if (!link) {
      return bot.sendMessage(chatId, "❌ Invalid code");
    }

    if (link.used) {
      return bot.sendMessage(chatId, "❌ Already used");
    }

    /* ================= LINK USER ================= */
    await q(
      "UPDATE users SET telegram_id=$1, telegram_username=$2 WHERE id=$3",
      [chatId, username, link.user_id]
    );

    await q(
      "UPDATE telegram_links SET used=true WHERE code=$1",
      [code]
    );

    bot.sendMessage(chatId, "✅ Account connected successfully!");
  } catch (e) {
    console.log(e);
    bot.sendMessage(chatId, "❌ Error connecting account");
  }
});

module.exports = bot;