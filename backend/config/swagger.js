const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Examinr API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for Examinr - Educational Platform',
      contact: {
        name: 'Examinr Support',
        email: 'support@examinr.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000/api',
        description: 'Development server'
      },
      {
        url: 'https://api.examinr.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object'
              }
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            firstName: {
              type: 'string',
              example: 'John'
            },
            lastName: {
              type: 'string',
              example: 'Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com'
            },
            role: {
              type: 'string',
              enum: ['student', 'teacher', 'admin', 'superadmin'],
              example: 'student'
            },
            profile: {
              type: 'object',
              properties: {
                avatar: {
                  type: 'object',
                  properties: {
                    url: { type: 'string' },
                    publicId: { type: 'string' }
                  }
                },
                bio: { type: 'string' },
                isProfileComplete: { type: 'boolean' }
              }
            },
            accountStatus: {
              type: 'object',
              properties: {
                isActive: { type: 'boolean' },
                isEmailVerified: { type: 'boolean' }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Course: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            title: {
              type: 'string',
              example: 'Introduction to JavaScript'
            },
            description: {
              type: 'string',
              example: 'Learn the fundamentals of JavaScript programming'
            },
            slug: {
              type: 'string',
              example: 'introduction-to-javascript'
            },
            category: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            instructor: {
              type: 'string',
              example: '507f1f77bcf86cd799439011'
            },
            thumbnail: {
              type: 'object',
              properties: {
                url: { type: 'string' },
                publicId: { type: 'string' }
              }
            },
            pricing: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['free', 'one_time', 'subscription']
                },
                amount: { type: 'number' },
                currency: { type: 'string' }
              }
            },
            level: {
              type: 'string',
              enum: ['beginner', 'intermediate', 'advanced', 'all_levels']
            },
            status: {
              type: 'string',
              enum: ['draft', 'published', 'archived']
            },
            statistics: {
              type: 'object',
              properties: {
                totalEnrollments: { type: 'number' },
                totalViews: { type: 'number' },
                averageRating: { type: 'number' }
              }
            }
          }
        },
        Question: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            text: { type: 'string' },
            type: {
              type: 'string',
              enum: ['multiple_choice', 'true_false', 'essay', 'short_answer', 'fill_blank', 'matching', 'ordering', 'code']
            },
            subject: { type: 'string' },
            topic: { type: 'string' },
            difficulty: {
              type: 'string',
              enum: ['beginner', 'easy', 'medium', 'hard', 'expert']
            },
            points: { type: 'number' },
            options: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  text: { type: 'string' },
                  isCorrect: { type: 'boolean' }
                }
              }
            }
          }
        },
        Quiz: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            type: {
              type: 'string',
              enum: ['practice', 'graded', 'exam', 'survey']
            },
            category: { type: 'string' },
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  question: { type: 'string' },
                  points: { type: 'number' },
                  order: { type: 'number' }
                }
              }
            },
            timing: {
              type: 'object',
              properties: {
                duration: { type: 'number' },
                showTimer: { type: 'boolean' }
              }
            },
            attempts: {
              type: 'object',
              properties: {
                maxAttempts: { type: 'number' },
                cooldownPeriod: { type: 'number' }
              }
            },
            scoring: {
              type: 'object',
              properties: {
                totalPoints: { type: 'number' },
                passingScore: { type: 'number' }
              }
            },
            status: {
              type: 'string',
              enum: ['draft', 'active', 'inactive', 'archived']
            }
          }
        },
        PaymentOrder: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            amount: { type: 'number' },
            currency: { type: 'string' },
            status: { type: 'string' }
          }
        },
        Subscription: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            plan: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                interval: { type: 'string' },
                price: {
                  type: 'object',
                  properties: {
                    amount: { type: 'number' },
                    currency: { type: 'string' }
                  }
                }
              }
            },
            status: {
              type: 'object',
              properties: {
                current: { type: 'string' }
              }
            },
            billing: {
              type: 'object',
              properties: {
                currentPeriodStart: { type: 'string', format: 'date-time' },
                currentPeriodEnd: { type: 'string', format: 'date-time' }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Users',
        description: 'User management and profile endpoints'
      },
      {
        name: 'Courses',
        description: 'Course creation and management'
      },
      {
        name: 'Categories',
        description: 'Course category management'
      },
      {
        name: 'Questions',
        description: 'Question bank management'
      },
      {
        name: 'Quizzes',
        description: 'Quiz creation and test-taking'
      },
      {
        name: 'Payments',
        description: 'Payment processing and subscriptions'
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js', './docs/*.swagger.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;