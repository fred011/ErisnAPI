const express = require("express");
const authMiddleware = require("../Auth/auth"); // Middleware for protecting routes
const {
  registerAdmin,
  loginAdmin,
  getAdminData,
  updateAdminData,
} = require("../Controllers/admin.controller");

const router = express.Router();

// Routes

// One-time registration of the admin (setup phase only)
router.post("/register", registerAdmin);

// Admin login for accessing the system
router.post("/login", loginAdmin);

// Fetch admin data (requires admin authentication)
router.get("/data", authMiddleware(["ADMIN"]), getAdminData);

// Update admin data (requires admin authentication)
router.patch("/update", authMiddleware(["ADMIN"]), updateAdminData);

module.exports = router;
