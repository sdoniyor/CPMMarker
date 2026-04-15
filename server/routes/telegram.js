const express = require("express");
const { q } = require("../db");
const auth = require("../middleware/auth");
const bot = require("../bot/bot");

const router = express.Router();

/* ================= ORDER TO TG ================= */
router.post("/order-to-tg", auth, async (req, res) => {
  try {
    const { car, configs, total } = req.body;

    const userRes = await q(
      "SELECT * FROM users WHERE id=$1",
      [req.userId]
    );

    const user = userRes.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const message =
      `🚗 NEW ORDER\n\n` +
      `👤 User: ${user.name}\n` +
      `📧 Email: ${user.email}\n` +
      `🆔 TG ID: ${user.telegram_id || "not connected"}\n` +
      `🔗 Username: @${user.telegram_username || "unknown"}\n\n` +
      `🚘 Car: ${car?.brand || ""} ${car?.name || ""}\n\n` +
      `⚙️ Configs:\n` +
      `${configs?.length ? configs.map(c => "• " + c).join("\n") : "No configs"}\n\n` +
      `💰 TOTAL: $${total || 0}`;

    await bot.sendMessage(process.env.CHAT_ID, message);

    res.json({ success: true });
  } catch (e) {
    console.log("ORDER ERROR:", e);
    res.status(500).json({ error: "Telegram error" });
  }
});

/* ================= SIMPLE ORDER ================= */
router.post("/order", auth, async (req, res) => {
  try {
    const { car } = req.body;

    const userRes = await q(
      "SELECT * FROM users WHERE id=$1",
      [req.userId]
    );

    const user = userRes.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await bot.sendMessage(
      process.env.CHAT_ID,
      `🚗 ${user.name} bought ${car?.name || "unknown car"}`
    );

    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false });
  }
});

module.exports = router;