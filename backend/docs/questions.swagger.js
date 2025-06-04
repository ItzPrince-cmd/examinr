/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         text:
 *           type: string
 *           example: What is the correct syntax for declaring a variable in JavaScript?
 *         type:
 *           type: string
 *           enum: [multiple_choice, true_false, short_answer, essay, code]
 *           example: multiple_choice
 *         category:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439012
 *             name:
 *               type: string
 *               example: Programming
 *         course:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439013
 *             title:
 *               type: string
 *               example: Introduction to JavaScript
 *         difficulty:
 *           type: string
 *           enum: [easy, medium, hard]
 *           example: easy
 *         points:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *         options:
 *           type: array
 *           description: For multiple choice questions
 *           items:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: var myVariable = 5;
 *               isCorrect:
 *                 type: boolean
 *                 example: true
 *         correctAnswer:
 *           type: string
 *           description: For true/false and short answer questions
 *           example: true
 *         explanation:
 *           type: string
 *           example: The 'var' keyword is used to declare variables in JavaScript, though 'let' and 'const' are preferred in modern JavaScript.
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: [javascript, variables, basics]
 *         image:
 *           type: string
 *           example: /uploads/questions/question-image.png
 *         codeSnippet:
 *           type: string
 *           example: |
 *             function example() {
 *               // Your code here
 *             }
 *         createdBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 507f1f77bcf86cd799439014
 *             firstName:
 *               type: string
 *               example: Jane
 *             lastName:
 *               type: string
 *               example: Smith
 *         usageCount:
 *           type: integer
 *           example: 25
 *         averageScore:
 *           type: number
 *           format: float
 *           example: 72.5
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T00:00:00.000Z
 *     
 *     QuestionBank:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439015
 *         name:
 *           type: string
 *           example: JavaScript Fundamentals Question Bank
 *         description:
 *           type: string
 *           example: Collection of questions for JavaScript basics
 *         category:
 *           type: string
 *           example: 507f1f77bcf86cd799439012
 *         course:
 *           type: string
 *           example: 507f1f77bcf86cd799439013
 *         questions:
 *           type: array
 *           items:
 *             type: string
 *           example: [507f1f77bcf86cd799439011, 507f1f77bcf86cd799439016]
 *         createdBy:
 *           type: string
 *           example: 507f1f77bcf86cd799439014
 *         isPublic:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
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
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: course
 *         schema:
 *           type: string
 *         description: Filter by course ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [multiple_choice, true_false, short_answer, essay, code]
 *         description: Filter by question type
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         description: Filter by difficulty level
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated list of tags
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in question text
 *       - in: query
 *         name: createdBy
 *         schema:
 *           type: string
 *         description: Filter by creator ID (admin/teacher only)
 *     responses:
 *       200:
 *         description: Questions retrieved successfully
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
 *                     questions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Question'
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
 *                           example: 156
 *                         pages:
 *                           type: integer
 *                           example: 8
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - type
 *               - category
 *               - difficulty
 *               - points
 *             properties:
 *               text:
 *                 type: string
 *                 example: What is the correct syntax for declaring a variable in JavaScript?
 *               type:
 *                 type: string
 *                 enum: [multiple_choice, true_false, short_answer, essay, code]
 *                 example: multiple_choice
 *               category:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *               course:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439013
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 example: easy
 *               points:
 *                 type: integer
 *                 minimum: 1
 *                 example: 10
 *               options:
 *                 type: array
 *                 description: Required for multiple choice questions
 *                 items:
 *                   type: object
 *                   required:
 *                     - text
 *                     - isCorrect
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: var myVariable = 5;
 *                     isCorrect:
 *                       type: boolean
 *                       example: true
 *               correctAnswer:
 *                 type: string
 *                 description: Required for true/false and short answer questions
 *                 example: true
 *               explanation:
 *                 type: string
 *                 example: The 'var' keyword is used to declare variables in JavaScript
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [javascript, variables, basics]
 *               codeSnippet:
 *                 type: string
 *                 example: |
 *                   function example() {
 *                     // Your code here
 *                   }
 *     responses:
 *       201:
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Question'
 *                 message:
 *                   type: string
 *                   example: Question created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Teacher or admin access required
 */

