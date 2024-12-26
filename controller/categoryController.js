const Category = require("../models/Category");

const createCategory = async (req, res) => {
  try {
    const { category, status } = req.body;

    if (!category) {
      res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
      return;
    }
    const categoryExists = await Category.findOne({ category });

    if (categoryExists) {
      res.status(400).json({
        success: false,
        message: "Category already exists",
      });
      return;
    }

    const newCategory = await Category.create({ category, status });
    if (!newCategory) {
      res.status(400).json({
        success: false,
        message: "Failed to create category",
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

const fetchCategory = async (req, res) => {
  try {
    let { page } = req.query;
    page = parseInt(page, 10);
    const limit = 5;

    if (!page || page < 1) {
      page = 1;
    }
    const total = await Category.countDocuments();

    const skip = (page - 1) * limit;

    const categories = await Category.find().skip(skip).limit(limit);

    if (!categories || categories.length === 0) {
      res.status(404).json({
        success: false,
        message: "No categories found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "categories fetched successfully",
      categories: categories,
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

const fetchCategoryAll = async (req, res) => {
  try {
    const categories = await Category.find({ status: true });
    if (!categories || categories.length === 0) {
      res.status(404).json({
        success: false,
        message: "No categories found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "categories fetched successfully",
      categories: categories,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || error,
    });
  }
};

module.exports = {
  createCategory,
  fetchCategory,
  fetchCategoryAll,
};
