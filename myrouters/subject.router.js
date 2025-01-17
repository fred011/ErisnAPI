import { Router } from "express";

import {
  createSubject,
  getAllSubjects,
  updateSubjectWithId,
  deleteSubjectWithId,
} from "../Controllers/subject.controller";

const router = Router();

router.post("/create", createSubject);
router.get("/all", getAllSubjects);
router.patch("/update/:id", updateSubjectWithId);
router.delete("/delete/:id", deleteSubjectWithId);

export default router;
