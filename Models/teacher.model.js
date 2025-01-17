import { Schema, model } from "mongoose";

const teacherSchema = new Schema({
  // school: { type: mongoose.Schema.ObjectId, ref: "Erisn Africa" },
  email: { type: String, required: true },
  name: { type: String, required: true },
  qualification: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  phone_number: { type: String, required: true },
  password: { type: String, required: true },

  createAt: { type: Date, default: new Date() },
});

export default model("Teacher", teacherSchema);
