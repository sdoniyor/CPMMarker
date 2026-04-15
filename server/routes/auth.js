// const express = require("express");
// const bcrypt = require("bcrypt");
// const { q } = require("../db");

// const router = express.Router();

// /* REGISTER */
// router.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;

//   const hash = await bcrypt.hash(password, 10);

//   const user = await q(
//     `INSERT INTO users (name,email,password)
//      VALUES ($1,$2,$3)
//      RETURNING id,name,email`,
//     [name, email, hash]
//   );

//   res.json(user.rows[0]);
// });

// /* LOGIN */
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const r = await q("SELECT * FROM users WHERE email=$1", [email]);
//   const user = r.rows[0];

//   if (!user) return res.status(404).json({ error: "user not found" });

//   const ok = await bcrypt.compare(password, user.password);

//   if (!ok) return res.status(401).json({ error: "wrong password" });

//   delete user.password;

//   res.json({ user });
// });

// module.exports = router;







const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { q } = require("../db");

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const exist = await q("SELECT id FROM users WHERE email=$1", [email]);
  if (exist.rows.length) {
    return res.status(400).json({ error: "Email exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await q(
    `INSERT INTO users (name,email,password)
     VALUES ($1,$2,$3)
     RETURNING id,name,email`,
    [name, email, hash]
  );

  const token = jwt.sign(
    { id: user.rows[0].id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: user.rows[0],
  });
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const r = await q("SELECT * FROM users WHERE email=$1", [email]);
  const user = r.rows[0];

  if (!user) return res.status(404).json({ error: "not found" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "wrong password" });

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  delete user.password;

  res.json({ token, user });
});

module.exports = router;