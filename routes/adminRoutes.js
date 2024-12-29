const express = require("express");
const {
  createAdmin,
  loginAdmin,
  adminShut,
  adminDashboard,
} = require("../controller/adminController");
const {
  createCountry,
  createState,
  createCity,
  fetchCountry,
  fetchState,
  fetchCity,
  deleteCountry,
} = require("../controller/localityContoller");
const {
  createCategory,
  fetchCategory,
} = require("../controller/categoryController");
const { fetchStudents } = require("../controller/studentController");
const {
  createTest,
  fetchAllTest,
  deleteTest,
  fetchDeletedTest,
  publishTest,
  fetchUnpublishedTest,
  fetchUpcomingTest,
  fetchOngingTest,
  fetchTestById,
} = require("../controller/testController");
const { createQuestion, updateQuestion } = require("../controller/questionController");

const router = express.Router();

// auth admin
router.route("/auth/login").post(loginAdmin);
router.route("/auth/register").post(createAdmin);
router.route("/admin/dashboard").get(adminDashboard);

// create locality
router.route("/create/country").post(createCountry);
router.route("/create/state").post(createState);
router.route("/create/city").post(createCity);
router.route("/shut").get(adminShut);

// fetch locality
router.route("/fetch/country").get(fetchCountry);
router.route("/fetch/state").get(fetchState);
router.route("/fetch/city").get(fetchCity);

//edit and delete locality
router.route("/edit/country/:countryId").get(deleteCountry);

//add categories
router.route("/create/category").post(createCategory);
router.route("/fetch/category").get(fetchCategory);

//students
router.route("/fetch/students").get(fetchStudents);

//test
router.route("/create/test").post(createTest);
router.route("/fetch/test/all").get(fetchAllTest);
router.route("/delete/test/:id").get(deleteTest);
router.route("/fetch/deleted/test").get(fetchDeletedTest);
router.route("/test/publish").post(publishTest);
router.route("/fetch/unpublished/test").get(fetchUnpublishedTest);
router.route("/fetch/upcoming/test").get(fetchUpcomingTest);
router.route("/fetch/ongoing/test").get(fetchOngingTest);
router.route("/fetch/test/:id").get(fetchTestById);


//question
router.route("/create/question").post(createQuestion);
router.route("/update/question").post(updateQuestion);


module.exports = router;
