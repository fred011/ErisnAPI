const express = require("express");

const {
  createSchedule,
  getScheduleWithClass,
  updateScheduleWithId,
  deleteScheduleWithId,
  fetchScheduleWithId,
} = require("../Controllers/schedule.controller");

const router = express.Router();

router.post("/create", createSchedule);
router.get("/fetch-with-class/:id", getScheduleWithClass);
router.get("/fetch/:id", fetchScheduleWithId);
router.post("/update/:id", updateScheduleWithId);
router.delete("/delete/:id", deleteScheduleWithId);

module.exports = router;
