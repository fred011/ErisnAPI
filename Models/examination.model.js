const mongoose = require("mongoose");

const examinationSchema = new mongoose.Schema({
  // school: { type: mongoose.Schema.ObjectId, ref: "Erisn Africa" },
  examDate: { type: Date, required: true },
  course: { type: mongoose.Schema.ObjectId, ref: "Course" },
  examType: { type: String, required: true },
  class: { type: mongoose.Schema.ObjectId, ref: "Class" },

  createdAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Examination", examinationSchema);
