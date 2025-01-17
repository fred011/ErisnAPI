import { Schema, model } from "mongoose";

const subjectSchema = new Schema({
  subject_name: { type: String, required: true },
  subject_codename: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model("Subject", subjectSchema);
