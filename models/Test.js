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
  testTime: {
    type: String,
    required: true,
  },
  prizePool: {
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
  pointSystem: {
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
    defaultValue: "mcq",
  },
  status: {
    type: String,
  },
  totalAttemptSubject: {
    type: String,
  },
  totalAttemptQuestion: {
    type: String,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
  publish_at: {
    type: String,
  },
  publish_time: {
    type: String,
  },
  unpublish_at: {
    type: String,
  },
  unpublish_time: {
    type: String,
  },
  auto_unpublish: {
    type: Boolean,
    default: false,
  },
  winer_list_publish: {
    type: Boolean,
    default: false,
  },
  result_publish: {
    type: Boolean,
    default: false,
  },
  result_auto_publish: {
    type: Boolean,
    default: false,
  },
  remain_number_of_slot: {
    type: String,
  },
  totalQuestion: {
    type: String,
  },
  totalMarks: {
    type: String,
  },
  cash_prize: [
    {
      amount: {
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
