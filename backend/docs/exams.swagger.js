/**
 * @swagger
 * components:
 *   schemas:
 *     Exam:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         title:
 *           type: string
 *           example: JavaScript Fundamentals Quiz
 *         description:
 *           type: string
 *           example: Test your knowledge of JavaScript basics
 *         course:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439012
 *             title:
 *               type: string
 *               example: Introduction to JavaScript
 *         instructor:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439013
 *             firstName:
 *               type: string
 *               example: Jane
 *             lastName:
 *               type: string
 *               example: Smith
 *         type:
 *           type: string
 *           enum: [quiz, midterm, final, practice]
 *           example: quiz
 *         duration:
 *           type: integer
 *           description: Duration in minutes
 *           example: 60
 *         totalPoints:
 *           type: integer
 *           example: 100
 *         passingScore:
 *           type: integer
 *           example: 70
 *         questions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: Question ID
 *                 example: 507f1f77bcf86cd799439014
 *               points:
 *                 type: integer
 *                 example: 10
 *               order:
 *                 type: integer
 *                 example: 1
 *         settings:
 *           type: object
 *           properties:
 *             shuffleQuestions:
 *               type: boolean
 *               example: true
 *             shuffleOptions:
 *               type: boolean
 *               example: true
 *             showResults:
 *               type: string
 *               enum: [immediately, after_submission, after_due_date, never]
 *               example: after_submission
 *             allowReview:
 *               type: boolean
 *               example: true
 *             maxAttempts:
 *               type: integer
 *               minimum: 1
 *               example: 3
 *             timeBetweenAttempts:
 *               type: integer
 *               description: Time in minutes
 *               example: 60
 *         availability:
 *           type: object
 *           properties:
 *             startDate:
 *               type: string
 *               format: date-time
 *               example: 2024-01-15T09:00:00.000Z
 *             endDate:
 *               type: string
 *               format: date-time
 *               example: 2024-01-22T23:59:59.000Z
 *             isPublished:
 *               type: boolean
 *               example: true
 *         instructions:
 *           type: string
 *           example: Read each question carefully. You have 60 minutes to complete this exam.
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: [javascript, basics, variables]
 *         attemptCount:
 *           type: integer
 *           example: 156
 *         averageScore:
 *           type: number
 *           format: float
 *           example: 82.5
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T00:00:00.000Z
 *     
 *     ExamAttempt:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439015
 *         exam:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         student:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439016
 *             firstName:
 *               type: string
 *               example: John
 *             lastName:
 *               type: string
 *               example: Doe
 *         attemptNumber:
 *           type: integer
 *           example: 1
 *         startedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:00:00.000Z
 *         submittedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:45:00.000Z
 *         timeSpent:
 *           type: integer
 *           description: Time spent in seconds
 *           example: 2700
 *         answers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439014
 *               answer:
 *                 type: string
 *                 example: Option A
 *               isCorrect:
 *                 type: boolean
 *                 example: true
 *               pointsAwarded:
 *                 type: integer
 *                 example: 10
 *               timeTaken:
 *                 type: integer
 *                 description: Time in seconds
 *                 example: 45
 *         score:
 *           type: integer
 *           example: 85
 *         percentage:
 *           type: number
 *           format: float
 *           example: 85.0
 *         passed:
 *           type: boolean
 *           example: true
 *         feedback:
 *           type: string
 *           example: Great job! You demonstrated a strong understanding of JavaScript basics.
 *     
 *     ExamStatistics:
 *       type: object
 *       properties:
 *         examId:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         totalAttempts:
 *           type: integer
 *           example: 156
 *         uniqueStudents:
 *           type: integer
 *           example: 125
 *         averageScore:
 *           type: number
 *           format: float
 *           example: 82.5
 *         highestScore:
 *           type: integer
 *           example: 100
 *         lowestScore:
 *           type: integer
 *           example: 45
 *         passRate:
 *           type: number
 *           format: float
 *           example: 78.5
 *         averageTimeSpent:
 *           type: integer
 *           description: Average time in seconds
 *           example: 2340
 *         questionStatistics:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               questionId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439014
 *               correctRate:
 *                 type: number
 *                 format: float
 *                 example: 85.5
 *               averageTimeSpent:
 *                 type: integer
 *                 example: 45
 *               skippedCount:
 *                 type: integer
 *                 example: 5
 */

