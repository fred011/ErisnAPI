const Teacher = require("../Models/teacher.model");
const bcrypt = require("bcryptjs");

///////
const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body; // Extract login credentials from the request
    const teacher = await Teacher.findOne(); // Fetch the only admin record

    // Check if the provided email matches the registered admin
    if (!teacher || teacher.email !== email) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or teacher not found.",
      });
    }

    // Verify the provided password against the hashed password
    const isAuth = await bcrypt.compare(password, teacher.password); // Using async bcrypt.compare
    if (!isAuth) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    // Generate a JWT token with a validity of 1 hour
    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign({ id: teacher._id, role: "TEACHER" }, jwtSecret, {
      expiresIn: "1h",
    });

    // Respond with the token and admin details
    res.header("Authorization", token);
    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      admin: { name: teacher.name, email: teacher.email },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
///////
// Fetch teachers with optional search filter
const getTeachersWithQuery = async (req, res) => {
  try {
    const filterQuery = req.query.search
      ? { name: { $regex: req.query.search, $options: "i" } }
      : {};

    const teachers = await Teacher.find(filterQuery);

    res.status(200).json({
      success: true,
      message: "Successfully fetched all teachers.",
      teachers,
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Fetch the logged-in teacher's data
const getTeacherOwnData = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select("-password");
    if (!teacher) {
      return res.status(404).json({ error: "Teacher data not found." });
    }
    res.status(200).json({ success: true, teacher });
  } catch (error) {
    console.error("Error fetching teacher data:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Update teacher data
const updateTeacherData = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Teacher not found." });

    const updates = req.body;

    // Hash password if it's being updated
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    Object.assign(teacher, updates);
    await teacher.save();

    res.status(200).json({
      success: true,
      message: "Teacher data updated successfully.",
      teacher,
    });
  } catch (error) {
    console.error("Error updating teacher data:", error);
    res.status(500).json({ error: "Failed to update teacher data." });
  }
};

// Delete teacher by ID
const deleteTeacherWithId = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!deletedTeacher)
      return res.status(404).json({ error: "Teacher not found." });

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully.",
      teacher: deletedTeacher,
    });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({ error: "Failed to delete teacher." });
  }
};

// Fetch teacher by ID
const getTeacherWithId = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select("-password");
    if (!teacher) return res.status(404).json({ error: "Teacher not found." });

    res.status(200).json({
      success: true,
      message: "Teacher fetched successfully.",
      teacher,
    });
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({ error: "Failed to fetch teacher." });
  }
};

module.exports = {
  loginTeacher,
  getTeachersWithQuery,
  getTeacherOwnData,
  updateTeacherData,
  deleteTeacherWithId,
  getTeacherWithId,
};