/**
 * @swagger
 * /questions/{questionId}:
 *   get:
 *     summary: Get question by ID
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Question retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Question'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /questions/{questionId}:
 *   put:
 *     summary: Update question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: What is the modern syntax for declaring a constant in JavaScript?
 *               type:
 *                 type: string
 *                 enum: [multiple_choice, true_false, short_answer, essay, code]
 *                 example: multiple_choice
 *               category:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *               course:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439013
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 example: medium
 *               points:
 *                 type: integer
 *                 minimum: 1
 *                 example: 15
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                     isCorrect:
 *                       type: boolean
 *               correctAnswer:
 *                 type: string
 *               explanation:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Question updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Question'
 *                 message:
 *                   type: string
 *                   example: Question updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only question creator or admin can update
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /questions/{questionId}:
 *   delete:
 *     summary: Delete question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Question deleted successfully
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
 *                   example: Question deleted successfully
 *       400:
 *         description: Cannot delete question that is used in active exams
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only question creator or admin can delete
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /questions/{questionId}/image:
 *   post:
 *     summary: Upload question image
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, GIF)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
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
 *                     imageUrl:
 *                       type: string
 *                       example: /uploads/questions/question-image.png
 *                 message:
 *                   type: string
 *                   example: Image uploaded successfully
 *       400:
 *         description: Invalid file type or size
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only question creator or admin can upload
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /questions/bank:
 *   post:
 *     summary: Create question bank
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: JavaScript Fundamentals Question Bank
 *               description:
 *                 type: string
 *                 example: Collection of questions for JavaScript basics
 *               category:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *               course:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439013
 *               questions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [507f1f77bcf86cd799439011, 507f1f77bcf86cd799439016]
 *               isPublic:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *     responses:
 *       201:
 *         description: Question bank created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/QuestionBank'
 *                 message:
 *                   type: string
 *                   example: Question bank created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Teacher or admin access required
 */

/**
 * @swagger
 * /questions/bank/{bankId}:
 *   get:
 *     summary: Get question bank by ID
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bankId
 *         required: true
 *         schema:
 *           type: string
 *         description: Question bank ID
 *     responses:
 *       200:
 *         description: Question bank retrieved successfully
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
 *                     - $ref: '#/components/schemas/QuestionBank'
 *                     - type: object
 *                       properties:
 *                         questions:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Question'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Private question bank
 *       404:
 *         description: Question bank not found
 */

/**
 * @swagger
 * /questions/import:
 *   post:
 *     summary: Import questions from file
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - category
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV or JSON file containing questions
 *               category:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *               course:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439013
 *     responses:
 *       200:
 *         description: Questions imported successfully
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
 *                     imported:
 *                       type: integer
 *                       example: 25
 *                     failed:
 *                       type: integer
 *                       example: 2
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           row:
 *                             type: integer
 *                             example: 5
 *                           error:
 *                             type: string
 *                             example: Missing required field 'text'
 *                 message:
 *                   type: string
 *                   example: 25 questions imported successfully, 2 failed
 *       400:
 *         description: Invalid file format or content
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Teacher or admin access required
 */

/**
 * @swagger
 * /questions/export:
 *   get:
 *     summary: Export questions
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, json]
 *           default: json
 *         description: Export format
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: course
 *         schema:
 *           type: string
 *         description: Filter by course ID
 *       - in: query
 *         name: questionIds
 *         schema:
 *           type: string
 *         description: Comma-separated list of question IDs
 *     responses:
 *       200:
 *         description: Questions exported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Question'
 *           text/csv:
 *             schema:
 *               type: string
 *               example: |
 *                 text,type,difficulty,points,options,correctAnswer
 *                 "What is JavaScript?","multiple_choice","easy",10,"[...]",""
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Teacher or admin access required
 */