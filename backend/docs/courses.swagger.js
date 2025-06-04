/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         title:
 *           type: string
 *           minLength: 5
 *           maxLength: 100
 *           example: Introduction to JavaScript
 *         description:
 *           type: string
 *           minLength: 20
 *           maxLength: 1000
 *           example: Learn the fundamentals of JavaScript programming language
 *         instructor:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439012
 *             firstName:
 *               type: string
 *               example: Jane
 *             lastName:
 *               type: string
 *               example: Smith
 *             email:
 *               type: string
 *               example: jane.smith@example.com
 *         category:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439013
 *             name:
 *               type: string
 *               example: Programming
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced, all_levels]
 *           example: beginner
 *         pricing:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [free, one_time, subscription]
 *               example: one_time
 *             amount:
 *               type: number
 *               minimum: 0
 *               example: 49.99
 *             currency:
 *               type: string
 *               default: USD
 *               example: USD
 *         thumbnail:
 *           type: string
 *           example: /uploads/thumbnails/course-thumbnail.jpg
 *         duration:
 *           type: integer
 *           description: Total duration in minutes
 *           example: 480
 *         isPublished:
 *           type: boolean
 *           example: true
 *         enrollmentCount:
 *           type: integer
 *           example: 156
 *         rating:
 *           type: object
 *           properties:
 *             average:
 *               type: number
 *               minimum: 0
 *               maximum: 5
 *               example: 4.5
 *             count:
 *               type: integer
 *               example: 42
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T00:00:00.000Z
 *     
 *     Module:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439014
 *         title:
 *           type: string
 *           example: Getting Started with Variables
 *         description:
 *           type: string
 *           maxLength: 500
 *           example: Learn about JavaScript variables, data types, and basic operations
 *         order:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         lessons:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Lesson'
 *     
 *     Lesson:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439015
 *         title:
 *           type: string
 *           example: Understanding let, const, and var
 *         type:
 *           type: string
 *           enum: [video, text, quiz, assignment]
 *           example: video
 *         content:
 *           type: string
 *           example: https://example.com/videos/lesson1.mp4
 *         estimatedDuration:
 *           type: integer
 *           minimum: 1
 *           description: Duration in minutes
 *           example: 15
 *         order:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         resources:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Lesson Slides
 *               url:
 *                 type: string
 *                 example: /uploads/materials/lesson1-slides.pdf
 *               type:
 *                 type: string
 *                 example: pdf
 *     
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439016
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439017
 *             firstName:
 *               type: string
 *               example: John
 *             lastName:
 *               type: string
 *               example: Doe
 *             avatar:
 *               type: string
 *               example: /uploads/avatars/user-avatar.jpg
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         comment:
 *           type: string
 *           maxLength: 1000
 *           example: Excellent course! Very well structured and easy to follow.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-10T00:00:00.000Z
 *     
 *     CourseStatistics:
 *       type: object
 *       properties:
 *         enrollmentCount:
 *           type: integer
 *           example: 156
 *         completionRate:
 *           type: number
 *           format: float
 *           example: 72.5
 *         averageProgress:
 *           type: number
 *           format: float
 *           example: 65.3
 *         revenueGenerated:
 *           type: number
 *           format: float
 *           example: 7798.44
 *         studentSatisfaction:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 5
 *           example: 4.5
 *         moduleCompletion:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               moduleId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439014
 *               title:
 *                 type: string
 *                 example: Getting Started with Variables
 *               completionRate:
 *                 type: number
 *                 format: float
 *                 example: 85.2
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *       - {}
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
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced, all_levels]
 *         description: Filter by difficulty level
 *       - in: query
 *         name: pricing
 *         schema:
 *           type: string
 *           enum: [free, paid]
 *         description: Filter by pricing type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, enrollmentCount, rating, price]
 *           default: createdAt
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
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
 *                     courses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Course'
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
 *                           example: 85
 *                         pages:
 *                           type: integer
 *                           example: 5
 *       400:
 *         description: Invalid query parameters
 */

