const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
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