/**
 * @swagger
 * /exams:
 *   get:
 *     summary: Get all exams
 *     tags: [Exams]
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
 *         name: course
 *         schema:
 *           type: string
 *         description: Filter by course ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [quiz, midterm, final, practice]
 *         description: Filter by exam type
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         description: Filter by published status
 *       - in: query
 *         name: instructor
 *         schema:
 *           type: string
 *         description: Filter by instructor ID (admin only)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *     responses:
 *       200:
 *         description: Exams retrieved successfully
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
 *                     exams:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Exam'
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
 *                           example: 45
 *                         pages:
 *                           type: integer
 *                           example: 3
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /exams:
 *   post:
 *     summary: Create a new exam
 *     tags: [Exams]
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
 *               - course
 *               - type
 *               - duration
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *                 example: JavaScript Fundamentals Quiz
 *               description:
 *                 type: string
 *                 example: Test your knowledge of JavaScript basics
 *               course:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *               type:
 *                 type: string
 *                 enum: [quiz, midterm, final, practice]
 *                 example: quiz
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 description: Duration in minutes
 *                 example: 60
 *               passingScore:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 70
 *               questions:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - question
 *                     - points
 *                   properties:
 *                     question:
 *                       type: string
 *                       description: Question ID
 *                       example: 507f1f77bcf86cd799439014
 *                     points:
 *                       type: integer
 *                       minimum: 1
 *                       example: 10
 *                     order:
 *                       type: integer
 *                       example: 1
 *               settings:
 *                 type: object
 *                 properties:
 *                   shuffleQuestions:
 *                     type: boolean
 *                     default: false
 *                     example: true
 *                   shuffleOptions:
 *                     type: boolean
 *                     default: false
 *                     example: true
 *                   showResults:
 *                     type: string
 *                     enum: [immediately, after_submission, after_due_date, never]
 *                     default: after_submission
 *                     example: after_submission
 *                   allowReview:
 *                     type: boolean
 *                     default: true
 *                     example: true
 *                   maxAttempts:
 *                     type: integer
 *                     minimum: 1
 *                     default: 1
 *                     example: 3
 *                   timeBetweenAttempts:
 *                     type: integer
 *                     description: Time in minutes
 *                     example: 60
 *               availability:
 *                 type: object
 *                 properties:
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-01-15T09:00:00.000Z
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-01-22T23:59:59.000Z
 *               instructions:
 *                 type: string
 *                 example: Read each question carefully. You have 60 minutes to complete this exam.
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [javascript, basics, variables]
 *     responses:
 *       201:
 *         description: Exam created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Exam'
 *                 message:
 *                   type: string
 *                   example: Exam created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Teacher or admin access required
 *       404:
 *         description: Course or questions not found
 */

/**
 * @swagger
 * /exams/{id}:
 *   get:
 *     summary: Get exam by ID
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: Exam retrieved successfully
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
 *                     - $ref: '#/components/schemas/Exam'
 *                     - type: object
 *                       properties:
 *                         questions:
 *                           type: array
 *                           description: Full question details (only for instructors)
 *                           items:
 *                             type: object
 *                             properties:
 *                               question:
 *                                 $ref: '#/components/schemas/Question'
 *                               points:
 *                                 type: integer
 *                                 example: 10
 *                               order:
 *                                 type: integer
 *                                 example: 1
 *                         canAttempt:
 *                           type: boolean
 *                           description: Whether current user can attempt the exam
 *                           example: true
 *                         attemptsRemaining:
 *                           type: integer
 *                           example: 2
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not enrolled in course
 *       404:
 *         description: Exam not found
 */

/**
 * @swagger
 * /exams/{id}:
 *   put:
 *     summary: Update exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: JavaScript Advanced Concepts Quiz
 *               description:
 *                 type: string
 *                 example: Test your knowledge of advanced JavaScript concepts
 *               type:
 *                 type: string
 *                 enum: [quiz, midterm, final, practice]
 *                 example: quiz
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 example: 90
 *               passingScore:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 80
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                     points:
 *                       type: integer
 *                     order:
 *                       type: integer
 *               settings:
 *                 type: object
 *                 properties:
 *                   shuffleQuestions:
 *                     type: boolean
 *                   shuffleOptions:
 *                     type: boolean
 *                   showResults:
 *                     type: string
 *                     enum: [immediately, after_submission, after_due_date, never]
 *                   allowReview:
 *                     type: boolean
 *                   maxAttempts:
 *                     type: integer
 *                   timeBetweenAttempts:
 *                     type: integer
 *               availability:
 *                 type: object
 *                 properties:
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                   isPublished:
 *                     type: boolean
 *               instructions:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Exam updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Exam'
 *                 message:
 *                   type: string
 *                   example: Exam updated successfully
 *       400:
 *         description: Validation error or exam has attempts
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only exam creator or admin can update
 *       404:
 *         description: Exam not found
 */

/**
 * @swagger
 * /exams/{id}:
 *   delete:
 *     summary: Delete exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: Exam deleted successfully
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
 *                   example: Exam deleted successfully
 *       400:
 *         description: Cannot delete exam with attempts
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only exam creator or admin can delete
 *       404:
 *         description: Exam not found
 */

