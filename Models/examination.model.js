import { Schema, model } from "mongoose";

const examinationSchema = new Schema({
  // school: { type: mongoose.Schema.ObjectId, ref: "Erisn Africa" },
  examDate: { type: Date, required: true },
  subject: { type: Schema.ObjectId, ref: "Subject" },
  examType: { type: String, required: true },
  class: { type: Schema.ObjectId, ref: "Class" },

  createdAt: { type: Date, default: new Date() },
});

export default model("Examination", examinationSchema);
