const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.ObjectId,
    ref: "Teacher",
    required: true,
  },
  subject: {
    type: mongoose.Schema.ObjectId,
    ref: "Subject",
    required: true,
  },
  class: { type: mongoose.Schema.ObjectId, ref: "Class", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },

  createdAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
