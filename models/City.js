const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  countryId: {
    type: mongoose.Types.ObjectId,
    ref: "Country",
    required: true,
  },
  stateId: {
    type: mongoose.Types.ObjectId,
    ref: "State",
    required: true,
  },
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

module.exports = mongoose.model("City", citySchema);
