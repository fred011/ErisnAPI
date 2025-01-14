const express = require("express");
const authMiddleware = require("../Auth/auth");

const {
  createSubject,
  getAllSubjects,
  updateSubjectWithId,
  deleteSubjectWithId,
} = require("../Controllers/subject.controller");

const router = express.Router();

router.post("/create", authMiddleware(["ADMIN"]), createSubject);
router.get("/all", authMiddleware(["ADMIN"]), getAllSubjects);
router.patch("/update/:id", authMiddleware(["ADMIN"]), updateSubjectWithId);
router.delete("/delete/:id", authMiddleware(["ADMIN"]), deleteSubjectWithId);

module.exports = router;