/**
 * @swagger
 * /courses/{courseId}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *       - {}
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course retrieved successfully
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
 *                   allOf:
 *                     - $ref: '#/components/schemas/Course'
 *                     - type: object
 *                       properties:
 *                         modules:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Module'
 *                         isEnrolled:
 *                           type: boolean
 *                           example: false
 *                           description: Only present if user is authenticated
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - level
 *               - pricing
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *                 example: Introduction to JavaScript
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 1000
 *                 example: Learn the fundamentals of JavaScript programming language
 *               category:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439013
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced, all_levels]
 *                 example: beginner
 *               pricing:
 *                 type: object
 *                 required:
 *                   - type
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [free, one_time, subscription]
 *                     example: one_time
 *                   amount:
 *                     type: number
 *                     minimum: 0
 *                     example: 49.99
 *               duration:
 *                 type: integer
 *                 description: Total duration in minutes
 *                 example: 480
 *               requirements:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Basic computer skills", "Internet connection"]
 *               objectives:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Understand JavaScript basics", "Write simple programs"]
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *                 message:
 *                   type: string
 *                   example: Course created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Teacher or admin access required
 */

/**
 * @swagger
 * /courses/{courseId}:
 *   put:
 *     summary: Update course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *                 example: Advanced JavaScript Concepts
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 1000
 *                 example: Master advanced JavaScript concepts and patterns
 *               category:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439013
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced, all_levels]
 *                 example: advanced
 *               pricing:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [free, one_time, subscription]
 *                     example: one_time
 *                   amount:
 *                     type: number
 *                     minimum: 0
 *                     example: 99.99
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *                 message:
 *                   type: string
 *                   example: Course updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only course instructor or admin can update
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /courses/{courseId}:
 *   delete:
 *     summary: Delete course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
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
 *                   example: Course deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only course instructor or admin can delete
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /courses/{courseId}/publish:
 *   post:
 *     summary: Publish or unpublish course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isPublished
 *             properties:
 *               isPublished:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Course publish status updated
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
 *                     isPublished:
 *                       type: boolean
 *                       example: true
 *                 message:
 *                   type: string
 *                   example: Course published successfully
 *       400:
 *         description: Course not ready for publishing (missing required content)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only course instructor or admin can publish
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /courses/{courseId}/thumbnail:
 *   post:
 *     summary: Upload course thumbnail
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, GIF)
 *     responses:
 *       200:
 *         description: Thumbnail uploaded successfully
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
 *                     thumbnailUrl:
 *                       type: string
 *                       example: /uploads/thumbnails/course-thumbnail.jpg
 *                 message:
 *                   type: string
 *                   example: Thumbnail uploaded successfully
 *       400:
 *         description: Invalid file type or size
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only course instructor or admin can upload
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /courses/{courseId}/modules:
 *   post:
 *     summary: Add module to course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Getting Started with Variables
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: Learn about JavaScript variables, data types, and basic operations
 *               order:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *     responses:
 *       201:
 *         description: Module added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Module'
 *                 message:
 *                   type: string
 *                   example: Module added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only course instructor or admin can add modules
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /courses/{courseId}/modules/{moduleId}:
 *   put:
 *     summary: Update course module
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Variables and Data Types
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 example: Deep dive into JavaScript variables and data types
 *               order:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       200:
 *         description: Module updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Module'
 *                 message:
 *                   type: string
 *                   example: Module updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Course or module not found
 */

/**
 * @swagger
 * /courses/{courseId}/modules/{moduleId}:
 *   delete:
 *     summary: Delete course module
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     responses:
 *       200:
 *         description: Module deleted successfully
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
 *                   example: Module deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Course or module not found
 */

