const nodemailer = require("nodemailer");
const axios = require("axios");

const dotenv = require("dotenv");
dotenv.config();

const sendOtpMobileNumber = async ({ mobile_number, otp }) => {
  try {
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        variables_values: otp,
        route: "otp",
        numbers: mobile_number,
      },
      {
        headers: {
          authorization: process.env.OTP_SENDER_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    throw error;
  }
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendOtpMail = async ({ email, otp }) => {
  console.log(process.env.SMTP_EMAIL, process.env.SMTP_PASSWORD);
  await transporter.sendMail({
    from: '"B competition" bcompetitionsms@gmail.com',
    to: email,
    subject: "Your Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #ffa200; text-align: center;">🔒 Verification Code</h2>
        <p>Hi <strong>user</strong>,</p>
        <p>Your One-Time Password (OTP) for verification is:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 1.5em; font-weight: bold; color: #ffa200; padding: 10px 20px; border: 1px dashed #ffa200; border-radius: 5px; background-color: #ffa20029;">
            ${otp}
          </span>
        </div>
        <p>This code is valid for the next <strong>10 minutes</strong>. Please do not share this code with anyone for your security.</p>
        <p>If you did not request this code, please ignore this email or <a href="https://bcompetition.com/support" style="color: #ffa200; text-decoration: none;">contact our support team</a> immediately.</p>
        <p style="margin-top: 20px; font-style: italic; color: #777;">Stay secure,<br>The B competition</p>
      </div>
    `,
  });
};
module.exports = {
  sendOtpMobileNumber,
  sendOtpMail,
};
