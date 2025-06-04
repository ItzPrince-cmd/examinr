/**
 * @swagger
 * components:
 *   schemas:
 *     SubscriptionPlan:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           enum: [basic_monthly, basic_yearly, premium_monthly, premium_yearly]
 *           example: basic_monthly
 *         name:
 *           type: string
 *           example: Basic Monthly
 *         description:
 *           type: string
 *           example: Access to all basic courses
 *         price:
 *           type: number
 *           example: 9.99
 *         currency:
 *           type: string
 *           default: USD
 *           example: USD
 *         duration:
 *           type: string
 *           enum: [monthly, yearly]
 *           example: monthly
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - Access to all basic courses
 *             - Certificate of completion
 *             - Basic support
 *         limits:
 *           type: object
 *           properties:
 *             coursesPerMonth:
 *               type: integer
 *               example: 5
 *             downloadableResources:
 *               type: boolean
 *               example: false
 *             prioritySupport:
 *               type: boolean
 *               example: false
 *     
 *     PaymentOrder:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         orderId:
 *           type: string
 *           example: order_JIISQmDAFuqKVF
 *         type:
 *           type: string
 *           enum: [course, subscription]
 *           example: course
 *         amount:
 *           type: number
 *           example: 49.99
 *         currency:
 *           type: string
 *           example: USD
 *         status:
 *           type: string
 *           enum: [created, paid, failed, refunded]
 *           example: created
 *         item:
 *           type: object
 *           oneOf:
 *             - type: object
 *               properties:
 *                 courseId:
 *                   type: string
 *                   example: 507f1f77bcf86cd799439012
 *                 courseTitle:
 *                   type: string
 *                   example: Introduction to JavaScript
 *             - type: object
 *               properties:
 *                 planId:
 *                   type: string
 *                   example: basic_monthly
 *                 planName:
 *                   type: string
 *                   example: Basic Monthly
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439013
 *             email:
 *               type: string
 *               example: john.doe@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:00:00.000Z
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:15:00.000Z
 *     
 *     Payment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439014
 *         paymentId:
 *           type: string
 *           example: pay_JIISix5XTjCZQW
 *         orderId:
 *           type: string
 *           example: order_JIISQmDAFuqKVF
 *         type:
 *           type: string
 *           enum: [course, subscription]
 *           example: course
 *         amount:
 *           type: number
 *           example: 49.99
 *         currency:
 *           type: string
 *           example: USD
 *         status:
 *           type: string
 *           enum: [success, failed, pending, refunded]
 *           example: success
 *         method:
 *           type: string
 *           example: card
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439013
 *             firstName:
 *               type: string
 *               example: John
 *             lastName:
 *               type: string
 *               example: Doe
 *             email:
 *               type: string
 *               example: john.doe@example.com
 *         item:
 *           type: object
 *           oneOf:
 *             - type: object
 *               properties:
 *                 course:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439012
 *                     title:
 *                       type: string
 *                       example: Introduction to JavaScript
 *                     instructor:
 *                       type: string
 *                       example: Jane Smith
 *             - type: object
 *               properties:
 *                 subscription:
 *                   type: object
 *                   properties:
 *                     planId:
 *                       type: string
 *                       example: basic_monthly
 *                     planName:
 *                       type: string
 *                       example: Basic Monthly
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T00:00:00.000Z
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-02-15T00:00:00.000Z
 *         gateway:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: Razorpay
 *             transactionId:
 *               type: string
 *               example: pay_JIISix5XTjCZQW
 *             signature:
 *               type: string
 *               example: 9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d
 *         refund:
 *           type: object
 *           properties:
 *             refundId:
 *               type: string
 *               example: rfnd_JIJq1Y4rxH7rnJ
 *             amount:
 *               type: number
 *               example: 49.99
 *             reason:
 *               type: string
 *               example: Customer request
 *             refundedAt:
 *               type: string
 *               format: date-time
 *               example: 2024-01-16T10:00:00.000Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:00:00.000Z
 *     
 *     ActiveSubscription:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439015
 *         user:
 *           type: string
 *           example: 507f1f77bcf86cd799439013
 *         plan:
 *           $ref: '#/components/schemas/SubscriptionPlan'
 *         status:
 *           type: string
 *           enum: [active, cancelled, expired]
 *           example: active
 *         startDate:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T00:00:00.000Z
 *         endDate:
 *           type: string
 *           format: date-time
 *           example: 2024-02-15T00:00:00.000Z
 *         autoRenew:
 *           type: boolean
 *           example: true
 *         paymentHistory:
 *           type: array
 *           items:
 *             type: string
 *           example: [507f1f77bcf86cd799439014]
 *         features:
 *           type: object
 *           properties:
 *             coursesAccessedThisMonth:
 *               type: integer
 *               example: 3
 *             coursesRemainingThisMonth:
 *               type: integer
 *               example: 2
 */

