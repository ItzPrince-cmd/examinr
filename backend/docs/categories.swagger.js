/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: Programming
 *         slug:
 *           type: string
 *           example: programming
 *         icon:
 *           type: string
 *           example: fa-code
 *         color:
 *           type: string
 *           pattern: ^#[0-9A-F]{6}$
 *           example: #3B82F6
 *         description:
 *           type: string
 *           maxLength: 200
 *           example: Learn various programming languages and software development
 *         order:
 *           type: integer
 *           minimum: 0
 *           example: 1
 *         courseCount:
 *           type: integer
 *           example: 25
 *         isActive:
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
 *     CategoryWithCourses:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/Category'
 *         - type: object
 *           properties:
 *             courses:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 507f1f77bcf86cd799439012
 *                   title:
 *                     type: string
 *                     example: Introduction to JavaScript
 *                   description:
 *                     type: string
 *                     example: Learn the fundamentals of JavaScript programming
 *                   thumbnail:
 *                     type: string
 *                     example: /uploads/thumbnails/course-thumbnail.jpg
 *                   level:
 *                     type: string
 *                     enum: [beginner, intermediate, advanced, all_levels]
 *                     example: beginner
 *                   pricing:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [free, one_time, subscription]
 *                         example: one_time
 *                       amount:
 *                         type: number
 *                         example: 49.99
 *                   rating:
 *                     type: object
 *                     properties:
 *                       average:
 *                         type: number
 *                         example: 4.5
 *                       count:
 *                         type: integer
 *                         example: 42
 *                   enrollmentCount:
 *                     type: integer
 *                     example: 156
 *                   instructor:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439013
 *                       firstName:
 *                         type: string
 *                         example: Jane
 *                       lastName:
 *                         type: string
 *                         example: Smith
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
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
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in category name and description
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, order, courseCount, createdAt]
 *           default: order
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
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
 *                     categories:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
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
 *       400:
 *         description: Invalid query parameters
 */

/**
 * @swagger
 * /categories/{categoryId}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /categories/{categoryId}/courses:
 *   get:
 *     summary: Get courses by category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
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
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, enrollmentCount, rating, price, title]
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
 *                     category:
 *                       $ref: '#/components/schemas/Category'
 *                     courses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 507f1f77bcf86cd799439012
 *                           title:
 *                             type: string
 *                             example: Introduction to JavaScript
 *                           description:
 *                             type: string
 *                             example: Learn the fundamentals of JavaScript programming
 *                           thumbnail:
 *                             type: string
 *                             example: /uploads/thumbnails/course-thumbnail.jpg
 *                           level:
 *                             type: string
 *                             enum: [beginner, intermediate, advanced, all_levels]
 *                             example: beginner
 *                           pricing:
 *                             type: object
 *                             properties:
 *                               type:
 *                                 type: string
 *                                 enum: [free, one_time, subscription]
 *                                 example: one_time
 *                               amount:
 *                                 type: number
 *                                 example: 49.99
 *                           rating:
 *                             type: object
 *                             properties:
 *                               average:
 *                                 type: number
 *                                 example: 4.5
 *                               count:
 *                                 type: integer
 *                                 example: 42
 *                           enrollmentCount:
 *                             type: integer
 *                             example: 156
 *                           instructor:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 507f1f77bcf86cd799439013
 *                               firstName:
 *                                 type: string
 *                                 example: Jane
 *                               lastName:
 *                                 type: string
 *                                 example: Smith
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
 *       400:
 *         description: Invalid query parameters
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category (admin only)
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Data Science
 *               icon:
 *                 type: string
 *                 example: fa-chart-line
 *               color:
 *                 type: string
 *                 pattern: ^#[0-9A-F]{6}$
 *                 example: #10B981
 *               description:
 *                 type: string
 *                 maxLength: 200
 *                 example: Explore data analysis, machine learning, and AI
 *               order:
 *                 type: integer
 *                 minimum: 0
 *                 example: 5
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *                   example: Category created successfully
 *       400:
 *         description: Validation error or category already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               validation:
 *                 value:
 *                   success: false
 *                   error: Name must be between 2 and 50 characters
 *               duplicate:
 *                 value:
 *                   success: false
 *                   error: Category with this name already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /categories/{categoryId}:
 *   put:
 *     summary: Update category (admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Data Science & Analytics
 *               icon:
 *                 type: string
 *                 example: fa-chart-bar
 *               color:
 *                 type: string
 *                 pattern: ^#[0-9A-F]{6}$
 *                 example: #059669
 *               description:
 *                 type: string
 *                 maxLength: 200
 *                 example: Master data analysis, machine learning, and artificial intelligence
 *               order:
 *                 type: integer
 *                 minimum: 0
 *                 example: 6
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *                   example: Category updated successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Category not found
 *       409:
 *         description: Category name already exists
 */

/**
 * @swagger
 * /categories/{categoryId}:
 *   delete:
 *     summary: Delete category (admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
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
 *                   example: Category deleted successfully
 *       400:
 *         description: Cannot delete category with associated courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Cannot delete category with 12 associated courses
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Category not found
 */