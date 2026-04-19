const express = require("express");
const { q } = require("../db");

const router = express.Router();

/* ================= CARS ================= */
router.get("/cars", async (req, res) => {
  try {
    const r = await q("SELECT * FROM cars");

    res.json(r.rows || []);
  } catch (e) {
    console.log("CARS ERROR:", e);
    res.status(500).json({ error: "Failed to load cars" });
  }
});

/* ================= CONFIGS ================= */
router.get("/configs", async (req, res) => {
  try {
    const r = await q("SELECT * FROM global_car_configs");

    const rows = r.rows || [];

    const power = rows.filter((i) => i.type === "power");
    const tuning = rows.filter((i) => i.type === "tuning");
    const wheels = rows.filter((i) => i.type === "wheels");

    res.json({
      power,
      tuning,
      wheels,
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



module.exports = router;

