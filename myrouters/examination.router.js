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

router.post("/create", authMiddleware(["TEACHER", "ADMIN"]), newExamination); // Only teachers & admins
router.get("/all", getAllExaminations); // Protected
router.get("/class/:id", getExaminationsByClass); // Protected
router.patch(
  "/update/:id",
  authMiddleware(["TEACHER", "ADMIN"]),
  updateExaminationWithId
);
router.delete(
  "/delete/:id",
  authMiddleware(["ADMIN"]),
  deleteExaminationWithId
); // Only admins can delete

module.exports = router;
