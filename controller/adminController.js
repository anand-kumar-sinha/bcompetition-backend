
const generateToken = require("../middleware/generateToken");
const Admin = require("../models/Admin");
const Category = require("../models/Category");
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

const adminDashboard = async (req, res) =>{
  try {
    const categories = await Category.countDocuments();
    const students = await User.countDocuments();
    const test = await Test.countDocuments({isDeleted: false});

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
}

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
  adminDashboard
};
