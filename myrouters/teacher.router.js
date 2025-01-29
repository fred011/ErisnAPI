const express = require("express");
const router = express.Router();
const authMiddleware = require("../Auth/auth");
const {
  getTeachersWithQuery,
  getTeacherOwnData,
  updateTeacherData,
  deleteTeacherWithId,
  getTeacherWithId,
} = require("../Controllers/teacher.controller");

// Routes
router.get("/fetch-with-query", getTeachersWithQuery);
router.patch("/update/:id", updateTeacherData);
router.get("/fetch-single", authMiddleware(), getTeacherOwnData);
router.get("/fetch/:id", getTeacherWithId);
router.delete("/delete/:id", deleteTeacherWithId);

module.exports = router;