/**
 * @swagger
 * /payments/plans:
 *   get:
 *     summary: Get all subscription plans
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Subscription plans retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     plans:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/SubscriptionPlan'
 */

/**
 * @swagger
 * /payments/order/course:
 *   post:
 *     summary: Create payment order for course
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *               couponCode:
 *                 type: string
 *                 example: SAVE20
 *     responses:
 *       200:
 *         description: Payment order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: order_JIISQmDAFuqKVF
 *                         amount:
 *                           type: integer
 *                           description: Amount in smallest currency unit (e.g., cents)
 *                           example: 4999
 *                         currency:
 *                           type: string
 *                           example: USD
 *                         receipt:
 *                           type: string
 *                           example: course_507f1f77bcf86cd799439012
 *                         status:
 *                           type: string
 *                           example: created
 *                         created_at:
 *                           type: integer
 *                           example: 1642345678
 *                     course:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439012
 *                         title:
 *                           type: string
 *                           example: Introduction to JavaScript
 *                         price:
 *                           type: number
 *                           example: 49.99
 *                         discount:
 *                           type: object
 *                           properties:
 *                             amount:
 *                               type: number
 *                               example: 10.00
 *                             code:
 *                               type: string
 *                               example: SAVE20
 *                 message:
 *                   type: string
 *                   example: Payment order created successfully
 *       400:
 *         description: Invalid course or already enrolled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /payments/order/subscription:
 *   post:
 *     summary: Create payment order for subscription
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planId
 *             properties:
 *               planId:
 *                 type: string
 *                 enum: [basic_monthly, basic_yearly, premium_monthly, premium_yearly]
 *                 example: basic_monthly
 *               couponCode:
 *                 type: string
 *                 example: FIRSTMONTH50
 *     responses:
 *       200:
 *         description: Subscription order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     order:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: order_JIISQmDAFuqKVG
 *                         amount:
 *                           type: integer
 *                           description: Amount in smallest currency unit
 *                           example: 999
 *                         currency:
 *                           type: string
 *                           example: USD
 *                         receipt:
 *                           type: string
 *                           example: sub_basic_monthly
 *                         status:
 *                           type: string
 *                           example: created
 *                     plan:
 *                       $ref: '#/components/schemas/SubscriptionPlan'
 *                 message:
 *                   type: string
 *                   example: Subscription order created successfully
 *       400:
 *         description: Invalid plan or already subscribed
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /payments/verify:
 *   post:
 *     summary: Verify payment after completion
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razorpay_order_id
 *               - razorpay_payment_id
 *               - razorpay_signature
 *               - type
 *               - itemId
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *                 example: order_JIISQmDAFuqKVF
 *               razorpay_payment_id:
 *                 type: string
 *                 example: pay_JIISix5XTjCZQW
 *               razorpay_signature:
 *                 type: string
 *                 example: 9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d
 *               type:
 *                 type: string
 *                 enum: [course, subscription]
 *                 example: course
 *               itemId:
 *                 type: string
 *                 description: Course ID or Plan ID
 *                 example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     payment:
 *                       $ref: '#/components/schemas/Payment'
 *                     enrollment:
 *                       type: object
 *                       description: Present for course payments
 *                       properties:
 *                         courseId:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439012
 *                         enrolledAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-01-15T10:00:00.000Z
 *                     subscription:
 *                       type: object
 *                       description: Present for subscription payments
 *                       properties:
 *                         planId:
 *                           type: string
 *                           example: basic_monthly
 *                         startDate:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-01-15T00:00:00.000Z
 *                         endDate:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-02-15T00:00:00.000Z
 *                 message:
 *                   type: string
 *                   example: Payment successful! You are now enrolled in the course.
 *       400:
 *         description: Invalid payment signature or verification failed
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /payments/history:
 *   get:
 *     summary: Get user's payment history
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [course, subscription, all]
 *           default: all
 *         description: Filter by payment type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [success, failed, pending, refunded, all]
 *           default: all
 *         description: Filter by payment status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-01-01
 *         description: Filter payments from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-12-31
 *         description: Filter payments until this date
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     payments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Payment'
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalAmount:
 *                           type: number
 *                           example: 299.95
 *                         totalTransactions:
 *                           type: integer
 *                           example: 6
 *                         coursesPurchased:
 *                           type: integer
 *                           example: 5
 *                         activeSubscription:
 *                           type: boolean
 *                           example: true
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 20
 *                         total:
 *                           type: integer
 *                           example: 6
 *                         pages:
 *                           type: integer
 *                           example: 1
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /payments/history/{userId}:
 *   get:
 *     summary: Get user's payment history (admin only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *     responses:
 *       200:
 *         description: User payment history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439013
 *                         firstName:
 *                           type: string
 *                           example: John
 *                         lastName:
 *                           type: string
 *                           example: Doe
 *                         email:
 *                           type: string
 *                           example: john.doe@example.com
 *                     payments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Payment'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 20
 *                         total:
 *                           type: integer
 *                           example: 8
 *                         pages:
 *                           type: integer
 *                           example: 1
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /payments/subscription/cancel:
 *   post:
 *     summary: Cancel active subscription
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: Not using the service anymore
 *               feedback:
 *                 type: string
 *                 example: The courses were great but I don't have time
 *     responses:
 *       200:
 *         description: Subscription cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     subscription:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: cancelled
 *                         endDate:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-02-15T00:00:00.000Z
 *                         cancelledAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-01-20T10:00:00.000Z
 *                 message:
 *                   type: string
 *                   example: Subscription cancelled. You will continue to have access until 2024-02-15
 *       400:
 *         description: No active subscription found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /payments/refund:
 *   post:
 *     summary: Process refund (admin only)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentId
 *               - amount
 *               - reason
 *             properties:
 *               paymentId:
 *                 type: string
 *                 example: pay_JIISix5XTjCZQW
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 example: 49.99
 *               reason:
 *                 type: string
 *                 example: Customer request - course content not as described
 *               notes:
 *                 type: string
 *                 example: Approved by support team
 *     responses:
 *       200:
 *         description: Refund processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     refund:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: rfnd_JIJq1Y4rxH7rnJ
 *                         paymentId:
 *                           type: string
 *                           example: pay_JIISix5XTjCZQW
 *                         amount:
 *                           type: number
 *                           example: 49.99
 *                         currency:
 *                           type: string
 *                           example: USD
 *                         status:
 *                           type: string
 *                           example: processed
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-01-16T10:00:00.000Z
 *                     enrollment:
 *                       type: object
 *                       description: Present if course enrollment was revoked
 *                       properties:
 *                         courseId:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439012
 *                         revokedAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-01-16T10:00:00.000Z
 *                 message:
 *                   type: string
 *                   example: Refund processed successfully
 *       400:
 *         description: Invalid refund amount or payment already refunded
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Payment not found
 */

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Payment gateway webhook endpoint
 *     tags: [Payments]
 *     description: Webhook endpoint for payment gateway notifications. This endpoint verifies the webhook signature.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Webhook payload from payment gateway
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *       400:
 *         description: Invalid webhook signature
 */

/**
 * @swagger
 * /payments/subscription/status:
 *   get:
 *     summary: Get current subscription status
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     hasActiveSubscription:
 *                       type: boolean
 *                       example: true
 *                     subscription:
 *                       $ref: '#/components/schemas/ActiveSubscription'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /payments/invoice/{paymentId}:
 *   get:
 *     summary: Download payment invoice
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Invoice PDF generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only download own invoices
 *       404:
 *         description: Payment not found
 */