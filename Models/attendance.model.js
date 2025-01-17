import { Schema, model } from "mongoose";

const attendanceSchema = new Schema({
  // school: { type: mongoose.Schema.ObjectId, ref: "Erisn Africa" },
  student: { type: Schema.ObjectId, ref: "Student" },
  class: { type: Schema.ObjectId, ref: "Class" },
  date: { type: Date, required: true },
  status: { type: String, enum: ["Present", "Absent"], default: "Absent" },

  createdAt: { type: Date, default: new Date() },
});

export default model("Attendance", attendanceSchema);
