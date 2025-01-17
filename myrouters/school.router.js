import { Router } from "express";
import authMiddleware from "../Auth/auth";
import {
  registerSchool,
  getAllSchools,
  loginSchool,
  updateSchool,
  getSchoolOwnData,
} from "../Controllers/school.controller";

const router = Router();

router.post("/register", registerSchool);
router.get("/all", getAllSchools);
router.get("/login", loginSchool);
router.patch("/update", authMiddleware(["SCHOOL"]), updateSchool);
router.get("/fetch-single", authMiddleware(["SCHOOL"]), getSchoolOwnData);

export default router;
