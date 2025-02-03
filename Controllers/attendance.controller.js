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
    console.log("Called attendance");
    try {
      const { studentId } = req.params;

      // Fetch attendance records, ensuring we only get necessary fields and populate student data (including name)
      const attendance = await Attendance.find({ student: studentId })
        .select("date status") // Select only necessary fields from attendance
        .populate("student", "name"); // Populate only the 'name' field of the student

      // Check if attendance data is available
      if (!attendance || attendance.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No attendance data found for this student.",
        });
      }

      // Include the student's name in the response for each attendance record
      const responseData = attendance.map((record) => ({
        date: record.date,
        status: record.status,
        studentName: record.student ? record.student.name : "Unknown", // Fallback if student name is not found
      }));

      res.status(200).json(responseData);
    } catch (error) {
      console.error("Error in getting attendance:", error);
      res.status(500).json({
        success: false,
        message: "Error in getting attendance data.",
      });
    }
  },

  checkAttendance: async (req, res) => {
    // const { classId } = req.params;
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
