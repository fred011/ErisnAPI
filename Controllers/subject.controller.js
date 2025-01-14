const Subject = require("../Models/subject.model");

const Student = require("../Models/student.model");
const Exam = require("../Models/examination.model");
const Schedule = require("../Models/schedule.model");

module.exports = {
  getAllSubjects: async (req, res) => {
    try {
      const allSubjects = await Subject.find();
      res.status(200).json({
        success: true,
        message: "Successfully fetched all Subjects ",
        data: allSubjects,
      });
    } catch (error) {
      console.log("Get all Subjects Error => ", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in fetching Subjects" });
    }
  },
  createSubject: async (req, res) => {
    try {
      const newSubject = new Subject({
        Subject_name: req.body.subject_name,
        subject_codename: req.body.subject_codename,
      });
      await newSubject.save();
      res
        .status(200)
        .json({ success: true, message: "Subject Created Successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Server error in Creating Subject" });
    }
  },
  updateSubjectWithId: async (req, res) => {
    try {
      let id = req.params.id;
      await Subject.findByIdAndUpdate({ _id: id }, { $set: { ...req.body } });
      const SubjectAfterUpdate = await Subject.findOne({ _id: id });
      res.status(200).json({
        success: true,
        message: "Subject Updated Successfully",
        data: SubjectAfterUpdate,
      });
    } catch (error) {
      console.log("Update Subject Error => ", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in Updating Subject" });
    }
  },
  deleteSubjectWithId: async (req, res) => {
    try {
      let id = req.params.id;

      const SubjectExamCount = (await Exam.find({ subject: id })).length;
      const SubjectScheduleCount = (await Schedule.find({ subject: id }))
        .length;

      if (SubjectExamCount === 0 && SubjectScheduleCount === 0) {
        await Subject.findByIdAndDelete({ _id: id });
        res
          .status(200)
          .json({ success: true, message: "Subject Deleted Successfully" });
      } else {
        res.status(500).json({
          success: false,
          message: "Subject cannot be deleted as it is already in use",
        });
      }
    } catch (error) {
      console.log("Delete Subject Error => ", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in Deleting Subject" });
    }
  },
};
