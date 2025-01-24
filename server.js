require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser"); // Add cookie parser for better cookie handling

// Import Routes
const adminRouter = require("./myrouters/admin.router");
const teacherRouter = require("./myrouters/teacher.router");
const studentRouter = require("./myrouters/student.router");
const classRouter = require("./myrouters/class.router");
const subjectRouter = require("./myrouters/subject.router");
const scheduleRouter = require("./myrouters/schedule.router");
const attendanceRouter = require("./myrouters/attendance.router");
const examinationRouter = require("./myrouters/examination.router");
const noticeRouter = require("./myrouters/notice.router");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(
  cors({
    origin: "https://erisn-sec-chance-program.vercel.app", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Methods allowed
    allowedHeaders: ["Content-Type", "Authorization"], // Headers allowed
    credentials: true, // Allow credentials
  })
);

app.use(express.json());
app.use(cookieParser()); // Parse cookies from requests

// Middleware to set a cookie with SameSite attribute
app.use((req, res, next) => {
  const isSecure = process.env.NODE_ENV === "production";
  res.cookie("example_cookie", "cookie_value", {
    httpOnly: true,
    secure: isSecure, // Secure cookie in production
    sameSite: isSecure ? "None" : "Lax", // Cross-site requests allowed in production
    path: "/",
  });
  next();
});

// Handle Preflight Requests for Complex CORS
app.options("*", (req, res) => {
  const allowedOrigin = "https://erisn-sec-chance-program.vercel.app"; // Your frontend URL
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin); // Set the specific origin
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  ); // Allowed methods
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization" // Add headers explicitly used in your requests
  );
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials (cookies, auth headers)
  res.sendStatus(200); // Respond to the preflight request
});

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "API is up and running!" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Use routes
app.use("/api/admin", adminRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/student", studentRouter);
app.use("/api/class", classRouter);
app.use("/api/subject", subjectRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/examination", examinationRouter);
app.use("/api/notice", noticeRouter);

// Start server
app.listen(PORT, () => {
  console.log(`API is running live on port ${PORT}`);
});
