
// const express = require("express");
// const router = express.Router();

// const { q } = require("../db");
// const auth = require("../middleware/auth");

// /* ================= HELPERS ================= */
// const parseCarIds = (car_ids) => {
//   if (!car_ids) return [];

//   if (Array.isArray(car_ids)) {
//     return car_ids.map(Number).filter(Boolean);
//   }

//   return String(car_ids)
//     .split(",")
//     .map((x) => Number(x.trim()))
//     .filter((x) => !isNaN(x));
// };

// const isExpired = (promo) => {
//   if (!promo.expires_at) return false;
//   return new Date(promo.expires_at) < new Date();
// };

// /* ================= 🔥 CONSUME PROMO ================= */
// const consumeUserPromo = async (userId, carId) => {
//   try {
//     console.log("🧠 consumeUserPromo START:", { userId, carId });

//     if (!carId) {
//       console.log("❌ carId missing → STOP");
//       return;
//     }

//     const userRes = await q(
//       `SELECT discount, discount_cars
//        FROM users
//        WHERE id=$1`,
//       [userId]
//     );

//     const user = userRes.rows[0];

//     if (!user || !user.discount) {
//       console.log("ℹ️ no active discount");
//       return;
//     }

//     const allowedCars = parseCarIds(user.discount_cars);

//     console.log("📦 allowedCars:", allowedCars);

//     if (allowedCars.length > 0 && !allowedCars.includes(Number(carId))) {
//       console.log("🚫 car not in promo list → skip");
//       return;
//     }

//     console.log("🔥 REMOVING PROMO");

//     await q(
//       `UPDATE user_promos
//        SET consumed=true
//        WHERE user_id=$1 AND consumed=false`,
//       [userId]
//     );

//     await q(
//       `UPDATE users
//        SET discount=NULL,
//            discount_cars=NULL
//        WHERE id=$1`,
//       [userId]
//     );

//     console.log("✅ PROMO REMOVED");

//   } catch (e) {
//     console.log("❌ CONSUME ERROR:", e);
//   }
// };

// /* ================= REDEEM ================= */
// router.post("/redeem", auth, async (req, res) => {
//   try {
//     const { code } = req.body;
//     const userId = req.userId;

//     console.log("🔥 REDEEM:", { userId, code });

//     if (!code) {
//       return res.status(400).json({ error: "No code provided" });
//     }

//     const promoRes = await q(
//       `SELECT * FROM promo_codes WHERE code=$1`,
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

//     const used = await q(
//       `SELECT id FROM user_promos
//        WHERE user_id=$1 AND promo_code=$2`,
//       [userId, code]
//     );

//     if (used.rows.length > 0) {
//       return res.status(400).json({ error: "Promo already used" });
//     }

//     const active = await q(
//       `SELECT id FROM user_promos
//        WHERE user_id=$1 AND consumed=false`,
//       [userId]
//     );

//     if (active.rows.length > 0) {
//       return res.status(400).json({ error: "You already have active promo" });
//     }

//     const allowedCars = parseCarIds(promo.car_ids);

//     await q(
//       `INSERT INTO user_promos
//        (user_id, promo_code, discount, consumed)
//        VALUES ($1,$2,$3,false)`,
//       [userId, code, promo.discount]
//     );

//     await q(
//       `UPDATE users
//        SET discount=$1,
//            discount_cars=$2
//        WHERE id=$3`,
//       [promo.discount, promo.car_ids, userId]
//     );

//     await q(
//       `UPDATE promo_codes
//        SET used_count = used_count + 1
//        WHERE id=$1`,
//       [promo.id]
//     );

//     return res.json({
//       success: true,
//       discount: Number(promo.discount),
//       car_ids: allowedCars,
//     });

//   } catch (e) {
//     console.log("PROMO ERROR:", e);
//     return res.status(500).json({ error: "Server error" });
//   }
// });

// /* ================= 💥 BUY ================= */
// router.post("/buy", auth, async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { carId } = req.body;

//     console.log("🛒 BUY REQUEST:", { userId, carId });

//     if (!carId) {
//       return res.status(400).json({ error: "carId missing" });
//     }

