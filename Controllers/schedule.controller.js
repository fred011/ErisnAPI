import Schedule from "../Models/subject.model";
import Exam from "../Models/examination.model";
import Student from "../Models/student.model";
import Subject from "../Models/subject.model";

export async function getScheduleWithClass(req, res) {
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
}
export async function createSchedule(req, res) {
  try {
    console.log("Request Body:", req.body);

    const newSchedule = new Schedule({
      teacher: req.body.teacher,
      subject: req.body.subject,
      class: req.body.selectedClass,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    });

    await newSchedule.save();
    res
      .status(200)
      .json({ success: true, message: "Schedule Created Successfully" });
  } catch (error) {
    console.error("Create Schedule Error =>", error.message);
    console.error("Full Error =>", error);
    res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
}
export async function updateScheduleWithId(req, res) {
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
}
export async function deleteScheduleWithId(req, res) {
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
}
