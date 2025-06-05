const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const { v4: uuidv4 } = require('uuid');
const EventEmitter = require('events');
const Question = require('../models/Question');
const LatexService = require('./latexService');
const ImageService = require('./imageService');

class QuestionImportService extends EventEmitter {
  constructor() {
    super();
    this.jobs = new Map();
  }

  /**
   * Create a new import job
   * @returns {string} - Job ID
   */
  createJob(userId, fileName, totalRows = 0) {
    const jobId = uuidv4();
    const job = {
      id: jobId,
      userId,
      fileName,
      status: 'pending',
      progress: 0,
      totalRows,
      processedRows: 0,
      successCount: 0,
      errorCount: 0,
      duplicateCount: 0,
      errors: [],
      duplicates: [],
      startedAt: null,
      completedAt: null,
      validationReport: null
    };
    
    this.jobs.set(jobId, job);
    return jobId;
  }

  /**
   * Get job status
   */
  getJobStatus(jobId) {
    return this.jobs.get(jobId);
  }

  /**
   * Update job progress
   */
  updateJobProgress(jobId, updates) {
    const job = this.jobs.get(jobId);
    if (job) {
      Object.assign(job, updates);
      if (updates.processedRows && job.totalRows) {
        job.progress = Math.round((updates.processedRows / job.totalRows) * 100);
      }
      this.emit('progress', { jobId, ...job });
    }
  }

  /**
   * Validate file without importing
   */
  async validateFile(filePath, fileType, options = {}) {
    const validationReport = {
      isValid: true,
      totalRows: 0,
      validRows: 0,
      errors: [],
      warnings: [],
      preview: []
    };

    try {
      let questions = [];
      
      if (fileType === 'csv') {
        questions = await this.parseCSV(filePath, { preview: true, limit: options.previewLimit || 10 });
      } else if (fileType === 'xlsx' || fileType === 'xls') {
        questions = await this.parseExcel(filePath, { preview: true, limit: options.previewLimit || 10 });
      } else if (fileType === 'docx') {
        throw new Error('Word document parsing not yet implemented');
      }

      validationReport.totalRows = questions.length;

      // Validate each question
      for (let i = 0; i < questions.length; i++) {
        const validation = await this.validateQuestion(questions[i], i + 2);
        
        if (validation.isValid) {
          validationReport.validRows++;
          if (validationReport.preview.length < 10) {
            validationReport.preview.push({
              row: i + 2,
              question: questions[i],
              validation: validation
            });
          }
        } else {
          validationReport.isValid = false;
          validationReport.errors.push({
            row: i + 2,
            errors: validation.errors,
            question: questions[i]
          });
        }

        if (validation.warnings.length > 0) {
          validationReport.warnings.push({
            row: i + 2,
            warnings: validation.warnings,
            question: questions[i]
          });
        }
      }

      return validationReport;
    } catch (error) {
      validationReport.isValid = false;
      validationReport.errors.push({
        row: 0,
        errors: [`File parsing error: ${error.message}`]
      });
      return validationReport;
    }
  }

