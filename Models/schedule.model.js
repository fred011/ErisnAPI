import { Schema, model } from "mongoose";

const scheduleSchema = new Schema({
  teacher: {
    type: Schema.ObjectId,
    ref: "Teacher",
    required: true,
  },
  subject: {
    type: Schema.ObjectId,
    ref: "Subject",
    required: true,
  },
  class: { type: Schema.ObjectId, ref: "Class", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },

  createdAt: { type: Date, default: new Date() },
});

export default model("Schedule", scheduleSchema);
