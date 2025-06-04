/**
 * @swagger
 * components:
 *   schemas:
 *     ExamResult:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         exam:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439012
 *             title:
 *               type: string
 *               example: JavaScript Fundamentals Quiz
 *             type:
 *               type: string
 *               enum: [quiz, midterm, final, practice]
 *               example: quiz
 *             course:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 507f1f77bcf86cd799439013
 *                 title:
 *                   type: string
 *                   example: Introduction to JavaScript
 *         student:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439014
 *             firstName:
 *               type: string
 *               example: John
 *             lastName:
 *               type: string
 *               example: Doe
 *             email:
 *               type: string
 *               example: john.doe@example.com
 *         attemptNumber:
 *           type: integer
 *           example: 1
 *         score:
 *           type: integer
 *           example: 85
 *         totalPoints:
 *           type: integer
 *           example: 100
 *         percentage:
 *           type: number
 *           format: float
 *           example: 85.0
 *         passed:
 *           type: boolean
 *           example: true
 *         passingScore:
 *           type: integer
 *           example: 70
 *         questionsAnswered:
 *           type: integer
 *           example: 20
 *         totalQuestions:
 *           type: integer
 *           example: 20
 *         correctAnswers:
 *           type: integer
 *           example: 17
 *         timeSpent:
 *           type: integer
 *           description: Time spent in seconds
 *           example: 2700
 *         startedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:00:00.000Z
 *         submittedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:45:00.000Z
 *         questionBreakdown:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               questionId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439015
 *               questionText:
 *                 type: string
 *                 example: What is the correct syntax for declaring a variable?
 *               type:
 *                 type: string
 *                 example: multiple_choice
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 example: easy
 *               points:
 *                 type: integer
 *                 example: 5
 *               pointsAwarded:
 *                 type: integer
 *                 example: 5
 *               isCorrect:
 *                 type: boolean
 *                 example: true
 *               studentAnswer:
 *                 type: string
 *                 example: var myVariable = 5;
 *               correctAnswer:
 *                 type: string
 *                 example: var myVariable = 5;
 *               timeTaken:
 *                 type: integer
 *                 description: Time in seconds
 *                 example: 45
 *         categoryPerformance:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: Variables
 *               questionsCount:
 *                 type: integer
 *                 example: 5
 *               correctCount:
 *                 type: integer
 *                 example: 4
 *               percentage:
 *                 type: number
 *                 format: float
 *                 example: 80.0
 *         feedback:
 *           type: string
 *           example: Great job! You demonstrated strong understanding of JavaScript basics.
 *         certificate:
 *           type: object
 *           properties:
 *             isEligible:
 *               type: boolean
 *               example: true
 *             certificateId:
 *               type: string
 *               example: CERT-2024-0001
 *             issuedAt:
 *               type: string
 *               format: date-time
 *               example: 2024-01-15T11:00:00.000Z
 *             url:
 *               type: string
 *               example: /certificates/CERT-2024-0001.pdf
 *     
 *     UserResultsSummary:
 *       type: object
 *       properties:
 *         totalExamsTaken:
 *           type: integer
 *           example: 25
 *         totalQuizzesTaken:
 *           type: integer
 *           example: 20
 *         averageScore:
 *           type: number
 *           format: float
 *           example: 82.5
 *         passRate:
 *           type: number
 *           format: float
 *           example: 88.0
 *         totalTimeSpent:
 *           type: integer
 *           description: Total time in minutes
 *           example: 1250
 *         strongestCategories:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: Programming
 *               averageScore:
 *                 type: number
 *                 format: float
 *                 example: 90.5
 *         weakestCategories:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: Database
 *               averageScore:
 *                 type: number
 *                 format: float
 *                 example: 65.2
 *         recentResults:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               examTitle:
 *                 type: string
 *                 example: JavaScript Fundamentals Quiz
 *               score:
 *                 type: integer
 *                 example: 85
 *               percentage:
 *                 type: number
 *                 format: float
 *                 example: 85.0
 *               passed:
 *                 type: boolean
 *                 example: true
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-01-15T10:45:00.000Z
 *         progressOverTime:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               month:
 *                 type: string
 *                 example: 2024-01
 *               averageScore:
 *                 type: number
 *                 format: float
 *                 example: 78.5
 *               examsTaken:
 *                 type: integer
 *                 example: 5
 */

