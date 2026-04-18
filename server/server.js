// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const fs = require("fs");

// const authRoutes = require("./routes/auth");
// const profileRoutes = require("./routes/profile");
// const marketRoutes = require("./routes/market");
// const promoRoutes = require("./routes/promo");
// const orderRoutes = require("./routes/order");
// const telegramRoutes = require("./routes/telegram");

// const app = express();

// /* ================= UPLOADS ================= */
// const uploadDir = path.join(__dirname, "uploads");

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
//   console.log("📁 uploads folder created");
// }

// /* ================= CORS (PRO FIX) ================= */
// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://localhost:5173",
//   "https://cpmmarker.onrender.com",
//   "https://cpm-marker.vercel.app",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       console.log("❌ CORS BLOCKED:", origin);
//       return callback(null, true); // ⚡ чтобы не ломало фронт (dev-safe)
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// /* ================= BODY ================= */
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// /* ================= STATIC ================= */
// app.use("/uploads", express.static(uploadDir));

// /* ================= LOGGING ================= */
// app.use((req, res, next) => {
//   console.log(`➡️ ${req.method} ${req.url}`);
//   next();
// });

// /* ================= ROUTES ================= */
// app.use("/auth", authRoutes);
// app.use("/profile", profileRoutes);
// app.use("/market", marketRoutes);
// app.use("/promo", promoRoutes);
// app.use("/order", orderRoutes);
// app.use("/telegram", telegramRoutes);

// /* ================= HEALTH ================= */
// app.get("/", (req, res) => {
//   res.json({
//     ok: true,
//     message: "CPM Market API running 🚀",
//     time: new Date().toISOString(),
//   });
// });

// /* ================= 404 ================= */
// app.use((req, res) => {
//   res.status(404).json({
//     error: "Route not found",
//     path: req.originalUrl,
//   });
// });

// /* ================= ERROR HANDLER ================= */
// app.use((err, req, res, next) => {
//   console.error("🔥 SERVER ERROR:", err);

//   res.status(500).json({
//     error: "Internal server error",
//   });
// });

// /* ================= START ================= */
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


const express = require("express");
const auth = require("./middleware/auth");
const { q } = require("../db");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

/* ================= UPLOAD DIR ================= */
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 uploads folder created:", uploadDir);
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

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/* ================= GET PROFILE ================= */
router.get("/me", auth, async (req, res) => {
  try {
    const r = await q("SELECT * FROM users WHERE id=$1", [req.userId]);
    const user = r.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const refs = await q(
      "SELECT COUNT(*) FROM users WHERE referred_by=$1",
      [req.userId]
    );

    res.json({
      id: user.id,
      name: user.name,
      email: user.email || null,
      avatar: user.avatar || null,

      discount: Number(user.discount) || 0,

      telegram_username: user.telegram_username || null,
      telegram_id: user.telegram_id || null,

      ref_code: user.ref_code || null,

      // ✅ FIX COUNT
      ref_count: parseInt(refs.rows?.[0]?.count || "0", 10),
    });
  } catch (e) {
    console.log("PROFILE ERROR:", e);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= TELEGRAM LINK ================= */
router.post("/telegram/link", auth, async (req, res) => {
  try {
    const code = Math.random().toString(36).substring(2, 10);

    await q(
      "INSERT INTO telegram_links (user_id, code, used) VALUES ($1,$2,false)",
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
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = `/uploads/${req.file.filename}`;

      const r = await q(
        `UPDATE users 
         SET avatar=$1 
         WHERE id=$2 
         RETURNING id, name, email, avatar`,
        [filePath, req.userId]
      );

      res.json(r.rows[0]);
    } catch (e) {
      console.log("UPLOAD ERROR:", e);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

module.exports = router;