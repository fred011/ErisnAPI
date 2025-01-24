const Teacher = require("../Models/teacher.model");
const bcrypt = require("bcryptjs");

const getTeachersWithQuery = async (req, res) => {
  try {
    const filterQuery = {};
    if (req.query.search) {
      filterQuery.name = { $regex: req.query.search, $options: "i" };
    }
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

const updateTeacherData = async (req, res) => {
  try {
    const id = req.params.id;
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found." });
    }

    const updates = req.body;
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    Object.assign(teacher, updates);
    const updatedTeacher = await teacher.save();

    res.status(200).json({
      success: true,
      message: "Teacher data updated successfully.",
      teacher: updatedTeacher,
    });
  } catch (error) {
    console.error("Error updating teacher data:", error);
    res.status(500).json({ error: "Failed to update teacher data." });
  }
};

const deleteTeacherWithId = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTeacher = await Teacher.findByIdAndDelete(id);

    if (!deletedTeacher) {
      return res.status(404).json({ error: "Teacher not found." });
    }
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

const getTeacherWithId = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id).select("-password");
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found." });
    }
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
  getTeachersWithQuery,
  getTeacherOwnData,
  updateTeacherData,
  deleteTeacherWithId,
  getTeacherWithId,
};
