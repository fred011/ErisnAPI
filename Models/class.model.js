import { Schema, model } from "mongoose";

const classSchema = new Schema({
  // school: { type: mongoose.Schema.ObjectId, ref: "Erisn Africa" },
  class_text: { type: String, requiredd: true },
  class_num: { type: String, requiredd: true },
  attendee: { type: Schema.ObjectId, ref: "Teacher" },
  createdAt: { type: Date, default: new Date() },
});

export default model("Class", classSchema);
