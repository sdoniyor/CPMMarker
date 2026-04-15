
const express = require("express");
const { q } = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/redeem", auth, async (req, res) => {
  const { code } = req.body;

  const r = await q(
    "SELECT * FROM promo_codes WHERE code=$1",
    [code]
  );

  const promo = r.rows[0];

  if (!promo) {
    return res.json({ success: false, error: "Invalid code" });
  }

  if (promo.used) {
    return res.json({ success: false, error: "Used" });
  }

  await q(
    "UPDATE users SET discount = COALESCE(discount,0) + $1 WHERE id=$2",
    [promo.discount, req.userId]
  );

  await q(
    "UPDATE promo_codes SET used=true, used_by=$1 WHERE id=$2",
    [req.userId, promo.id]
  );

  res.json({ success: true });
});

module.exports = router;