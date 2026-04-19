
// const express = require("express");
// const auth = require("../middleware/auth");
// const { q } = require("../db");

// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const router = express.Router();

// /* ================= UPLOAD DIR (Render safe) ================= */
// const uploadDir = path.join(process.cwd(), "server/uploads");

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
//   console.log("📁 uploads folder created:", uploadDir);
// }

// /* ================= MULTER ================= */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `avatar-${Date.now()}${ext}`);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

// /* ================= GET PROFILE ================= */
// router.get("/me", auth, async (req, res) => {
//   try {
//     const r = await q("SELECT * FROM users WHERE id=$1", [req.userId]);
//     const user = r.rows[0];

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const refs = await q(
//       "SELECT COUNT(*) FROM users WHERE referred_by=$1",
//       [req.userId]
//     );

//     let discountCars = [];

//     try {
//       if (Array.isArray(user.discount_cars)) {
//         discountCars = user.discount_cars;
//       } else if (typeof user.discount_cars === "string") {
//         discountCars = user.discount_cars
//           .split(",")
//           .map((x) => Number(x.trim()))
//           .filter(Boolean);
//       }
//     } catch {
//       discountCars = [];
//     }

//     res.json({
//       id: user.id,
//       name: user.name,
//       email: user.email || null,
//       avatar: user.avatar || null,

//       discount: Number(user.discount) || 0,
//       discount_cars: discountCars,

//       telegram_username: user.telegram_username || null,
//       telegram_id: user.telegram_id || null,

//       ref_code: user.ref_code || null,
//       ref_count: Number(refs.rows?.[0]?.count || 0),
//     });
//   } catch (e) {
//     console.log("PROFILE ERROR:", e);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// /* ================= TELEGRAM LINK ================= */
// router.post("/telegram/link", auth, async (req, res) => {
//   try {
//     const code = Math.random().toString(36).substring(2, 10);

//     await q(
//       "INSERT INTO telegram_links (user_id, code, used) VALUES ($1,$2,false)",
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
//   upload.single("avatar"),
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded" });
//       }

//       const filePath = `/uploads/${req.file.filename}`;

//       const r = await q(
//         `UPDATE users 
//          SET avatar=$1 
//          WHERE id=$2 
//          RETURNING id, name, email, avatar`,
//         [filePath, req.userId]
//       );

//       res.json(r.rows[0]);
//     } catch (e) {
//       console.log("UPLOAD ERROR:", e);
//       res.status(500).json({ error: "Upload failed" });
//     }
//   }
// );

// module.exports = router;



const express = require("express");
const auth = require("../middleware/auth");
const { q } = require("../db");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

/* ================= UPLOAD DIR ================= */
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 uploads ready:", uploadDir);
}

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

/* ================= PARSE CAR IDS ================= */
const parseCarIds = (car_ids) => {
  if (!car_ids) return [];

  if (Array.isArray(car_ids)) return car_ids.map(Number);

  if (typeof car_ids === "string") {
    return car_ids
      .split(",")
      .map((x) => Number(x.trim()))
      .filter((x) => !isNaN(x));
  }

  return [];
};

/* ================= GET PROFILE ================= */
router.get("/me", auth, async (req, res) => {
  try {
    const r = await q("SELECT * FROM users WHERE id=$1", [req.userId]);
    const user = r.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    /* ================= REF COUNT ================= */
    const refs = await q(
      "SELECT COUNT(*) FROM users WHERE referred_by=$1",
      [req.userId]
    );

    /* ================= PROMO CARS FROM DB ================= */
    const promoRes = await q(
      "SELECT car_id FROM user_promos WHERE user_id=$1",
      [req.userId]
    );

    const promoCars = promoRes.rows.map((r) => Number(r.car_id));

    /* ================= RESPONSE ================= */
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,

      discount: Number(user.discount) || 0,

      ref_code: user.ref_code,
      ref_count: Number(refs.rows[0].count),

      telegram_username: user.telegram_username,
      telegram_id: user.telegram_id,

      // 🔥 ВАЖНО ДЛЯ МАРКЕТА
      promo_cars: promoCars,
    });

  } catch (e) {
    console.log("PROFILE ERROR:", e);
    res.status(500).json({ error: "server error" });
  }
});

/* ================= UPLOAD AVATAR ================= */
router.post(
  "/upload-avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = `/uploads/${req.file.filename}`;

      const r = await q(
        "UPDATE users SET avatar=$1 WHERE id=$2 RETURNING *",
        [filePath, req.userId]
      );

      res.json({
        success: true,
        user: r.rows[0],
      });

    } catch (e) {
      console.log("UPLOAD ERROR:", e);
      res.status(500).json({ error: "upload failed" });
    }
  }
);

module.exports = router;