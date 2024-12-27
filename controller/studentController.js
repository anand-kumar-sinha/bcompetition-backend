const User = require("../models/User");

const fetchStudents = async (req, res) => {
  try {
    let { page } = req.query;
    page = parseInt(page, 10);
    const limit = 5;

    if (!page || page < 1) {
      page = 1;
    }
    const total = await User.countDocuments();

    const skip = (page - 1) * limit;

    const students = await User.find().skip(skip).limit(limit);

    if (!students || students.length === 0) {
      res.status(404).json({
        success: false,
        message: "No students found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "students fetched successfully",
      students: students,
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

module.exports = {
  fetchStudents,
};
