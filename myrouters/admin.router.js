const express = require("express");

const router = express.Router();
const Admin = require("../Models/admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getAdminOwnData } = require("../Controllers/admin.controller");

// POST request to register an admin
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
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

// POST request to log in an admin
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "ADMIN" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Ensure secure cookies in production
      sameSite: "None",
    });

    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST request to log out an admin
router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Logged out successfully" });
});

router.get("/fetch-single/id", getAdminOwnData);

module.exports = router;
