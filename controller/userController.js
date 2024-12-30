const generateOtp = require("../middleware/generateOtp");
const User = require("../models/User");
const { sendOtpMobileNumber, sendOtpMail } = require("../middleware/sendOtp");
const generateToken = require("../middleware/generateToken");
const Country = require("../models/Country");
const State = require("../models/State");
const City = require("../models/City");

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

    // await sendOtpMobileNumber({ mobile_number, otp });

    if (user) {
      user.otp = otp;
      user.fcm_id = fcm_id;
      user.device_id = device_id;
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

    const user = await User.findOne({ mobile_number }).select("otp auth_token");
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
    const token = generateToken(user._id);
    user.auth_token = token;
    user.isVerified = true;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Otp verified successfully",
      auth_token: user.auth_token,
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
    user.referral_code = user._id.toString();
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
      error: error?.errorResponse?.errmsg || error,
    });
  }
};

const userProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Something went wrong please login again",
      });
      return;
    }

    res.status(200).json({
      success: true,
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

const fetchCountry = async (req, res) => {
  try {
    const country = await Country.find({ status: true });

    if (!country) {
      res.status(404).json({
        success: false,
        message: "Country not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      country: country,
    });
    return;
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
    });
  }
};

const fetchState = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(401).json({
        success: false,
        message: "Please provide country id",
      });
      return;
    }

    const state = await State.find({ countryId: id, status: true });
    if (!state) {
      res.status(404).json({
        success: false,
        message: "No state found for this country",
      });
      return;
    }

    res.status(200).json({
      success: true,
      state: state,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

const fetchCity = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(401).json({
        success: false,
        message: "Please provide state id",
      });
      return;
    }

    const city = await City.find({ stateId: id, status: true });
    if (!city) {
      res.status(404).json({
        success: false,
        message: "No city found for this state",
      });
      return;
    }

    res.status(200).json({
      success: true,
      city: city,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

module.exports = {
  auth,
  verifyOtp,
  userRegister,
  userProfile,
  fetchCountry,
  fetchState,
  fetchCity,
};
