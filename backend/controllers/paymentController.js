const Razorpay = require('razorpay');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Course = require('../models/Course');
const Subscription = require('../models/Subscription');
const EmailService = require('../services/emailService');

// Initialize Razorpay instance
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
} else {
  console.warn('Razorpay credentials not configured. Payment features will be disabled.');
}

// Create order for course purchase
const createCourseOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { courseId } = req.body;
    const userId = req.userId;

    // Get course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
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

    // Check if course is free
    if (course.pricing.type === 'free') {
      return res.status(400).json({
        success: false,
        message: 'This is a free course. No payment required.'
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(course.pricing.amount * 100), // Amount in paise
      currency: course.pricing.currency || 'INR',
      receipt: `course_${courseId}_${Date.now()}`,
      notes: {
        courseId: courseId,
        userId: userId,
        courseTitle: course.title,
        userEmail: user.email
      }
    };

    const order = await razorpay.orders.create(options);

    // Save order details in database (you might want to create an Order model)
    user.paymentHistory = user.paymentHistory || [];
    user.paymentHistory.push({
      orderId: order.id,
      type: 'course',
      itemId: courseId,
      amount: course.pricing.amount,
      currency: course.pricing.currency || 'INR',
      status: 'created',
      createdAt: new Date()
    });
    await user.save();

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        courseDetails: {
          id: course._id,
          title: course.title,
          price: course.pricing.amount
        }
      }
    });
  } catch (error) {
    console.error('Create course order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order'
    });
  }
};

