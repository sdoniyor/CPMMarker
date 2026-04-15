const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const marketRoutes = require("./routes/market"); // 👈 ДОБАВИЛ

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/market", marketRoutes); // 👈 ВАЖНО

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Server running 🚀" });
});

app.listen(5000, () => console.log("Server running"));