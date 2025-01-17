import { Router } from "express";

import {
  createSchedule,
  getScheduleWithClass,
  updateScheduleWithId,
  deleteScheduleWithId,
} from "../Controllers/schedule.controller";

const router = Router();

router.post("/create", createSchedule);
router.get("/fetch-with-class/:id", getScheduleWithClass);
router.patch("/update/:id", updateScheduleWithId);
router.delete("/delete/:id", deleteScheduleWithId);

export default router;
