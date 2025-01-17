const Schedule = require("../Models/subject.model");
const Exam = require("../Models/examination.model");
const Student = require("../Models/student.model");
const Subject = require("../Models/subject.model");

module.exports = {
  getScheduleWithClass: async (req, res) => {
    try {
      const classId = req.params.id;
      const schedules = await Schedule.find({ class: classId });
      res.status(200).json({
        success: true,
        message: "Successfully fetched all Schedules ",
        data: schedules,
      });
    } catch (error) {
      console.log("Get Schedules with class Error => ", error);
      res.status(500).json({
        success: false,
        message: "Server error in fetching Schedule with class",
      });
    }
  },
  createSchedule: async (req, res) => {
    try {
      // Create new schedule
      const newSchedule = new Schedule({
        teacher: req.body.teacher,
        subject: req.body.subject,
        class: req.body.selectedClass,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
      });

      const subjectExists = await Subject.findById(req.body.subject);
      if (!subjectExists) {
        return res.status(400).json({
          success: false,
          message: "Subject not found",
        });
      }

      await newSchedule.save();
      res
        .status(200)
        .json({ success: true, message: "Schedule Created Successfully" });
    } catch (error) {
      console.log("Create Schedule Error => ", error.message, error.stack);
      res
        .status(500)
        .json({ success: false, message: "Server error in Creating Schedule" });
    }
  },

  updateScheduleWithId: async (req, res) => {
    try {
      let id = req.params.id;
      await Schedule.findOneAndUpdate({ _id: id }, { $set: { ...req.body } });
      const scheduleAfterUpdate = await Schedule.findOne({ _id: id });
      res.status(200).json({
        success: true,
        message: "Schedule Updated Successfully",
        data: scheduleAfterUpdate,
      });
    } catch (error) {
      console.log("Update Schedule Error => ", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in Updating Schedule" });
    }
  },
  deleteScheduleWithId: async (req, res) => {
    try {
      let id = req.params.id;

      await Schedule.findByIdAndDelete({ _id: id });
      res
        .status(200)
        .json({ success: true, message: "Schedule Deleted Successfully" });
    } catch (error) {
      console.log("Delete Schedule Error => ", error);
      res
        .status(500)
        .json({ success: false, message: "Server error in Deleting Schedule" });
    }
  },
};
