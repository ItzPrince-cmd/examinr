const Course = require('../models/Course');
const User = require('../models/User');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;
const mongoose = require('mongoose');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create a new course
const createCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const courseData = {
      ...req.body,
      instructor: req.userId,
      status: 'draft'
    };

    // Create course
    const course = await Course.create(courseData);
    
    // Populate instructor details
    await course.populate('instructor', 'firstName lastName email profile.avatar');
    await course.populate('category', 'name icon');

    res.status(201).json({
      success: true,
      course,
      message: 'Course created successfully'
    });
  } catch (error) {
    console.error('Create course error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A course with this slug already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating course'
    });
  }
};

// Get all courses with filters and pagination
const getAllCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      level,
      price,
      rating,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      status = 'published'
    } = req.query;

    // Build query
    const query = {};
    
    // Only show published courses to non-admins
    if (!['admin', 'superadmin'].includes(req.user?.role)) {
      query.status = 'published';
    } else if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    if (price) {
      if (price === 'free') {
        query['pricing.type'] = 'free';
      } else if (price === 'paid') {
        query['pricing.type'] = { $ne: 'free' };
      }
    }

    if (rating) {
      query['statistics.averageRating'] = { $gte: parseFloat(rating) };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'metadata.objectives': { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const courses = await Course.find(query)
      .populate('instructor', 'firstName lastName profile.avatar teaching.rating')
      .populate('category', 'name icon')
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses'
    });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate('instructor', 'firstName lastName email profile teaching')
      .populate('category', 'name icon')
      .populate('reviews.user', 'firstName lastName profile.avatar');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if course is published or user has access
    const hasAccess = course.status === 'published' ||
                     course.instructor._id.toString() === req.user?._id.toString() ||
                     ['admin', 'superadmin'].includes(req.user?.role);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Increment view count
    course.statistics.totalViews += 1;
    await course.save();

    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course'
    });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { courseId } = req.params;
    const updates = req.body;

    // Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.userId && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update course
    Object.assign(course, updates);
    course.updatedAt = Date.now();
    await course.save();

    await course.populate('instructor', 'firstName lastName email profile.avatar');
    await course.populate('category', 'name icon');

    res.json({
      success: true,
      course,
      message: 'Course updated successfully'
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course'
    });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.userId && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Soft delete
    course.status = 'archived';
    course.isDeleted = true;
    course.deletedAt = Date.now();
    await course.save();

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting course'
    });
  }
};

// Publish/Unpublish course
const publishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish = true } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.userId && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if course is ready to publish
    if (publish && course.modules.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot publish course without modules'
      });
    }

    course.status = publish ? 'published' : 'draft';
    course.publishedAt = publish ? Date.now() : null;
    await course.save();

    res.json({
      success: true,
      course,
      message: `Course ${publish ? 'published' : 'unpublished'} successfully`
    });
  } catch (error) {
    console.error('Publish course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error publishing course'
    });
  }
};

// Upload course thumbnail
const uploadThumbnail = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.userId && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'examinr/courses/thumbnails',
      width: 800,
      height: 450,
      crop: 'fill'
    });

    // Delete old thumbnail if exists
    if (course.thumbnail?.publicId) {
      await cloudinary.uploader.destroy(course.thumbnail.publicId);
    }

    // Update course thumbnail
    course.thumbnail = {
      url: result.secure_url,
      publicId: result.public_id
    };
    await course.save();

    // Delete local file
    await fs.unlink(req.file.path);

    res.json({
      success: true,
      thumbnail: course.thumbnail,
      message: 'Thumbnail uploaded successfully'
    });
  } catch (error) {
    console.error('Thumbnail upload error:', error);
    
    // Clean up local file if exists
    if (req.file && req.file.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading thumbnail'
    });
  }
};

// Course module management
const addModule = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { courseId } = req.params;
    const moduleData = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.userId && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Add module
    course.modules.push(moduleData);
    await course.save();

    res.json({
      success: true,
      module: course.modules[course.modules.length - 1],
      message: 'Module added successfully'
    });
  } catch (error) {
    console.error('Add module error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding module'
    });
  }
};

