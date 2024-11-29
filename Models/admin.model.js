const mongoose = require("mongoose");

// Admin Schema for storing admin details
const adminSchema = new mongoose.Schema({
  admin_name: { type: String, required: true }, // Name of the admin
  email: { type: String, required: true }, // Email address for login
  password: { type: String, required: true }, // Hashed password
  createdAt: { type: Date, default: Date.now }, // Timestamp for admin creation
});

module.exports = mongoose.model("Admin", adminSchema);
