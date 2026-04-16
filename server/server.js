require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

/* ================= ROUTES ================= */
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const marketRoutes = require("./routes/market");
const promoRoutes = require("./routes/promo");
const orderRoutes = require("./routes/order");

/* ================= INIT ================= */
const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: "*",
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= UPLOADS STATIC ================= */
/* ⚠️ ВАЖНО: папка uploads должна существовать */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= ROUTES ================= */
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/market", marketRoutes);
app.use("/promo", promoRoutes);
app.use("/order", orderRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "CPM Market API running 🚀",
  });
});

/* ================= 404 HANDLER ================= */
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