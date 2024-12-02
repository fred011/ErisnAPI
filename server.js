require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

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
