const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  testTitle: {
    type: String,
    required: true,
  },
  examDetail: {
    type: String,
    required: true,
  },
  testType: {
    type: String,
    required: true,
    default: "mock test",
  },
  totalTestTime: {
    type: String,
    required: true,
  },
  totalPrizePool: {
    type: String,
    required: true,
  },
  joinAmount: {
    type: String,
    required: true,
  },
  slots: {
    type: String,
    required: true,
  },
  subject: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Subject",
    },
  ],
  optionsType: {
    type: String,
    required: true,
    defaultValue: "Single Choice",
  },
  status: {
    type: Boolean,
    default: true,
  },
  cash_prize: [
    {
      prize: {
        type: String,
        required: true,
      },
      rank: {
        type: String,
        required: true,
      },
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Test", testSchema);
