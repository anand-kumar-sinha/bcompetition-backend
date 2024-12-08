const express = require("express");
const { auth } = require("../controller/userController");

const router = express.Router();

router.route("/auth/login").post(auth);


module.exports = router;
