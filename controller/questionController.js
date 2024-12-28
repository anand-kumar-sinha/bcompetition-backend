const Question = require("../models/Question");
const Subject = require("../models/Subject");

const createQuestion = async (req, res) => {
  try {
    const {
      question,
      questionType,
      subject,
      optionsType,
      optionsNumber,
      correctOption,
      options,
      correctPoint,
      wrongPoint,
      questionLanguage,
    } = req.body;

    if (
      !question ||
      !questionType ||
      !subject ||
      !optionsType ||
      !optionsNumber ||
      !correctOption ||
      !options ||
      !correctPoint ||
      !wrongPoint ||
      !questionLanguage
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exitsubject = await Subject.findById(subject);
    if (!exitsubject) {
      return res.status(400).json({
        success: false,
        message: "Subject not found",
      });
    }

    const newQuestion = new Question.create({
      question,
      questionType,
      subject,
      optionsType,
      optionsNumber,
      correctOption,
      options,
      correctPoint,
      wrongPoint,
      questionLanguage,
    });

    if (!newQuestion) {
      return res.status(400).json({
        success: false,
        message: "Question not created",
      });
    }

    exitsubject.question.push(newQuestion._id);
    await exitsubject.save();
    res.status(201).json({
      success: true,
      message: "Question created successfully",
      question: newQuestion,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

module.exports = {};
