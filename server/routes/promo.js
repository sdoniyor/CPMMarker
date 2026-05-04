
// const express = require("express");
// const router = express.Router();

// const { q } = require("../db");
// const auth = require("../middleware/auth");

// /* ================= HELPERS ================= */
// const parseCarIds = (input) => {
//   if (!input) return [];

//   if (Array.isArray(input)) return input.map(Number).filter(Boolean);

//   return String(input)
//     .split(",")
//     .map((x) => Number(x.trim()))
//     .filter((x) => !isNaN(x));
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
//       `SELECT * FROM promo_codes WHERE code=$1`,
//       [code]
//     );

//     const promo = promoRes.rows[0];

//     if (!promo) {
//       return res.status(404).json({ error: "Invalid code" });
//     }

//     // уже использовал этот код
//     const used = await q(
//       `SELECT id FROM user_promos WHERE user_id=$1 AND promo_code=$2`,
//       [userId, code]
//     );

//     if (used.rows.length > 0) {
//       return res.status(400).json({ error: "Already used" });
//     }

//     // уже есть активный промо
//     const active = await q(
//       `SELECT id FROM user_promos WHERE user_id=$1 AND consumed=false`,
//       [userId]
//     );

//     if (active.rows.length > 0) {
//       return res.status(400).json({ error: "Already active promo" });
//     }

//     // создаём промо (НИЧЕГО В USERS НЕ ТРОГАЕМ!)
//     await q(
//       `
//       INSERT INTO user_promos
//       (user_id, promo_code, discount, car_ids, consumed)
//       VALUES ($1,$2,$3,$4,false)
//       `,
//       [
//         userId,
//         code,
//         Number(promo.discount) || 0,
//         promo.car_ids || null,
//       ]
//     );

//     return res.json({
//       success: true,
//     });

//   } catch (e) {
//     console.log("REDEEM ERROR:", e);
//     return res.status(500).json({ error: "server error" });
//   }
// });

// /* ================= BUY ================= */
// router.post("/buy", auth, async (req, res) => {
//   try {
//     const { carId } = req.body;

//     if (!carId) {
//       return res.status(400).json({ error: "carId missing" });
//     }

//     // сохраняем покупку
//     await q(
//       `INSERT INTO user_cars (user_id, car_id)
//        VALUES ($1,$2)`,
//       [req.userId, carId]
//     );

//     // 🔥 СЖИГАЕМ ТОЛЬКО ОДИН АКТИВНЫЙ ПРОМО
//     await q(
//       `
//       UPDATE user_promos
//       SET consumed=true
//       WHERE user_id=$1 AND consumed=false
//       `,
//       [req.userId]
//     );

//     return res.json({ success: true });

//   } catch (e) {
//     console.log("BUY ERROR:", e);
//     return res.status(500).json({ error: "server error" });
//   }
// });

// module.exports = router;



const express = require("express");
const auth = require("../middleware/auth");
const { q } = require("../db");

const router = express.Router();

/* ================= REDEEM ================= */
router.post("/redeem", auth, async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.userId;

    if (!code) {
      return res.status(400).json({ error: "No code" });
    }

    const promoRes = await q(
      `SELECT * FROM promo_codes WHERE code=$1`,
      [code]
    );

    const promo = promoRes.rows[0];

    if (!promo) {
      return res.status(404).json({ error: "Invalid code" });
    }

    // ================= RULES (ТОЛЬКО СТРОКА) =================
    let rules = promo.rules;

    // если вдруг пришёл JSON или мусор
    if (typeof rules !== "string") {
      rules = String(rules || "");
    }

    rules = rules.trim();

    // ================= VALIDATION =================
    if (!rules) {
      return res.status(400).json({ error: "Invalid promo config" });
    }

    const validTypes = ["coin", "premium", "default", "all"];

    if (!validTypes.includes(rules)) {
      return res.status(400).json({ error: "Invalid promo type" });
    }

    // ================= CHECK USED =================
    const used = await q(
      `SELECT id FROM user_promos WHERE user_id=$1 AND promo_code=$2`,
      [userId, code]
    );

    if (used.rows.length > 0) {
      return res.status(400).json({ error: "Already used" });
    }

    // ================= ACTIVE PROMO =================
    const active = await q(
      `SELECT id FROM user_promos WHERE user_id=$1 AND consumed=false`,
      [userId]
    );

    if (active.rows.length > 0) {
      return res.status(400).json({ error: "Already active promo" });
    }

    // ================= SAVE =================
    await q(
      `INSERT INTO user_promos (user_id, promo_code, rules, consumed)
       VALUES ($1,$2,$3,false)`,
      [userId, code, rules]
    );

    res.json({ success: true });

  } catch (e) {
    console.log("PROMO ERROR:", e);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;