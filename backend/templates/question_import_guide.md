# Question Import Guide for Examinr

## Overview
This guide explains how to prepare and import questions into the Examinr platform using CSV or Excel files.

## File Formats Supported
- CSV (.csv)
- Excel (.xlsx, .xls)
- Word (.docx) - Coming soon

## Column Definitions

### Required Fields
1. **Subject** - One of: physics, chemistry, mathematics, biology
2. **Chapter** - Chapter name (e.g., "Mechanics", "Calculus", "Thermodynamics")
3. **Topic** - Specific topic within the chapter
4. **QuestionType** - Type of question (see Question Types below)
5. **Difficulty** - One of: easy, medium, hard, expert
6. **Question** - The question text (supports LaTeX)
7. **CorrectAnswer** - The correct answer(s)

### Optional Fields
1. **Subtopic** - More specific categorization
2. **Title** - Short title for the question (auto-generated if not provided)
3. **OptionA/B/C/D** - Answer options for MCQ type questions
4. **Solution** - Detailed solution with explanation (supports LaTeX)
5. **Tags** - Comma-separated tags for searching
6. **ImageURL** - URL of image associated with the question
7. **IsPYQ** - Yes/No - Is this a Previous Year Question?
8. **PYQYear** - Year if it's a PYQ
9. **PYQExam** - Exam name if it's a PYQ (JEE Main, JEE Advanced, NEET, etc.)
10. **BookReference** - Reference book name
11. **Points** - Points for correct answer (default: 1)
12. **NegativePoints** - Negative marking (default: 0)
13. **Tolerance** - For numerical questions (default: 0)
14. **Unit** - Unit for numerical answers

## Question Types
- **MCQ** or **Multiple Choice** - Single correct answer
- **Multiple Correct** - Multiple correct answers
- **True/False** - True or false question
- **Numerical** - Numerical answer type
- **Essay** - Long answer type
- **Short Answer** - Short text answer
- **Fill in the Blank** - Fill in the blank type
- **Matching** - Match the following
- **Matrix Match** - Matrix matching type

## LaTeX Support
Questions and solutions support LaTeX mathematical expressions. Use standard LaTeX delimiters:
- Inline math: `$...$` or `\(...\)`
- Display math: `$$...$$` or `\[...\]`

### Examples:
- Inline: `The equation $x^2 + y^2 = r^2$ represents a circle`
- Display: `$$\int_{0}^{\pi} \sin(x) dx = 2$$`

## Answer Format Guidelines

### Multiple Choice (MCQ)
- **CorrectAnswer**: Single letter (A, B, C, or D)
- Example: `A`

### Multiple Correct
- **CorrectAnswer**: Comma-separated letters
- Example: `A,C,D`

### True/False
- **OptionA**: True
- **OptionB**: False
- **CorrectAnswer**: A (for True) or B (for False)

### Numerical
- **CorrectAnswer**: Numerical value
- **Tolerance**: Acceptable error margin
- **Unit**: Unit of measurement
- Example: CorrectAnswer=9.8, Tolerance=0.1, Unit=m/s²

### Fill in the Blank
- **CorrectAnswer**: The answer text
- Use ____ in the question to indicate the blank

## Best Practices

1. **Consistency**: Keep formatting consistent across all questions
2. **LaTeX Validation**: Ensure all LaTeX expressions are properly closed
3. **Image URLs**: Use direct image URLs (not Google Drive or Dropbox links)
4. **Tags**: Use relevant tags for better searchability
5. **Special Characters**: For CSV files, wrap text containing commas in quotes
6. **Excel Sheets**: You can use different sheets for different subjects

## Import Process

1. Download the template file
2. Fill in your questions following the guidelines
3. Save the file in CSV or Excel format
4. Go to Admin Panel > Question Bank > Import
5. Upload your file
6. Review the import preview
7. Fix any validation errors
8. Complete the import

## Error Handling

Common errors and solutions:
- **Unmatched LaTeX delimiters**: Check that all $ symbols are paired
- **Invalid difficulty**: Use only: easy, medium, hard, expert
- **Missing required fields**: Ensure all required columns have values
- **Invalid question type**: Check the spelling of question types

## Sample Data

See the `question_import_template.csv` file for examples of properly formatted questions.

## Support

For additional help or to report issues, contact the Examinr support team.