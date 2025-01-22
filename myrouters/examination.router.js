const express = require("express");
const authMiddleware = require("../Auth/auth");
const {
  newExamination,
  getAllExaminations,
  getExaminationsByClass,
  updateExaminationWithId,
  deleteExaminationWithId,
} = require("../Controllers/examination.controller");

const router = express.Router();

router.post("/create", newExamination);
router.get("/all", getAllExaminations);
router.get(
  "/class/:id",
  authMiddleware(["TEACHER", "STUDENT", "ADMIN"]),
  getExaminationsByClass
);
router.post("/update/:id", updateExaminationWithId);
router.delete("/delete/:id", deleteExaminationWithId);

module.exports = router;
