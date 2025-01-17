require("dotenv").config();
import express, { json } from "express";
import cors from "cors";
import { connect } from "mongoose";
import cookieParser from "cookie-parser"; // Add cookie parser for better cookie handling

// Import Routes
import adminRouter from "./myrouters/admin.router";
import teacherRouter from "./myrouters/teacher.router";
import studentRouter from "./myrouters/student.router";
import classRouter from "./myrouters/class.router";
import subjectRouter from "./myrouters/subject.router";
import scheduleRouter from "./myrouters/schedule.router";

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

app.use(json());
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
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://erisn-sec-chance-program.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "API is up and running!" });
});

// Connect to MongoDB
connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Use routes
app.use("/api/admin", adminRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/student", studentRouter);
app.use("/api/class", classRouter);
app.use("/api/subject", subjectRouter);
app.use("/api/schedule", scheduleRouter);

// Start server
app.listen(PORT, () => {
  console.log(`API is running live on port ${PORT}`);
});
