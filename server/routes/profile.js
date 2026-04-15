const express = require("express");
const auth = require("../middleware/auth");
const { q } = require("../db");

const router = express.Router();

/* ================= GET MY PROFILE ================= */
router.get("/me", auth, async (req, res) => {
  try {
    const r = await q("SELECT * FROM users WHERE id=$1", [req.userId]);

    const user = r.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    delete user.password;

    res.json(user);
  } catch (e) {
    console.log("PROFILE ERROR:", e);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= CREATE TELEGRAM LINK ================= */
router.post("/telegram/link", auth, async (req, res) => {
  try {
    const userId = req.userId;

    const code = Math.random().toString(36).substring(2, 10);

    await q(
      "INSERT INTO telegram_links (user_id, code, used) VALUES ($1,$2,false)",
      [userId, code]
    );

    const botUsername = process.env.BOT_USERNAME || "CPMMarket_bot";

    const link = `https://t.me/${botUsername}?start=${code}`;

    res.json({ link, code });
  } catch (e) {
    console.log("TG LINK ERROR:", e);
    res.status(500).json({ error: "Failed to create telegram link" });
  }
});

module.exports = router;