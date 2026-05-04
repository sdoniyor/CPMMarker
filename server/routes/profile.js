


// const express = require("express");
// const auth = require("../middleware/auth");
// const { q } = require("../db");

// const router = express.Router();

// /* ================= GET PROFILE ================= */
// router.get("/me", auth, async (req, res) => {
//   try {
//     const userRes = await q(
//       `SELECT id, name, email, avatar, ref_code, telegram_username, telegram_id
//        FROM users
//        WHERE id=$1`,
//       [req.userId]
//     );

//     const user = userRes.rows[0];

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     /* ================= REF COUNT ================= */
//     const refs = await q(
//       `SELECT COUNT(*) FROM referrals WHERE referrer_id=$1`,
//       [req.userId]
//     );

//     /* ================= ACTIVE PROMO ================= */
//     const promoRes = await q(
//       `
//       SELECT discount, car_ids
//       FROM user_promos
//       WHERE user_id=$1 AND consumed=false
//       ORDER BY id DESC
//       LIMIT 1
//       `,
//       [req.userId]
//     );

//     const promo = promoRes.rows[0];

//     // безопасный парсер (ВАЖНО)
//     let promoCars = [];

//     if (promo?.car_ids) {
//       try {
//         if (typeof promo.car_ids === "string") {
//           promoCars = promo.car_ids
//             .split(",")
//             .map((x) => Number(x.trim()))
//             .filter(Boolean);
//         } else if (Array.isArray(promo.car_ids)) {
//           promoCars = promo.car_ids.map(Number).filter(Boolean);
//         }
//       } catch (e) {
//         promoCars = [];
//       }
//     }

//     res.json({
//       id: user.id,
//       name: user.name,
//       email: user.email,

//       avatar: user.avatar || null,

//       ref_code: user.ref_code,
//       ref_count: Number(refs.rows?.[0]?.count || 0),

//       telegram_username: user.telegram_username,
//       telegram_id: user.telegram_id,

//       active_promo: promo
//         ? {
//             discount: Number(promo.discount || 0),
//             car_ids: promoCars,
//           }
//         : null,
//     });

//   } catch (e) {
//     console.log("PROFILE ERROR:", e);
//     res.status(500).json({ error: "server error" });
//   }
// });

// /* ================= TELEGRAM LINK ================= */
// router.post("/telegram/link", auth, async (req, res) => {
//   try {
//     const code = Math.random().toString(36).substring(2, 10);

//     await q(
//       `INSERT INTO telegram_links (user_id, code, used)
//        VALUES ($1,$2,false)`,
//       [req.userId, code]
//     );

//     const bot = process.env.BOT_USERNAME || "CPMMarket_bot";

//     res.json({
//       link: `https://t.me/${bot}?start=${code}`,
//       code,
//     });

//   } catch (e) {
//     console.log("TG LINK ERROR:", e);
//     res.status(500).json({ error: "Failed to create link" });
//   }
// });

// /* ================= UPLOAD AVATAR ================= */
// router.post(
//   "/upload-avatar",
//   auth,
//   require("../middleware/upload").single("avatar"),
//   async (req, res) => {
//     try {
//       const imageUrl = req.file?.path;

//       if (!imageUrl) {
//         return res.status(400).json({ error: "No file" });
//       }

//       await q(
//         `UPDATE users SET avatar=$1 WHERE id=$2`,
//         [imageUrl, req.userId]
//       );

//       const user = await q(
//         `SELECT id, name, email, avatar
//          FROM users
//          WHERE id=$1`,
//         [req.userId]
//       );

//       res.json({
//         success: true,
//         user: user.rows[0],
//       });

//     } catch (e) {
//       console.log("UPLOAD ERROR:", e);
//       res.status(500).json({ error: "upload failed" });
//     }
//   }
// );

// module.exports = router;









const express = require("express");
const auth = require("../middleware/auth");
const { q } = require("../db");

const router = express.Router();

/* ================= GET PROFILE ================= */
router.get("/me", auth, async (req, res) => {
  try {
    const userRes = await q(
      `SELECT id, name, email, avatar, ref_code, telegram_username, telegram_id
       FROM users
       WHERE id=$1`,
      [req.userId]
    );

    const user = userRes.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    /* ================= REF COUNT ================= */
    const refs = await q(
      `SELECT COUNT(*) FROM referrals WHERE referrer_id=$1`,
      [req.userId]
    );

    /* ================= ACTIVE PROMO ================= */
    const promoRes = await q(
      `
      SELECT promo_code, rules
      FROM user_promos
      WHERE user_id=$1 AND consumed=false
      ORDER BY id DESC
      LIMIT 1
      `,
      [req.userId]
    );

    const promo = promoRes.rows[0] || null;

    let rules = promo?.rules || null;

    if (typeof rules !== "string") {
      rules = String(rules || "");
    }

    rules = rules.trim();

    const validTypes = ["coin", "premium", "default", "all"];

    const isValidPromo =
      promo &&
      rules &&
      validTypes.includes(rules);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,

      ref_code: user.ref_code,
      ref_count: Number(refs.rows?.[0]?.count || 0),

      telegram_username: user.telegram_username,
      telegram_id: user.telegram_id,

      /* ================= PROMO ================= */
      active_promo: isValidPromo
        ? {
            promo_code: promo.promo_code,
            rules: rules
          }
        : null
    });

  } catch (e) {
    console.log("PROFILE ERROR:", e);
    res.status(500).json({ error: "server error" });
  }
});
/* ================= TELEGRAM LINK ================= */
router.post("/telegram/link", auth, async (req, res) => {
  try {
    const code = Math.random().toString(36).substring(2, 10);

    await q(
      `INSERT INTO telegram_links (user_id, code, used)
       VALUES ($1,$2,false)`,
      [req.userId, code]
    );

    const bot = process.env.BOT_USERNAME || "CPMMarket_bot";

    res.json({
      link: `https://t.me/${bot}?start=${code}`,
      code,
    });

  } catch (e) {
    console.log("TG LINK ERROR:", e);
    res.status(500).json({ error: "Failed to create link" });
  }
});

/* ================= UPLOAD AVATAR ================= */
router.post(
  "/upload-avatar",
  auth,
  require("../middleware/upload").single("avatar"),
  async (req, res) => {
    try {
      const imageUrl = req.file?.path;

      if (!imageUrl) {
        return res.status(400).json({ error: "No file" });
      }

      await q(
        `UPDATE users SET avatar=$1 WHERE id=$2`,
        [imageUrl, req.userId]
      );

      const user = await q(
        `SELECT id, name, email, avatar
         FROM users
         WHERE id=$1`,
        [req.userId]
      );

      res.json({
        success: true,
        user: user.rows[0],
      });

    } catch (e) {
      console.log("UPLOAD ERROR:", e);
      res.status(500).json({ error: "upload failed" });
    }
  }
);

module.exports = router;