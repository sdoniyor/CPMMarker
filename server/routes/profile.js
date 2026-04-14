const express = require("express");
const { q } = require("../db");

const router = express.Router();

/* ================= GET PROFILE ================= */
router.get("/:id", async (req, res) => {
  try {
    const r = await q("SELECT * FROM users WHERE id=$1", [req.params.id]);

    const user = r.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    delete user.password;

    res.json(user);
  } catch (e) {
    console.log("GET PROFILE ERROR:", e);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= UPDATE AVATAR ================= */
router.post("/update-avatar", async (req, res) => {
  try {
    const { userId, avatar } = req.body;

    if (!userId || !avatar) {
      return res.status(400).json({ error: "Missing data" });
    }

    await q(
      "UPDATE users SET avatar=$1 WHERE id=$2",
      [avatar, userId]
    );

    const r = await q("SELECT * FROM users WHERE id=$1", [userId]);
    const user = r.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    delete user.password;

    res.json(user);
  } catch (e) {
    console.log("UPDATE AVATAR ERROR:", e);
    res.status(500).json({ error: "Failed to update avatar" });
  }
});

/* ================= UPDATE PROFILE (optional) ================= */
router.post("/update", async (req, res) => {
  try {
    const { userId, name, email } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    await q(
      "UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email) WHERE id=$3",
      [name, email, userId]
    );

    const r = await q("SELECT * FROM users WHERE id=$1", [userId]);
    const user = r.rows[0];

    delete user.password;

    res.json(user);
  } catch (e) {
    console.log("UPDATE PROFILE ERROR:", e);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;