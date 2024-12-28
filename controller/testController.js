const Subject = require("../models/Subject");
const Test = require("../models/Test");

const createTest = async (req, res) => {
  try {
    const {
      testTitle,
      examDetail,
      testType,
      testTime,
      prizePool,
      joinAmount,
      slots,
      pointSystem,
      subject,
      optionsType,
      status,
      cashPrize,
      total_attempt_subject,
      total_attempted_questions,
      category,
      publish_at,
      publish_time,
      unpublish_at,
      unpublish_time,
      auto_unpublish,
      winer_list_publish,
      result_publish,
      result_auto_publish,
      remain_number_of_slot,
      totalQuestion,
      totalMarks
    } = req.body; 

    if (
      !testTitle ||
      !examDetail ||
      !testType ||
      !testTime ||
      !prizePool ||
      !joinAmount ||
      !slots ||
      !subject ||
      !cashPrize ||
      !pointSystem
    ) {
      res.status(401).json({
        success: false,
        message: "Please enter all required fields",
      });
      return;
    }

    //creating subject
    let subArr = [];
    for (let item of subject) {
      try {
        let sub = await Subject.create({ subject: item });
        if (!sub) {
          res.status(400).json({
            success: false,
            message: "Failed to create subject",
          });
          return;
        }
        subArr.push(sub._id);
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error.message || error,
        });
        return;
      }
    }

    const test = await Test.create({
      testTitle,
      examDetail,
      testType,
      testTime,
      prizePool,
      joinAmount,
      slots,
      subject: subArr,
      cash_prize: cashPrize,
      pointSystem
    });

    if (!test) {
      res.status(400).json({
        success: false,
        message: "Failed to create test",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Test created successfully",
      test: test,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

const fetchAllTest = async (req, res) => {
  try {
    let { page } = req.query;
    page = parseInt(page, 10);
    const limit = 5;

    if (!page || page < 1) {
      page = 1;
    }
    const skip = (page - 1) * limit;

    const total = await Test.countDocuments();
    const tests = await Test.find().populate("subject").limit(limit).skip(skip);

    if (!tests || tests.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "tests fetched successfully",
      tests: tests,
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
  createTest,
  fetchAllTest,
};
