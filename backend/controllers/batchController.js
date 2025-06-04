const Batch = require('../models/Batch');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Create a new batch (Teacher only)
const createBatch = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const teacherId = req.userId;
    const user = await User.findById(teacherId);
    
    if (user.role !== 'teacher' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only teachers can create batches'
      });
    }

    const batchData = {
      ...req.body,
      teacher: teacherId
    };

    const batch = new Batch(batchData);
    await batch.save();
    
    await batch.populate('teacher category');

    res.status(201).json({
      success: true,
      batch,
      message: 'Batch created successfully'
    });
  } catch (error) {
    console.error('Create batch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create batch',
      error: error.message
    });
  }
};

// Get all batches with filters
const getBatches = async (req, res) => {
  try {
    const { 
      subject, 
      level, 
      status, 
      teacher, 
      search,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};
    
    if (subject) query.subject = subject;
    if (level) query.level = level;
    if (status) query.status = status;
    if (teacher) query.teacher = teacher;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const batches = await Batch.find(query)
      .populate('teacher', 'firstName lastName email')
      .populate('category')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Batch.countDocuments(query);

    res.json({
      success: true,
      batches,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get batches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch batches',
      error: error.message
    });
  }
};

// Get batch by ID
const getBatchById = async (req, res) => {
  try {
    const { batchId } = req.params;
    
    const batch = await Batch.findById(batchId)
      .populate('teacher', 'firstName lastName email profile')
      .populate('category')
      .populate('enrollment.enrolledStudents.student', 'firstName lastName email');

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    res.json({
      success: true,
      batch
    });
  } catch (error) {
    console.error('Get batch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch batch',
      error: error.message
    });
  }
};

// Update batch (Teacher/Admin only)
const updateBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const userId = req.userId;
    
    const batch = await Batch.findById(batchId);
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    // Check authorization
    const user = await User.findById(userId);
    if (batch.teacher.toString() !== userId && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this batch'
      });
    }

    const updatedBatch = await Batch.findByIdAndUpdate(
      batchId,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('teacher category');

    res.json({
      success: true,
      batch: updatedBatch,
      message: 'Batch updated successfully'
    });
  } catch (error) {
    console.error('Update batch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update batch',
      error: error.message
    });
  }
};

// Delete batch (Teacher/Admin only)
const deleteBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const userId = req.userId;
    
    const batch = await Batch.findById(batchId);
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    // Check authorization
    const user = await User.findById(userId);
    if (batch.teacher.toString() !== userId && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this batch'
      });
    }

    await batch.deleteOne();

    res.json({
      success: true,
      message: 'Batch deleted successfully'
    });
  } catch (error) {
    console.error('Delete batch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete batch',
      error: error.message
    });
  }
};

// Enroll in a batch (Student only)
const enrollInBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const studentId = req.userId;
    
    const user = await User.findById(studentId);
    if (user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can enroll in batches'
      });
    }

    const batch = await Batch.findById(batchId);
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    if (batch.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This batch is not accepting enrollments'
      });
    }

    if (batch.enrollment.enrollmentDeadline && new Date() > batch.enrollment.enrollmentDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Enrollment deadline has passed'
      });
    }

    await batch.enrollStudent(studentId);

    res.json({
      success: true,
      message: 'Successfully enrolled in batch',
      batch
    });
  } catch (error) {
    console.error('Enroll in batch error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to enroll in batch'
    });
  }
};

// Unenroll from a batch (Student only)
const unenrollFromBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const studentId = req.userId;
    
    const batch = await Batch.findById(batchId);
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    await batch.unenrollStudent(studentId);

    res.json({
      success: true,
      message: 'Successfully unenrolled from batch'
    });
  } catch (error) {
    console.error('Unenroll from batch error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to unenroll from batch'
    });
  }
};

