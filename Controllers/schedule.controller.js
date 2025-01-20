const Schedule = require("../Models/schedule.model"); // Assuming Schedule model is defined
const Class = require("../Models/class.model");
const Student = require("../Models/student.model");
const Exam = require("../Models/examination.model");

module.exports = {
  // Create a new schedule
  createSchedule: async (req, res) => {
    try {
      const { selectedClass, teacher, subject, startTime, endTime } = req.body;

      const newSchedule = new Schedule({
        classId: selectedClass,
        teacher,
        subject,
        startTime,
        endTime,
      });

      const savedSchedule = await newSchedule.save();
      res.status(201).json({
        message: "Schedule created successfully",
        data: savedSchedule,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating schedule", error });
    }
  },

  // Get schedule by class
  getScheduleWithClass: async (req, res) => {
    console.log(req.params.id);
    try {
      const classId = req.params.id;
      const schedules = await Schedule.find({ class: classId });
      res.status(200).lson({
        success: true,
        message: "Success in fetching all events.",
        data: schedules,
      });
    } catch (error) {
      console.log("Server Error in retrieving schedules", error);
      res
        .status(500)
        .json({ message: "Server Error in retrieving schedules", error });
    }
  },

  // Update a schedule by ID
  updateScheduleWithId: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedSchedule = await Schedule.findByIdAndUpdate(id, updates, {
        new: true,
      });
      if (!updatedSchedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }

      res.status(200).json({
        message: "Schedule updated successfully",
        data: updatedSchedule,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating schedule", error });
    }
  },

  // Delete a schedule by ID
  deleteScheduleWithId: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedSchedule = await Schedule.findByIdAndDelete(id);
      if (!deletedSchedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }

      res.status(200).json({ message: "Schedule deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting schedule", error });
    }
  },
};
