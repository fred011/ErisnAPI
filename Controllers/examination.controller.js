const Examination = require("../models/examinationModel");

exports.createExamination = async (req, res) => {
  try {
    const { date, examType, subjectId, classId } = req.body;

    const examination = new Examination({
      examDate: date,
      examType,
      subject: subjectId,
      class: classId,
    });

    await examination.save();
    res
      .status(201)
      .json({ message: "Examination created successfully", examination });
  } catch (error) {
    console.error("Error creating examination:", error);
    res.status(500).json({ message: "Failed to create examination" });
  }
};

exports.updateExamination = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, examType, subjectId } = req.body;

    const updatedExamination = await Examination.findByIdAndUpdate(
      id,
      { examDate: date, examType, subject: subjectId },
      { new: true }
    );

    if (!updatedExamination) {
      return res.status(404).json({ message: "Examination not found" });
    }

    res
      .status(200)
      .json({
        message: "Examination updated successfully",
        updatedExamination,
      });
  } catch (error) {
    console.error("Error updating examination:", error);
    res.status(500).json({ message: "Failed to update examination" });
  }
};

exports.deleteExamination = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExamination = await Examination.findByIdAndDelete(id);

    if (!deletedExamination) {
      return res.status(404).json({ message: "Examination not found" });
    }

    res.status(200).json({ message: "Examination deleted successfully" });
  } catch (error) {
    console.error("Error deleting examination:", error);
    res.status(500).json({ message: "Failed to delete examination" });
  }
};

exports.getExaminationsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const examinations = await Examination.find({ class: classId })
      .populate("subject", "subject_name")
      .populate("class", "class_text");

    res.status(200).json({ examinations });
  } catch (error) {
    console.error("Error fetching examinations:", error);
    res.status(500).json({ message: "Failed to fetch examinations" });
  }
};
