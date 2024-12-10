const generateOtp = require("../middleware/generateOtp");
const User = require("../models/User");
const { sendOtpMobileNumber, sendOtpMail } = require("../middleware/sendOtp");
const generateReferralCode = require("../middleware/generateOtp");

const auth = async (req, res) => {
  try {
    const { fcm_id, device_id, mobile_number } = req.body;
    if (!fcm_id || !device_id || !mobile_number) {
      res.status(401).json({
        success: false,
        message: "Please enter all required fields",
      });
      return;
    }
    const user = await User.findOne({ mobile_number });
    const otp = generateOtp();
    await sendOtpMobileNumber({ mobile_number, otp });

    if (user) {
      user.otp = otp;
      user.fcm_id = fcm_id;
      user.device_id = device_id;
      user.auth_token = device_id;
      await user.save();
      if (user.email) {
        await sendOtpMail({ email: user.email, otp });
      }

      res.status(200).json({
        success: true,
        message: "Otp send successfully",
        isRegister: user.isRegister,
      });
      return;
    }

    const newUser = await User.create({
      mobile_number,
      otp,
      fcm_id,
      device_id,
      auth_token: device_id,
    });

    if (!newUser) {
      res.status(400).json({
        success: false,
        message: "Failed to create user",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Otp send successfully",
      isRegister: newUser.isRegister,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { mobile_number, otp } = req.body;
    if (!mobile_number || !otp) {
      res.status(401).json({
        success: false,
        message: "Please enter all required fields",
      });
      return;
    }

    const user = await User.findOne({ mobile_number }).select("otp");
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Something went wrong",
      });
      return;
    }

    if (user.otp !== otp) {
      res.status(401).json({
        success: false,
        message: "Incorrect OTP",
      });
      return;
    }

    user.isVerified = true;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Otp verified successfully",
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

const userRegister = async (req, res) => {
  try {
    const {
      mobile_number,
      name,
      email,
      schoolname,
      dob,
      gender,
      address,
      pincode,
      country,
      state,
      district,
      referCode,
    } = req.body;

    if (
      !mobile_number ||
      !name ||
      !email ||
      !schoolname ||
      !dob ||
      !gender ||
      !pincode ||
      !country ||
      !state ||
      !district
    ) {
      res.status(401).json({
        success: false,
        message: "Please enter all required fields",
      });
      return;
    }


    const user = await User.findOne({ mobile_number });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "invalid request",
      });
      return;
    }
    if (!user.isVerified || user.isRegister) {
      res.status(401).json({
        success: false,
        message: "User already registered or not verified",
      });
      return;
    }

    user.name = name;
    user.email = email;
    user.school_name = schoolname;
    user.date_of_birth = dob;
    user.gender = gender;
    user.address = address;
    user.pin_code = pincode;
    user.country = country;
    user.state = state;
    user.city = district;
    user.refer_code = referCode;
    user.referral_code = generateReferralCode();
    user.isRegister = true;
    user.wallet_amount = 0;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: user,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

module.exports = {
  auth,
  verifyOtp,
  userRegister,
};
