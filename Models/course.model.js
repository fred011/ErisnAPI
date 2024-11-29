const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  // school: { type: mongoose.Schema.ObjectId, ref: "Erisn Africa" },
  course_name: { type: Number, required: true },
  course_code: { type: Number, required: true },

  createdAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Course", courseSchema);
