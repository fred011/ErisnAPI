const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Verify Token Route
router.post("/verify-token", (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({ success: true, valid: true, user: decoded });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, valid: false, message: "Invalid token." });
  }
});

module.exports = router;
