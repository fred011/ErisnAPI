import Subject from "../Models/subject.model";

import Student from "../Models/student.model";
import { find } from "../Models/examination.model";
import Schedule from "../Models/schedule.model";

export async function getAllSubjects(req, res) {
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
}
export async function createSubject(req, res) {
  try {
    const { subject_name, subject_codename } = req.body;

    if (!subject_name || !subject_codename) {
      return res.status(400).json({
        success: false,
        message: "Subject name and codename are required",
      });
    }

    const newSubject = new Subject({
      subject_name: subject_name,
      subject_codename: subject_codename,
    });

    await newSubject.save();
    res
      .status(200)
      .json({ success: true, message: "Subject Created Successfully" });
  } catch (error) {
    console.log("Create Subject Error => ", error);
    res
      .status(500)
      .json({ success: false, message: "Server error in Creating Subject" });
  }
}
export async function updateSubjectWithId(req, res) {
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
}
export async function deleteSubjectWithId(req, res) {
  try {
    let id = req.params.id;

    const SubjectExamCount = (await find({ subject: id })).length;
    const SubjectScheduleCount = (await Schedule.find({ subject: id })).length;

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
}