/**
 * @swagger
 * /results/my-results:
 *   get:
 *     summary: Get user's exam results
 *     tags: [Results]
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
 *         name: examType
 *         schema:
 *           type: string
 *           enum: [quiz, midterm, final, practice]
 *         description: Filter by exam type
 *       - in: query
 *         name: passed
 *         schema:
 *           type: boolean
 *         description: Filter by pass/fail status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-01-01
 *         description: Filter results from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-12-31
 *         description: Filter results until this date
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, score, percentage]
 *           default: date
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
 *         description: Results retrieved successfully
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
 *                     results:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ExamResult'
 *                     summary:
 *                       $ref: '#/components/schemas/UserResultsSummary'
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
 *                           example: 25
 *                         pages:
 *                           type: integer
 *                           example: 2
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /results/{examId}:
 *   get:
 *     summary: Get specific exam result
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *         description: Exam ID
 *       - in: query
 *         name: attemptNumber
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Specific attempt number (defaults to latest)
 *     responses:
 *       200:
 *         description: Exam result retrieved successfully
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
 *                     - $ref: '#/components/schemas/ExamResult'
 *                     - type: object
 *                       properties:
 *                         showDetailedResults:
 *                           type: boolean
 *                           example: true
 *                           description: Whether detailed question breakdown is available
 *                         comparativeAnalysis:
 *                           type: object
 *                           properties:
 *                             averageScore:
 *                               type: number
 *                               format: float
 *                               example: 75.5
 *                               description: Average score for this exam
 *                             percentile:
 *                               type: integer
 *                               example: 85
 *                               description: User's percentile ranking
 *                             totalAttempts:
 *                               type: integer
 *                               example: 156
 *                               description: Total attempts by all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Results not available yet or no attempts found
 *       404:
 *         description: Exam not found
 */

/**
 * @swagger
 * /results/certificate/{certificateId}:
 *   get:
 *     summary: Download exam certificate
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: certificateId
 *         required: true
 *         schema:
 *           type: string
 *         description: Certificate ID
 *     responses:
 *       200:
 *         description: Certificate PDF generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not eligible for certificate or not your certificate
 *       404:
 *         description: Certificate not found
 */

