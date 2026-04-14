const express = require("express");
const { q } = require("../db");

const router = express.Router();

router.get("/:id", async (req, res) => {
  const r = await q("SELECT * FROM users WHERE id=$1", [req.params.id]);
  const user = r.rows[0];

  if (!user) return res.json(null);

  delete user.password;

  res.json(user);
});

module.exports = router;