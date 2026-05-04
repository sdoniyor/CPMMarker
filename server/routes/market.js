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
const { q } = require("../db");

const router = express.Router();

/* ================= GET ACTIVE PROMO ================= */
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
router.get("/cars", async (req, res) => {
  try {
    const userId = req.userId || null;

    const carsRes = await q(`
      SELECT 
        id,
        name,
        brand,
        price,
        image_url,
        type
      FROM cars
      ORDER BY id DESC
    `);

    const cars = carsRes.rows || [];

    let promo = null;

    if (userId) {
      promo = await getUserPromo(userId);
    }

    let rules = promo?.rules || null;
    let discount = Number(promo?.discount || 0);

    if (typeof rules !== "string") {
      rules = String(rules || "");
    }

    rules = rules.trim();

    const result = cars.map((car) => {
      let finalPrice = car.price;
      let promoActive = false;

      if (promo && discount > 0) {
        if (rules === "all" || rules === car.type) {
          finalPrice = Math.floor(
            car.price - (car.price * discount) / 100
          );
          promoActive = true;
        }
      }

      return {
        ...car,
        final_price: finalPrice,
        promo_active: promoActive,
      };
    });

    res.json(result);

  } catch (e) {
    console.log("CARS ERROR:", e);
    res.status(500).json({ error: "Failed to load cars" });
  }
});

/* ================= CAR BY ID ================= */
router.get("/cars/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await q(
      `
      SELECT 
        id,
        name,
        brand,
        price,
        image_url,
        type
      FROM cars
      WHERE id = $1
      `,
      [id]
    );

    const car = result.rows[0];

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(car);

  } catch (e) {
    console.log("CAR BY ID ERROR:", e);
    res.status(500).json({ error: "Failed to load car" });
  }
});

/* ================= CONFIGS ================= */
router.get("/configs", async (req, res) => {
  try {
    const result = await q(`
      SELECT type, data
      FROM global_car_configs
    `);

    const rows = result.rows || [];

    const grouped = rows.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item.data);
      return acc;
    }, {});

    res.json({
      power: grouped.power || [],
      tuning: grouped.tuning || [],
      wheels: grouped.wheels || [],
    });

  } catch (e) {
    console.log("CONFIGS ERROR:", e);

    res.status(500).json({
      power: [],
      tuning: [],
      wheels: [],
      error: "Failed to load configs",
    });
  }
});

/* ================= FILTER BY TYPE ================= */
router.get("/cars/type/:type", async (req, res) => {
  try {
    const { type } = req.params;

    const result = await q(
      `
      SELECT 
        id,
        name,
        brand,
        price,
        image_url,
        type
      FROM cars
      WHERE type = $1
      ORDER BY id DESC
      `,
      [type]
    );

    res.json(result.rows || []);

  } catch (e) {
    console.log("FILTER CARS ERROR:", e);
    res.status(500).json({ error: "Failed to filter cars" });
  }
});

module.exports = router;