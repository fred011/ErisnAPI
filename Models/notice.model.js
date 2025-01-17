import { Schema, model } from "mongoose";

const noticeSchema = new Schema({
  // school: { type: mongoose.Schema.ObjectId, ref: "Erisn Africa" },
  title: { type: String, required: true },
  message: { type: String, required: true },
  audience: { type: String, enum: ["student", "teacher"], required: true },

  createdAt: { type: Date, default: new Date() },
});

export default model("Notice", noticeSchema);
