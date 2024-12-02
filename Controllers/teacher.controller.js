const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../Models/teacher.model");

/**
 * Registers a Teacher.
 */
const registerTeacher = async (req, res) => {
  try {
    const { email, name, qualification, age, gender, teacher_image, password } =
      req.body;

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newTeacher = new Teacher({
      email,
      name,
      //   qualification,
      //   age,
      //   gender,
      //   teacher_image,
      password: hashedPassword,
    });

    const savedTeacher = await newTeacher.save();
    res.status(201).json({
      success: true,
      message: "Teacher registered successfully.",
      data: savedTeacher,
    });
  } catch (error) {
    console.error("Error registering teacher:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to register teacher." });
  }
};

/**
 * Logs in the Teacher.
 */
const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found." });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: teacher._id, role: "TEACHER" },
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
        teacher: { id: teacher._id, email: teacher.email, name: teacher.name },
      });
  } catch (error) {
    console.error("Error logging in teacher:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = {
  registerTeacher,
  loginTeacher,
};
