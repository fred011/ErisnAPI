const express = require("express");

const {
  createClass,
  getAllClasses,
  updateClassWithId,
  deleteClassWithId,
  getSingleClass,
} = require("../Controllers/class.controller");

const router = express.Router();

router.post("/create", createClass);
router.get("/all", getAllClasses);
router.get("/single/:id", getSingleClass);
router.patch("/update/:id", updateClassWithId);
router.delete("/delete/:id", deleteClassWithId);

module.exports = router;