// Create subscription order
const createSubscriptionOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { planId } = req.body;
    const userId = req.userId;

    // Define subscription plans
    const plans = {
      basic_monthly: {
        id: 'basic_monthly',
        name: 'Basic Monthly',
        amount: 999, // ₹999
        interval: 'monthly',
        features: {
          courses: { maxCourses: 10 },
          quizzes: { maxQuizzesPerCourse: 20 },
          analytics: { basicAnalytics: true, advancedAnalytics: false }
        }
      },
      basic_yearly: {
        id: 'basic_yearly',
        name: 'Basic Yearly',
        amount: 9999, // ₹9,999
        interval: 'yearly',
        features: {
          courses: { maxCourses: 10 },
          quizzes: { maxQuizzesPerCourse: 20 },
          analytics: { basicAnalytics: true, advancedAnalytics: false }
        }
      },
      premium_monthly: {
        id: 'premium_monthly',
        name: 'Premium Monthly',
        amount: 2999, // ₹2,999
        interval: 'monthly',
        features: {
          courses: { maxCourses: -1 }, // Unlimited
          quizzes: { maxQuizzesPerCourse: -1 },
          analytics: { basicAnalytics: true, advancedAnalytics: true }
        }
      },
      premium_yearly: {
        id: 'premium_yearly',
        name: 'Premium Yearly',
        amount: 29999, // ₹29,999
        interval: 'yearly',
        features: {
          courses: { maxCourses: -1 },
          quizzes: { maxQuizzesPerCourse: -1 },
          analytics: { basicAnalytics: true, advancedAnalytics: true }
        }
      }
    };

    const plan = plans[planId];
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }

    const user = await User.findById(userId);

    // Create Razorpay order
    const options = {
      amount: plan.amount * 100, // Amount in paise
      currency: 'INR',
      receipt: `sub_${planId}_${Date.now()}`,
      notes: {
        planId: planId,
        userId: userId,
        userEmail: user.email,
        planName: plan.name
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        plan: {
          id: plan.id,
          name: plan.name,
          amount: plan.amount,
          interval: plan.interval,
          features: plan.features
        }
      }
    });
  } catch (error) {
    console.error('Create subscription order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating subscription order'
    });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      type, // 'course' or 'subscription'
      itemId // courseId or planId
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Get payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    if (payment.status !== 'captured') {
      return res.status(400).json({
        success: false,
        message: 'Payment not captured'
      });
    }

    const user = await User.findById(req.userId);
    const emailService = new EmailService();

    if (type === 'course') {
      // Handle course purchase
      const course = await Course.findById(itemId)
        .populate('instructor', 'firstName lastName');

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Enroll user in course
      user.learning.enrolledCourses.push(itemId);
      
      // Update payment history
      const paymentIndex = user.paymentHistory.findIndex(
        p => p.orderId === razorpay_order_id
      );
      if (paymentIndex !== -1) {
        user.paymentHistory[paymentIndex].status = 'completed';
        user.paymentHistory[paymentIndex].paymentId = razorpay_payment_id;
        user.paymentHistory[paymentIndex].completedAt = new Date();
      }

      // Update course statistics
      course.statistics.totalEnrollments += 1;
      await course.save();

      await user.save();

      // Send enrollment email
      await emailService.sendCourseEnrollmentEmail(user, course);

      res.json({
        success: true,
        message: 'Payment successful. You are now enrolled in the course.',
        enrolledCourse: {
          id: course._id,
          title: course.title
        }
      });

    } else if (type === 'subscription') {
      // Handle subscription purchase
      const plans = {
        basic_monthly: { name: 'Basic Monthly', amount: 999, interval: 'monthly' },
        basic_yearly: { name: 'Basic Yearly', amount: 9999, interval: 'yearly' },
        premium_monthly: { name: 'Premium Monthly', amount: 2999, interval: 'monthly' },
        premium_yearly: { name: 'Premium Yearly', amount: 29999, interval: 'yearly' }
      };

      const plan = plans[itemId];
      if (!plan) {
        return res.status(400).json({
          success: false,
          message: 'Invalid plan'
        });
      }

      // Create or update subscription
      let subscription = await Subscription.findOne({ user: user._id });
      
      if (subscription) {
        // Update existing subscription
        subscription.plan = {
          id: itemId,
          name: plan.name,
          interval: plan.interval,
          price: {
            amount: plan.amount,
            currency: 'INR'
          }
        };
        subscription.razorpay.orderId = razorpay_order_id;
        subscription.razorpay.paymentMethodId = razorpay_payment_id;
        subscription.status.current = 'active';
        subscription.billing.currentPeriodStart = new Date();
        subscription.billing.currentPeriodEnd = plan.interval === 'monthly' 
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      } else {
        // Create new subscription
        subscription = await Subscription.create({
          user: user._id,
          plan: {
            id: itemId,
            name: plan.name,
            interval: plan.interval,
            price: {
              amount: plan.amount,
              currency: 'INR'
            }
          },
          razorpay: {
            customerId: user.email, // You might want to create actual Razorpay customer
            orderId: razorpay_order_id,
            paymentMethodId: razorpay_payment_id
          },
          status: {
            current: 'active'
          },
          billing: {
            currentPeriodStart: new Date(),
            currentPeriodEnd: plan.interval === 'monthly' 
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          },
          features: plans[itemId].features || {}
        });
      }

      await subscription.save();

      // Update user subscription reference
      user.subscription.isActive = true;
      user.subscription.plan = itemId;
      user.subscription.endDate = subscription.billing.currentPeriodEnd;
      await user.save();

      // Send subscription confirmation email
      await emailService.sendSubscriptionConfirmationEmail(user, subscription);

      res.json({
        success: true,
        message: 'Subscription activated successfully',
        subscription: {
          plan: subscription.plan.name,
          validUntil: subscription.billing.currentPeriodEnd
        }
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment'
    });
  }
};

