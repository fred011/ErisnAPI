const express = require("express");
const authMiddleware = require("../Auth/auth");
const router = express.Router();
const Student = require("../Models/student.model");
const bcrypt = require("bcryptjs");
const {
  getStudentsWithQuery,
  updateStudentData,
  getStudentOwnData,
  getStudentWithId,
  deleteStudentWithId,
  registerStudent,
} = require("../Controllers/student.controller");

// POST request to register a student
router.post("/register", registerStudent);

// POST request to login a student
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Compare password with the stored hash
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET is not set" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: student._id, email: student.email, role: "STUDENT" },
      process.env.JWT_SECRET, // Ensure JWT_SECRET is in your environment variables
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Send successful response with token
    res.status(200).json({ message: "Login successful", student, token });
  } catch (err) {
    console.error("Error during login:", err); // Log the error
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get(
  "/fetch-with-query",
  authMiddleware(["ADMIN", "TEACHER"]),
  getStudentsWithQuery
); // Protected
router.get("/fetch-single", authMiddleware(["STUDENT"]), getStudentOwnData); // Only students can access their own data
router.get(
  "/fetch/:id",
  authMiddleware(["ADMIN", "TEACHER"]),
  getStudentWithId
); // Protected
router.patch(
  "/update/:id",
  authMiddleware(["ADMIN", "STUDENT"]),
  updateStudentData
); // Admins & students can update
router.delete("/delete/:id", authMiddleware(["ADMIN"]), deleteStudentWithId); // Only admins can delete

module.exports = router;
