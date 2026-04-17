require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

/* ================= ROUTES ================= */
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const marketRoutes = require("./routes/market");
const promoRoutes = require("./routes/promo");
const orderRoutes = require("./routes/order");
const telegramRoutes = require("./routes/telegram");

/* ================= INIT ================= */
const app = express();

/* ================= CREATE UPLOADS FOLDER ================= */
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 uploads folder created");
}

/* ================= CORS ================= */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

/* ================= BODY LIMIT PROTECTION ================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ================= STATIC FILES ================= */
app.use("/uploads", express.static(uploadDir));

/* ================= REQUEST LOG ================= */
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

/* ================= HEALTH CHECK ================= */
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

  res.status(500).json({
    error: "Internal server error",
  });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});