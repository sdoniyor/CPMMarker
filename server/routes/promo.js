const express = require("express");
const { q } = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= REDEEM PROMO ================= */
router.post("/redeem", auth, async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code" });
  }

  // найти промо
  const promoRes = await q(
    "SELECT * FROM promo_codes WHERE code=$1",
    [code]
  );

  const promo = promoRes.rows[0];

  if (!promo) {
    return res.status(404).json({ error: "Invalid code" });
  }

  if (promo.used) {
    return res.status(400).json({ error: "Already used" });
  }

  // применяем скидку к пользователю
  await q(
    "UPDATE users SET discount=$1 WHERE id=$2",
    [promo.discount, req.userId]
  );

  // помечаем промо как использованный
  await q(
    "UPDATE promo_codes SET used=true, used_by=$1 WHERE id=$2",
    [req.userId, promo.id]
  );

  res.json({
    success: true,
    discount: promo.discount
  });
});

module.exports = router;