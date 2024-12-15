const express = require("express");
const {
  createAdmin,
  loginAdmin,
  adminShut,
  createCountry,
  createState,
  createCity,
  fetchCountry,
  fetchState,
  fetchCity,
  deleteCountry,
} = require("../controller/adminController");

const router = express.Router();

// auth admin
router.route("/auth/login").post(loginAdmin);
router.route("/auth/register").post(createAdmin);

// create locality
router.route("/create/country").post(createCountry);
router.route("/create/state").post(createState);
router.route("/create/city").post(createCity);
router.route("/shut").get(adminShut);

// fetch locality
router.route("/fetch/country").get(fetchCountry);
router.route("/fetch/state").get(fetchState);
router.route("/fetch/city/:stateId").get(fetchCity);

//edit and delete locality
router.route("/edit/country/:countryId").get(deleteCountry);

module.exports = router;
