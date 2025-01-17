import { Schema, model } from "mongoose";

const schoolSchema = new Schema({
  school_name: { type: String, required: true },
  email: { type: String, reguire: true },
  admin: { type: String, reguire: true },
  password: { type: String, required: true },

  createAt: { type: Date, default: new Date() },
});

export default model("School", schoolSchema);
