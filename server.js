require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const adminRouter = require("./myrouters/admin.router");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// MongoDB connection
mongoose
  .connect(`mongodb://127.0.0.1:27017/erisnStudentManagementSystem2024`)
  .then(() => {
    console.log("MongoDB is connected successfully.");
  })
  .catch((e) => {
    console.error("MongoDB connection error:", e);
  });

//Routers
app.use("/api/admin", adminRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running at PORT=>", PORT);
});
