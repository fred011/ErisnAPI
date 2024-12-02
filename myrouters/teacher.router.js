const express = require("express");
const router = express.Router();
const Teacher = require("../Models/teacher.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    console.error("Error registering teacher:", err);
    res
      .status(500)
      .json({ error: "Failed to register teacher", details: err.message });
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

    // Compare password with the hashed password stored in the DB
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token for the authenticated teacher
    const token = jwt.sign(
      { id: teacher._id, email: teacher.email },
      process.env.JWT_SECRET, // Make sure to set JWT_SECRET in your environment variables
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Send the response with the token
    res.status(200).json({
      message: "Login successful",
      token: token, // Send token to the client
    });
  } catch (err) {
    console.error("Error during login:", err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

module.exports = router;
