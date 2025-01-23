const Examination = require("../Models/examination.model");

module.exports = {
  newExamination: async (req, res) => {
    try {
      const { date, subjectId, examType, classId } = req.body;
      const newExamination = new Examination({
        examDate: date,
        subject: subjectId,
        examType: examType,
        class: classId,
      });
      const savedData = await newExamination.save();
      res.status(200).json({
        success: true,
        message: "New examination created successfully.",
        data: savedData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating new examination.",
        error: error.message,
      });
    }
  },
  getAllExaminations: async (req, res) => {
    try {
      const examinations = await Examination.find()
        .populate("subject", "subject_name")
        .populate("class", "class_text");
      res.status(200).json({
        success: true,
        examinations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching all examinations.",
        error: error.message,
      });
    }
  },
  getExaminationsByClass: async (req, res) => {
    try {
      const classId = req.params.id;
      const examinations = await Examination.find({ class: classId })
        .populate("subject", "subject_name")
        .populate("class", "class_text");
      res.status(200).json({
        success: true,
        examinations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching examinations by class.",
        error: error.message,
      });
    }
  },
  updateExaminationWithId: async (req, res) => {
    const { date, subjectId, examType } = req.body;
    try {
      const examinationId = req.params.id;

      const updatedExam = await Examination.findByIdAndUpdate(
        examinationId,
        {
          $set: {
            examDate: date,
            subject: subjectId,
            examType: examType,
          },
        },
        { new: true }
      );
      if (!updatedExam) {
        return res.status(404).json({
          success: false,
          message: "Examination not found.",
        });
      }
      res.status(200).json({
        success: true,
        message: "Examination updated successfully.",
        data: updatedExam,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating examination.",
        error: error.message,
      });
    }
  },
  deleteExaminationWithId: async (req, res) => {
    try {
      const examinationId = req.params.id;
      const deletedExam = await Examination.findByIdAndDelete(examinationId);
      if (!deletedExam) {
        return res.status(404).json({
          success: false,
          message: "Examination not found.",
        });
      }
      res.status(200).json({
        success: true,
        message: "Examination deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting examination.",
        error: error.message,
      });
    }
  },
};
