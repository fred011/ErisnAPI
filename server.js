require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require("./myrouters/auth.router");

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// CORS Configuration
const corsOptions = {
  origin: "https://erisn-sec-chance-program.vercel.app", // Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allow cookies and other credentials
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "API is up and running!" });
});

// Example Middleware to Set a Secure Cookie
app.use((req, res, next) => {
  const isSecure = process.env.NODE_ENV === "production";
  res.cookie("example_cookie", "cookie_value", {
    httpOnly: true,
    secure: isSecure, // Secure in production
    sameSite: isSecure ? "None" : "Lax", // Cross-origin cookies in production
    path: "/",
  });
  next();
});

// Verify Token Route
app.post("/api/verify-token", (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({ success: true, valid: true, user: decoded });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, valid: false, message: "Invalid token." });
  }
});

// Routers
app.use("/api/auth", authRoutes);
app.use("/api/admin", require("./myrouters/admin.router"));
app.use("/api/teacher", require("./myrouters/teacher.router"));
app.use("/api/student", require("./myrouters/student.router"));
app.use("/api/class", require("./myrouters/class.router"));
app.use("/api/subject", require("./myrouters/subject.router"));
app.use("/api/schedule", require("./myrouters/schedule.router"));
app.use("/api/attendance", require("./myrouters/attendance.router"));
app.use("/api/examination", require("./myrouters/examination.router"));
app.use("/api/notice", require("./myrouters/notice.router"));

// Start the Server
app.listen(PORT, () => {
  console.log(`API is running live on port ${PORT}`);
});
