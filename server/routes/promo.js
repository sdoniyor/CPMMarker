// const express = require("express");
// const { q } = require("../db");
// const auth = require("../middleware/auth");

// const router = express.Router();

// /* ================= GET USER ================= */
// const getUser = async (id) => {
//   const res = await q("SELECT * FROM users WHERE id=$1", [id]);
//   return res.rows[0];
// };

// /* ================= EXPIRE CHECK ================= */
// const isExpired = (user) => {
//   if (!user.promo_used_at) return false;

//   const diff = Date.now() - new Date(user.promo_used_at).getTime();
//   const hours = diff / (1000 * 60 * 60);

//   return hours >= 24;
// };

// /* ================= REDEEM PROMO ================= */
// router.post("/redeem", auth, async (req, res) => {
//   try {
//     const { code, car_id } = req.body;
//     const userId = req.userId;

//     if (!code) {
//       return res.status(400).json({ error: "No code" });
//     }

//     let user = await getUser(userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     /* ================= RESET EXPIRED ================= */
//     if (isExpired(user)) {
//       await q(
//         "UPDATE users SET active_promo=NULL, promo_used_at=NULL, discount=0 WHERE id=$1",
//         [userId]
//       );

//       user = await getUser(userId);
//     }

//     /* ================= GET PROMO ================= */
//     const promoRes = await q(
//       "SELECT * FROM promo_codes WHERE code=$1",
//       [code]
//     );

//     const promo = promoRes.rows[0];

//     if (!promo) {
//       return res.status(404).json({ error: "Invalid promo" });
//     }

//     /* ================= CAR RESTRICTION ================= */
//     if (promo.car_ids) {
//       const allowed = promo.car_ids.split(",").map(Number);

//       if (car_id && !allowed.includes(Number(car_id))) {
//         return res.status(400).json({
//           error: "Promo not valid for this car"
//         });
//       }
//     }

//     /* ================= COOLDOWN ================= */
//     if (
//       user.active_promo === code &&
//       user.promo_used_at &&
//       !isExpired(user)
//     ) {
//       return res.status(400).json({
//         error: "Promo cooldown 24h"
//       });
//     }

//     /* ================= ONE CAR ONE PROMO CHECK ================= */
//     if (car_id) {
//       const check = await q(
//         "SELECT * FROM orders WHERE user_id=$1 AND car_id=$2 AND promo_code=$3",
//         [userId, car_id, code]
//       );

//       if (check.rows.length > 0) {
//         return res.status(400).json({
//           error: "Promo already used on this car"
//         });
//       }
//     }

//     /* ================= APPLY PROMO ================= */
//     await q(
//       "UPDATE users SET active_promo=$1, promo_used_at=NOW(), discount=$2 WHERE id=$3",
//       [code, promo.discount, userId]
//     );

//     res.json({
//       success: true,
//       discount: promo.discount,
//       car_ids: promo.car_ids || null
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

/* ================= GET USER ================= */
const getUser = async (id) => {
  const res = await q("SELECT * FROM users WHERE id=$1", [id]);
  return res.rows[0];
};

/* ================= EXPIRE CHECK ================= */
const isExpired = (promo) => {
  if (!promo.expires_at) return false;
  return new Date(promo.expires_at) < new Date();
};

/* ================= REDEEM PROMO ================= */
router.post("/redeem", auth, async (req, res) => {
  try {
    const { code, car_id } = req.body;
    const userId = req.userId;

    const user = await getUser(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const promoRes = await q(
      "SELECT * FROM promo_codes WHERE code=$1",
      [code]
    );

    const promo = promoRes.rows[0];

    if (!promo) {
      return res.status(404).json({ error: "Invalid promo code" });
    }

    /* ================= EXPIRED ================= */
    if (isExpired(promo)) {
      return res.status(400).json({ error: "Promo expired" });
    }

    /* ================= MAX USES ================= */
    if (promo.max_uses > 0 && promo.used_count >= promo.max_uses) {
      return res.status(400).json({ error: "Promo limit reached" });
    }

    /* ================= CAR CHECK ================= */
    let allowedCars = [];

    if (promo.car_ids) {
      allowedCars = promo.car_ids
        .split(",")
        .map(x => Number(x.trim()))
        .filter(Boolean);
    }

    if (car_id && allowedCars.length > 0) {
      if (!allowedCars.includes(Number(car_id))) {
        return res.status(400).json({
          error: "Promo not valid for this car"
        });
      }
    }

    /* ================= ONE PROMO PER USER CHECK ================= */
    const alreadyUsed = await q(
      "SELECT * FROM user_promos WHERE user_id=$1 AND promo_code=$2 AND car_id=$3",
      [userId, code, car_id || null]
    );

    if (alreadyUsed.rows.length > 0) {
      return res.status(400).json({
        error: "Promo already used"
      });
    }

    /* ================= SAVE USER PROMO ================= */
    await q(
      `INSERT INTO user_promos (user_id, promo_code, car_id, discount)
       VALUES ($1,$2,$3,$4)`,
      [userId, code, car_id || null, promo.discount]
    );

    /* ================= UPDATE USER ================= */
    await q(
      `UPDATE users SET discount=$1 WHERE id=$2`,
      [promo.discount, userId]
    );

    /* ================= UPDATE PROMO USAGE ================= */
    await q(
      `UPDATE promo_codes SET used_count = used_count + 1 WHERE id=$1`,
      [promo.id]
    );

    res.json({
      success: true,
      discount: promo.discount,
      allowedCars
    });

  } catch (e) {
    console.log("PROMO ERROR:", e);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;