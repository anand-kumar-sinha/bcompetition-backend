const express = require("express");
const {
  auth,
  verifyOtp,
  userRegister,
  userProfile,
  fetchCountry,
  fetchState,
  fetchCity
} = require("../controller/userController");
const { protect } = require("../middleware/auth");
const { fetchCategoryAll } = require("../controller/categoryController");
const { fetchTestByCategory, fetchTestById } = require("../controller/testController");
const { enrollStudentInTest } = require("../controller/studentController");

const router = express.Router();

//authentication
router.route("/auth/login").post(auth);
router.route("/auth/verification-otp").post(verifyOtp);
router.route("/auth/register").post(userRegister);
router.route("/user/profile").get(protect, userProfile);

// Fetch country and state data
router.route("/fetch/country").get(fetchCountry)
router.route("/fetch/state/:id").get(fetchState)
router.route("/fetch/city/:id").get(fetchCity)

//fetch category data
router.route("/fetch/category").get(fetchCategoryAll);

//fetch test
router.route("/fetch/test/category/:id").get(fetchTestByCategory);
router.route("/fetch/test/:id").get(fetchTestById);
router.route("/student/enroll").post(enrollStudentInTest)

module.exports = router;
