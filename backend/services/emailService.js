const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(to, subject, html, text) {
    try {
      const mailOptions = {
        from: `"Examinr" <${process.env.EMAIL_FROM || 'noreply@examinr.com'}>`,
        to,
        subject,
        text,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Examinr!</h1>
        <p>Hi ${user.firstName},</p>
        <p>Thank you for registering with Examinr. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">If you didn't create an account with Examinr, please ignore this email.</p>
      </div>
    `;

    const text = `
      Welcome to Examinr!
      
      Hi ${user.firstName},
      
      Thank you for registering with Examinr. Please verify your email address by visiting:
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create an account with Examinr, please ignore this email.
    `;

    return this.sendEmail(user.email, 'Verify your Examinr account', html, text);
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>Hi ${user.firstName},</p>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #FF9800; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
      </div>
    `;

    const text = `
      Password Reset Request
      
      Hi ${user.firstName},
      
      You requested to reset your password. Visit the following link to create a new password:
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request a password reset, please ignore this email and your password will remain unchanged.
    `;

    return this.sendEmail(user.email, 'Reset your Examinr password', html, text);
  }

  async sendWelcomeEmail(user) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Examinr!</h1>
        <p>Hi ${user.firstName},</p>
        <p>Your email has been verified and your account is now active. Here's what you can do next:</p>
        <ul style="line-height: 1.8;">
          <li>Complete your profile to help us personalize your experience</li>
          <li>Browse our course catalog and enroll in courses</li>
          <li>Take practice quizzes to test your knowledge</li>
          <li>Track your learning progress on your dashboard</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/dashboard" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">Need help? Contact our support team at support@examinr.com</p>
      </div>
    `;

    const text = `
      Welcome to Examinr!
      
      Hi ${user.firstName},
      
      Your email has been verified and your account is now active. Here's what you can do next:
      - Complete your profile to help us personalize your experience
      - Browse our course catalog and enroll in courses
      - Take practice quizzes to test your knowledge
      - Track your learning progress on your dashboard
      
      Visit your dashboard at: ${process.env.CLIENT_URL}/dashboard
      
      Need help? Contact our support team at support@examinr.com
    `;

    return this.sendEmail(user.email, 'Welcome to Examinr!', html, text);
  }

  async sendCourseEnrollmentEmail(user, course) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Course Enrollment Confirmation</h1>
        <p>Hi ${user.firstName},</p>
        <p>You have successfully enrolled in:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #333; margin: 0;">${course.title}</h2>
          <p style="color: #666; margin: 10px 0;">Instructor: ${course.instructor.fullName}</p>
          <p style="color: #666; margin: 10px 0;">Duration: ${course.metadata.duration} hours</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/courses/${course._id}" style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Start Learning
          </a>
        </div>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">Happy learning!</p>
      </div>
    `;

    const text = `
      Course Enrollment Confirmation
      
      Hi ${user.firstName},
      
      You have successfully enrolled in:
      ${course.title}
      
      Instructor: ${course.instructor.fullName}
      Duration: ${course.metadata.duration} hours
      
      Start learning at: ${process.env.CLIENT_URL}/courses/${course._id}
      
      Happy learning!
    `;

    return this.sendEmail(user.email, `Enrolled in ${course.title}`, html, text);
  }

  async sendQuizResultEmail(user, quiz, attempt) {
    const passed = attempt.result.passed ? 'Passed' : 'Failed';
    const color = attempt.result.passed ? '#4CAF50' : '#F44336';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Quiz Results</h1>
        <p>Hi ${user.firstName},</p>
        <p>Here are your results for ${quiz.title}:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: ${color}; margin: 0;">${passed}</h2>
          <p style="color: #666; margin: 10px 0;">Score: ${attempt.score.percentage.toFixed(2)}%</p>
          <p style="color: #666; margin: 10px 0;">Correct Answers: ${attempt.performance.correctAnswers}/${attempt.answers.length}</p>
          <p style="color: #666; margin: 10px 0;">Time Taken: ${Math.floor(attempt.timeSpent / 60)} minutes</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/results/${attempt._id}" style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Detailed Results
          </a>
        </div>
      </div>
    `;

    const text = `
      Quiz Results
      
      Hi ${user.firstName},
      
      Here are your results for ${quiz.title}:
      
      Status: ${passed}
      Score: ${attempt.score.percentage.toFixed(2)}%
      Correct Answers: ${attempt.performance.correctAnswers}/${attempt.answers.length}
      Time Taken: ${Math.floor(attempt.timeSpent / 60)} minutes
      
      View detailed results at: ${process.env.CLIENT_URL}/results/${attempt._id}
    `;

    return this.sendEmail(user.email, `Quiz Results: ${quiz.title}`, html, text);
  }

  async sendSubscriptionConfirmationEmail(user, subscription) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Subscription Activated!</h1>
        <p>Hi ${user.firstName},</p>
        <p>Your ${subscription.plan.name} subscription has been activated successfully.</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #333; margin: 0;">${subscription.plan.name}</h2>
          <p style="color: #666; margin: 10px 0;">Price: ₹${subscription.plan.price.amount}/${subscription.plan.interval}</p>
          <p style="color: #666; margin: 10px 0;">Valid until: ${new Date(subscription.billing.currentPeriodEnd).toLocaleDateString()}</p>
        </div>
        <h3>Your plan includes:</h3>
        <ul style="line-height: 1.8;">
          ${subscription.features.courses.maxCourses === -1 ? '<li>Unlimited courses</li>' : `<li>Access to ${subscription.features.courses.maxCourses} courses</li>`}
          ${subscription.features.quizzes.maxQuizzesPerCourse === -1 ? '<li>Unlimited quizzes per course</li>' : `<li>${subscription.features.quizzes.maxQuizzesPerCourse} quizzes per course</li>`}
          ${subscription.features.analytics.advancedAnalytics ? '<li>Advanced analytics and insights</li>' : '<li>Basic analytics</li>'}
          <li>Priority support</li>
          <li>Certificate generation</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/dashboard" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">Thank you for choosing Examinr Premium!</p>
      </div>
    `;

    const text = `
      Subscription Activated!
      
      Hi ${user.firstName},
      
      Your ${subscription.plan.name} subscription has been activated successfully.
      
      Plan: ${subscription.plan.name}
      Price: ₹${subscription.plan.price.amount}/${subscription.plan.interval}
      Valid until: ${new Date(subscription.billing.currentPeriodEnd).toLocaleDateString()}
      
      Your plan includes:
      ${subscription.features.courses.maxCourses === -1 ? '- Unlimited courses' : `- Access to ${subscription.features.courses.maxCourses} courses`}
      ${subscription.features.quizzes.maxQuizzesPerCourse === -1 ? '- Unlimited quizzes per course' : `- ${subscription.features.quizzes.maxQuizzesPerCourse} quizzes per course`}
      ${subscription.features.analytics.advancedAnalytics ? '- Advanced analytics and insights' : '- Basic analytics'}
      - Priority support
      - Certificate generation
      
      Visit your dashboard at: ${process.env.CLIENT_URL}/dashboard
      
      Thank you for choosing Examinr Premium!
    `;

    return this.sendEmail(user.email, 'Subscription Activated - Examinr', html, text);
  }

  async sendPaymentReceiptEmail(user, payment) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Payment Receipt</h1>
        <p>Hi ${user.firstName},</p>
        <p>Thank you for your payment. Here's your receipt:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #333; margin: 0;">Receipt Details</h3>
          <p style="color: #666; margin: 10px 0;">Receipt ID: ${payment.id}</p>
          <p style="color: #666; margin: 10px 0;">Date: ${new Date().toLocaleDateString()}</p>
          <p style="color: #666; margin: 10px 0;">Amount: ₹${payment.amount}</p>
          <p style="color: #666; margin: 10px 0;">Description: ${payment.description}</p>
          <p style="color: #666; margin: 10px 0;">Payment Method: ${payment.method}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/payments/history" style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Payment History
          </a>
        </div>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">This is an auto-generated receipt. Please keep it for your records.</p>
      </div>
    `;

    const text = `
      Payment Receipt
      
      Hi ${user.firstName},
      
      Thank you for your payment. Here's your receipt:
      
      Receipt ID: ${payment.id}
      Date: ${new Date().toLocaleDateString()}
      Amount: ₹${payment.amount}
      Description: ${payment.description}
      Payment Method: ${payment.method}
      
      View your payment history at: ${process.env.CLIENT_URL}/payments/history
      
      This is an auto-generated receipt. Please keep it for your records.
    `;

    return this.sendEmail(user.email, 'Payment Receipt - Examinr', html, text);
  }
}

module.exports = EmailService;