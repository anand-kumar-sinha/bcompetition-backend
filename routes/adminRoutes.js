const express = require("express");
const { createAdmin, loginAdmin } = require("../controller/adminController");

const router = express.Router();

router.route("/auth/login").post(loginAdmin);
router.route("/auth/register").post(createAdmin)

module.exports = router;
