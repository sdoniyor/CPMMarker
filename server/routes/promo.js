

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



const express = require("express");
const { q } = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= HELPERS ================= */
const parseCarIds = (car_ids) => {
  if (!car_ids) return [];

  if (Array.isArray(car_ids)) {
    return car_ids.map(Number).filter(Boolean);
  }

  return String(car_ids)
    .split(",")
    .map((x) => Number(x.trim()))
    .filter((x) => !isNaN(x));
};

const isExpired = (promo) => {
  if (!promo.expires_at) return false;
  return new Date(promo.expires_at) < new Date();
};

/*
  Вызывать после покупки машины:
  await consumeUserPromo(userId, carId)
*/
const consumeUserPromo = async (userId, carId) => {
  try {
    const userRes = await q(
      `SELECT discount, discount_cars
       FROM users
       WHERE id=$1`,
      [userId]
    );

    const user = userRes.rows[0];
    if (!user) return false;

    if (!user.discount || !user.discount_cars) {
      return false;
    }

    const allowedCars = parseCarIds(user.discount_cars);

    // если машина не участвует в промо — не сжигаем
    if (!allowedCars.includes(Number(carId))) {
      return false;
    }

    // сжигаем активный промо
    await q(
      `UPDATE user_promos
       SET consumed=true
       WHERE user_id=$1
         AND consumed=false`,
      [userId]
    );

    // очищаем скидку пользователя
    await q(
      `UPDATE users
       SET discount=NULL,
           discount_cars=NULL
       WHERE id=$1`,
      [userId]
    );

    return true;
  } catch (e) {
    console.log("CONSUME PROMO ERROR:", e);
    return false;
  }
};

/* ================= REDEEM ================= */
router.post("/redeem", auth, async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.userId;

    if (!code) {
      return res.status(400).json({
        error: "No code provided",
      });
    }

    /* ищем промокод */
    const promoRes = await q(
      `SELECT * FROM promo_codes WHERE code=$1`,
      [code]
    );

    const promo = promoRes.rows[0];

    if (!promo) {
      return res.status(404).json({
        error: "Invalid promo code",
      });
    }

    /* проверка срока */
    if (isExpired(promo)) {
      return res.status(400).json({
        error: "Promo expired",
      });
    }

    /* проверка лимита */
    if (promo.max_uses > 0 && promo.used_count >= promo.max_uses) {
      return res.status(400).json({
        error: "Promo limit reached",
      });
    }

    /* уже использовал именно этот код */
    const used = await q(
      `SELECT id
       FROM user_promos
       WHERE user_id=$1
         AND promo_code=$2`,
      [userId, code]
    );

    if (used.rows.length > 0) {
      return res.status(400).json({
        error: "Promo already used",
      });
    }

    /* есть активный несгоревший промо */
    const activePromo = await q(
      `SELECT id
       FROM user_promos
       WHERE user_id=$1
         AND consumed=false`,
      [userId]
    );

    if (activePromo.rows.length > 0) {
      return res.status(400).json({
        error: "You already have active promo",
      });
    }

    const allowedCars = parseCarIds(promo.car_ids);

    /* сохраняем промо */
    await q(
      `INSERT INTO user_promos
       (user_id, promo_code, discount, consumed)
       VALUES ($1,$2,$3,false)`,
      [userId, code, promo.discount]
    );

    /* записываем скидку пользователю */
    await q(
      `UPDATE users
       SET discount=$1,
           discount_cars=$2
       WHERE id=$3`,
      [promo.discount, promo.car_ids, userId]
    );

    /* счетчик использования */
    await q(
      `UPDATE promo_codes
       SET used_count = used_count + 1
       WHERE id=$1`,
      [promo.id]
    );

    return res.json({
      success: true,
      discount: Number(promo.discount),
      car_ids: allowedCars,
    });

  } catch (e) {
    console.log("PROMO ERROR:", e);
    return res.status(500).json({
      error: "Server error",
    });
  }
});

module.exports = {
  router,
  consumeUserPromo,
};