// Get teacher's batches
const getTeacherBatches = async (req, res) => {
  try {
    const teacherId = req.userId;
    const { status } = req.query;
    
    const query = { teacher: teacherId };
    if (status) query.status = status;
    
    const batches = await Batch.find(query)
      .populate('category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      batches
    });
  } catch (error) {
    console.error('Get teacher batches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teacher batches',
      error: error.message
    });
  }
};

// Get student's enrolled batches
const getStudentBatches = async (req, res) => {
  try {
    const studentId = req.userId;
    
    const batches = await Batch.getEnrolledByStudent(studentId);

    res.json({
      success: true,
      batches
    });
  } catch (error) {
    console.error('Get student batches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student batches',
      error: error.message
    });
  }
};

// Add live session to batch
const addLiveSession = async (req, res) => {
  try {
    const { batchId } = req.params;
    const userId = req.userId;
    const sessionData = req.body;
    
    const batch = await Batch.findById(batchId);
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    // Check authorization
    if (batch.teacher.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to add sessions to this batch'
      });
    }

    // Generate meeting ID
    sessionData.meetingId = `${batch.code}-${Date.now()}`;
    sessionData.meetingPassword = Math.random().toString(36).substring(2, 8);
    
    batch.liveSessions.push(sessionData);
    await batch.save();

    res.json({
      success: true,
      message: 'Live session added successfully',
      session: batch.liveSessions[batch.liveSessions.length - 1]
    });
  } catch (error) {
    console.error('Add live session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add live session',
      error: error.message
    });
  }
};

// Start live session
const startLiveSession = async (req, res) => {
  try {
    const { batchId, sessionId } = req.params;
    const userId = req.userId;
    
    const batch = await Batch.findById(batchId);
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    // Check authorization
    if (batch.teacher.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to start this session'
      });
    }

    const session = batch.liveSessions.id(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: 'Session is not in scheduled state'
      });
    }

    session.status = 'live';
    session.startedAt = new Date();
    await batch.save();

    // Emit socket event to notify students
    if (req.io) {
      req.io.to(`batch-${batchId}`).emit('sessionStarted', {
        batchId,
        sessionId,
        session
      });
    }

    res.json({
      success: true,
      message: 'Live session started',
      session
    });
  } catch (error) {
    console.error('Start live session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start live session',
      error: error.message
    });
  }
};

// End live session
const endLiveSession = async (req, res) => {
  try {
    const { batchId, sessionId } = req.params;
    const userId = req.userId;
    
    const batch = await Batch.findById(batchId);
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    // Check authorization
    if (batch.teacher.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to end this session'
      });
    }

    const session = batch.liveSessions.id(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    if (session.status !== 'live') {
      return res.status(400).json({
        success: false,
        message: 'Session is not live'
      });
    }

    session.status = 'completed';
    session.endedAt = new Date();
    await batch.save();

    // Emit socket event to notify students
    if (req.io) {
      req.io.to(`batch-${batchId}`).emit('sessionEnded', {
        batchId,
        sessionId
      });
    }

    res.json({
      success: true,
      message: 'Live session ended',
      session
    });
  } catch (error) {
    console.error('End live session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end live session',
      error: error.message
    });
  }
};

// Get batch students (Teacher only)
const getBatchStudents = async (req, res) => {
  try {
    const { batchId } = req.params;
    const userId = req.userId;
    
    const batch = await Batch.findById(batchId)
      .populate('enrollment.enrolledStudents.student', 'firstName lastName email profile');
    
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found'
      });
    }

    // Check authorization
    const user = await User.findById(userId);
    if (batch.teacher.toString() !== userId && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view batch students'
      });
    }

    const students = batch.enrollment.enrolledStudents.filter(e => e.status === 'active');

    res.json({
      success: true,
      students,
      total: students.length
    });
  } catch (error) {
    console.error('Get batch students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch batch students',
      error: error.message
    });
  }
};

module.exports = {
  createBatch,
  getBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
  enrollInBatch,
  unenrollFromBatch,
  getTeacherBatches,
  getStudentBatches,
  addLiveSession,
  startLiveSession,
  endLiveSession,
  getBatchStudents
};