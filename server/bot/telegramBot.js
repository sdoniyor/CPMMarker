const TelegramBot = require("node-telegram-bot-api");
const { q } = require("../db");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

/* ================= CONNECT ================= */
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

    bot.sendMessage(telegram_id, "✅ Telegram connected!");
  } catch (e) {
    console.log("TG ERROR:", e);
  }
});

module.exports = bot;