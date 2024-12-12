const express = require("express");
const { createAdmin, loginAdmin, adminShut, createCountry, createState, createCity } = require("../controller/adminController");

const router = express.Router();

router.route("/auth/login").post(loginAdmin);
router.route("/auth/register").post(createAdmin)
router.route("/create/country").post(createCountry)
router.route("/create/state").post(createState)
router.route("/create/city").post(createCity)
router.route("/shut").get(adminShut)


module.exports = router;
