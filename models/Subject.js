const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  question: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Question",
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

module.exports = mongoose.model("Subject", subjectSchema);
