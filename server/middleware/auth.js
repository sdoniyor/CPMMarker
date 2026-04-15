const jwt = require("jsonwebtoken");
const { q } = require("../db");

module.exports = async function (req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userCheck = await q(
      "SELECT id FROM users WHERE id=$1",
      [decoded.id]
    );

    if (!userCheck.rows[0]) {
      return res.status(401).json({ error: "User not found" });
    }

    req.userId = decoded.id;
    next();

  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
};