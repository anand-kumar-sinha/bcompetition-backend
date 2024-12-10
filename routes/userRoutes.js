const express = require("express");
const {
  auth,
  verifyOtp,
  userRegister,
} = require("../controller/userController");

const router = express.Router();

router.route("/auth/login").post(auth);
router.route("/auth/verification-otp").post(verifyOtp);
router.route("/auth/register").post(userRegister);

module.exports = router;