  /**
   * Process import with progress tracking
   */
  async processImport(filePath, fileType, userId, options = {}) {
    const jobId = this.createJob(userId, path.basename(filePath));
    
    try {
      this.updateJobProgress(jobId, { status: 'processing', startedAt: new Date() });

      let questions = [];
      
      // Parse file based on type
      if (fileType === 'csv') {
        questions = await this.parseCSV(filePath);
      } else if (fileType === 'xlsx' || fileType === 'xls') {
        questions = await this.parseExcel(filePath);
      } else if (fileType === 'docx') {
        throw new Error('Word document parsing not yet implemented');
      }

      this.updateJobProgress(jobId, { totalRows: questions.length });

      // Process questions in batches for better performance
      const batchSize = 50;
      const batches = this.createBatches(questions, batchSize);
      
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        const batchResults = await this.processBatch(batch, userId, options, jobId);
        
        // Update job progress
        const job = this.getJobStatus(jobId);
        this.updateJobProgress(jobId, {
          processedRows: job.processedRows + batch.length,
          successCount: job.successCount + batchResults.success,
          errorCount: job.errorCount + batchResults.errors,
          duplicateCount: job.duplicateCount + batchResults.duplicates
        });
      }

      // Mark job as completed
      this.updateJobProgress(jobId, {
        status: 'completed',
        completedAt: new Date()
      });

      return this.getJobStatus(jobId);
    } catch (error) {
      this.updateJobProgress(jobId, {
        status: 'failed',
        completedAt: new Date(),
        errors: [...this.getJobStatus(jobId).errors, {
          row: 0,
          error: error.message
        }]
      });
      throw error;
    }
  }

  /**
   * Parse CSV file with streaming for large files
   */
  async parseCSV(filePath, options = {}) {
    return new Promise((resolve, reject) => {
      const questions = [];
      let rowCount = 0;
      
      const stream = fs.createReadStream(filePath)
        .pipe(csv({
          mapHeaders: ({ header }) => header.trim()
        }))
        .on('data', (row) => {
          rowCount++;
          
          if (options.preview && rowCount > (options.limit || 10)) {
            stream.destroy();
            return;
          }

          try {
            const question = this.mapCSVRowToQuestion(row);
            questions.push(question);
          } catch (error) {
            questions.push({
              _error: error.message,
              _row: rowCount + 1,
              _rawData: row
            });
          }
        })
        .on('end', () => resolve(questions))
        .on('error', reject);
    });
  }

  /**
   * Parse Excel file
   */
  async parseExcel(filePath, options = {}) {
    const workbook = xlsx.readFile(filePath);
    const questions = [];
    let totalRows = 0;
    
    for (const sheetName of workbook.SheetNames) {
      // Skip instruction sheets
      if (sheetName.toLowerCase().includes('instruction') || 
          sheetName.toLowerCase().includes('guide') ||
          sheetName.toLowerCase().includes('template')) {
        continue;
      }
      
      const sheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(sheet, {
        header: 1,
        defval: '',
        blankrows: false // Don't include blank rows
      });
      
      if (data.length < 2) continue; // Skip empty sheets
      
      const headers = data[0].map(h => h.toString().trim());
      
      for (let i = 1; i < data.length; i++) {
        // Skip empty rows
        const rowData = data[i];
        if (!rowData || rowData.every(cell => !cell || cell === '')) {
          continue;
        }
        
        totalRows++;
        
        if (options.preview && questions.length >= (options.limit || 10)) {
          break;
        }
        
        const row = {};
        headers.forEach((header, index) => {
          row[header] = data[i][index] || '';
        });
        
        // Skip rows that don't have essential data
        if (!row.Question && !row.Subject && !row.Chapter) {
          continue;
        }
        
        try {
          const question = this.mapExcelRowToQuestion(row, sheetName);
          questions.push(question);
        } catch (error) {
          questions.push({
            _error: error.message,
            _row: totalRows + 1,
            _sheet: sheetName,
            _rawData: row
          });
        }
      }
      
      if (options.preview && questions.length >= (options.limit || 10)) {
        break;
      }
    }
    
    return questions;
  }

  /**
   * Map CSV row to question object
   */
  mapCSVRowToQuestion(row) {
    // Add null check for row
    if (!row || typeof row !== 'object') {
      throw new Error('Invalid row data');
    }
    
    const question = {
      title: row.Title || this.generateTitle(row.Question || ''),
      text: row.Question || '',
      type: this.mapQuestionType(row.QuestionType || 'Multiple Choice'),
      subject: row.Subject ? row.Subject.toLowerCase().trim() : '',
      chapter: row.Chapter || '',
      topic: row.Topic || '',
      subtopic: row.Subtopic || '',
      difficulty: row.Difficulty ? row.Difficulty.toLowerCase().trim() : 'medium',
      points: parseInt(row.Points) || 1,
      negativePoints: parseFloat(row.NegativePoints) || 0,
      tags: row.Tags ? row.Tags.split(',').map(tag => tag.trim()) : [],
      specialCategories: {}
    };

    // Handle options for MCQ type questions
    if (['multiple_choice', 'multiple_correct'].includes(question.type)) {
      question.options = this.parseOptions(row);
    }

    // Handle numerical questions
    if (question.type === 'numerical') {
      question.numerical = {
        correctAnswer: parseFloat(row.CorrectAnswer),
        tolerance: parseFloat(row.Tolerance) || 0,
        unit: row.Unit || ''
      };
    }

    // Add solution
    if (row.Solution) {
      question.solution = {
        detailed: {
          text: row.Solution
        }
      };
    }

    // Handle special categories
    if (row.IsPYQ === 'Yes' || row.IsPYQ === 'true' || row.IsPYQ === '1') {
      question.specialCategories.isPYQ = true;
      question.specialCategories.pyqYear = row.PYQYear;
      question.specialCategories.pyqExam = row.PYQExam;
    }

    if (row.BookReference) {
      question.specialCategories.bookReference = {
        name: row.BookReference,
        author: row.BookAuthor,
        edition: row.BookEdition,
        pageNumber: row.PageNumber
      };
    }

    // Handle images
    if (row.ImageURL) {
      question.imageUrls = [{
        url: row.ImageURL,
        caption: row.ImageCaption || '',
        position: 'question'
      }];
    }

    // Handle option images
    ['A', 'B', 'C', 'D'].forEach(option => {
      if (row[`Option${option}Image`]) {
        if (!question.optionImages) question.optionImages = {};
        question.optionImages[option] = row[`Option${option}Image`];
      }
    });

    return question;
  }

  /**
   * Map Excel row to question object
   */
  mapExcelRowToQuestion(row, sheetName) {
    // Similar to CSV mapping but can use sheet name as default subject
    const question = this.mapCSVRowToQuestion(row);
    
    if (!question.subject && sheetName) {
      // Try to extract subject from sheet name
      const subjectMatch = sheetName.toLowerCase().match(/(physics|chemistry|mathematics|biology)/);
      if (subjectMatch) {
        question.subject = subjectMatch[1];
      }
    }
    
    return question;
  }

  /**
   * Parse options from row data
   */
  parseOptions(row) {
    const options = [];
    const optionColumns = ['A', 'B', 'C', 'D', 'E', 'F'];
    const correctAnswers = this.parseCorrectAnswers(row.CorrectAnswer);
    
    optionColumns.forEach(col => {
      const optionText = row[`Option${col}`];
      if (optionText) {
        const option = {
          id: uuidv4(),
          text: optionText,
          isCorrect: correctAnswers.includes(col)
        };
        
        // Add explanation if available
        if (row[`Option${col}Explanation`]) {
          option.explanation = {
            text: row[`Option${col}Explanation`]
          };
        }
        
        // Add image if available
        if (row[`Option${col}Image`]) {
          option.media = {
            type: 'image',
            url: row[`Option${col}Image`]
          };
        }
        
        options.push(option);
      }
    });
    
    return options;
  }

  /**
   * Parse correct answers
   */
  parseCorrectAnswers(correctAnswer) {
    if (!correctAnswer) return [];
    
    // Handle undefined or null values
    const answerStr = String(correctAnswer || '');
    
    return answerStr
      .toUpperCase()
      .split(',')
      .map(a => a.trim())
      .filter(a => /^[A-F]$/.test(a));
  }

  /**
   * Validate question data
   */
  async validateQuestion(question, rowNumber) {
    const errors = [];
    const warnings = [];
    
    // Check for parsing errors
    if (question._error) {
      return {
        isValid: false,
        errors: [question._error],
        warnings: []
      };
    }

    // Required fields validation
    if (!question.text || question.text.trim() === '') {
      errors.push('Question text is required');
    }
    
    if (!question.subject) {
      errors.push('Subject is required');
    } else if (!['physics', 'chemistry', 'mathematics', 'biology'].includes(question.subject)) {
      errors.push(`Invalid subject: ${question.subject}`);
    }
    
    if (!question.chapter) {
      errors.push('Chapter is required');
    }
    
    if (!question.topic) {
      errors.push('Topic is required');
    }
    
    if (!question.type) {
      errors.push('Question type is required');
    }
    
    if (!['easy', 'medium', 'hard', 'expert'].includes(question.difficulty)) {
      errors.push(`Invalid difficulty: ${question.difficulty}`);
    }

    // Validate LaTeX
    if (question.text) {
      const latexValidation = LatexService.validateLatex(question.text);
      if (!latexValidation.isValid) {
        errors.push(`LaTeX errors in question: ${latexValidation.errors.join(', ')}`);
      }
    }
    
    if (question.solution && question.solution.detailed && question.solution.detailed.text) {
      const latexValidation = LatexService.validateLatex(question.solution.detailed.text);
      if (!latexValidation.isValid) {
        errors.push(`LaTeX errors in solution: ${latexValidation.errors.join(', ')}`);
      }
    }

    // Validate options for MCQ
    if (['multiple_choice', 'multiple_correct'].includes(question.type)) {
      if (!question.options || question.options.length < 2) {
        errors.push('At least 2 options are required for MCQ');
      } else {
        const correctOptions = question.options.filter(opt => opt.isCorrect);
        if (correctOptions.length === 0) {
          errors.push('At least one correct option is required');
        }
        
        if (question.type === 'multiple_choice' && correctOptions.length > 1) {
          errors.push('Multiple choice questions should have only one correct answer');
        }
      }
    }

    // Validate numerical questions
    if (question.type === 'numerical') {
      if (!question.numerical || isNaN(question.numerical.correctAnswer)) {
        errors.push('Valid numerical answer is required');
      }
    }

    // Validate images
    if (question.imageUrls) {
      for (const img of question.imageUrls) {
        const validation = ImageService.validateImageUrl(img.url);
        if (!validation.isValid) {
          errors.push(`Invalid image URL: ${validation.error}`);
        }
      }
    }
    
    // Validate LaTeX
    const LatexService = require('./latexService');
    
    // Check main question text
    if (question.text) {
      const latexValidation = LatexService.validateLatex(question.text);
      if (!latexValidation.isValid) {
        errors.push(`LaTeX errors in question text: ${latexValidation.errors.join(', ')}`);
      }
    }
    
    // Check options for LaTeX
    if (question.options) {
      question.options.forEach((option, index) => {
        if (option.text) {
          const optionLatexValidation = LatexService.validateLatex(option.text);
          if (!optionLatexValidation.isValid) {
            errors.push(`LaTeX errors in option ${String.fromCharCode(65 + index)}: ${optionLatexValidation.errors.join(', ')}`);
          }
        }
      });
    }
    
    // Check solution for LaTeX
    if (question.solution && question.solution.detailed && question.solution.detailed.text) {
      const solutionLatexValidation = LatexService.validateLatex(question.solution.detailed.text);
      if (!solutionLatexValidation.isValid) {
        warnings.push(`LaTeX errors in solution: ${solutionLatexValidation.errors.join(', ')}`);
      }
    }

    // Check for potential duplicates (warning only)
    if (question.text && question.text.length < 20) {
      warnings.push('Question text seems too short');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Process a batch of questions
   */
  async processBatch(batch, userId, options, jobId) {
    const results = {
      success: 0,
      errors: 0,
      duplicates: 0
    };

    for (const questionData of batch) {
      try {
        // Skip if parsing error
        if (questionData._error) {
          results.errors++;
          this.addJobError(jobId, questionData._row || 0, questionData._error);
          continue;
        }

        // Check for duplicates
        if (!options.skipDuplicateCheck) {
          const duplicates = await Question.findDuplicates(
            questionData.text,
            questionData.subject,
            questionData.chapter,
            questionData.topic
          );
          
          if (duplicates.length > 0) {
            if (options.duplicateAction === 'skip') {
              results.duplicates++;
              this.addJobDuplicate(jobId, questionData, duplicates);
              continue;
            } else if (options.duplicateAction === 'update') {
              // Update existing question
              await Question.findByIdAndUpdate(duplicates[0].question._id, {
                ...questionData,
                lastModifiedBy: userId,
                version: duplicates[0].question.version + 1
              });
              results.success++;
              continue;
            }
            // Otherwise, create new question anyway
          }
        }

        // Create question
        await Question.create({
          ...questionData,
          createdBy: userId,
          status: options.autoPublish ? 'published' : 'draft'
        });
        
        results.success++;
      } catch (error) {
        results.errors++;
        this.addJobError(jobId, questionData._row || 0, error.message);
      }
    }

    return results;
  }

  /**
   * Create batches from array
   */
  createBatches(array, batchSize) {
    const batches = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Generate title from question text
   */
  generateTitle(questionText) {
    if (!questionText) return 'Untitled Question';
    
    // Remove LaTeX and clean text
    const cleanText = LatexService.cleanTextForComparison(questionText);
    
    // Take first 50 characters
    return cleanText.substring(0, 50) + (cleanText.length > 50 ? '...' : '');
  }

  /**
   * Map question type
   */
  mapQuestionType(type) {
    const typeMap = {
      'MCQ': 'multiple_choice',
      'Multiple Choice': 'multiple_choice',
      'Multiple Correct': 'multiple_correct',
      'True/False': 'true_false',
      'TF': 'true_false',
      'Numerical': 'numerical',
      'NUM': 'numerical',
      'Essay': 'essay',
      'Short Answer': 'short_answer',
      'SA': 'short_answer',
      'Fill in the Blank': 'fill_blank',
      'FIB': 'fill_blank',
      'Matching': 'matching',
      'Matrix Match': 'matrix_match',
      'MM': 'matrix_match'
    };
    
    return typeMap[type] || 'multiple_choice';
  }

  /**
   * Add error to job
   */
  addJobError(jobId, row, error) {
    const job = this.jobs.get(jobId);
    if (job) {
      job.errors.push({ row, error, timestamp: new Date() });
    }
  }

  /**
   * Add duplicate to job
   */
  addJobDuplicate(jobId, question, duplicates) {
    const job = this.jobs.get(jobId);
    if (job) {
      job.duplicates.push({
        question,
        duplicates: duplicates.map(d => ({
          id: d.question._id,
          title: d.question.title,
          similarity: d.similarity
        })),
        timestamp: new Date()
      });
    }
  }

  /**
   * Clean up old jobs (older than 24 hours)
   */
  cleanupOldJobs() {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    for (const [jobId, job] of this.jobs) {
      if (job.completedAt && job.completedAt < cutoffTime) {
        this.jobs.delete(jobId);
      }
    }
  }
}

// Create singleton instance
const questionImportService = new QuestionImportService();

// Clean up old jobs every hour
setInterval(() => {
  questionImportService.cleanupOldJobs();
}, 60 * 60 * 1000);

module.exports = questionImportService;