// Get payment history
const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.params.userId || req.userId;
    
    // Check access
    if (userId !== req.userId && !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const user = await User.findById(userId)
      .select('paymentHistory')
      .populate('paymentHistory.itemId', 'title thumbnail');

    const subscription = await Subscription.findOne({ user: userId });

    res.json({
      success: true,
      paymentHistory: user.paymentHistory || [],
      currentSubscription: subscription ? {
        plan: subscription.plan,
        status: subscription.status.current,
        validUntil: subscription.billing.currentPeriodEnd
      } : null
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history'
    });
  }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
  try {
    const userId = req.userId;

    const subscription = await Subscription.findOne({ user: userId });
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    // Update subscription status
    subscription.status.current = 'cancelled';
    subscription.status.cancelledAt = new Date();
    subscription.cancellation = {
      reason: req.body.reason,
      feedback: req.body.feedback,
      cancelledAt: new Date()
    };

    await subscription.save();

    // Update user subscription status
    const user = await User.findById(userId);
    user.subscription.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'Subscription cancelled successfully. You will have access until the end of the current billing period.',
      accessUntil: subscription.billing.currentPeriodEnd
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling subscription'
    });
  }
};

// Process refund
const processRefund = async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;

    // In production, you would call Razorpay refund API
    // const refund = await razorpay.payments.refund(paymentId, {
    //   amount: amount * 100, // Amount in paise
    //   notes: { reason }
    // });

    // For now, just log the refund request
    console.log('Refund request:', { paymentId, amount, reason });

    res.json({
      success: true,
      message: 'Refund request has been submitted and will be processed within 5-7 business days',
      refundDetails: {
        paymentId,
        amount,
        reason,
        status: 'processing'
      }
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing refund'
    });
  }
};

// Webhook handler for Razorpay events
const handleWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    // Verify webhook signature
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');
    
    if (digest !== req.headers['x-razorpay-signature']) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    switch (event) {
      case 'payment.captured':
        // Handle successful payment
        console.log('Payment captured:', payload.payment.entity);
        break;

      case 'payment.failed':
        // Handle failed payment
        console.log('Payment failed:', payload.payment.entity);
        // You might want to notify the user
        break;

      case 'subscription.activated':
        // Handle subscription activation
        console.log('Subscription activated:', payload.subscription.entity);
        break;

      case 'subscription.cancelled':
        // Handle subscription cancellation
        console.log('Subscription cancelled:', payload.subscription.entity);
        break;

      default:
        console.log('Unhandled webhook event:', event);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing error'
    });
  }
};

// Get subscription plans
const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free Plan',
        price: {
          monthly: 0,
          yearly: 0
        },
        features: {
          courses: { maxCourses: 3, description: 'Access up to 3 courses' },
          quizzes: { maxQuizzesPerCourse: 5, description: '5 quizzes per course' },
          analytics: { basic: true, advanced: false },
          support: { type: 'community', description: 'Community support' },
          certificates: false
        }
      },
      {
        id: 'basic',
        name: 'Basic Plan',
        price: {
          monthly: 999,
          yearly: 9999
        },
        features: {
          courses: { maxCourses: 10, description: 'Access up to 10 courses' },
          quizzes: { maxQuizzesPerCourse: 20, description: '20 quizzes per course' },
          analytics: { basic: true, advanced: false },
          support: { type: 'email', description: 'Email support' },
          certificates: true,
          downloadableContent: true
        },
        popular: true
      },
      {
        id: 'premium',
        name: 'Premium Plan',
        price: {
          monthly: 2999,
          yearly: 29999
        },
        features: {
          courses: { maxCourses: -1, description: 'Unlimited courses' },
          quizzes: { maxQuizzesPerCourse: -1, description: 'Unlimited quizzes' },
          analytics: { basic: true, advanced: true, description: 'Advanced analytics & insights' },
          support: { type: 'priority', description: '24/7 priority support' },
          certificates: true,
          downloadableContent: true,
          exclusiveContent: true,
          earlyAccess: true
        }
      }
    ];

    res.json({
      success: true,
      plans
    });
  } catch (error) {
    console.error('Get subscription plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription plans'
    });
  }
};

module.exports = {
  createCourseOrder,
  createSubscriptionOrder,
  verifyPayment,
  getPaymentHistory,
  cancelSubscription,
  processRefund,
  handleWebhook,
  getSubscriptionPlans
};