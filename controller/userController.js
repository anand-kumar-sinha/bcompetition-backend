const generateOtp = require("../middleware/generateOtp");
const User = require("../models/User");
const { sendOtpMobileNumber, sendOtpMail } = require("../middleware/sendOtp");


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
    const message = `1234 is your OTP for your Reset Password . OTP valid for 10 minutes.	;`;
    // await sendOtpMobileNumber({ mobile_number, message });

    if (user) {
      user.otp = otp;
      user.fcm_id = fcm_id;
      user.device_id = device_id;
      user.auth_token = device_id;
      await user.save();
    
        await sendOtpMail({email: "harshrajsinha1@gmail.com", otp})

      
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

module.exports = {
  auth,
};
