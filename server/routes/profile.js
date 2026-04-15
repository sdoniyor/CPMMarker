const express = require("express");
const auth = require("../middleware/auth");
const { q } = require("../db");

const router = express.Router();

/* GET MY PROFILE */
router.get("/me", auth, async (req, res) => {
  const r = await q("SELECT * FROM users WHERE id=$1", [req.userId]);

  const user = r.rows[0];
  delete user.password;

  res.json(user);
});

module.exports = router;