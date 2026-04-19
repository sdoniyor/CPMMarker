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
//   fs.mkdirSync(uploadDir, { recursive: true });
//   console.log("📁 uploads folder created:", uploadDir);
// }

// /* ================= CORS FIX ================= */
// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://localhost:5173",
//   "https://cpmmarker.onrender.com",
//   "https://cpm-marker.vercel.app",
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // allow tools like Postman / server-to-server
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       console.log("❌ CORS BLOCKED:", origin);

//       // НЕ ломаем фронт
//       return callback(null, true);
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// /* ================= BODY ================= */
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// /* ================= STATIC FILES ================= */
// app.use("/uploads", express.static(uploadDir));

// /* ================= LOGS ================= */
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

// /* ================= HEALTH CHECK ================= */
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







require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const marketRoutes = require("./routes/market");
const promoRoutes = require("./routes/promo");
const orderRoutes = require("./routes/order");
const telegramRoutes = require("./routes/telegram");

const app = express();

/* ================= UPLOADS (FIXED) ================= */
// 🔥 ВАЖНО: используем стабильную папку внутри сервера
const uploadDir = path.join(__dirname, "uploads");

// создаём если нет
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 uploads folder created:", uploadDir);
}

/* ================= CORS ================= */
app.use(
  cors({
    origin: true, // проще и стабильнее для прод
    credentials: true,
  })
);

/* ================= BODY ================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ================= STATIC FILES ================= */
// 🔥 именно это даёт доступ к /uploads/...
app.use("/uploads", express.static(uploadDir));

/* ================= LOGGING ================= */
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

/* ================= ROUTES ================= */
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/market", marketRoutes);
app.use("/promo", promoRoutes);
app.use("/order", orderRoutes);
app.use("/telegram", telegramRoutes);

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "CPM Market API running 🚀",
    time: new Date().toISOString(),
  });
});

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(500).json({ error: "Internal server error" });
});

/* ================= START ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});