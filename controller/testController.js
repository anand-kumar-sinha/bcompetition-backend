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
      cashPrize,
      attemetedSubject,
      attemeptedQuestion,
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
      !pointSystem ||
      !attemeptedQuestion ||
      !attemetedSubject
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
      pointSystem,
      totalAttemptQuestion: attemeptedQuestion,
      totalAttemptSubject: attemetedSubject,
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
    const tests = await Test.find({ isDeleted: false }).populate("category");

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
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(401).json({
        success: false,
        message: "Please provide test id",
      });
      return;
    }

    const test = await Test.findByIdAndUpdate(id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    test.isDeleted = true;
    await test.save();
    res.status(200).json({
      success: true,
      message: "Test deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

const fetchDeletedTest = async (req, res) => {
  try {
    let { page } = req.params;
    page = parseInt(page, 10);
    const limit = 5;
    if (!page || page < 1) {
      page = 1;
    }
    const skip = (page - 1) * limit;
    const total = await Test.countDocuments({ isDeleted: true });
    const tests = await Test.find({ isDeleted: true }).limit(limit).skip(skip);
    if (!tests || tests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No test found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Deleted test fetched successfully",
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

const fetchUnpublishedTest = async (req, res) => {
  try {
    let tests = await Test.find({ isDeleted: false }).populate("category");

    const getLocalTimestamp = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const date = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${date}T${hours}:${minutes}`;
    };

    const timestamp = getLocalTimestamp();
    let finalTest = [];
    for (let item of tests) {
      if (item.unpublish_at < timestamp) {
        finalTest.push(item);
      }
    }

    if (!finalTest || finalTest.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No test found",
      });
    }
    res.status(200).json({
      success: true,
      message: "unpublished test fetched successfully",
      tests: finalTest,
      timestamp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

const fetchUpcomingTest = async (req, res) => {
  try {
    let tests = await Test.find({ isDeleted: false }).populate("category");

    const getLocalTimestamp = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const date = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${date}T${hours}:${minutes}`;
    };

    const timestamp = getLocalTimestamp();
    let finalTest = [];
    for (let item of tests) {
      if (item.publish_at > timestamp) {
        finalTest.push(item);
      }
    }

    if (!finalTest || finalTest.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No test found",
      });
    }
    res.status(200).json({
      success: true,
      message: "upcoming test fetched successfully",
      tests: finalTest,
      timestamp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

const fetchOngingTest = async (req, res) => {
  try {
    let tests = await Test.find({ isDeleted: false }).populate("category");

    const getLocalTimestamp = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const date = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${date}T${hours}:${minutes}`;
    };

    const timestamp = getLocalTimestamp();
    let finalTest = [];
    for (let item of tests) {
      if (item.publish_at <= timestamp && item.unpublish_at >= timestamp) {
        finalTest.push(item);
      }
    }

    if (!finalTest || finalTest.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No test found",
      });
    }
    res.status(200).json({
      success: true,
      message: "upcoming test fetched successfully",
      tests: finalTest,
      timestamp,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

const publishTest = async (req, res) => {
  try {
    const { id, publish_at, testJoinType, unpublish_at, category } = req.body;

    if (!id || !publish_at || !unpublish_at || !testJoinType || !category) {
      res.status(401).json({
        success: false,
        message: "Please provide all required fields",
      });
      return;
    }

    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    test.category = category;
    test.testJoinType = testJoinType;
    test.publish_at = publish_at;
    test.unpublish_at = unpublish_at;
    test.isDeleted = false;

    await test.save();
    res.status(200).json({
      success: true,
      message: "Test published successfully",
      test: test,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message || error,
    });
  }
};

const fetchTestById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(401).json({
        success: false,
        message: "Please provide test id",
      });
      return;
    }

    const test = await Test.findById(id)
      .populate({
        path: "subject",
        populate: {
          path: "question",
          select: "+correctOption",
        },
      })
      .populate("category");
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Test fetched successfully",
      test: test,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message || error,
    });
  }
};

const updateTest = async (req, res) => {
  try {
    const { id, ...data } = req.body;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Test ID is required",
      });
    }

    const testDocument = await Test.findByIdAndUpdate(
      id,
      { $set: data }, // Use $set to update specific fields
      { new: true, runValidators: true } // Ensure new doc is returned and validations are run
    );

    if (!testDocument) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Test updated successfully",
      test: testDocument,
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
  deleteTest,
  fetchDeletedTest,
  publishTest,
  fetchUnpublishedTest,
  fetchUpcomingTest,
  fetchOngingTest,
  fetchTestById,
  updateTest,
};
