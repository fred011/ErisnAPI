import { Schema, model } from "mongoose";

const studentSchema = new Schema({
  // Reference to the school (if needed in the future)
  // school: { type: mongoose.Schema.ObjectId, ref: "Erisn Africa" },

  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  student_class: { type: Schema.ObjectId, ref: "Class" },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  guardian: { type: String, required: true },
  guardian_phone: { type: String, required: true },
  password: { type: String, required: true },

  createAt: { type: Date, default: new Date() },
});

export default model("Student", studentSchema);
