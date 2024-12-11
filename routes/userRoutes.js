const express = require("express");
const {
  auth,
  verifyOtp,
  userRegister,
  userProfile,
} = require("../controller/userController");
const {protect} = require("../middleware/auth")

const router = express.Router();

router.route("/auth/login").post(auth);
router.route("/auth/verification-otp").post(verifyOtp);
router.route("/auth/register").post(userRegister);
router.route("/user/profile").get(protect, userProfile)

module.exports = router;
