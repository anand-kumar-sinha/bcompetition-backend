const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  school_name: {
    type: String,
  },
  name: {
    type: String,
    lowercase: true,
  },
  email: {
    type: String,
    unique: true,
  },
  date_of_birth: {
    type: String,
  },
  gender: {
    type: String,
  },
  mobile_number: {
    type: String,
  },
  country: {
    type: mongoose.Types.ObjectId,
    ref: "Country",
  },
  state: {
    type: mongoose.Types.ObjectId,
    ref: "State",
  },
  city: {
    type: mongoose.Types.ObjectId,
    ref: "City",
  },
  language_id: {
    type: String,
  },
  wallet_amount: {
    type: String,
  },
  reward_earn: {
    type: String,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    select: false,
  },
  fcm_id: {
    type: String,
  },
  device_id: {
    type: String,
  },
  refer_code: {
    type: String,
  },
  referral_code: {
    type: String,
  },
  auth_token: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isRegister: {
    type: Boolean,
    default: false,
  },
  profile_pic: {
    type: String,
    default:
      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1732461238~exp=1732464838~hmac=c5526687db2dbb14683397ad1940f6d9c05e7b7b442683e0d778d5645e7c9e72&w=740",
  },
  enrolledTest: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Test",
    }
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

// Geospatial index for location field
userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
