const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../Models/student.model");

/**
 * Registers a Student.
 */
const registerStudent = async (req, res) => {
  try {
    const { email, name, student_class, age, gender, student_image, password } =
      req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({
      email,
      name,
      //   student_class,
      //   age,
      //   gender,
      //   student_image,
      password: hashedPassword,
    });

    const savedStudent = await newStudent.save();
    res.status(201).json({
      success: true,
      message: "Student registered successfully.",
      data: savedStudent,
    });
  } catch (error) {
    console.error("Error registering student:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to register student." });
  }
};

/**
 * Logs in the Student.
 */
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: student._id, role: "STUDENT" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res
      .header("Authorization", token)
      .status(200)
      .json({
        success: true,
        message: "Login successful.",
        token,
        student: { id: student._id, email: student.email, name: student.name },
      });
  } catch (error) {
    console.error("Error logging in student:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
};
