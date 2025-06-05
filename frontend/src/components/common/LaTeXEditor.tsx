import React, { useState, useCallback, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import LaTeXRenderer, { containsLatex, extractLatexExpressions } from './LaTeXRenderer';
import { 
  Calculator, 
  Sigma, 
  Divide, 
  X, 
  Superscript, 
  Subscript,
  Hash,  // Using Hash instead of SquareRoot
  Infinity,
  Pi,
  ChevronDown,
  Copy,
  Check,
  FileText,
  Beaker,  // Using Beaker instead of Flask
  Atom,
  Binary,
  Dna
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LaTeXEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  className?: string;
  showTemplates?: boolean;
  autoFocus?: boolean;
  onValidate?: (isValid: boolean, errors: string[]) => void;
}

interface SymbolGroup {
  name: string;
  icon: React.ReactNode;
  symbols: Array<{
    latex: string;
    display: string;
    description: string;
  }>;
}

const symbolGroups: SymbolGroup[] = [
  {
    name: 'Basic Math',
    icon: <Calculator className="h-4 w-4" />,
    symbols: [
      { latex: '\\frac{a}{b}', display: '\\frac{a}{b}', description: 'Fraction' },
      { latex: '\\sqrt{x}', display: '\\sqrt{x}', description: 'Square root' },
      { latex: '\\sqrt[n]{x}', display: '\\sqrt[n]{x}', description: 'Nth root' },
      { latex: 'x^{n}', display: 'x^n', description: 'Superscript' },
      { latex: 'x_{n}', display: 'x_n', description: 'Subscript' },
      { latex: '\\pm', display: '\\pm', description: 'Plus-minus' },
      { latex: '\\times', display: '\\times', description: 'Times' },
      { latex: '\\div', display: '\\div', description: 'Division' },
      { latex: '\\neq', display: '\\neq', description: 'Not equal' },
      { latex: '\\approx', display: '\\approx', description: 'Approximately' },
      { latex: '\\leq', display: '\\leq', description: 'Less than or equal' },
      { latex: '\\geq', display: '\\geq', description: 'Greater than or equal' },
    ]
  },
  {
    name: 'Greek Letters',
    icon: <Sigma className="h-4 w-4" />,
    symbols: [
      { latex: '\\alpha', display: '\\alpha', description: 'Alpha' },
      { latex: '\\beta', display: '\\beta', description: 'Beta' },
      { latex: '\\gamma', display: '\\gamma', description: 'Gamma' },
      { latex: '\\delta', display: '\\delta', description: 'Delta' },
      { latex: '\\epsilon', display: '\\epsilon', description: 'Epsilon' },
      { latex: '\\theta', display: '\\theta', description: 'Theta' },
      { latex: '\\lambda', display: '\\lambda', description: 'Lambda' },
      { latex: '\\mu', display: '\\mu', description: 'Mu' },
      { latex: '\\pi', display: '\\pi', description: 'Pi' },
      { latex: '\\sigma', display: '\\sigma', description: 'Sigma' },
      { latex: '\\phi', display: '\\phi', description: 'Phi' },
      { latex: '\\omega', display: '\\omega', description: 'Omega' },
    ]
  },
  {
    name: 'Calculus',
    icon: <Binary className="h-4 w-4" />,
    symbols: [
      { latex: '\\frac{d}{dx}', display: '\\frac{d}{dx}', description: 'Derivative' },
      { latex: '\\frac{\\partial}{\\partial x}', display: '\\frac{\\partial}{\\partial x}', description: 'Partial derivative' },
      { latex: '\\int', display: '\\int', description: 'Integral' },
      { latex: '\\int_{a}^{b}', display: '\\int_a^b', description: 'Definite integral' },
      { latex: '\\sum_{i=1}^{n}', display: '\\sum_{i=1}^n', description: 'Sum' },
      { latex: '\\prod_{i=1}^{n}', display: '\\prod_{i=1}^n', description: 'Product' },
      { latex: '\\lim_{x \\to \\infty}', display: '\\lim_{x \\to \\infty}', description: 'Limit' },
      { latex: '\\nabla', display: '\\nabla', description: 'Gradient' },
    ]
  },
  {
    name: 'Matrices',
    icon: <FileText className="h-4 w-4" />,
    symbols: [
      { latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', display: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', description: 'Parentheses matrix' },
      { latex: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}', display: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}', description: 'Bracket matrix' },
      { latex: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}', display: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}', description: 'Determinant' },
      { latex: '\\vec{v}', display: '\\vec{v}', description: 'Vector' },
      { latex: '\\cdot', display: '\\cdot', description: 'Dot product' },
      { latex: '\\times', display: '\\times', description: 'Cross product' },
    ]
  },
  {
    name: 'Physics',
    icon: <Atom className="h-4 w-4" />,
    symbols: [
      { latex: '\\hbar', display: '\\hbar', description: 'Reduced Planck constant' },
      { latex: '\\angstrom', display: '\\text{Å}', description: 'Angstrom' },
      { latex: '\\degree', display: '°', description: 'Degree' },
      { latex: '\\vec{F} = m\\vec{a}', display: '\\vec{F} = m\\vec{a}', description: "Newton's second law" },
      { latex: 'E = mc^2', display: 'E = mc^2', description: 'Mass-energy equivalence' },
      { latex: '\\psi', display: '\\psi', description: 'Wave function' },
    ]
  },
  {
    name: 'Chemistry',
    icon: <Beaker className="h-4 w-4" />,
    symbols: [
      { latex: '\\ce{H2O}', display: '\\ce{H2O}', description: 'Water' },
      { latex: '\\ce{CO2}', display: '\\ce{CO2}', description: 'Carbon dioxide' },
      { latex: '\\ce{H+ + OH- -> H2O}', display: '\\ce{H+ + OH- -> H2O}', description: 'Reaction' },
      { latex: '\\rightleftharpoons', display: '\\rightleftharpoons', description: 'Equilibrium' },
      { latex: '\\rightarrow', display: '\\rightarrow', description: 'Reaction arrow' },
      { latex: '\\Delta H', display: '\\Delta H', description: 'Enthalpy change' },
    ]
  }
];

