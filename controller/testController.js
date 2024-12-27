const Subject = require("../models/Subject");
const Test = require("../models/Test");
const User = require("../models/User");

const createTest = async (req, res) => {
  try {
    const {
      testTitle,
      examDetail,
      testType,
      totalTestTime,
      totalPrizePool,
      joinAmount,
      slots,
      subject,
      optionsType,
      status,
      cash_prize,
    } = req.body;

    if (
      !testTitle ||
      !examDetail ||
      !testType ||
      !totalTestTime ||
      !totalPrizePool ||
      !joinAmount ||
      !slots ||
      !subject ||
      !optionsType ||
      !status ||
      !cash_prize
    ) {
      res.status(401).json({
        success: false,
        message: "Please enter all required fields",
      });
      return;
    }

    //creating subject
    let subArr = [];
    for(let item of subject){
        let sub = await Subject.create({ subject: item });
        if (!sub) {
          res.status(400).json({
            success: false,
            message: "Failed to create subject",
          });
          return;
        }
        subArr.push(sub._id);
    }
    console.log(subArr)

    const test = await Test.create({
      testTitle,
      examDetail,
      testType,
      totalTestTime,
      totalPrizePool,
      joinAmount,
      slots,
      subject: subArr,
      optionsType,
      status,
      cash_prize,
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

module.exports = {
  createTest,
};
