const Schedule = require("../Models/subject.model");
const Exam = require("../Models/examination.model");
const Student = require("../Models/student.model");
const Subject = require("../Models/subject.model");
const Teacher = require("../Models/teacher.model");

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
      const {
        teacher,
        subject,
        class: selectedClass,
        startTime,
        endTime,
      } = req.body;

      // Validate inputs
      if (!teacher || !subject || !selectedClass || !startTime || !endTime) {
        return res.status(400).json({
          success: false,
          message: "All fields are required to create a schedule.",
        });
      }

      // Validate the subject existence
      const subjectExists = await Subject.findById(subject);
      if (!subjectExists) {
        return res.status(404).json({
          success: false,
          message: "Subject not found.",
        });
      }

      // Create a new schedule entry
      const newSchedule = new Schedule({
        teacher,
        subject,
        class: selectedClass,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      });

      await newSchedule.save();

      return res.status(200).json({
        success: true,
        message: "Schedule created successfully!",
        data: newSchedule,
      });
    } catch (error) {
      console.error("Create Schedule Error => ", error.message, error.stack);
      return res.status(500).json({
        success: false,
        message: "An error occurred while creating the schedule.",
      });
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