//     await q(
//       `INSERT INTO user_cars (user_id, car_id)
//        VALUES ($1,$2)`,
//       [userId, carId]
//     );

//     await consumeUserPromo(userId, carId);

//     return res.json({ success: true });

//   } catch (e) {
//     console.log("BUY ERROR:", e);
//     return res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;
// module.exports.consumeUserPromo = consumeUserPromo;


const express = require("express");
const router = express.Router();

const { q } = require("../db");
const auth = require("../middleware/auth");

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

/* ================= CONSUME PROMO ================= */
const consumeUserPromo = async (userId, carId) => {
  try {
    const userRes = await q(
      `SELECT discount, promo_cars
       FROM users
       WHERE id=$1`,
      [userId]
    );

    const user = userRes.rows[0];
    if (!user || !user.discount) return false;

    const allowedCars = parseCarIds(user.promo_cars);

    // если promo_cars пустой -> скидка на все машины
    const isAllowed =
      allowedCars.length === 0 ||
      allowedCars.includes(Number(carId));

    if (!isAllowed) return false;

await q(
  `UPDATE user_promos
   SET consumed=true
   WHERE id = (
      SELECT id
      FROM user_promos
      WHERE user_id=$1
      AND consumed=false
      ORDER BY id DESC
      LIMIT 1
   )`,
  [userId]
);

    await q(
      `UPDATE users
       SET discount=NULL,
           promo_cars=NULL
       WHERE id=$1`,
      [userId]
    );

    console.log("🔥 PROMO CONSUMED");
    return true;
  } catch (e) {
    console.log("CONSUME ERROR:", e);
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

    if (isExpired(promo)) {
      return res.status(400).json({
        error: "Promo expired",
      });
    }

    if (
      promo.max_uses > 0 &&
      promo.used_count >= promo.max_uses
    ) {
      return res.status(400).json({
        error: "Promo limit reached",
      });
    }

    // уже использовал этот код
    const used = await q(
      `SELECT id
       FROM user_promos
       WHERE user_id=$1 AND promo_code=$2`,
      [userId, code]
    );

    if (used.rows.length > 0) {
      return res.status(400).json({
        error: "Promo already used",
      });
    }

    // уже есть активный промо
    const active = await q(
      `SELECT id
       FROM user_promos
       WHERE user_id=$1 AND consumed=false`,
      [userId]
    );

    if (active.rows.length > 0) {
      return res.status(400).json({
        error: "You already have active promo",
      });
    }

    // записываем промо
    await q(
      `INSERT INTO user_promos
       (user_id, promo_code, discount, consumed)
       VALUES ($1,$2,$3,false)`,
      [userId, code, promo.discount]
    );

    // записываем скидку пользователю
    await q(
      `UPDATE users
       SET discount=$1,
           promo_cars=$2
       WHERE id=$3`,
      [promo.discount, promo.car_ids, userId]
    );

    // увеличиваем счётчик
    await q(
      `UPDATE promo_codes
       SET used_count = used_count + 1
       WHERE id=$1`,
      [promo.id]
    );

    return res.json({
      success: true,
      discount: Number(promo.discount),
      promo_cars: parseCarIds(promo.car_ids),
    });
  } catch (e) {
    console.log("PROMO ERROR:", e);
    return res.status(500).json({
      error: "Server error",
    });
  }
});

/* ================= BUY ================= */
router.post("/buy", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { carId } = req.body;

    if (!carId) {
      return res.status(400).json({
        error: "carId missing",
      });
    }

    // сохраняем покупку
    await q(
      `INSERT INTO user_cars (user_id, car_id)
       VALUES ($1,$2)`,
      [userId, carId]
    );

    // сжигаем промо (если подходит)
    await consumeUserPromo(userId, carId);

    // возвращаем обновлённого user
    const userRes = await q(
      `SELECT id, name, discount, promo_cars
       FROM users
       WHERE id=$1`,
      [userId]
    );

    return res.json({
      success: true,
      user: userRes.rows[0],
    });
  } catch (e) {
    console.log("BUY ERROR:", e);
    return res.status(500).json({
      error: "Server error",
    });
  }
});

module.exports = router;
module.exports.consumeUserPromo = consumeUserPromo;