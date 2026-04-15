const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const marketRoutes = require("./routes/market");
const promoRoutes = require("./routes/promo");

// 🔥 TELEGRAM / ORDER ROUTES
const orderRoutes = require("./routes/order");
// или: const telegramRoutes = require("./routes/telegram");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/market", marketRoutes);
app.use("/promo", promoRoutes);

// 🔥 TELEGRAM API
app.use("/order", orderRoutes);
// или: app.use("/telegram", telegramRoutes);

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Server running 🚀" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running " + PORT));