const Examination = require("../Models/examination.model");

module.exports = {
  newExamination: async (req, res) => {
    try {
      const { date, subjectId, examType, classId } = req.body;
      if (!date || !subjectId || !examType || !classId) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }
      const newExamination = new Examination({
        examDate: date,
        subject: subjectId,
        examType: examType,
        class: classId,
      });
      const savedData = await newExamination.save();
      res.status(200).json({
        success: true,
        message: "Success in creating new Examination",
        data: savedData,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error in creating new examination" });
    }
  },
  getAllExaminations: async (req, res) => {
    try {
      const examinations = await Examination.find();
      res.status(200).json({
        success: true,
        examinations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error in fetching all examinations",
      });
    }
  },
  getExaminationsByClass: async (req, res) => {
    try {
      const classId = req.params.id;
      const examinations = await Examination.find({ class: classId }).populate(
        "subject"
      );
      res.status(200).json({
        success: true,
        examinations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error in fetching examinations",
      });
    }
  },
  updateExaminationWithId: async (req, res) => {
    const { date, subjectId, examType } = req.body;
    try {
      const examinationId = req.params.id;

      await Examination.findByIdAndUpdate(
        { _id: examinationId },
        {
          $set: {
            examDate: date,
            subject: subjectId,
            examType: examType,
          },
        }
      );
      res.status(200).json({
        success: true,
        message: "Success in updating Examination",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error in updating examinations",
      });
    }
  },
  deleteExaminationWithId: async (req, res) => {
    try {
      const examinationId = req.params.id;
      await Examination.findOneAndDelete({ _id: examinationId });
      res.status(200).json({
        success: true,
        message: "Success in deleting Examination",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error in deleting examinations",
      });
    }
  },
};
