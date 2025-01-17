import { hash, compare, genSalt } from "bcryptjs";
import { sign } from "jsonwebtoken";
import Teacher, {
  findOne,
  find,
  findByIdAndDelete,
  findById,
} from "../Models/teacher.model";

const registerTeacher = async (req, res) => {
  try {
    const { email, name, qualification, age, phone_number, gender, password } =
      req.body;

    const existingTeacher = await findOne({ email });
    if (existingTeacher) {
      return res
        .status(409)
        .json({ success: false, message: "Email already registered." });
    }

    const hashedPassword = await hash(password, 10);
    const newTeacher = new Teacher({
      email: email,
      name: name,
      qualification: qualification,
      age: age,
      gender: gender,
      phone_number: phone_number,
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

const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await findOne({ email });
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found." });
    }

    const isMatch = await compare(password, teacher.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const token = sign(
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
const getTeachersWithQuery = async (req, res) => {
  try {
    const filterQuery = {};
    if (req.query.hasOwnProperty("search")) {
      filterQuery["name"] = { $regex: req.query.search, $options: "i" };
    }
    // if (req.query.hasOwnProperty("qualification")) {
    //   console.log("Teacher class", req.query.qualification);
    //   filterQuery["qualification"] = req.query.qualification;
    // }
    const teachers = await find(filterQuery);

    res.status(200).json({
      success: true,
      message: "Successfully fetched all teachers",
      teachers,
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error [TEACHER DATA].",
    });
  }
};
const getTeacherOwnData = async (req, res) => {
  try {
    const teacher = await findOne({}).select("-password"); // Fetch admin data excluding the password
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher data not found.",
      });
    }
    res.status(200).json({ success: true, admin });
  } catch (error) {
    console.error("Error fetching teacher  data:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
const updateTeacherData = async (req, res) => {
  try {
    const id = req.params.id;
    const teacher = await findOne({ _id: id }); // Fetch the only admin record
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });
    }

    // Destructure and update the provided fields
    const { name, email, password, qualification, age, gender, phone_number } =
      req.body;
    if (name) teacher.name = name;
    if (email) teacher.email = email;
    if (qualification) teacher.qualification = qualification;
    if (age) teacher.age = age;
    if (gender) teacher.gender = gender;
    if (phone_number) teacher.phone_number = phone_number;

    if (password) {
      const salt = await genSalt(10); // Generate a new salt
      teacher.password = await hash(password, salt); // Hash the updated password
      teacher["password"] = teacher.password;
    }

    // Save the updated teacher record
    const updatedTeacher = await teacher.save();
    res.status(200).json({
      success: true,
      message: "Teacher data updated successfully.",
      teacher: updatedTeacher,
    });
  } catch (error) {
    console.error("Error updating teacher data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update teacher data.",
    });
  }
};

const deleteTeacherWithId = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTeacher = await findByIdAndDelete(id);

    if (!deletedTeacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully.",
      teacher: deletedTeacher,
    });
  } catch (error) {
    console.error("Error deleting teacher:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete teacher.",
    });
  }
};
const getTeacherWithId = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await findById(id).select("-password"); // Exclude sensitive fields

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher fetched successfully.",
      teacher,
    });
  } catch (error) {
    console.error("Error fetching teacher:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher.",
    });
  }
};

export default {
  registerTeacher,
  loginTeacher,
  getTeachersWithQuery,
  getTeacherOwnData,
  updateTeacherData,
  deleteTeacherWithId,
  getTeacherWithId,
};
