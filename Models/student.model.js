const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  // Reference to the school (if needed in the future)
  // school: { type: mongoose.Schema.ObjectId, ref: "Erisn Africa" },

  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  // student_class: { type: String, required: true },
  // age: { type: String, required: true },
  // gender: { type: String, required: true },
  // student_image: { type: String, required: true },
  password: { type: String, required: true },

  createAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Student", studentSchema);
