require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const marketRoutes = require("./routes/market");
const profileRoutes = require("./routes/profile");
const telegramRoutes = require("./routes/telegram");
const promoRoutes = require("./routes/promo"); // 🔥 ДОБАВЬ

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

/* ================= ROUTES ================= */

/* AUTH */
app.use("/auth", authRoutes);

/* MARKET */
app.use("/market", marketRoutes);

/* PROFILE */
app.use("/profile", profileRoutes);

/* TELEGRAM */
app.use("/telegram", telegramRoutes);

/* PROMO */
app.use("/promo", promoRoutes); // 🔥 ВАЖНО

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "CPM SERVER RUNNING 🚀",
  });
});

/* ================= 404 ================= */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

/* ================= START ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 SERVER RUNNING ON PORT:", PORT);
});