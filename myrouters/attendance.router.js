const express = require("express");
const authMiddleware = require("../Auth/auth");
const {
  markAttendance,
  getAttendance,
  checkAttendance,
} = require("../Controllers/attendance.controller");

const router = express.Router();

router.post("/mark", authMiddleware(["TEACHER"]), markAttendance);
router.get("/:studentId", getAttendance);
router.get("/check/:classId", checkAttendance);

module.exports = router;
