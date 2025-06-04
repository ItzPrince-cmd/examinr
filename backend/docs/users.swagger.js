/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         role:
 *           type: string
 *           enum: [student, teacher, admin, superadmin]
 *           example: student
 *         avatar:
 *           type: string
 *           example: /uploads/avatars/avatar-507f1f77bcf86cd799439011.jpg
 *         profile:
 *           type: object
 *           properties:
 *             bio:
 *               type: string
 *               example: Passionate learner and educator
 *             dateOfBirth:
 *               type: string
 *               format: date
 *               example: 1990-01-01
 *             phone:
 *               type: object
 *               properties:
 *                 countryCode:
 *                   type: string
 *                   example: +1
 *                 number:
 *                   type: string
 *                   example: 5551234567
 *             address:
 *               type: object
 *               properties:
 *                 street:
 *                   type: string
 *                   example: 123 Main St
 *                 city:
 *                   type: string
 *                   example: New York
 *                 state:
 *                   type: string
 *                   example: NY
 *                 country:
 *                   type: string
 *                   example: USA
 *                 zipCode:
 *                   type: string
 *                   example: 10001
 *         preferences:
 *           type: object
 *           properties:
 *             language:
 *               type: string
 *               example: en
 *             theme:
 *               type: string
 *               enum: [light, dark]
 *               example: light
 *             emailNotifications:
 *               type: boolean
 *               example: true
 *             pushNotifications:
 *               type: boolean
 *               example: false
 *         isActive:
 *           type: boolean
 *           example: true
 *         isEmailVerified:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T00:00:00.000Z
 *     
 *     LearningProgress:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         enrolledCourses:
 *           type: integer
 *           example: 12
 *         completedCourses:
 *           type: integer
 *           example: 5
 *         totalQuizzesTaken:
 *           type: integer
 *           example: 45
 *         averageScore:
 *           type: number
 *           format: float
 *           example: 85.5
 *         totalStudyTime:
 *           type: integer
 *           description: Total study time in minutes
 *           example: 3600
 *         achievements:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Fast Learner
 *               description:
 *                 type: string
 *                 example: Completed 5 courses in 30 days
 *               earnedAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-01-15T00:00:00.000Z
 *         recentActivity:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [course_enrolled, course_completed, quiz_taken, lesson_completed]
 *                 example: quiz_taken
 *               title:
 *                 type: string
 *                 example: JavaScript Fundamentals Quiz
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-01-15T10:30:00.000Z
 *               score:
 *                 type: number
 *                 example: 90
 *     
 *     UserStatistics:
 *       type: object
 *       properties:
 *         totalUsers:
 *           type: integer
 *           example: 1500
 *         activeUsers:
 *           type: integer
 *           example: 1200
 *         usersByRole:
 *           type: object
 *           properties:
 *             student:
 *               type: integer
 *               example: 1300
 *             teacher:
 *               type: integer
 *               example: 150
 *             admin:
 *               type: integer
 *               example: 45
 *             superadmin:
 *               type: integer
 *               example: 5
 *         newUsersThisMonth:
 *           type: integer
 *           example: 125
 *         verifiedEmails:
 *           type: integer
 *           example: 1350
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               profile:
 *                 type: object
 *                 properties:
 *                   bio:
 *                     type: string
 *                     maxLength: 500
 *                     example: Passionate learner and educator
 *                   dateOfBirth:
 *                     type: string
 *                     format: date
 *                     example: 1990-01-01
 *                   phone:
 *                     type: object
 *                     properties:
 *                       countryCode:
 *                         type: string
 *                         example: +1
 *                       number:
 *                         type: string
 *                         example: 5551234567
 *                   address:
 *                     type: object
 *                     properties:
 *                       street:
 *                         type: string
 *                         example: 123 Main St
 *                       city:
 *                         type: string
 *                         example: New York
 *                       state:
 *                         type: string
 *                         example: NY
 *                       country:
 *                         type: string
 *                         example: USA
 *                       zipCode:
 *                         type: string
 *                         example: 10001
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /users/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, GIF)
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
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
 *                     avatarUrl:
 *                       type: string
 *                       example: /uploads/avatars/avatar-507f1f77bcf86cd799439011.jpg
 *                 message:
 *                   type: string
 *                   example: Avatar uploaded successfully
 *       400:
 *         description: Invalid file type or size
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /users/avatar:
 *   delete:
 *     summary: Delete user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Avatar deleted successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /users/preferences:
 *   put:
 *     summary: Update user preferences
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *                 example: en
 *               theme:
 *                 type: string
 *                 enum: [light, dark]
 *                 example: dark
 *               emailNotifications:
 *                 type: boolean
 *                 example: true
 *               pushNotifications:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Preferences updated successfully
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
 *                     preferences:
 *                       type: object
 *                       properties:
 *                         language:
 *                           type: string
 *                           example: en
 *                         theme:
 *                           type: string
 *                           example: dark
 *                         emailNotifications:
 *                           type: boolean
 *                           example: true
 *                         pushNotifications:
 *                           type: boolean
 *                           example: false
 *                 message:
 *                   type: string
 *                   example: Preferences updated successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /users/learning-progress:
 *   get:
 *     summary: Get current user's learning progress
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Learning progress retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/LearningProgress'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /users/learning-progress/{userId}:
 *   get:
 *     summary: Get specific user's learning progress
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Learning progress retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/LearningProgress'
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only access own progress unless admin
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
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
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [student, teacher, admin, superadmin]
 *         description: Filter by role
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: isEmailVerified
 *         schema:
 *           type: boolean
 *         description: Filter by email verification status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserProfile'
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
 *                           example: 150
 *                         pages:
 *                           type: integer
 *                           example: 8
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /users/statistics:
 *   get:
 *     summary: Get user statistics (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserStatistics'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /users/bulk-operation:
 *   post:
 *     summary: Perform bulk operations on users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - operation
 *               - userIds
 *             properties:
 *               operation:
 *                 type: string
 *                 enum: [activate, deactivate, delete, changeRole]
 *                 example: activate
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
 *               newRole:
 *                 type: string
 *                 enum: [student, teacher, admin]
 *                 description: Required when operation is changeRole
 *                 example: teacher
 *     responses:
 *       200:
 *         description: Bulk operation completed successfully
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
 *                     processed:
 *                       type: integer
 *                       example: 2
 *                     failed:
 *                       type: integer
 *                       example: 0
 *                 message:
 *                   type: string
 *                   example: Bulk operation completed successfully
 *       400:
 *         description: Invalid operation or parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: Update user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               role:
 *                 type: string
 *                 enum: [student, teacher, admin]
 *                 example: teacher
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               isEmailVerified:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *       400:
 *         description: Invalid user ID or data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only delete own account or admin access required
 *       404:
 *         description: User not found
 */