const templates = {
  physics: [
    { name: 'Velocity', latex: '$v = \\frac{\\Delta x}{\\Delta t}$' },
    { name: 'Acceleration', latex: '$a = \\frac{\\Delta v}{\\Delta t}$' },
    { name: 'Force', latex: '$F = ma$' },
    { name: 'Kinetic Energy', latex: '$KE = \\frac{1}{2}mv^2$' },
    { name: 'Momentum', latex: '$p = mv$' },
    { name: "Ohm's Law", latex: '$V = IR$' },
  ],
  chemistry: [
    { name: 'Ideal Gas', latex: '$PV = nRT$' },
    { name: 'pH Formula', latex: '$\\text{pH} = -\\log[H^+]$' },
    { name: 'Rate Law', latex: '$\\text{Rate} = k[A]^m[B]^n$' },
    { name: 'Equilibrium', latex: '$K = \\frac{[C]^c[D]^d}{[A]^a[B]^b}$' },
  ],
  mathematics: [
    { name: 'Quadratic Formula', latex: '$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$' },
    { name: 'Binomial Theorem', latex: '$(a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k$' },
    { name: 'Derivative Definition', latex: '$\\frac{d}{dx}[f(x)] = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$' },
    { name: 'Integration by Parts', latex: '$\\int u\\,dv = uv - \\int v\\,du$' },
  ]
};

