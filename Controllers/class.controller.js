const Class = require("../Models/class.model");

const Student = require("../Models/student.model");
const Exam = require("../Models/examination.model");
const Schedule = require("../Models/schedule.model");

module.exports = {
  getAllClasses: async (req, res) => {
    try {
      const allClasses = await Class.find();
      res.status(200).json({
        success: true,
        message: "Successfully fetched all classes ",
        data: allClasses,
      });
    } catch (error) {
      console.log("Get all classes Error => ", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in fetching Classes" });
    }
  },
  createClass: async (req, res) => {
    try {
      const newClass = new Class({
        class_text: req.body.class_text,
        class_num: req.body.class_num,
      });
      await newClass.save();
      res
        .status(200)
        .json({ success: true, message: "Class Created Successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Server error in Creating Class" });
    }
  },
  updateClassWithId: async (req, res) => {
    try {
      let id = req.params.id;
      await Class.findByIdAndUpdate({ _id: id }, { $set: { ...req.body } });
      const classAfterUpdate = await Class.findOne({ _id: id });
      res.status(200).json({
        success: true,
        message: "Class Updated Successfully",
        data: classAfterUpdate,
      });
    } catch (error) {
      console.log("Update class Error => ", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in Updating Class" });
    }
  },
  deleteClassWithId: async (req, res) => {
    try {
      let id = req.params.id;
      const classStudentCount = (await Student.find({ student_class: id }))
        .length;
      const classExamCount = (await Exam.find({ class: id })).length;
      const classScheduleCount = (await Schedule.find({ class: id })).length;
      if (
        classStudentCount === 0 ||
        classExamCount === 0 ||
        classScheduleCount === 0
      ) {
        await Class.findByIdAndDelete({ _id: id });
        res
          .status(200)
          .json({ success: true, message: "Class Deleted Successfully" });
      } else {
        res.status(500).json({
          success: false,
          message: "Class cannot be deleted as it is already in use",
        });
      }
    } catch (error) {
      console.log("Delete class Error => ", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in Deleting Class" });
    }
  },
};