/**
 * @swagger
 * /results/analytics/performance:
 *   get:
 *     summary: Get detailed performance analytics
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, quarter, year, all]
 *           default: month
 *         description: Time period for analytics
 *     responses:
 *       200:
 *         description: Performance analytics retrieved successfully
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
 *                     overallPerformance:
 *                       type: object
 *                       properties:
 *                         averageScore:
 *                           type: number
 *                           format: float
 *                           example: 82.5
 *                         trend:
 *                           type: string
 *                           enum: [improving, stable, declining]
 *                           example: improving
 *                         trendPercentage:
 *                           type: number
 *                           format: float
 *                           example: 5.2
 *                     categoryAnalysis:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 507f1f77bcf86cd799439016
 *                               name:
 *                                 type: string
 *                                 example: Programming
 *                           examsCount:
 *                             type: integer
 *                             example: 15
 *                           averageScore:
 *                             type: number
 *                             format: float
 *                             example: 88.5
 *                           improvement:
 *                             type: number
 *                             format: float
 *                             example: 10.2
 *                           recommendedTopics:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: [Advanced Functions, Async Programming]
 *                     difficultyAnalysis:
 *                       type: object
 *                       properties:
 *                         easy:
 *                           type: object
 *                           properties:
 *                             averageScore:
 *                               type: number
 *                               format: float
 *                               example: 92.5
 *                             questionsAttempted:
 *                               type: integer
 *                               example: 100
 *                         medium:
 *                           type: object
 *                           properties:
 *                             averageScore:
 *                               type: number
 *                               format: float
 *                               example: 78.3
 *                             questionsAttempted:
 *                               type: integer
 *                               example: 150
 *                         hard:
 *                           type: object
 *                           properties:
 *                             averageScore:
 *                               type: number
 *                               format: float
 *                               example: 65.8
 *                             questionsAttempted:
 *                               type: integer
 *                               example: 50
 *                     timeAnalysis:
 *                       type: object
 *                       properties:
 *                         averageTimePerQuestion:
 *                           type: integer
 *                           description: Time in seconds
 *                           example: 90
 *                         fastestCategory:
 *                           type: string
 *                           example: True/False Questions
 *                         slowestCategory:
 *                           type: string
 *                           example: Code Problems
 *                     strengths:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [JavaScript Basics, HTML/CSS, React Fundamentals]
 *                     weaknesses:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [Database Design, SQL Queries, API Development]
 *                     recommendations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           courseId:
 *                             type: string
 *                             example: 507f1f77bcf86cd799439017
 *                           courseTitle:
 *                             type: string
 *                             example: Advanced Database Management
 *                           reason:
 *                             type: string
 *                             example: To improve your database skills based on recent exam performance
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /results/export:
 *   get:
 *     summary: Export results data
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [pdf, csv, json]
 *           default: pdf
 *         description: Export format
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-01-01
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *           example: 2024-12-31
 *       - in: query
 *         name: includeDetails
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include detailed question breakdown
 *     responses:
 *       200:
 *         description: Results exported successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           text/csv:
 *             schema:
 *               type: string
 *               example: |
 *                 Date,Exam,Score,Percentage,Passed
 *                 2024-01-15,JavaScript Quiz,85,85.0,true
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExamResult'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /results/compare:
 *   post:
 *     summary: Compare results with other users
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - examId
 *             properties:
 *               examId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *               compareWith:
 *                 type: string
 *                 enum: [all, course_students, similar_level]
 *                 default: all
 *                 example: course_students
 *     responses:
 *       200:
 *         description: Comparison data retrieved successfully
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
 *                     userScore:
 *                       type: integer
 *                       example: 85
 *                     averageScore:
 *                       type: number
 *                       format: float
 *                       example: 75.5
 *                     highestScore:
 *                       type: integer
 *                       example: 98
 *                     lowestScore:
 *                       type: integer
 *                       example: 42
 *                     percentile:
 *                       type: integer
 *                       example: 85
 *                     totalParticipants:
 *                       type: integer
 *                       example: 156
 *                     scoreDistribution:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           range:
 *                             type: string
 *                             example: 80-90
 *                           count:
 *                             type: integer
 *                             example: 35
 *                           percentage:
 *                             type: number
 *                             format: float
 *                             example: 22.4
 *                     ranking:
 *                       type: object
 *                       properties:
 *                         position:
 *                           type: integer
 *                           example: 24
 *                         total:
 *                           type: integer
 *                           example: 156
 *                         betterThan:
 *                           type: number
 *                           format: float
 *                           example: 84.6
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Exam not found or no attempt found
 */

/**
 * @swagger
 * /results/student/{userId}:
 *   get:
 *     summary: Get student's results (instructor/admin only)
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student user ID
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *         description: Filter by specific course
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
 *         description: Student results retrieved successfully
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
 *                     student:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439014
 *                         firstName:
 *                           type: string
 *                           example: John
 *                         lastName:
 *                           type: string
 *                           example: Doe
 *                         email:
 *                           type: string
 *                           example: john.doe@example.com
 *                     results:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ExamResult'
 *                     summary:
 *                       $ref: '#/components/schemas/UserResultsSummary'
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
 *                           example: 15
 *                         pages:
 *                           type: integer
 *                           example: 1
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Instructor can only view students in their courses
 *       404:
 *         description: Student not found
 */