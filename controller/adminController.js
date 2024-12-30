const generateReferralCode = require("../middleware/generateRefferalCode");
const generateToken = require("../middleware/generateToken");
const Admin = require("../models/Admin");
const Category = require("../models/Category");
const City = require("../models/City");
const Country = require("../models/Country");
const State = require("../models/State");
const Test = require("../models/Test");
const User = require("../models/User");

const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(401).json({
        success: false,
        message: "Please enter all required fields",
      });
      return;
    }

    const exitAdmin = await Admin.findOne({ email });

    if (exitAdmin) {
      res.status(400).json({
        success: false,
        message: "Admin with this email already exists",
      });
      return;
    }

    const admin = await Admin.create({ email, password });
    if (!admin) {
      res.status(400).json({
        success: false,
        message: "Failed to create admin",
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: admin,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(401).json({
        success: false,
        message: "Please enter all required fields",
      });
      return;
    }

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      res.status(404).json({
        success: false,
        message: "Admin not found",
      });
      return;
    }

    if (admin.password !== password) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const token = generateToken(admin._id);
    admin.auth_token = token;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      auth_token: admin.auth_token,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error,
    });
  }
};

const adminDashboard = async (req, res) => {
  try {
    const categories = await Category.countDocuments();
    const students = await User.countDocuments();
    const test = await Test.countDocuments({ isDeleted: false });

    res.status(200).json({
      success: true,
      categories: categories,
      students: students,
      test: test,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      mobile_number,
      name,
      email,
      schoolname,
      dob,
      gender,
      address,
      pincode,
      country,
      state,
      city,
    } = req.body;

    if (
      !mobile_number ||
      !name ||
      !email ||
      !schoolname ||
      !dob ||
      !gender ||
      !address ||
      !pincode ||
      !country ||
      !state ||
      !city 
    ) {
      res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
      return;
    }

    const userExists = await User.findOne({ mobile_number });
    if (userExists) {
      res.status(400).json({
        success: false,
        message: "User with this mobile_number already exists",
      });
      return;
    }

    const countryName = await Country.findById(country);
    const stateName = await State.findById(state);
    const cityName = await City.findById(city);

    const referral_code = generateReferralCode();

    const newUser = await User.create({
      mobile_number,
      name,
      email,
      school_name: schoolname,
      date_of_birth: dob,
      gender,
      address,
      pincode,
      country: countryName.country,
      state: stateName.state,
      city: cityName.city,
      referral_code,
      isRegister: true,
      wallet_amount: 0,
      reward_earn: 0,
      isVerified: true,
    });

    if (!newUser) {
      res.status(400).json({
        success: false,
        message: "Failed to create user",
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message || error,
    });
  }
};

const adminShut = async (req, res) => {
  process.exit(0);
};

const adminOn = async (req, res) => {
  process.on(0);
};

module.exports = {
  createAdmin,
  loginAdmin,
  adminShut,
  adminOn,
  adminDashboard,
  createUser
};