/**
 * @swagger
 * /exams/{id}/start:
 *   post:
 *     summary: Start exam attempt
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: Exam attempt started successfully
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
 *                     attemptId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439015
 *                     exam:
 *                       type: object
 *                       properties:
 *                         title:
 *                           type: string
 *                           example: JavaScript Fundamentals Quiz
 *                         duration:
 *                           type: integer
 *                           example: 60
 *                         totalQuestions:
 *                           type: integer
 *                           example: 20
 *                         totalPoints:
 *                           type: integer
 *                           example: 100
 *                     questions:
 *                       type: array
 *                       description: Questions without correct answers
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 507f1f77bcf86cd799439014
 *                           text:
 *                             type: string
 *                             example: What is the correct syntax for declaring a variable?
 *                           type:
 *                             type: string
 *                             example: multiple_choice
 *                           options:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                 text:
 *                                   type: string
 *                           points:
 *                             type: integer
 *                             example: 10
 *                           order:
 *                             type: integer
 *                             example: 1
 *                     startedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T10:00:00.000Z
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-01-15T11:00:00.000Z
 *                 message:
 *                   type: string
 *                   example: Exam started successfully. Good luck!
 *       400:
 *         description: Cannot start exam (not available, max attempts reached, etc.)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not enrolled in course
 *       404:
 *         description: Exam not found
 */

/**
 * @swagger
 * /exams/{id}/submit:
 *   post:
 *     summary: Submit exam attempt
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attemptId
 *               - answers
 *             properties:
 *               attemptId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439015
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - questionId
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439014
 *                     answer:
 *                       oneOf:
 *                         - type: string
 *                           description: For multiple choice or true/false
 *                           example: option_1
 *                         - type: array
 *                           description: For multiple select
 *                           items:
 *                             type: string
 *                           example: [option_1, option_3]
 *                         - type: string
 *                           description: For short answer or essay
 *                           example: JavaScript is a programming language
 *     responses:
 *       200:
 *         description: Exam submitted successfully
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
 *                     attemptId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439015
 *                     score:
 *                       type: integer
 *                       example: 85
 *                     percentage:
 *                       type: number
 *                       format: float
 *                       example: 85.0
 *                     passed:
 *                       type: boolean
 *                       example: true
 *                     totalQuestions:
 *                       type: integer
 *                       example: 20
 *                     correctAnswers:
 *                       type: integer
 *                       example: 17
 *                     timeSpent:
 *                       type: integer
 *                       description: Time in seconds
 *                       example: 2700
 *                     showResults:
 *                       type: boolean
 *                       example: true
 *                     allowReview:
 *                       type: boolean
 *                       example: true
 *                 message:
 *                   type: string
 *                   example: Exam submitted successfully. You scored 85/100 (85%)
 *       400:
 *         description: Invalid attempt or answers
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Attempt not found or already submitted
 *       404:
 *         description: Exam not found
 */

/**
 * @swagger
 * /exams/{id}/attempts:
 *   get:
 *     summary: Get user's exam attempts
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: Attempts retrieved successfully
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
 *                     attempts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 507f1f77bcf86cd799439015
 *                           attemptNumber:
 *                             type: integer
 *                             example: 1
 *                           startedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-01-15T10:00:00.000Z
 *                           submittedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-01-15T10:45:00.000Z
 *                           score:
 *                             type: integer
 *                             example: 85
 *                           percentage:
 *                             type: number
 *                             format: float
 *                             example: 85.0
 *                           passed:
 *                             type: boolean
 *                             example: true
 *                           timeSpent:
 *                             type: integer
 *                             example: 2700
 *                     maxAttempts:
 *                       type: integer
 *                       example: 3
 *                     attemptsRemaining:
 *                       type: integer
 *                       example: 2
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Exam not found
 */

/**
 * @swagger
 * /exams/{id}/attempt/{attemptId}:
 *   get:
 *     summary: Get detailed exam attempt results
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *       - in: path
 *         name: attemptId
 *         required: true
 *         schema:
 *           type: string
 *         description: Attempt ID
 *     responses:
 *       200:
 *         description: Attempt details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ExamAttempt'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Can only view own attempts or instructor/admin
 *       404:
 *         description: Exam or attempt not found
 */

/**
 * @swagger
 * /exams/{id}/statistics:
 *   get:
 *     summary: Get exam statistics (instructor/admin only)
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
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
 *                   $ref: '#/components/schemas/ExamStatistics'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only exam creator or admin can view statistics
 *       404:
 *         description: Exam not found
 */

/**
 * @swagger
 * /exams/{id}/students:
 *   get:
 *     summary: Get exam student attempts (instructor/admin only)
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
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
 *           maximum: 100
 *           default: 20
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, passed, failed, not_attempted]
 *           default: all
 *     responses:
 *       200:
 *         description: Student attempts retrieved successfully
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
 *                     students:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           student:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 507f1f77bcf86cd799439016
 *                               firstName:
 *                                 type: string
 *                                 example: John
 *                               lastName:
 *                                 type: string
 *                                 example: Doe
 *                               email:
 *                                 type: string
 *                                 example: john.doe@example.com
 *                           attempts:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 attemptNumber:
 *                                   type: integer
 *                                   example: 1
 *                                 submittedAt:
 *                                   type: string
 *                                   format: date-time
 *                                 score:
 *                                   type: integer
 *                                   example: 85
 *                                 passed:
 *                                   type: boolean
 *                                   example: true
 *                           bestScore:
 *                             type: integer
 *                             example: 85
 *                           lastAttempt:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-01-15T10:45:00.000Z
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
 *                           example: 125
 *                         pages:
 *                           type: integer
 *                           example: 7
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only exam creator or admin can view
 *       404:
 *         description: Exam not found
 */