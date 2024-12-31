const Test = require("../models/Test");
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

const enrollStudentInTest = async (req, res) => {
  try {
    // validate inputs
    const { userId, testId } = req.body;

    if (!userId || !testId) {
      res.status(400).json({
        success: false,
        message: "Please provide both user ID and test ID",
      });
      return;
    }

    // find the user and test
    const user = await User.findById(userId);
    const test = await Test.findById(testId);

    if (!user || !test) {
      res.status(404).json({
        success: false,
        message: "User or test not found",
      });
      return;
    }

    if(!user.isRegister){
      res.status(401).json({
        success: false,
        message: "User not registered"
      });
      return;
    }

    // check if user is already enrolled in the test
    if (user.enrolledTest.includes(test._id)) {
      res.status(400).json({
        success: false,
        message: "User is already enrolled in the test",
      });
      return;
    }

    // add test id to the user's enrolledTest array
    user.enrolledTest.push(test._id);
    test.enrolledStudents.push(user._id);
    await user.save();
    await test.save();

    res.status(200).json({
      success: true,
      message: "User enrolled successfully in the test",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

const unenrollStudentInTest = async (req, res) => {
  try {
    // validate inputs
    const { userId, testId } = req.body;

    if (!userId || !testId) {
      res.status(400).json({
        success: false,
        message: "Please provide both user ID and test ID",
      });
      return;
    }

    // find the user and test
    const user = await User.findById(userId);
    const test = await Test.findById(testId);

    if (!user || !test) {
      res.status(404).json({
        success: false,
        message: "User or test not found",
      });
      return;
    }

    if(!user.isRegister){
      res.status(401).json({
        success: false,
        message: "User not registered"
      });
      return;
    }

    // check if user is already enrolled in the test
    if (!user.enrolledTest.includes(test._id)) {
      res.status(400).json({
        success: false,
        message: "user is not enrolled in the test",
      });
      return;
    }

    // add test id to the user's enrolledTest array
    user.enrolledTest.remove(test._id);
    test.enrolledStudents.remove(user._id);
    await user.save();
    await test.save();

    res.status(200).json({
      success: true,
      message: "User unenrolled successfully in the test",
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
  enrollStudentInTest,
  unenrollStudentInTest
};
