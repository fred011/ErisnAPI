require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Import Routes
const adminRouter = require("./myrouters/admin.router");
const teacherRouter = require("./myrouters/teacher.router");
const studentRouter = require("./myrouters/student.router");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "https://erisn-sec-chance-program.vercel.app", // The frontend application URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Middleware to set a cookie with SameSite attribute
app.use((req, res, next) => {
  res.cookie("example_cookie", "cookie_value", {
    httpOnly: true, // Protects against XSS
    secure: true, // Ensures cookie is sent over HTTPS
    sameSite: "None", // Ensures compatibility with cross-site requests
    path: "/", // Cookie available across the entire app
  });
  next();
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
