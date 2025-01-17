import Class, {
  find,
  findByIdAndUpdate,
  findOne,
  findByIdAndDelete,
} from "../Models/class.model";

import { find as _find } from "../Models/student.model";
import { find as __find } from "../Models/examination.model";
import Schedule from "../Models/schedule.model";

export async function getAllClasses(req, res) {
  try {
    const allClasses = await find();
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
}
export async function createClass(req, res) {
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
}
export async function updateClassWithId(req, res) {
  try {
    let id = req.params.id;
    await findByIdAndUpdate({ _id: id }, { $set: { ...req.body } });
    const classAfterUpdate = await findOne({ _id: id });
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
}
export async function deleteClassWithId(req, res) {
  try {
    let id = req.params.id;
    const classStudentCount = (await _find({ student_class: id })).length;
    const classExamCount = (await __find({ class: id })).length;
    const classScheduleCount = (await Schedule.find({ class: id })).length;
    if (
      classStudentCount === 0 ||
      classExamCount === 0 ||
      classScheduleCount === 0
    ) {
      await findByIdAndDelete({ _id: id });
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
}
