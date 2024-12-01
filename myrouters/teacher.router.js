const express = require("express");
const router = express.Router();
const Teacher = require("../Models/teacher.model");
const bcrypt = require("bcrypt");

// POST request to register a teacher
router.post("/register", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Validate input
    if (!email || !name || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the email is already registered
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new teacher record
    const newTeacher = new Teacher({
      email,
      name,

      password: hashedPassword,
    });

    // Save the teacher to the database
    const savedTeacher = await newTeacher.save();

    res.status(201).json({
      success: true,
      message: "Teacher registered successfully",
      data: savedTeacher,
    });
  } catch (err) {
    console.error("Error registering teacher:", err.message);
    res.status(500).json({ error: "Failed to register teacher" });
  }
});

// POST request to login a teacher
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", teacher });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
