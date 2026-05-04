// const express = require("express");
// const { q } = require("../db");

// const router = express.Router();

// /* ================= CARS ================= */
// router.get("/cars", async (req, res) => {
//   try {
//     const r = await q("SELECT * FROM cars");

//     res.json(r.rows || []);
//   } catch (e) {
//     console.log("CARS ERROR:", e);
//     res.status(500).json({ error: "Failed to load cars" });
//   }
// });

// /* ================= CONFIGS ================= */
// router.get("/configs", async (req, res) => {
//   try {
//     const r = await q("SELECT * FROM global_car_configs");

//     const rows = r.rows || [];

//     res.json({
//       power: rows.filter(i => i.type === "power"),
//       tuning: rows.filter(i => i.type === "tuning"),
//       wheels: rows.filter(i => i.type === "wheels"),
//     });

//   } catch (e) {
//     console.log("CONFIGS ERROR:", e);
//     res.status(500).json({
//       power: [],
//       tuning: [],
//       wheels: [],
//       error: "Failed to load configs",
//     });
//   }
// });

// module.exports = router;


const express = require("express");
const auth = require("../middleware/auth");
const { q } = require("../db");

const router = express.Router();

/* ================= PROMO ================= */
const getUserPromo = async (userId) => {
  const promoRes = await q(
    `
    SELECT promo_code, discount, rules
    FROM user_promos
    WHERE user_id=$1 AND consumed=false
    ORDER BY id DESC
    LIMIT 1
    `,
    [userId]
  );

  return promoRes.rows[0] || null;
};

/* ================= CARS ================= */
router.get("/cars", auth, async (req, res) => {
  try {
    const userId = req.userId;

    const carsRes = await q(`
      SELECT id, name, brand, price, image_url, type
      FROM cars
      ORDER BY id DESC
    `);

    const promo = await getUserPromo(userId);

    let rules = promo?.rules || "";
    let discount = Number(promo?.discount || 0);

    rules = String(rules).trim();

    const cars = carsRes.rows.map((car) => {
      let finalPrice = car.price;
      let active = false;

      if (promo && discount > 0) {
        if (rules === "all" || rules === car.type) {
          finalPrice = Math.floor(
            car.price - (car.price * discount) / 100
          );
          active = true;
        }
      }

      return {
        ...car,
        final_price: finalPrice,
        promo_active: active,
      };
    });

    res.json(cars);

  } catch (e) {
    console.log("CARS ERROR:", e);
    res.status(500).json({ error: "Failed to load cars" });
  }
});

module.exports = router;