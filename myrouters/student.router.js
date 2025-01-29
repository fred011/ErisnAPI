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
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: student._id, email: student.email, role: "STUDENT" },
      process.env.JWT_SECRET, // Make sure to set JWT_SECRET in your environment variables
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res
      .status(200)
      .json({ message: "Login successful", student, token: token });
  } catch (err) {
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
