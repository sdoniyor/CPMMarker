const express = require("express");
const { q } = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= RESET EXPIRED PROMO ================= */
const resetIfExpired = async (user) => {
  if (!user.promo_used_at) return;

  const diff = Date.now() - new Date(user.promo_used_at).getTime();
  const hours = diff / (1000 * 60 * 60);

  if (hours >= 24) {
    await q(
      "UPDATE users SET promo_code=NULL, promo_used_at=NULL WHERE id=$1",
      [user.id]
    );
  }
};

/* ================= REDEEM PROMO ================= */
router.post("/redeem", auth, async (req, res) => {
  try {
    const { code, car_id } = req.body;
    const userId = req.userId;

    if (!code) {
      return res.status(400).json({ error: "No code" });
    }

    /* ================= USER ================= */
    const userRes = await q(
      "SELECT * FROM users WHERE id=$1",
      [userId]
    );

    const user = userRes.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await resetIfExpired(user);

    /* ================= PROMO ================= */
    const promoRes = await q(
      "SELECT * FROM promo_codes WHERE code=$1",
      [code]
    );

    const promo = promoRes.rows[0];

    if (!promo) {
      return res.status(404).json({ error: "Invalid code" });
    }

    /* ================= CHECK CAR ================= */
    if (promo.car_ids) {
      const allowed = promo.car_ids.split(",");

      if (car_id && !allowed.includes(String(car_id))) {
        return res.status(400).json({
          error: "Promo not valid for this car"
        });
      }
    }

    /* ================= 24H CHECK ================= */
    if (
      user.promo_code === code &&
      user.promo_used_at
    ) {
      const diff =
        Date.now() -
        new Date(user.promo_used_at).getTime();

      const hours = diff / (1000 * 60 * 60);

      if (hours < 24) {
        return res.status(400).json({
          error: "Promo cooldown 24h"
        });
      }
    }

    /* ================= PURCHASE HISTORY BLOCK ================= */
    if (car_id) {
      const checkOrder = await q(
        "SELECT * FROM orders WHERE user_id=$1 AND car_id=$2 AND promo_code=$3",
        [userId, car_id, code]
      );

      if (checkOrder.rows.length > 0) {
        return res.status(400).json({
          error: "Already used promo on this car"
        });
      }
    }

    /* ================= APPLY PROMO ================= */

    // сбрасываем старый промо (если есть другой)
    await q(
      "UPDATE users SET promo_code=$1, promo_used_at=NOW() WHERE id=$2",
      [code, userId]
    );

    // применяем скидку
    await q(
      "UPDATE users SET discount=$1 WHERE id=$2",
      [promo.discount, userId]
    );

    res.json({
      success: true,
      discount: promo.discount
    });

  } catch (e) {
    console.log("PROMO ERROR:", e);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;