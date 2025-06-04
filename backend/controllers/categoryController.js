const Category = require('../models/Category');
const Course = require('../models/Course');
const { validationResult } = require('express-validator');

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort('order name');

    // Get course count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const courseCount = await Course.countDocuments({
          category: category._id,
          status: 'published'
        });
        
        return {
          ...category.toObject(),
          courseCount
        };
      })
    );

    res.json({
      success: true,
      categories: categoriesWithCount
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const courseCount = await Course.countDocuments({
      category: category._id,
      status: 'published'
    });

    res.json({
      success: true,
      category: {
        ...category.toObject(),
        courseCount
      }
    });
  } catch (error) {
    console.error('Get category by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category'
    });
  }
};

// Create category (admin only)
const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const categoryData = req.body;

    // Check if category with same name exists
    const existing = await Category.findOne({ 
      name: { $regex: new RegExp(`^${categoryData.name}$`, 'i') }
    });
    
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      category,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating category'
    });
  }
};

// Update category (admin only)
const updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { categoryId } = req.params;
    const updates = req.body;

    const category = await Category.findByIdAndUpdate(
      categoryId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      category,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category'
    });
  }
};

// Delete category (admin only)
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Check if category has courses
    const courseCount = await Course.countDocuments({ category: categoryId });
    if (courseCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${courseCount} courses. Please reassign courses first.`
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Soft delete
    category.isActive = false;
    await category.save();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category'
    });
  }
};

// Get courses by category
const getCoursesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const {
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const courses = await Course.find({
      category: categoryId,
      status: 'published'
    })
      .populate('instructor', 'firstName lastName profile.avatar')
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments({
      category: categoryId,
      status: 'published'
    });

    res.json({
      success: true,
      category,
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get courses by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses'
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCoursesByCategory
};