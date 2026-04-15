require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const marketRoutes = require("./routes/market");
const profileRoutes = require("./routes/profile");
const telegramRoutes = require("./routes/telegram");
const promoRoutes = require("./routes/promo");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

app.use("/auth", authRoutes);
app.use("/market", marketRoutes);
app.use("/profile", profileRoutes);
app.use("/telegram", telegramRoutes);
app.use("/promo", promoRoutes);

app.get("/", (req, res) => {
  res.json({ ok: true });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("SERVER RUNNING");
});