const updateModule = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const updates = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.userId && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Find and update module
    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    Object.assign(module, updates);
    await course.save();

    res.json({
      success: true,
      module,
      message: 'Module updated successfully'
    });
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating module'
    });
  }
};

const deleteModule = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.userId && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Remove module
    course.modules.pull(moduleId);
    await course.save();

    res.json({
      success: true,
      message: 'Module deleted successfully'
    });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting module'
    });
  }
};

// Lesson management
const addLesson = async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const lessonData = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.userId && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Find module
    const module = course.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Add lesson
    module.lessons.push(lessonData);
    await course.save();

    res.json({
      success: true,
      lesson: module.lessons[module.lessons.length - 1],
      message: 'Lesson added successfully'
    });
  } catch (error) {
    console.error('Add lesson error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding lesson'
    });
  }
};

// Course enrollment
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.userId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Course is not available for enrollment'
      });
    }

    // Check if already enrolled
    const user = await User.findById(userId);
    if (user.learning.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Check payment if course is paid
    if (course.pricing.type !== 'free') {
      // TODO: Verify payment
      // For now, we'll skip payment verification
    }

    // Enroll user
    user.learning.enrolledCourses.push(courseId);
    await user.save();

    // Update course statistics
    course.statistics.totalEnrollments += 1;
    await course.save();

    // Send enrollment email
    const EmailService = require('../services/emailService');
    const emailService = new EmailService();
    await emailService.sendCourseEnrollmentEmail(user, course);

    res.json({
      success: true,
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    console.error('Course enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error enrolling in course'
    });
  }
};

// Get enrolled courses
const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;

    // Check permissions
    if (req.userId !== userId && !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const user = await User.findById(userId)
      .populate({
        path: 'learning.enrolledCourses',
        populate: {
          path: 'instructor category',
          select: 'firstName lastName profile.avatar name icon'
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      courses: user.learning.enrolledCourses
    });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enrolled courses'
    });
  }
};

// Get instructor courses
const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.params.instructorId || req.userId;

    const courses = await Course.find({ instructor: instructorId })
      .populate('category', 'name icon')
      .sort('-createdAt');

    res.json({
      success: true,
      courses
    });
  } catch (error) {
    console.error('Get instructor courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching instructor courses'
    });
  }
};

// Course reviews
const addReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { courseId } = req.params;
    const { rating, comment } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled
    const user = await User.findById(req.userId);
    if (!user.learning.enrolledCourses.includes(courseId)) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled to review this course'
      });
    }

    // Check if already reviewed
    const existingReview = course.reviews.find(
      review => review.user.toString() === req.userId
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this course'
      });
    }

    // Add review
    course.reviews.push({
      user: req.userId,
      rating,
      comment
    });

    // Update statistics
    const totalRatings = course.reviews.reduce((sum, review) => sum + review.rating, 0);
    course.statistics.averageRating = totalRatings / course.reviews.length;
    course.statistics.totalReviews = course.reviews.length;

    await course.save();
    await course.populate('reviews.user', 'firstName lastName profile.avatar');

    res.json({
      success: true,
      review: course.reviews[course.reviews.length - 1],
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review'
    });
  }
};

// Get course statistics
const getCourseStatistics = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.userId && 
        !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get detailed analytics
    const QuizAttempt = require('../models/QuizAttempt');
    const enrollmentTrend = await User.aggregate([
      {
        $match: {
          'learning.enrolledCourses': mongoose.Types.ObjectId(courseId)
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      statistics: {
        basic: course.statistics,
        enrollmentTrend,
        completionRate: course.statistics.totalCompletions / course.statistics.totalEnrollments * 100
      }
    });
  } catch (error) {
    console.error('Get course statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course statistics'
    });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  publishCourse,
  uploadThumbnail,
  addModule,
  updateModule,
  deleteModule,
  addLesson,
  enrollInCourse,
  getEnrolledCourses,
  getInstructorCourses,
  addReview,
  getCourseStatistics
};