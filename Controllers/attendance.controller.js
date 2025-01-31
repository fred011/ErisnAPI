const Attendance = require("../Models/attendance.model");
const moment = require("moment");

module.exports = {
  markAttendance: async (req, res) => {
    try {
      const { studentId, date, status, classId } = req.body;

      const newAttendance = new Attendance({
        student: studentId,
        date,
        status,
        class: classId,
      });

      await newAttendance.save();
      res.status(201).json(newAttendance);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Error in marking Atthendance" });
    }
  },
  getAttendance: async (req, res) => {
    try {
      const { studentId } = req.params;

      const attendance = await Attendance.find({ student: studentId }).populate(
        "student"
      );
      res.status(200).json(attendance);
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error in getting Atthendance" });
    }
  },
  checkAttendance: async (req, res) => {
    const { classId } = req.params;
    try {
      const today = moment().startOf("day");
      const attendanceForToday = await Attendance.findOne({
        class: req.params.classId,
        date: {
          // 00:00 hours to 23:59 hours
          $gte: today.toDate(),
          $lt: moment(today).endOf("day").toDate(),
        },
      });

      if (attendanceForToday) {
        res
          .status(200)
          .json({ attendanceTaken: true, message: "Attendance already taken" });
      } else {
        return res.status(200).json({
          attendanceTaken: false,
          message: "No Attendance taken yet for today",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error in checking  Atthendance",
      });
    }
  },
};
