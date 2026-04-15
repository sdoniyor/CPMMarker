// const express = require("express");
// const { q } = require("../db");

// const router = express.Router();

// /**
//  * REDEEM PROMO CODE
//  */
// router.post("/redeem", async (req, res) => {
//    console.log("🔥 PROMO HIT:", req.body);
//   try {
//     const { userId, code } = req.body;

//     if (!userId || !code) {
//       return res.status(400).json({
//         success: false,
//         error: "Missing userId or code",
//       });
//     }

//     // ищем промокод
//       const promoRes = await q(
//       "SELECT * FROM promo_codes WHERE code = $1",
//       [code]
//     );

//     const promo = promoRes.rows[0];

//     if (!promo) {
//       return res.json({
//         success: false,
//         error: "Invalid promo code",
//       });
//     }

//     if (promo.used) {
//       return res.json({
//         success: false,
//         error: "Promo already used",
//       });
//     }

//     await q(
//       "UPDATE users SET discount = COALESCE(discount, 0) + $1 WHERE id = $2",
//       [promo.discount, userId]
//     );

//     await q(
//       "UPDATE promo_codes SET used = true, used_by = $1 WHERE code = $2",
//       [userId, code]
//     );

//     res.json({
//       success: true,
//       discount: promo.discount,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       error: "Server error",
//     });
//   }
// });


// module.exports = router;









const express = require("express");
const { q } = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/redeem", auth, async (req, res) => {
  const { code } = req.body;

  const r = await q(
    "SELECT * FROM promo_codes WHERE code=$1",
    [code]
  );

  const promo = r.rows[0];

  if (!promo) {
    return res.json({ success: false, error: "Invalid code" });
  }

  if (promo.used) {
    return res.json({ success: false, error: "Used" });
  }

  await q(
    "UPDATE users SET discount = COALESCE(discount,0) + $1 WHERE id=$2",
    [promo.discount, req.userId]
  );

  await q(
    "UPDATE promo_codes SET used=true, used_by=$1 WHERE id=$2",
    [req.userId, promo.id]
  );

  res.json({ success: true });
});

module.exports = router;