const express = require("express");
const { q } = require("../db");
const auth = require("../middleware/auth");
const bot = require("../bot/bot");

const router = express.Router();

/* ================= ORDER ================= */
router.post("/", auth, async (req, res) => {
  try {
    const userRes = await q(
      "SELECT * FROM users WHERE id=$1",
      [req.userId]
    );

    const user = userRes.rows[0];

    const { car, total } = req.body;

    const message =
      `🚗 NEW ORDER\n\n` +
      `👤 ${user.name}\n` +
      `📧 ${user.email}\n` +
      `🚘 ${car?.brand} ${car?.name}\n` +
      `💰 $${total}`;

    await bot.sendMessage(process.env.CHAT_ID, message);

    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Order error" });
  }
});

module.exports = router;