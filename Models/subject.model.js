const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subject_name: { type: String, required: true },
  subject_codename: { type: String, required: true },

  createAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Subject", subjectSchema);
