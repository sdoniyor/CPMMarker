const express = require("express");
const { q } = require("../db");

const router = express.Router();

/* CARS */
router.get("/cars", async (req, res) => {
  const r = await q("SELECT * FROM cars");
  res.json(r.rows);
});

/* CONFIGS */
router.get("/configs", async (req, res) => {
  const r = await q("SELECT * FROM global_car_configs");
  const rows = r.rows || [];

  res.json({
    power: rows.filter(i => i.type === "power"),
    tuning: rows.filter(i => i.type === "tuning"),
    wheels: rows.filter(i => i.type === "wheels"),
  });
});

module.exports = router;