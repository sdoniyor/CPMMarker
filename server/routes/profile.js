const express = require("express");
const { q } = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= GET MY PROFILE ================= */
router.get("/me", auth, async (req, res) => {
  try {
    const r = await q("SELECT * FROM users WHERE id=$1", [
      req.userId,
    ]);

    const user = r.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    delete user.password;

    res.json(user);
  } catch (e) {
    console.log("PROFILE ERROR:", e);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= UPDATE AVATAR (JWT SAFE) ================= */
router.post("/update-avatar", auth, async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ error: "Missing avatar" });
    }

    await q(
      "UPDATE users SET avatar=$1 WHERE id=$2",
      [avatar, req.userId]
    );

    const r = await q("SELECT * FROM users WHERE id=$1", [
      req.userId,
    ]);

    const user = r.rows[0];

    delete user.password;

    res.json(user);
  } catch (e) {
    console.log("AVATAR ERROR:", e);
    res.status(500).json({ error: "Failed to update avatar" });
  }
});

/* ================= UPDATE NAME/EMAIL ================= */
router.post("/update", auth, async (req, res) => {
  try {
    const { name, email } = req.body;

    await q(
      `UPDATE users 
       SET name = COALESCE($1, name),
           email = COALESCE($2, email)
       WHERE id=$3`,
      [name, email, req.userId]
    );

    const r = await q("SELECT * FROM users WHERE id=$1", [
      req.userId,
    ]);

    const user = r.rows[0];

    delete user.password;

    res.json(user);
  } catch (e) {
    console.log("UPDATE ERROR:", e);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;