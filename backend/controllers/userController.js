const User = require('../models/User');
const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password -tokens')
      .populate('subscription.courses', 'title thumbnail')
      .populate('learning.enrolledCourses', 'title thumbnail instructor');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const updates = {};
    const allowedUpdates = [
      'firstName', 'lastName', 'profile.displayName', 'profile.bio',
      'profile.dateOfBirth', 'profile.gender', 'profile.phone',
      'profile.address', 'profile.socialLinks', 'preferences',
      'teaching.bio', 'teaching.specializations', 'teaching.qualifications',
      'education'
    ];

    // Extract allowed updates from request body
    allowedUpdates.forEach(field => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (req.body[parent] && req.body[parent][child] !== undefined) {
          if (!updates[parent]) updates[parent] = {};
          updates[parent][child] = req.body[parent][child];
        }
      } else if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Update user
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -tokens');

    res.json({
      success: true,
      user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

// Upload avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old avatar from Cloudinary if exists
    if (user.profile.avatar && user.profile.avatar.publicId) {
      await cloudinary.uploader.destroy(user.profile.avatar.publicId);
    }

    // Upload new avatar to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'examinr/avatars',
      width: 300,
      height: 300,
      crop: 'fill',
      quality: 'auto'
    });

    // Update user avatar
    user.profile.avatar = {
      url: result.secure_url,
      publicId: result.public_id
    };
    user.profile.isProfileComplete = true;
    await user.save();

    // Delete local file
    await fs.unlink(req.file.path);

    res.json({
      success: true,
      avatar: user.profile.avatar,
      message: 'Avatar uploaded successfully'
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    
    // Clean up local file if exists
    if (req.file && req.file.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading avatar'
    });
  }
};

// Delete avatar
const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.profile.avatar && user.profile.avatar.publicId) {
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(user.profile.avatar.publicId);
    }

    // Remove avatar from user
    user.profile.avatar = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Avatar deleted successfully'
    });
  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting avatar'
    });
  }
};

// Get user by ID (admin or self)
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is accessing their own profile or is admin
    if (req.userId !== userId && !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const user = await User.findById(userId)
      .select('-password -tokens')
      .populate('subscription.courses', 'title thumbnail')
      .populate('learning.enrolledCourses', 'title thumbnail instructor');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user'
    });
  }
};

// Get all users (admin only) with pagination and filters
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      status,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status) {
      if (status === 'active') {
        query['accountStatus.isActive'] = true;
      } else if (status === 'inactive') {
        query['accountStatus.isActive'] = false;
      } else if (status === 'verified') {
        query['accountStatus.isEmailVerified'] = true;
      } else if (status === 'unverified') {
        query['accountStatus.isEmailVerified'] = false;
      }
    }

    // Execute query with pagination
    const users = await User.find(query)
      .select('-password -tokens')
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

// Update user by ID (admin only)
const updateUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated this way
    delete updates.password;
    delete updates.tokens;
    delete updates.email; // Email should be updated through verification process

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -tokens');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user'
    });
  }
};

// Delete user (admin only or self)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check permissions
    if (req.userId !== userId && !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete by deactivating account
    user.accountStatus.isActive = false;
    user.accountStatus.deactivatedAt = new Date();
    user.tokens = []; // Logout from all devices
    await user.save();

    res.json({
      success: true,
      message: 'User account deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
};

// Bulk user operations (admin only)
const bulkUserOperation = async (req, res) => {
  try {
    const { userIds, operation, data } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      });
    }

    let result;

    switch (operation) {
      case 'activate':
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { $set: { 'accountStatus.isActive': true } }
        );
        break;

      case 'deactivate':
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { 
            $set: { 
              'accountStatus.isActive': false,
              'accountStatus.deactivatedAt': new Date()
            },
            $unset: { tokens: 1 }
          }
        );
        break;

      case 'updateRole':
        if (!data || !data.role) {
          return res.status(400).json({
            success: false,
            message: 'Role is required for updateRole operation'
          });
        }
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { $set: { role: data.role } }
        );
        break;

      case 'delete':
        // Soft delete multiple users
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { 
            $set: { 
              'accountStatus.isActive': false,
              'accountStatus.deactivatedAt': new Date()
            },
            $unset: { tokens: 1 }
          }
        );
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid operation'
        });
    }

    res.json({
      success: true,
      message: `Bulk ${operation} completed successfully`,
      affected: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk operation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing bulk operation'
    });
  }
};

// Get user statistics (admin only)
const getUserStatistics = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $facet: {
          byRole: [
            {
              $group: {
                _id: '$role',
                count: { $sum: 1 }
              }
            }
          ],
          byStatus: [
            {
              $group: {
                _id: {
                  active: '$accountStatus.isActive',
                  verified: '$accountStatus.isEmailVerified'
                },
                count: { $sum: 1 }
              }
            }
          ],
          recentSignups: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                }
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
          ],
          total: [
            { $count: 'count' }
          ]
        }
      }
    ]);

    res.json({
      success: true,
      statistics: stats[0]
    });
  } catch (error) {
    console.error('Get user statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics'
    });
  }
};

// Update user preferences
const updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { preferences } },
      { new: true, runValidators: true }
    ).select('preferences');

    res.json({
      success: true,
      preferences: user.preferences,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences'
    });
  }
};

// Get user learning progress
const getLearningProgress = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;

    // Check permissions
    if (req.userId !== userId && !['admin', 'superadmin', 'teacher'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const user = await User.findById(userId)
      .select('learning')
      .populate({
        path: 'learning.enrolledCourses',
        select: 'title thumbnail metadata.duration'
      })
      .populate({
        path: 'learning.completedCourses',
        select: 'title thumbnail'
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get quiz attempts and calculate statistics
    const QuizAttempt = require('../models/QuizAttempt');
    const quizStats = await QuizAttempt.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          averageScore: { $avg: '$score.percentage' },
          totalQuizzes: { $addToSet: '$quiz' }
        }
      }
    ]);

    res.json({
      success: true,
      progress: {
        ...user.learning,
        quizStatistics: quizStats[0] || {
          totalAttempts: 0,
          averageScore: 0,
          totalQuizzes: []
        }
      }
    });
  } catch (error) {
    console.error('Get learning progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching learning progress'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  getUserById,
  getAllUsers,
  updateUserById,
  deleteUser,
  bulkUserOperation,
  getUserStatistics,
  updatePreferences,
  getLearningProgress
};