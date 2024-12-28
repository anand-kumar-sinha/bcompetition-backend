const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    required: true,
    defaultValue: "Normal Question",
  },
  subject: {
    type: mongoose.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  optionsType: {
    type: String,
    required: true,
    defaultValue: "Single Choice",
  },
  optionsNumber: {
    type: Number,
    required: true,
    defaultValue: 4,
  },
  correctOption: {
    type: String,
    required: true,
    select: false,
  },
  options: [
    {
      option: {
        type: String,
        required: true,
      },
    },
  ],
  status: {
    type: Boolean,
    default: true,
  },
  correctPoint: {
    type: Number,
    required: true,
    default: 1,
  },
  wrongPoint: {
    type: Number,
    required: true,
    default: -0.25,
  },
  questionLanguage:{
    type: String,
    required: true,
    default: "English"
  },
  answerExplanation: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Question", questionSchema);
