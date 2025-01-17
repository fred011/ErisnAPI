import { Router } from "express";

import {
  createClass,
  getAllClasses,
  updateClassWithId,
  deleteClassWithId,
} from "../Controllers/class.controller";

const router = Router();

router.post("/create", createClass);
router.get("/all", getAllClasses);
router.patch("/update/:id", updateClassWithId);
router.delete("/delete/:id", deleteClassWithId);

export default router;
