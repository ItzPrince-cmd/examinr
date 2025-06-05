const path = require('path');
const ExcelTemplateGenerator = require('../services/excelTemplateGenerator');

// Generate Excel template
const excelTemplatePath = path.join(__dirname, '..', 'templates', 'question_import_template.xlsx');
ExcelTemplateGenerator.saveTemplate(excelTemplatePath);
console.log(`Excel template generated at: ${excelTemplatePath}`);