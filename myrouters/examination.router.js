const express = require("express");
const {
  createExamination,
  updateExamination,
  deleteExamination,
  getExaminationsByClass,
} = require("../controllers/examinationController");

const router = express.Router();

router.post("/create", createExamination);
router.put("/update/:id", updateExamination);
router.delete("/delete/:id", deleteExamination);
router.get("/class/:classId", getExaminationsByClass);

module.exports = router;
