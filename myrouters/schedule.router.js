const express = require("express");
const {
  createSchedule,
  getScheduleWithClass,
  updateScheduleWithId,
  deleteScheduleWithId,
} = require("../Controllers/schedule.controller");
const router = express.Router();

router.post("/schedule/create", createSchedule);
router.get("/schedule/class/:classId", getScheduleWithClass);
router.put("/schedule/:id", updateScheduleWithId);
router.delete("/schedule/:id", deleteScheduleWithId);

module.exports = router;
