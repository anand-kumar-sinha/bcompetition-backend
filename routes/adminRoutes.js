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
} = require("../controller/CategoryController");
const { fetchStudents } = require("../controller/studentController");

const router = express.Router();

// auth admin
router.route("/auth/login").post(loginAdmin);
router.route("/auth/register").post(createAdmin);
router.route("/admin/dashboard").get(adminDashboard)

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

module.exports = router;
