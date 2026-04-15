const express = require("express");
const { q } = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* GET ME */
router.get("/me", auth, async (req, res) => {
  const r = await q("SELECT * FROM users WHERE id=$1", [req.userId]);

  const user = r.rows[0];
  if (!user) return res.status(404).json({ error: "not found" });

  delete user.password;
  res.json(user);
});

/* UPDATE AVATAR */
router.post("/update-avatar", auth, async (req, res) => {
  const { avatar } = req.body;

  await q(
    "UPDATE users SET avatar=$1 WHERE id=$2",
    [avatar, req.userId]
  );

  const r = await q("SELECT * FROM users WHERE id=$1", [req.userId]);

  delete r.rows[0].password;
  res.json(r.rows[0]);
});

module.exports = router;