const LaTeXEditor: React.FC<LaTeXEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter text with LaTeX expressions...\nUse $ for inline math and $$ for display math.',
  height = 400,
  className,
  showTemplates = true,
  autoFocus = false,
  onValidate
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);
  const editorRef = useRef<any>(null);
  const { toast } = useToast();

  // Validate LaTeX on change
  useEffect(() => {
    if (onValidate && containsLatex(value)) {
      const expressions = extractLatexExpressions(value);
      const errors: string[] = [];
      
      expressions.forEach(expr => {
        try {
          // Try to render with KaTeX to validate
          require('katex').renderToString(expr.expression, { throwOnError: true });
        } catch (error) {
          errors.push(`Invalid LaTeX at position ${expr.startIndex}: ${error}`);
        }
      });
      
      onValidate(errors.length === 0, errors);
    }
  }, [value, onValidate]);

  // Insert symbol at cursor
  const insertSymbol = useCallback((latex: string) => {
    if (editorRef.current) {
      const textarea = editorRef.current.textarea;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + latex + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + latex.length, start + latex.length);
      }, 0);
    }
  }, [value, onChange]);

  // Copy symbol to clipboard
  const copySymbol = useCallback((latex: string) => {
    navigator.clipboard.writeText(latex).then(() => {
      setCopiedSymbol(latex);
      setTimeout(() => setCopiedSymbol(null), 2000);
      toast({
        title: 'Copied!',
        description: 'LaTeX symbol copied to clipboard',
        duration: 2000,
      });
    });
  }, [toast]);

  // Insert template
  const insertTemplate = useCallback((template: string) => {
    const newValue = value + (value ? '\n\n' : '') + template;
    onChange(newValue);
    setActiveTab('preview');
  }, [value, onChange]);

  return (
    <div className={cn('latex-editor', className)}>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'write' | 'preview')}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            {/* Symbol Palette */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calculator className="h-4 w-4 mr-2" />
                  Symbols
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[600px] p-0" align="end">
                <ScrollArea className="h-[400px]">
                  <div className="p-4">
                    <h4 className="font-medium mb-4">LaTeX Symbols</h4>
                    {symbolGroups.map((group) => (
                      <div key={group.name} className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          {group.icon}
                          <h5 className="font-medium">{group.name}</h5>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {group.symbols.map((symbol) => (
                            <div
                              key={symbol.latex}
                              className="group relative"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start font-mono text-xs"
                                onClick={() => insertSymbol(symbol.latex)}
                              >
                                <LaTeXRenderer
                                  content={`$${symbol.display}$`}
                                  inline
                                  className="mr-2"
                                />
                                <span className="text-muted-foreground">
                                  {symbol.description}
                                </span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copySymbol(symbol.latex);
                                }}
                              >
                                {copiedSymbol === symbol.latex ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>

            {/* Templates */}
            {showTemplates && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Templates
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="end">
                  <ScrollArea className="h-[300px]">
                    <div className="p-4">
                      <h4 className="font-medium mb-4">Formula Templates</h4>
                      {Object.entries(templates).map(([category, items]) => (
                        <div key={category} className="mb-4">
                          <h5 className="text-sm font-medium capitalize mb-2">{category}</h5>
                          <div className="space-y-1">
                            {items.map((template) => (
                              <Button
                                key={template.name}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => insertTemplate(template.latex)}
                              >
                                <span className="mr-2">{template.name}:</span>
                                <LaTeXRenderer
                                  content={template.latex}
                                  inline
                                  className="text-xs"
                                />
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        <TabsContent value="write" className="mt-0">
          <MDEditor
            ref={editorRef}
            value={value}
            onChange={(val) => onChange(val || '')}
            preview="edit"
            hideToolbar
            height={height}
            data-color-mode="light"
            textareaProps={{
              placeholder,
              autoFocus,
            }}
          />
          <div className="mt-2 text-xs text-muted-foreground">
            Use $ for inline math (e.g., $x^2$) and $$ for display math (e.g., $$\\int_0^1 x dx$$)
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <Card>
            <CardContent className="p-6" style={{ minHeight: height }}>
              {value ? (
                <LaTeXRenderer content={value} />
              ) : (
                <p className="text-muted-foreground">Nothing to preview</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LaTeXEditor;