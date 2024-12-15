const express = require("express");
const {
  auth,
  verifyOtp,
  userRegister,
  userProfile,
  fetchCountry,
} = require("../controller/userController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/auth/login").post(auth);
router.route("/auth/verification-otp").post(verifyOtp);
router.route("/auth/register").post(userRegister);
router.route("/user/profile").get(protect, userProfile);
router.route("/fetch/country").get(fetchCountry)

module.exports = router;
