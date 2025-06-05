const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const katex = require('katex');
const mathJax = require('mathjax-node');

// Configure MathJax
mathJax.config({
  MathJax: {
    tex: {
      packages: {'[+]': ['ams', 'physics', 'chemistry']},
      macros: {
        RR: "\\mathbb{R}",
        bold: ["\\boldsymbol{#1}", 1]
      }
    }
  }
});
mathJax.start();

class LatexService {
  constructor() {
    // Cache for rendered expressions
    this.renderCache = new Map();
    this.cacheMaxSize = 1000;
  }

  /**
   * Validate LaTeX syntax
   * @param {string} text - Text containing LaTeX
   * @returns {object} - Validation result
   */
  static validateLatex(text) {
    if (!text) return { isValid: true, errors: [] };
    
    const errors = [];
    
    // Check for unmatched delimiters
    const delimiters = [
      { open: '$$', close: '$$', name: 'display math' },
      { open: '\\[', close: '\\]', name: 'display math brackets' },
      { open: '\\(', close: '\\)', name: 'inline math parentheses' }
    ];
    
    for (const delimiter of delimiters) {
      const openCount = (text.match(new RegExp(delimiter.open.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      const closeCount = (text.match(new RegExp(delimiter.close.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      
      if (openCount !== closeCount) {
        errors.push(`Unmatched ${delimiter.name} delimiters`);
      }
    }
    
    // Check for single $ delimiters (more complex due to escaping)
    const dollarSigns = text.match(/(?<!\\)\$/g) || [];
    if (dollarSigns.length % 2 !== 0) {
      errors.push('Unmatched $ delimiter');
    }
    
    // Check for unclosed environments
    const beginMatches = text.match(/\\begin\{([^}]+)\}/g) || [];
    const endMatches = text.match(/\\end\{([^}]+)\}/g) || [];
    
    const beginEnvs = beginMatches.map(m => m.match(/\\begin\{([^}]+)\}/)[1]);
    const endEnvs = endMatches.map(m => m.match(/\\end\{([^}]+)\}/)[1]);
    
    beginEnvs.forEach(env => {
      const index = endEnvs.indexOf(env);
      if (index === -1) {
        errors.push(`Unclosed \\begin{${env}} environment`);
      } else {
        endEnvs.splice(index, 1);
      }
    });
    
    endEnvs.forEach(env => {
      errors.push(`\\end{${env}} without matching \\begin{${env}}`);
    });
    
    // Check for common LaTeX errors
    const commonErrors = [
      { pattern: /\\[a-zA-Z]+(?![a-zA-Z{])/, message: 'Possible malformed LaTeX command' },
      { pattern: /\^\s+/, message: 'Space after ^ superscript' },
      { pattern: /_\s+/, message: 'Space after _ subscript' }
    ];
    
    // Validate each expression with KaTeX
    const expressions = this.extractLatexExpressions(text);
    for (const expr of expressions) {
      try {
        katex.renderToString(expr.expression, { throwOnError: true });
      } catch (error) {
        errors.push(`Invalid LaTeX in expression: ${error.message}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
  
  /**
   * Extract LaTeX expressions from text
   * @param {string} text - Text containing LaTeX
   * @returns {array} - Array of LaTeX expressions
   */
  static extractLatexExpressions(text) {
    if (!text) return [];
    
    const expressions = [];
    
    // Extract display math
    const displayMath = [
      ...text.matchAll(/\$\$([\s\S]*?)\$\$/g),
      ...text.matchAll(/\\\[([\s\S]*?)\\\]/g)
    ];
    
    displayMath.forEach(match => {
      expressions.push({
        type: 'display',
        expression: match[1].trim(),
        fullMatch: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length
      });
    });
    
    // Extract inline math
    const inlineMath = [
      ...text.matchAll(/(?<!\$)\$(?!\$)(.*?)\$/g),
      ...text.matchAll(/\\\((.*?)\\\)/g)
    ];
    
    inlineMath.forEach(match => {
      expressions.push({
        type: 'inline',
        expression: match[1].trim(),
        fullMatch: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length
      });
    });
    
    // Extract environments
    const environments = text.matchAll(/\\begin\{([^}]+)\}([\s\S]*?)\\end\{\1\}/g);
    
    for (const match of environments) {
      expressions.push({
        type: 'environment',
        environment: match[1],
        expression: match[2].trim(),
        fullMatch: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length
      });
    }
    
    // Sort by position
    expressions.sort((a, b) => a.startIndex - b.startIndex);
    
    return expressions;
  }
  
  /**
   * Render LaTeX to HTML using KaTeX
   * @param {string} expression - LaTeX expression
   * @param {object} options - Rendering options
   * @returns {string} - Rendered HTML
   */
  static renderToHTML(expression, options = {}) {
    const defaults = {
      displayMode: false,
      throwOnError: false,
      errorColor: '#cc0000',
      macros: {
        "\\RR": "\\mathbb{R}",
        "\\NN": "\\mathbb{N}",
        "\\ZZ": "\\mathbb{Z}",
        "\\QQ": "\\mathbb{Q}",
        "\\CC": "\\mathbb{C}",
        "\\ce": "\\mathrm{#1}",  // Basic chemistry support
      },
      trust: false
    };
    
    const finalOptions = { ...defaults, ...options };
    
    // Check cache
    const cacheKey = crypto.createHash('md5').update(expression + JSON.stringify(finalOptions)).digest('hex');
    if (this.renderCache && this.renderCache.has(cacheKey)) {
      return this.renderCache.get(cacheKey);
    }
    
    try {
      const html = katex.renderToString(expression, finalOptions);
      
      // Cache the result
      if (this.renderCache) {
        if (this.renderCache.size >= this.cacheMaxSize) {
          // Remove oldest entry
          const firstKey = this.renderCache.keys().next().value;
          this.renderCache.delete(firstKey);
        }
        this.renderCache.set(cacheKey, html);
      }
      
      return html;
    } catch (error) {
      return `<span class="latex-error" style="color: ${finalOptions.errorColor}">LaTeX Error: ${error.message}</span>`;
    }
  }
  
  /**
   * Render LaTeX to SVG using MathJax
   * @param {string} expression - LaTeX expression
   * @param {object} options - Rendering options
   * @returns {Promise<string>} - SVG string
   */
  static async renderToSVG(expression, options = {}) {
    return new Promise((resolve, reject) => {
      mathJax.typeset({
        math: expression,
        format: "TeX",
        svg: true,
        ex: options.ex || 8,
        width: options.width || 100,
        linebreaks: options.linebreaks || false
      }, (data) => {
        if (data.errors) {
          reject(new Error(data.errors.join(', ')));
        } else {
          resolve(data.svg);
        }
      });
    });
  }
  
  /**
   * Render LaTeX to MathML
   * @param {string} expression - LaTeX expression
   * @param {object} options - Rendering options
   * @returns {Promise<string>} - MathML string
   */
  static async renderToMathML(expression, options = {}) {
    return new Promise((resolve, reject) => {
      mathJax.typeset({
        math: expression,
        format: "TeX",
        mml: true
      }, (data) => {
        if (data.errors) {
          reject(new Error(data.errors.join(', ')));
        } else {
          resolve(data.mml);
        }
      });
    });
  }
  
  /**
   * Process text with LaTeX and render all expressions
   * @param {string} text - Text containing LaTeX
   * @param {object} options - Processing options
   * @returns {object} - Processed text data
   */
  static async processLatexText(text, options = {}) {
    if (!text) return { original: text, containsLatex: false };
    
    const validation = this.validateLatex(text);
    const expressions = this.extractLatexExpressions(text);
    
    // Render each expression
    const renderedExpressions = [];
    for (const expr of expressions) {
      try {
        const rendered = {
          ...expr,
          html: this.renderToHTML(expr.expression, { 
            displayMode: expr.type === 'display' || expr.type === 'environment' 
          })
        };
        
        if (options.includeSVG) {
          rendered.svg = await this.renderToSVG(expr.expression);
        }
        
        if (options.includeMathML) {
          rendered.mathml = await this.renderToMathML(expr.expression);
        }
        
        renderedExpressions.push(rendered);
      } catch (error) {
        renderedExpressions.push({
          ...expr,
          error: error.message
        });
      }
    }
    
    // Generate processed text with placeholders
    let processedText = text;
    let htmlText = text;
    
    // Replace expressions with placeholders or rendered HTML
    for (let i = renderedExpressions.length - 1; i >= 0; i--) {
      const expr = renderedExpressions[i];
      if (expr.html) {
        htmlText = htmlText.slice(0, expr.startIndex) + expr.html + htmlText.slice(expr.endIndex);
      }
      processedText = processedText.slice(0, expr.startIndex) + 
                     `[LATEX_${i}]` + 
                     processedText.slice(expr.endIndex);
    }
    
    return {
      original: text,
      containsLatex: expressions.length > 0,
      expressions: renderedExpressions,
      validation: validation,
      processedText: processedText,
      htmlText: htmlText
    };
  }
  
  /**
   * Clean text for duplicate detection (removes LaTeX)
   * @param {string} text - Text containing LaTeX
   * @returns {string} - Cleaned text
   */
  static cleanTextForComparison(text) {
    if (!text) return '';
    
    // Remove all LaTeX expressions
    let cleaned = text
      .replace(/\$\$[\s\S]*?\$\$/g, '')
      .replace(/\$[^$]*?\$/g, '')
      .replace(/\\\[[\s\S]*?\\\]/g, '')
      .replace(/\\\([^)]*?\\\)/g, '')
      .replace(/\\begin\{[^}]+\}[\s\S]*?\\end\{[^}]+\}/g, '');
    
    // Remove extra whitespace and normalize
    cleaned = cleaned
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
    
    return cleaned;
  }
  
  /**
   * Generate LaTeX templates for common expressions
   * @param {string} type - Type of template
   * @returns {object} - Template data
   */
  static getLatexTemplate(type) {
    const templates = {
      // Physics templates
      physics: {
        kinematics: {
          velocity: '$v = \\frac{\\Delta x}{\\Delta t}$',
          acceleration: '$a = \\frac{\\Delta v}{\\Delta t}$',
          kinematicEq1: '$v = v_0 + at$',
          kinematicEq2: '$x = x_0 + v_0t + \\frac{1}{2}at^2$',
          kinematicEq3: '$v^2 = v_0^2 + 2a\\Delta x$'
        },
        forces: {
          newton2: '$F = ma$',
          friction: '$f = \\mu N$',
          spring: '$F = -kx$',
          gravitational: '$F = G\\frac{m_1m_2}{r^2}$'
        },
        energy: {
          kinetic: '$KE = \\frac{1}{2}mv^2$',
          potential: '$PE = mgh$',
          elastic: '$PE = \\frac{1}{2}kx^2$',
          conservation: '$E_i = E_f$'
        },
        waves: {
          waveSpeed: '$v = f\\lambda$',
          period: '$T = \\frac{1}{f}$',
          harmonicMotion: '$x(t) = A\\cos(\\omega t + \\phi)$'
        },
        electricity: {
          ohmsLaw: '$V = IR$',
          power: '$P = IV = I^2R = \\frac{V^2}{R}$',
          capacitance: '$C = \\frac{Q}{V}$',
          resistance: '$R = \\rho\\frac{L}{A}$'
        }
      },
      
      // Chemistry templates
      chemistry: {
        equations: {
          idealGas: '$PV = nRT$',
          ratelaw: 'Rate $= k[A]^m[B]^n$',
          equilibrium: '$K = \\frac{[C]^c[D]^d}{[A]^a[B]^b}$',
          pH: '$\\text{pH} = -\\log[H^+]$',
          gibbs: '$\\Delta G = \\Delta H - T\\Delta S$'
        },
        structures: {
          water: '$\\ce{H2O}$',
          benzene: '$\\ce{C6H6}$',
          sulfuricAcid: '$\\ce{H2SO4}$',
          ammonia: '$\\ce{NH3}$'
        },
        reactions: {
          combustion: '$\\ce{CH4 + 2O2 -> CO2 + 2H2O}$',
          acidBase: '$\\ce{HCl + NaOH -> NaCl + H2O}$',
          redox: '$\\ce{2Fe^{2+} + Cl2 -> 2Fe^{3+} + 2Cl-}$'
        }
      },
      
      // Mathematics templates
      mathematics: {
        algebra: {
          quadratic: '$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$',
          binomial: '$(a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k$',
          geometric: '$S_n = a\\frac{1-r^n}{1-r}$'
        },
        calculus: {
          derivative: '$\\frac{d}{dx}[f(x)] = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$',
          integral: '$\\int_a^b f(x)\\,dx = F(b) - F(a)$',
          chainRule: '$\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$',
          taylorSeries: '$f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n$'
        },
        linearAlgebra: {
          matrix: '$\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$',
          determinant: '$\\det(A) = ad - bc$',
          eigenvalue: '$Av = \\lambda v$',
          dotProduct: '$\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos\\theta$'
        },
        statistics: {
          mean: '$\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i$',
          variance: '$\\sigma^2 = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2$',
          normalDist: '$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$',
          correlation: '$r = \\frac{\\sum(x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum(x_i - \\bar{x})^2\\sum(y_i - \\bar{y})^2}}$'
        }
      },
      
      // Biology formulas
      biology: {
        genetics: {
          hardyWeinberg: '$p^2 + 2pq + q^2 = 1$',
          alleleFreq: '$p + q = 1$'
        },
        ecology: {
          growthRate: '$\\frac{dN}{dt} = rN$',
          carryingCapacity: '$\\frac{dN}{dt} = rN\\left(1 - \\frac{N}{K}\\right)$'
        }
      }
    };
    
    if (type && templates[type]) {
      return templates[type];
    }
    
    return templates;
  }
  
  /**
   * Search for LaTeX expressions in text
   * @param {string} text - Text to search in
   * @param {string} searchQuery - LaTeX expression to find
   * @returns {array} - Array of matches
   */
  static searchLatexInText(text, searchQuery) {
    const expressions = this.extractLatexExpressions(text);
    const matches = [];
    
    const normalizedQuery = searchQuery.replace(/\s+/g, '').toLowerCase();
    
    for (const expr of expressions) {
      const normalizedExpr = expr.expression.replace(/\s+/g, '').toLowerCase();
      if (normalizedExpr.includes(normalizedQuery)) {
        matches.push({
          ...expr,
          matchScore: normalizedExpr === normalizedQuery ? 1.0 : 0.5
        });
      }
    }
    
    return matches;
  }
  
  /**
   * Convert between different LaTeX delimiters
   * @param {string} text - Text containing LaTeX
   * @param {string} fromDelimiter - Source delimiter type
   * @param {string} toDelimiter - Target delimiter type
   * @returns {string} - Converted text
   */
  static convertDelimiters(text, fromDelimiter, toDelimiter) {
    const delimiters = {
      dollar: { inline: ['$', '$'], display: ['$$', '$$'] },
      bracket: { inline: ['\\(', '\\)'], display: ['\\[', '\\]'] },
      tex: { inline: ['\\begin{math}', '\\end{math}'], display: ['\\begin{displaymath}', '\\end{displaymath}'] }
    };
    
    if (!delimiters[fromDelimiter] || !delimiters[toDelimiter]) {
      throw new Error('Invalid delimiter type');
    }
    
    let result = text;
    
    // Convert display math
    const fromDisplay = delimiters[fromDelimiter].display;
    const toDisplay = delimiters[toDelimiter].display;
    result = result.replace(
      new RegExp(fromDisplay[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([\\s\\S]*?)' + fromDisplay[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      toDisplay[0] + '$1' + toDisplay[1]
    );
    
    // Convert inline math
    const fromInline = delimiters[fromDelimiter].inline;
    const toInline = delimiters[toDelimiter].inline;
    result = result.replace(
      new RegExp(fromInline[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(.*?)' + fromInline[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      toInline[0] + '$1' + toInline[1]
    );
    
    return result;
  }
  
  /**
   * Prepare LaTeX for safe storage
   * @param {string} text - Raw LaTeX text
   * @returns {object} - Storage-ready data
   */
  static prepareLaTeXForStorage(text) {
    if (!text) return { raw: '', metadata: {} };
    
    const expressions = this.extractLatexExpressions(text);
    const validation = this.validateLatex(text);
    
    return {
      raw: text,
      metadata: {
        expressionCount: expressions.length,
        hasDisplay: expressions.some(e => e.type === 'display'),
        hasInline: expressions.some(e => e.type === 'inline'),
        hasEnvironments: expressions.some(e => e.type === 'environment'),
        isValid: validation.isValid,
        hash: crypto.createHash('md5').update(text).digest('hex')
      },
      searchIndex: expressions.map(e => e.expression).join(' ')
    };
  }
}

// Create singleton instance
const latexService = new LatexService();

module.exports = LatexService;