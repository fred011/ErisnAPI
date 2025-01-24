const express = require("express");
const authMiddleware = require("./path/to/authMiddleware");

const router = express.Router();

router.get("/admin-data", authMiddleware(["admin"]), (req, res) => {
  res.json({ success: true, message: "Welcome, admin!" });
});

router.get(
  "/teacher-data",
  authMiddleware(["teacher", "admin"]),
  (req, res) => {
    res.json({ success: true, message: "Welcome, teacher or admin!" });
  }
);
