const express = require("express");

const {
  createSubject,
  getAllSubjects,
  updateSubjectWithId,
  deleteSubjectWithId,
} = require("../Controllers/subject.controller");

const router = express.Router();

router.post("/create", createSubject);
router.get("/all", getAllSubjects);
router.patch("/update/:id", updateSubjectWithId);
router.delete("/delete/:id", deleteSubjectWithId);

module.exports = router;
