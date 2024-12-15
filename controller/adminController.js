const generateOtp = require("../middleware/generateOtp");
const User = require("../models/User");
const { sendOtpMobileNumber, sendOtpMail } = require("../middleware/sendOtp");
const generateToken = require("../middleware/generateToken");
const Admin = require("../models/Admin");
const Country = require("../models/Country");
const City = require("../models/City");
const State = require("../models/State");

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

const createCountry = async (req, res) => {
  try {
    const { country, status } = req.body;

    if (!country) {
      res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
      return;
    }

    const existCountry = await Country.findOne({ country: country });
    if (existCountry) {
      res.status(400).json({
        success: false,
        message: "Country already exists",
      });
      return;
    }

    const newCountry = await Country.create({ country, status: status });

    if (!newCountry) {
      res.status(400).json({
        success: false,
        message: "Failed to create country",
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Country created successfully",
      country: newCountry,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
    });
  }
};

const createState = async (req, res) => {
  try {
    const { state, countryId, status } = req.body;
    if (!state || !countryId) {
      res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
      return;
    }

    const existState = await State.findOne({ state });
    if (existState) {
      res.status(400).json({
        success: false,
        message: "State already exists",
      });
      return;
    }

    const newState = await State.create({
      state,
      countryId: countryId,
      status: status,
    });

    if (!newState) {
      res.status(400).json({
        success: false,
        message: "Failed to create state",
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Country created successfully",
      state: newState,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
    });
  }
};

const createCity = async (req, res) => {
  try {
    const { city, stateId, countryId } = req.body;

    if (!city || !stateId || !countryId) {
      res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
      return;
    }

    const existCity = await City.findOne({ city });
    if (existCity) {
      res.status(400).json({
        success: false,
        message: "City already exists",
      });
      return;
    }

    const newCity = await City.create({
      city,
      stateId: stateId,
      countryId: countryId,
      status: true,
    });

    if (!newCity) {
      res.status(400).json({
        success: false,
        message: "Failed to create city",
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "City created successfully",
      city: newCity,
    });
  } catch (error) {}
};

const fetchCountry = async (req, res) => {
  try {
    let { page } = req.query;
    page = parseInt(page, 10);
    const limit = 5;

    if (!page || page < 1) {
      page = 1;
    }
    const total = await Country.countDocuments();

    const skip = (page - 1) * limit;

    const countries = await Country.find().skip(skip).limit(limit);

    if (!countries || countries.length === 0) {
      res.status(404).json({
        success: false,
        message: "No countries found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Countries fetched successfully",
      countries: countries,
      total: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

const fetchState = async (req, res) => {
  try {
    let { page } = req.query;
    page = parseInt(page, 10);
    const limit = 5;

    if (!page || page < 1) {
      page = 1;
    }
    const total = await State.countDocuments();

    const skip = (page - 1) * limit;

    const states = await State.find().skip(skip).limit(limit);

    if (!states || states.length === 0) {
      res.status(404).json({
        success: false,
        message: "No states found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "states fetched successfully",
      states: states,
      total: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

const fetchCity = async (req, res) => {
  try {
    const { stateId } = req.params;
    if (!stateId) {
      res.status(400).json({
        success: false,
        message: "Please provide stateId",
      });
      return;
    }

    const cities = await City.find({ stateId: stateId, status: true });
    if (!cities) {
      res.status(404).json({
        success: false,
        message: "No cities found for this state",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Cities fetched successfully",
      cities: cities,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
    });
  }
};

const deleteCountry = async (req, res) => {
  try {
    const { countryId } = req.params;
    if (!countryId) {
      res.status(400).json({
        success: false,
        message: "Please provide countryId",
      });
      return;
    }

    const country = await Country.findByIdAndDelete(countryId);
    if (!country) {
      res.status(404).json({
        success: false,
        message: "Country not found",
      });
      return;
    }

    const state = await State.deleteMany({ countryId: countryId });

    const city = await City.deleteMany({ countryId: countryId });

    res.status(200).json({
      success: true,
      message: "Country deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
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
  createCountry,
  createState,
  createCity,
  fetchCountry,
  fetchState,
  fetchCity,
  deleteCountry,
};
