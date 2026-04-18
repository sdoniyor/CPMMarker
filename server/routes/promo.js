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

/* ================= PARSE CAR IDS ================= */
const parseCarIds = (car_ids) => {
  if (!car_ids) return [];

  return car_ids
    .split(",")
    .map((x) => Number(x.trim()))
    .filter((x) => !isNaN(x));
};

/* ================= REDEEM PROMO ================= */
router.post("/redeem", auth, async (req, res) => {
  try {
    const { code, car_id } = req.body;
    const userId = req.userId;

    if (!code) {
      return res.status(400).json({ error: "No code provided" });
    }

    const user = await getUser(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    /* ================= GET PROMO ================= */
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

    /* ================= LIMIT ================= */
    if (promo.max_uses > 0 && promo.used_count >= promo.max_uses) {
      return res.status(400).json({ error: "Promo limit reached" });
    }

    /* ================= CAR RESTRICTION ================= */
    const allowedCars = parseCarIds(promo.car_ids);

    if (car_id && allowedCars.length > 0) {
      if (!allowedCars.includes(Number(car_id))) {
        return res.status(400).json({
          error: "Promo not valid for this car",
        });
      }
    }

    /* ================= CHECK IF USER ALREADY USED ================= */
    const alreadyUsed = await q(
      "SELECT id FROM user_promos WHERE user_id=$1 AND promo_code=$2",
      [userId, code]
    );

    if (alreadyUsed.rows.length > 0) {
      return res.status(400).json({
        error: "Promo already used",
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
      `UPDATE users 
       SET discount=$1,
           discount_cars=$2
       WHERE id=$3`,
      [
        promo.discount,
        promo.car_ids || null,
        userId,
      ]
    );

    /* ================= UPDATE PROMO USAGE ================= */
    await q(
      `UPDATE promo_codes 
       SET used_count = used_count + 1 
       WHERE id=$1`,
      [promo.id]
    );

    /* ================= RESPONSE ================= */
    res.json({
      success: true,
      discount: promo.discount,
      allowedCars,
    });

  } catch (e) {
    console.log("PROMO ERROR:", e);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;