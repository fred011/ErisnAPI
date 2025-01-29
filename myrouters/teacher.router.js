const express = require("express");
const router = express.Router();
const authMiddleware = require("../Auth/auth");
const {
  getTeachersWithQuery,
  getTeacherOwnData,
  updateTeacherData,
  deleteTeacherWithId,
  getTeacherWithId,
  loginTeacher,
} = require("../Controllers/teacher.controller");

// Routes
router.post("/login", loginTeacher);
router.get("/fetch-with-query", getTeachersWithQuery);
router.patch("/update/:id", updateTeacherData);
router.get("/fetch-single", authMiddleware(), getTeacherOwnData);
router.get("/fetch/:id", getTeacherWithId);
router.delete("/delete/:id", deleteTeacherWithId);

module.exports = router;
