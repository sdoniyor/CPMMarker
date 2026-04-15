const express = require("express");
const { q } = require("../db");

const router = express.Router();

/**
 * REDEEM PROMO CODE
 */
router.post("/redeem", async (req, res) => {
   console.log("🔥 PROMO HIT:", req.body);
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({
        success: false,
        error: "Missing userId or code",
      });
    }

    // ищем промокод
    const promoRes = await q(
      "SELECT * FROM promos WHERE code = $1",
      [code]
    );

    const promo = promoRes.rows[0];

    if (!promo) {
      return res.json({
        success: false,
        error: "Invalid promo code",
      });
    }

    if (promo.used) {
      return res.json({
        success: false,
        error: "Promo already used",
      });
    }

    // начисляем скидку пользователю
    await q(
      "UPDATE users SET discount = COALESCE(discount, 0) + $1 WHERE id = $2",
      [promo.discount, userId]
    );

    // помечаем промо как использованный
    await q(
      "UPDATE promos SET used = true, used_by = $1 WHERE code = $2",
      [userId, code]
    );

    res.json({
      success: true,
      discount: promo.discount,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});




module.exports = router;