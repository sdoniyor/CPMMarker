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


router.get("/cars", async (req, res) => {
  try {
    const userId = req.userId; // если auth есть (если нет — ignore)

    const cars = await q(`
      SELECT id, name, brand, price, image_url, type
      FROM cars
      ORDER BY id DESC
    `);

    let promo = null;

    // ================= GET ACTIVE PROMO =================
    if (userId) {
      const promoRes = await q(
        `SELECT discount, rules
         FROM user_promos
         WHERE user_id=$1 AND consumed=false
         ORDER BY id DESC
         LIMIT 1`,
        [userId]
      );

      promo = promoRes.rows[0] || null;
    }

    let rules = promo?.rules || null;
    let discount = Number(promo?.discount || 0);

    if (typeof rules !== "string") {
      rules = String(rules || "");
    }

    const result = cars.rows.map((car) => {
      let finalPrice = car.price;
      let hasPromo = false;

      if (promo && discount > 0) {
        if (rules === "all" || rules === car.type) {
          finalPrice = Math.floor(
            car.price - (car.price * discount) / 100
          );
          hasPromo = true;
        }
      }

      return {
        ...car,
        final_price: finalPrice,
        promo_active: hasPromo,
      };
    });

    res.json(result);

  } catch (e) {
    console.log("CARS ERROR:", e);
    res.status(500).json({ error: "Failed to load cars" });
  }
});