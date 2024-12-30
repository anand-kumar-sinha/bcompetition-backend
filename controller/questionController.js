const { response } = require("express");
const Question = require("../models/Question");
const Subject = require("../models/Subject");
const Test = require("../models/Test");

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
      test_id,
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
      !questionLanguage ||
      !test_id
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const exitTest = await Test.findById(test_id).populate("subject");
    if (!exitTest) {
      return res.status(400).json({
        success: false,
        message: "Test not found",
      });
    }

    let exitsubject;
    for (let item of exitTest.subject) {
      if (item.subject === subject) {
        exitsubject = item;
        break;
      }
    }

    if (!exitsubject) {
      return res.status(400).json({
        success: false,
        message: "Subject not found",
      });
    }

    const newQuestion = await Question.create({
      question,
      questionType,
      subject: exitsubject._id,
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

const updateQuestion = async (req, res) => {
  try {
    const { id, question, options, correctOption } = req.body;

    if (!id || !question || !options || !correctOption) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const questionDocument = await Question.findByIdAndUpdate(
      id,
      { question, options, correctOption },
      { new: true }
    );

    if (!questionDocument) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question: questionDocument,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};



module.exports = {
  createQuestion,
  updateQuestion,
};
