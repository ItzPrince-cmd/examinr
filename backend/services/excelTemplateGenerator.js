const xlsx = require('xlsx');
const path = require('path');

class ExcelTemplateGenerator {
  static generateQuestionImportTemplate() {
    // Create a new workbook
    const wb = xlsx.utils.book_new();
    
    // Physics sheet
    const physicsData = [
      ['Subject', 'Chapter', 'Topic', 'Subtopic', 'QuestionType', 'Difficulty', 'Question', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'CorrectAnswer', 'Solution', 'Tags', 'ImageURL', 'IsPYQ', 'PYQYear', 'PYQExam', 'BookReference', 'Points', 'NegativePoints'],
      ['Physics', 'Mechanics', 'Newton\'s Laws', 'Force and Motion', 'Multiple Choice', 'Medium', 'A block of mass $m$ is placed on a frictionless inclined plane of angle $\\theta$. What is the acceleration of the block?', '$g\\sin\\theta$', '$g\\cos\\theta$', '$g\\tan\\theta$', '$g$', 'A', 'The component of gravitational force along the incline is $mg\\sin\\theta$. Using Newton\'s second law: $ma = mg\\sin\\theta$, therefore $a = g\\sin\\theta$', 'mechanics,incline,acceleration', '', 'Yes', '2022', 'JEE Main', '', '4', '1'],
      ['Physics', 'Waves', 'Simple Harmonic Motion', 'Oscillations', 'Numerical', 'Hard', 'A particle executes SHM with amplitude $A = 0.1$ m and frequency $f = 5$ Hz. Find the maximum velocity in m/s.', '', '', '', '', '3.14', 'Maximum velocity in SHM is $v_{max} = A\\omega = A(2\\pi f) = 0.1 \\times 2\\pi \\times 5 = \\pi \\approx 3.14$ m/s', 'shm,velocity,oscillation', '', 'No', '', '', 'HC Verma', '5', '1.25'],
      ['Physics', 'Electromagnetism', 'Electromagnetic Induction', 'Faraday\'s Law', 'Multiple Correct', 'Hard', 'Which of the following statements are correct about electromagnetic induction?', 'EMF is induced when magnetic flux changes', 'Lenz\'s law is based on conservation of energy', 'Induced EMF depends on the rate of change of flux', 'Induced current is always in clockwise direction', 'A,B,C', 'Statements A, B, and C are correct. The direction of induced current depends on the direction of flux change, not always clockwise.', 'emi,faraday,lenz', '', 'Yes', '2021', 'JEE Advanced', '', '4', '2']
    ];
    const physicsSheet = xlsx.utils.aoa_to_sheet(physicsData);
    xlsx.utils.book_append_sheet(wb, physicsSheet, 'Physics');
    
    // Chemistry sheet
    const chemistryData = [
      ['Subject', 'Chapter', 'Topic', 'Subtopic', 'QuestionType', 'Difficulty', 'Question', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'CorrectAnswer', 'Solution', 'Tags', 'ImageURL', 'IsPYQ', 'PYQYear', 'PYQExam', 'BookReference', 'Points', 'NegativePoints'],
      ['Chemistry', 'Physical Chemistry', 'Thermodynamics', 'First Law', 'Multiple Choice', 'Medium', 'For an isothermal reversible expansion of an ideal gas, which is correct?', '$\\Delta U = 0$', '$\\Delta H = 0$', '$q = -w$', 'All of the above', 'D', 'For isothermal process of ideal gas: $\\Delta U = 0$ (no temperature change), $\\Delta H = 0$ (as $H = U + PV = U + nRT$), and from first law: $q = -w$', 'thermodynamics,isothermal', '', 'No', '', '', '', '3', '1'],
      ['Chemistry', 'Organic Chemistry', 'Hydrocarbons', 'Alkenes', 'Multiple Choice', 'Easy', 'The general formula for alkenes is:', '$C_nH_{2n+2}$', '$C_nH_{2n}$', '$C_nH_{2n-2}$', '$C_nH_n$', 'B', 'Alkenes have one double bond and follow the general formula $C_nH_{2n}$', 'organic,alkene,formula', '', 'No', '', '', 'Morrison Boyd', '2', '0.5'],
      ['Chemistry', 'Inorganic Chemistry', 'Periodic Table', 'Periodic Properties', 'True/False', 'Easy', 'Ionization energy generally increases across a period from left to right', 'True', 'False', '', '', 'A', 'Due to increasing nuclear charge and decreasing atomic radius, ionization energy increases across a period', 'periodic table,ionization energy', '', 'Yes', '2020', 'NEET', '', '2', '0.5']
    ];
    const chemistrySheet = xlsx.utils.aoa_to_sheet(chemistryData);
    xlsx.utils.book_append_sheet(wb, chemistrySheet, 'Chemistry');
    
    // Mathematics sheet
    const mathData = [
      ['Subject', 'Chapter', 'Topic', 'Subtopic', 'QuestionType', 'Difficulty', 'Question', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'CorrectAnswer', 'Solution', 'Tags', 'ImageURL', 'IsPYQ', 'PYQYear', 'PYQExam', 'BookReference', 'Points', 'NegativePoints'],
      ['Mathematics', 'Calculus', 'Integration', 'Definite Integrals', 'Numerical', 'Medium', 'Evaluate: $\\int_{0}^{\\pi/2} \\sin^2(x) dx$', '', '', '', '', '0.785', 'Using $\\sin^2(x) = \\frac{1-\\cos(2x)}{2}$: $\\int_{0}^{\\pi/2} \\frac{1-\\cos(2x)}{2} dx = \\frac{1}{2}[x - \\frac{\\sin(2x)}{2}]_{0}^{\\pi/2} = \\frac{\\pi}{4} \\approx 0.785$', 'integration,trigonometry', '', 'Yes', '2021', 'JEE Main', '', '4', '1'],
      ['Mathematics', 'Algebra', 'Quadratic Equations', 'Nature of Roots', 'Multiple Choice', 'Easy', 'If discriminant $D < 0$, the quadratic equation has:', 'Two real and distinct roots', 'Two real and equal roots', 'Two complex conjugate roots', 'No roots', 'C', 'When $D = b^2 - 4ac < 0$, the roots are complex conjugates: $\\frac{-b \\pm i\\sqrt{|D|}}{2a}$', 'quadratic,discriminant,complex', '', 'No', '', '', 'RD Sharma', '3', '1'],
      ['Mathematics', 'Coordinate Geometry', 'Straight Lines', 'Slope', 'Fill in the Blank', 'Easy', 'The slope of a line passing through points $(x_1, y_1)$ and $(x_2, y_2)$ is ____', '', '', '', '', '(y2-y1)/(x2-x1)', 'Slope $m = \\frac{y_2 - y_1}{x_2 - x_1}$', 'coordinate geometry,slope', '', 'No', '', '', '', '2', '0.5']
    ];
    const mathSheet = xlsx.utils.aoa_to_sheet(mathData);
    xlsx.utils.book_append_sheet(wb, mathSheet, 'Mathematics');
    
    // Biology sheet
    const biologyData = [
      ['Subject', 'Chapter', 'Topic', 'Subtopic', 'QuestionType', 'Difficulty', 'Question', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'CorrectAnswer', 'Solution', 'Tags', 'ImageURL', 'IsPYQ', 'PYQYear', 'PYQExam', 'BookReference', 'Points', 'NegativePoints'],
      ['Biology', 'Cell Biology', 'Cell Structure', 'Organelles', 'Multiple Choice', 'Easy', 'Which organelle is known as the powerhouse of the cell?', 'Nucleus', 'Mitochondria', 'Golgi apparatus', 'Endoplasmic reticulum', 'B', 'Mitochondria produce ATP through cellular respiration, providing energy for cellular processes', 'cell biology,mitochondria,ATP', '', 'No', '', '', 'NCERT', '2', '0.5'],
      ['Biology', 'Genetics', 'Mendelian Genetics', 'Monohybrid Cross', 'Multiple Choice', 'Medium', 'In a monohybrid cross between Tt × Tt, what is the phenotypic ratio?', '1:1', '3:1', '1:2:1', '9:3:3:1', 'B', 'Tt × Tt produces TT, Tt, Tt, tt. If T is dominant, phenotypic ratio is 3 dominant : 1 recessive', 'genetics,mendel,monohybrid', '', 'Yes', '2020', 'NEET', '', '3', '1'],
      ['Biology', 'Ecology', 'Ecosystem', 'Food Chain', 'Short Answer', 'Easy', 'Define primary consumers in a food chain.', '', '', '', '', '', 'Primary consumers are herbivores that feed directly on producers (plants) in a food chain', 'ecology,food chain,consumers', '', 'No', '', '', '', '3', '0']
    ];
    const biologySheet = xlsx.utils.aoa_to_sheet(biologyData);
    xlsx.utils.book_append_sheet(wb, biologySheet, 'Biology');
    
    // Instructions sheet
    const instructionsData = [
      ['QUESTION IMPORT TEMPLATE INSTRUCTIONS'],
      [''],
      ['This Excel template is designed to help you import questions into the Examinr platform.'],
      [''],
      ['SHEET ORGANIZATION:'],
      ['- Each sheet represents a subject (Physics, Chemistry, Mathematics, Biology)'],
      ['- You can add questions to the appropriate subject sheet'],
      ['- The system will automatically detect the subject from the sheet name'],
      [''],
      ['REQUIRED FIELDS:'],
      ['- Subject: physics, chemistry, mathematics, or biology'],
      ['- Chapter: The chapter name'],
      ['- Topic: The specific topic within the chapter'],
      ['- QuestionType: MCQ, Multiple Correct, True/False, Numerical, Essay, Short Answer, Fill in the Blank, Matching, Matrix Match'],
      ['- Difficulty: easy, medium, hard, or expert'],
      ['- Question: The question text (supports LaTeX)'],
      ['- CorrectAnswer: The correct answer(s)'],
      [''],
      ['LATEX SUPPORT:'],
      ['- Use standard LaTeX delimiters: $...$ for inline math, $$...$$ for display math'],
      ['- Examples: $x^2 + y^2 = r^2$, $\\int_{0}^{\\infty} e^{-x} dx$'],
      [''],
      ['ANSWER FORMATS:'],
      ['- Multiple Choice: Single letter (A, B, C, D)'],
      ['- Multiple Correct: Comma-separated letters (A,C,D)'],
      ['- True/False: A for True, B for False'],
      ['- Numerical: Numeric value'],
      ['- Fill in the Blank: The answer text'],
      [''],
      ['SPECIAL CATEGORIES:'],
      ['- IsPYQ: Yes/No - Is this a Previous Year Question?'],
      ['- PYQYear: Year if it\'s a PYQ'],
      ['- PYQExam: Exam name (JEE Main, JEE Advanced, NEET, etc.)'],
      ['- BookReference: Reference book name'],
      [''],
      ['TIPS:'],
      ['- Keep one question per row'],
      ['- Ensure LaTeX expressions are properly formatted'],
      ['- Use meaningful tags for better searchability'],
      ['- Points and NegativePoints should be numeric values'],
      ['- Leave optional fields empty if not applicable']
    ];
    const instructionsSheet = xlsx.utils.aoa_to_sheet(instructionsData.map(row => [row]));
    xlsx.utils.book_append_sheet(wb, instructionsSheet, 'Instructions');
    
    return wb;
  }
  
  static saveTemplate(outputPath) {
    const wb = this.generateQuestionImportTemplate();
    xlsx.writeFile(wb, outputPath);
  }
}

module.exports = ExcelTemplateGenerator;