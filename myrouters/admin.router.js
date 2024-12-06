const express = require("express");
const router = express.Router();
const Admin = require("../Models/admin.model");
const bcrypt = require("bcryptjs");

// POST request to register an admin (allow multiple admins)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the email is already registered
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin record
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    // Save the admin to the database
    const savedAdmin = await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: savedAdmin,
    });
  } catch (err) {
    console.error("Error registering admin:", err.message);
    res.status(500).json({ error: "Failed to register admin" });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Optionally, set a cookie/session here
    res.status(200).json({ message: "Login successful", admin });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/logout", (req, res) => {
  // If you're using sessions
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      } else {
        return res.status(200).json({ message: "Logged out successfully" });
      }
    });
  } else {
    // If you're using JWTs, just send a success response
    res.status(200).json({ message: "Logged out successfully" });
  }
});

module.exports = router;

module.exports = router;
