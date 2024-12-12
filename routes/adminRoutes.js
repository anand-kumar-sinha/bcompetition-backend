const express = require("express");
const { createAdmin, loginAdmin, adminShut } = require("../controller/adminController");

const router = express.Router();

router.route("/auth/login").post(loginAdmin);
router.route("/auth/register").post(createAdmin)
router.route("/shut").get(adminShut)


module.exports = router;
