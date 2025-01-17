const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subject_codename: { type: String, required: true },
  subject_name: { type: String, required: true },

  createdAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Subject", subjectSchema);
