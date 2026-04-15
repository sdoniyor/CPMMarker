const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { q } = require("../db");

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const hash = await bcrypt.hash(password, 10);

  const r = await q(
    "INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id",
    [name, email, hash]
  );

  const token = jwt.sign(
    { id: r.rows[0].id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const r = await q("SELECT * FROM users WHERE email=$1", [email]);
  const user = r.rows[0];

  if (!user) return res.status(404).json({ error: "User not found" });

  const ok = await bcrypt.compare(password, user.password);

  if (!ok) return res.status(401).json({ error: "Wrong password" });

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token });
});

module.exports = router;