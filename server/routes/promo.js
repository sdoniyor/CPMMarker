

// const express = require("express");
// const { q } = require("../db");
// const auth = require("../middleware/auth");

// const router = express.Router();

// /* ================= HELPERS ================= */
// const parseCarIds = (car_ids) => {
//   if (!car_ids) return [];

//   if (Array.isArray(car_ids)) {
//     return car_ids.map(Number).filter(Boolean);
//   }

//   return car_ids
//     .split(",")
//     .map((x) => Number(x.trim()))
//     .filter((x) => !isNaN(x));
// };

// const isExpired = (promo) => {
//   if (!promo.expires_at) return false;
//   return new Date(promo.expires_at) < new Date();
// };

// /* ================= REDEEM ================= */
// router.post("/redeem", auth, async (req, res) => {
//   try {
//     const { code } = req.body;
//     const userId = req.userId;

//     if (!code) {
//       return res.status(400).json({ error: "No code provided" });
//     }

//     const promoRes = await q(
//       "SELECT * FROM promo_codes WHERE code=$1",
//       [code]
//     );

//     const promo = promoRes.rows[0];

//     if (!promo) {
//       return res.status(404).json({ error: "Invalid promo code" });
//     }

//     if (isExpired(promo)) {
//       return res.status(400).json({ error: "Promo expired" });
//     }

//     if (promo.max_uses > 0 && promo.used_count >= promo.max_uses) {
//       return res.status(400).json({ error: "Promo limit reached" });
//     }

//     /* ================= CHECK DUPLICATE ================= */
//     const used = await q(
//       "SELECT id FROM user_promos WHERE user_id=$1 AND promo_code=$2",
//       [userId, code]
//     );

//     if (used.rows.length > 0) {
//       return res.status(400).json({ error: "Promo already used" });
//     }

//     const allowedCars = parseCarIds(promo.car_ids);

//     /* ================= SAVE USER PROMO ================= */
//     await q(
//       `INSERT INTO user_promos (user_id, promo_code, discount)
//        VALUES ($1,$2,$3)`,
//       [userId, code, promo.discount]
//     );

//     /* ================= 🔥 IMPORTANT FIX ================= */
//     await q(
//       `UPDATE users 
//        SET discount=$1,
//            discount_cars=$2
//        WHERE id=$3`,
//       [promo.discount, promo.car_ids, userId]
//     );

//     /* ================= UPDATE COUNTER ================= */
//     await q(
//       `UPDATE promo_codes 
//        SET used_count = used_count + 1 
//        WHERE id=$1`,
//       [promo.id]
//     );

//     res.json({
//       success: true,
//       discount: Number(promo.discount),
//       car_ids: allowedCars,
//     });

//   } catch (e) {
//     console.log("PROMO ERROR:", e);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;



router.post("/buy", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { carId } = req.body;

    // 1. покупка машины (твоя логика)
    await q(
      `INSERT INTO user_cars (user_id, car_id)
       VALUES ($1,$2)`,
      [userId, carId]
    );

    // 2. 🔥 ВОТ ЭТО ГЛАВНОЕ — СЖИГАЕМ ПРОМО
    await consumeUserPromo(userId, carId);

    return res.json({
      success: true,
    });

  } catch (e) {
    console.log("BUY ERROR:", e);
    return res.status(500).json({
      error: "Server error",
    });
  }
});