/**
 * @swagger
 * /courses/{courseId}/modules/{moduleId}/lessons:
 *   post:
 *     summary: Add lesson to module
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 example: Understanding let, const, and var
 *               type:
 *                 type: string
 *                 enum: [video, text, quiz, assignment]
 *                 example: video
 *               content:
 *                 type: string
 *                 example: https://example.com/videos/lesson1.mp4
 *               estimatedDuration:
 *                 type: integer
 *                 minimum: 1
 *                 description: Duration in minutes
 *                 example: 15
 *               order:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *     responses:
 *       201:
 *         description: Lesson added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Lesson'
 *                 message:
 *                   type: string
 *                   example: Lesson added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Course or module not found
 */

/**
 * @swagger
 * /courses/{courseId}/materials:
 *   post:
 *     summary: Upload course materials
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               materials:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Course material files (PDF, DOC, ZIP, etc.)
 *     responses:
 *       200:
 *         description: Materials uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       filename:
 *                         type: string
 *                         example: material-1234567890.pdf
 *                       originalName:
 *                         type: string
 *                         example: course-slides.pdf
 *                       size:
 *                         type: integer
 *                         example: 1048576
 *                       path:
 *                         type: string
 *                         example: /uploads/materials/material-1234567890.pdf
 *       400:
 *         description: Invalid file type or size
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /courses/{courseId}/enroll:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Enrolled successfully
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
 *                     enrollmentId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439018
 *                     enrolledAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T10:00:00.000Z
 *                 message:
 *                   type: string
 *                   example: Enrolled in course successfully
 *       400:
 *         description: Already enrolled or course not available
 *       401:
 *         description: Unauthorized
 *       402:
 *         description: Payment required for paid course
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /courses/enrolled/my-courses:
 *   get:
 *     summary: Get user's enrolled courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, all]
 *           default: all
 *     responses:
 *       200:
 *         description: Enrolled courses retrieved successfully
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
 *                     courses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         allOf:
 *                           - $ref: '#/components/schemas/Course'
 *                           - type: object
 *                             properties:
 *                               progress:
 *                                 type: number
 *                                 format: float
 *                                 example: 65.5
 *                               enrolledAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: 2024-01-01T00:00:00.000Z
 *                               lastAccessedAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: 2024-01-15T00:00:00.000Z
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
 *                           example: 12
 *                         pages:
 *                           type: integer
 *                           example: 1
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /courses/enrolled/{userId}:
 *   get:
 *     summary: Get user's enrolled courses (admin/teacher)
 *     tags: [Courses]
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
 *         description: User's enrolled courses retrieved successfully
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
 *                     courses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Course'
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
 *                           example: 5
 *                         pages:
 *                           type: integer
 *                           example: 1
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or teacher access required
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /courses/instructor/my-courses:
 *   get:
 *     summary: Get instructor's courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         description: Filter by published status
 *     responses:
 *       200:
 *         description: Instructor courses retrieved successfully
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
 *                     courses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Course'
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
 *         description: Forbidden - Teacher or admin access required
 */

/**
 * @swagger
 * /courses/instructor/{instructorId}:
 *   get:
 *     summary: Get courses by instructor
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: instructorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Instructor ID
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
 *         description: Instructor courses retrieved successfully
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
 *                     instructor:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439012
 *                         firstName:
 *                           type: string
 *                           example: Jane
 *                         lastName:
 *                           type: string
 *                           example: Smith
 *                         avatar:
 *                           type: string
 *                           example: /uploads/avatars/instructor-avatar.jpg
 *                     courses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Course'
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
 *                           example: 5
 *                         pages:
 *                           type: integer
 *                           example: 1
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Instructor not found
 */

/**
 * @swagger
 * /courses/{courseId}/reviews:
 *   post:
 *     summary: Add course review
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *                 example: Excellent course! Very well structured and easy to follow.
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *                 message:
 *                   type: string
 *                   example: Review added successfully
 *       400:
 *         description: Already reviewed or not enrolled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */

/**
 * @swagger
 * /courses/{courseId}/statistics:
 *   get:
 *     summary: Get course statistics
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/CourseStatistics'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only course instructor or admin can view statistics
 *       404:
 *         description: Course not found
 */