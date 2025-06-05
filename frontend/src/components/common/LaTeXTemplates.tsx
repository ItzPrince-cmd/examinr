import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import LaTeXRenderer from './LaTeXRenderer';
import {
  Search,
  Copy,
  Check,
  FileText,
  Atom,
  Beaker,  // Using Beaker instead of Flask
  Calculator,
  Dna,
  Star,
  Clock,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LaTeXTemplate {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  latex: string;
  description: string;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  tags: string[];
  usage?: number;
  lastUsed?: Date;
}

interface LaTeXTemplatesProps {
  onInsert?: (template: LaTeXTemplate) => void;
  onCopy?: (template: LaTeXTemplate) => void;
  subject?: string;
  showFavorites?: boolean;
  className?: string;
}

// Comprehensive template library
const templateLibrary: LaTeXTemplate[] = [
  // Physics Templates
  // Mechanics
  { id: 'phys-mech-1', name: 'Velocity', category: 'physics', subcategory: 'mechanics', latex: '$v = \\frac{\\Delta x}{\\Delta t}$', description: 'Average velocity formula', difficulty: 'basic', tags: ['kinematics', 'velocity'] },
  { id: 'phys-mech-2', name: 'Acceleration', category: 'physics', subcategory: 'mechanics', latex: '$a = \\frac{\\Delta v}{\\Delta t}$', description: 'Average acceleration', difficulty: 'basic', tags: ['kinematics', 'acceleration'] },
  { id: 'phys-mech-3', name: 'Kinematic Equation 1', category: 'physics', subcategory: 'mechanics', latex: '$v = v_0 + at$', description: 'Velocity-time relation', difficulty: 'basic', tags: ['kinematics'] },
  { id: 'phys-mech-4', name: 'Kinematic Equation 2', category: 'physics', subcategory: 'mechanics', latex: '$x = x_0 + v_0t + \\frac{1}{2}at^2$', description: 'Position-time relation', difficulty: 'intermediate', tags: ['kinematics'] },
  { id: 'phys-mech-5', name: 'Kinematic Equation 3', category: 'physics', subcategory: 'mechanics', latex: '$v^2 = v_0^2 + 2a\\Delta x$', description: 'Velocity-displacement relation', difficulty: 'intermediate', tags: ['kinematics'] },
  { id: 'phys-mech-6', name: "Newton's Second Law", category: 'physics', subcategory: 'mechanics', latex: '$\\vec{F} = m\\vec{a}$', description: 'Force equals mass times acceleration', difficulty: 'basic', tags: ['forces', 'newton'] },
  { id: 'phys-mech-7', name: 'Gravitational Force', category: 'physics', subcategory: 'mechanics', latex: '$F = G\\frac{m_1m_2}{r^2}$', description: "Newton's law of gravitation", difficulty: 'intermediate', tags: ['gravity', 'forces'] },
  { id: 'phys-mech-8', name: 'Centripetal Force', category: 'physics', subcategory: 'mechanics', latex: '$F_c = \\frac{mv^2}{r}$', description: 'Force in circular motion', difficulty: 'intermediate', tags: ['circular motion', 'forces'] },
  
  // Energy
  { id: 'phys-energy-1', name: 'Kinetic Energy', category: 'physics', subcategory: 'energy', latex: '$KE = \\frac{1}{2}mv^2$', description: 'Energy of motion', difficulty: 'basic', tags: ['energy', 'kinetic'] },
  { id: 'phys-energy-2', name: 'Potential Energy', category: 'physics', subcategory: 'energy', latex: '$PE = mgh$', description: 'Gravitational potential energy', difficulty: 'basic', tags: ['energy', 'potential'] },
  { id: 'phys-energy-3', name: 'Work Done', category: 'physics', subcategory: 'energy', latex: '$W = \\vec{F} \\cdot \\vec{d} = Fd\\cos\\theta$', description: 'Work done by a force', difficulty: 'intermediate', tags: ['work', 'energy'] },
  { id: 'phys-energy-4', name: 'Power', category: 'physics', subcategory: 'energy', latex: '$P = \\frac{W}{t} = \\frac{dE}{dt}$', description: 'Rate of energy transfer', difficulty: 'intermediate', tags: ['power', 'energy'] },
  
  // Waves
  { id: 'phys-wave-1', name: 'Wave Speed', category: 'physics', subcategory: 'waves', latex: '$v = f\\lambda$', description: 'Wave speed relation', difficulty: 'basic', tags: ['waves', 'frequency'] },
  { id: 'phys-wave-2', name: 'Simple Harmonic Motion', category: 'physics', subcategory: 'waves', latex: '$x(t) = A\\cos(\\omega t + \\phi)$', description: 'SHM displacement', difficulty: 'intermediate', tags: ['SHM', 'oscillations'] },
  { id: 'phys-wave-3', name: 'Wave Equation', category: 'physics', subcategory: 'waves', latex: '$\\frac{\\partial^2 y}{\\partial t^2} = v^2 \\frac{\\partial^2 y}{\\partial x^2}$', description: 'General wave equation', difficulty: 'advanced', tags: ['waves', 'differential equations'] },
  
  // Electricity
  { id: 'phys-elec-1', name: "Ohm's Law", category: 'physics', subcategory: 'electricity', latex: '$V = IR$', description: 'Voltage-current relation', difficulty: 'basic', tags: ['electricity', 'resistance'] },
  { id: 'phys-elec-2', name: 'Electric Power', category: 'physics', subcategory: 'electricity', latex: '$P = IV = I^2R = \\frac{V^2}{R}$', description: 'Power in circuits', difficulty: 'intermediate', tags: ['electricity', 'power'] },
  { id: 'phys-elec-3', name: "Coulomb's Law", category: 'physics', subcategory: 'electricity', latex: '$F = k\\frac{q_1q_2}{r^2}$', description: 'Electrostatic force', difficulty: 'intermediate', tags: ['electrostatics', 'forces'] },
  
  // Chemistry Templates
  // General Chemistry
  { id: 'chem-gen-1', name: 'Ideal Gas Law', category: 'chemistry', subcategory: 'general', latex: '$PV = nRT$', description: 'Ideal gas equation', difficulty: 'basic', tags: ['gases', 'thermodynamics'] },
  { id: 'chem-gen-2', name: 'pH Definition', category: 'chemistry', subcategory: 'general', latex: '$\\text{pH} = -\\log[H^+]$', description: 'pH from hydrogen ion concentration', difficulty: 'basic', tags: ['acids', 'pH'] },
  { id: 'chem-gen-3', name: 'Rate Law', category: 'chemistry', subcategory: 'general', latex: '$\\text{Rate} = k[A]^m[B]^n$', description: 'Chemical reaction rate', difficulty: 'intermediate', tags: ['kinetics', 'rate'] },
  { id: 'chem-gen-4', name: 'Equilibrium Constant', category: 'chemistry', subcategory: 'general', latex: '$K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}$', description: 'Equilibrium expression', difficulty: 'intermediate', tags: ['equilibrium'] },
  { id: 'chem-gen-5', name: 'Gibbs Free Energy', category: 'chemistry', subcategory: 'general', latex: '$\\Delta G = \\Delta H - T\\Delta S$', description: 'Gibbs energy change', difficulty: 'intermediate', tags: ['thermodynamics'] },
  
  // Chemical Structures
  { id: 'chem-struct-1', name: 'Water', category: 'chemistry', subcategory: 'structures', latex: '$\\ce{H2O}$', description: 'Water molecule', difficulty: 'basic', tags: ['molecules', 'inorganic'] },
  { id: 'chem-struct-2', name: 'Sulfuric Acid', category: 'chemistry', subcategory: 'structures', latex: '$\\ce{H2SO4}$', description: 'Sulfuric acid', difficulty: 'basic', tags: ['acids', 'inorganic'] },
  { id: 'chem-struct-3', name: 'Benzene', category: 'chemistry', subcategory: 'structures', latex: '$\\ce{C6H6}$', description: 'Benzene ring', difficulty: 'intermediate', tags: ['organic', 'aromatic'] },
  
  // Reactions
  { id: 'chem-rxn-1', name: 'Combustion', category: 'chemistry', subcategory: 'reactions', latex: '$\\ce{CH4 + 2O2 -> CO2 + 2H2O}$', description: 'Methane combustion', difficulty: 'basic', tags: ['combustion', 'organic'] },
  { id: 'chem-rxn-2', name: 'Acid-Base', category: 'chemistry', subcategory: 'reactions', latex: '$\\ce{HCl + NaOH -> NaCl + H2O}$', description: 'Neutralization reaction', difficulty: 'basic', tags: ['acid-base', 'neutralization'] },
  { id: 'chem-rxn-3', name: 'Redox', category: 'chemistry', subcategory: 'reactions', latex: '$\\ce{2Fe^{2+} + Cl2 -> 2Fe^{3+} + 2Cl-}$', description: 'Oxidation-reduction', difficulty: 'intermediate', tags: ['redox', 'electrons'] },
  
  // Mathematics Templates
  // Algebra
  { id: 'math-alg-1', name: 'Quadratic Formula', category: 'mathematics', subcategory: 'algebra', latex: '$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$', description: 'Solutions to quadratic equation', difficulty: 'intermediate', tags: ['quadratic', 'equations'] },
  { id: 'math-alg-2', name: 'Binomial Theorem', category: 'mathematics', subcategory: 'algebra', latex: '$(a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k$', description: 'Binomial expansion', difficulty: 'advanced', tags: ['binomial', 'expansion'] },
  { id: 'math-alg-3', name: 'Geometric Series', category: 'mathematics', subcategory: 'algebra', latex: '$S_n = a\\frac{1-r^n}{1-r}$', description: 'Sum of geometric series', difficulty: 'intermediate', tags: ['series', 'geometric'] },
  
  // Calculus
  { id: 'math-calc-1', name: 'Derivative Definition', category: 'mathematics', subcategory: 'calculus', latex: '$f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$', description: 'Definition of derivative', difficulty: 'intermediate', tags: ['derivative', 'limits'] },
  { id: 'math-calc-2', name: 'Integration by Parts', category: 'mathematics', subcategory: 'calculus', latex: '$\\int u\\,dv = uv - \\int v\\,du$', description: 'Integration technique', difficulty: 'intermediate', tags: ['integration', 'techniques'] },
  { id: 'math-calc-3', name: 'Chain Rule', category: 'mathematics', subcategory: 'calculus', latex: '$\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$', description: 'Composite function derivative', difficulty: 'intermediate', tags: ['derivative', 'chain rule'] },
  { id: 'math-calc-4', name: 'Taylor Series', category: 'mathematics', subcategory: 'calculus', latex: '$f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n$', description: 'Taylor expansion', difficulty: 'advanced', tags: ['series', 'taylor'] },
  
  // Linear Algebra
  { id: 'math-linalg-1', name: 'Matrix Multiplication', category: 'mathematics', subcategory: 'linear algebra', latex: '$\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} \\begin{bmatrix} e & f \\\\ g & h \\end{bmatrix} = \\begin{bmatrix} ae+bg & af+bh \\\\ ce+dg & cf+dh \\end{bmatrix}$', description: '2x2 matrix multiplication', difficulty: 'intermediate', tags: ['matrices', 'multiplication'] },
  { id: 'math-linalg-2', name: 'Determinant 2x2', category: 'mathematics', subcategory: 'linear algebra', latex: '$\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$', description: '2x2 determinant', difficulty: 'basic', tags: ['determinant', 'matrices'] },
  { id: 'math-linalg-3', name: 'Eigenvalue Equation', category: 'mathematics', subcategory: 'linear algebra', latex: '$A\\vec{v} = \\lambda\\vec{v}$', description: 'Eigenvalue definition', difficulty: 'advanced', tags: ['eigenvalues', 'eigenvectors'] },
  
  // Statistics
  { id: 'math-stat-1', name: 'Mean', category: 'mathematics', subcategory: 'statistics', latex: '$\\bar{x} = \\frac{1}{n}\\sum_{i=1}^{n} x_i$', description: 'Sample mean', difficulty: 'basic', tags: ['mean', 'average'] },
  { id: 'math-stat-2', name: 'Standard Deviation', category: 'mathematics', subcategory: 'statistics', latex: '$\\sigma = \\sqrt{\\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\bar{x})^2}$', description: 'Population standard deviation', difficulty: 'intermediate', tags: ['variance', 'deviation'] },
  { id: 'math-stat-3', name: 'Normal Distribution', category: 'mathematics', subcategory: 'statistics', latex: '$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$', description: 'Gaussian distribution', difficulty: 'advanced', tags: ['normal', 'distribution'] },
  
  // Biology Templates
  { id: 'bio-gen-1', name: 'Hardy-Weinberg', category: 'biology', subcategory: 'genetics', latex: '$p^2 + 2pq + q^2 = 1$', description: 'Genotype frequencies', difficulty: 'intermediate', tags: ['genetics', 'population'] },
  { id: 'bio-gen-2', name: 'Population Growth', category: 'biology', subcategory: 'ecology', latex: '$\\frac{dN}{dt} = rN\\left(1 - \\frac{N}{K}\\right)$', description: 'Logistic growth model', difficulty: 'intermediate', tags: ['population', 'ecology'] },
];

const LaTeXTemplates: React.FC<LaTeXTemplatesProps> = ({
  onInsert,
  onCopy,
  subject,
  showFavorites = false,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const { toast } = useToast();

  // Filter templates
  const filteredTemplates = templateLibrary.filter(template => {
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      template.latex.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    const matchesSubject = !subject || template.category === subject.toLowerCase();
    const matchesFavorites = !showFavorites || favorites.has(template.id);
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesSubject && matchesFavorites;
  });

  // Group by category and subcategory
  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = {};
    }
    if (!acc[template.category][template.subcategory]) {
      acc[template.category][template.subcategory] = [];
    }
    acc[template.category][template.subcategory].push(template);
    return acc;
  }, {} as Record<string, Record<string, LaTeXTemplate[]>>);

  const handleCopy = async (template: LaTeXTemplate) => {
    await navigator.clipboard.writeText(template.latex);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
    
    // Update recently used
    setRecentlyUsed(prev => [template.id, ...prev.filter(id => id !== template.id)].slice(0, 10));
    
    if (onCopy) {
      onCopy(template);
    }
    
    toast({
      title: 'Copied!',
      description: `${template.name} formula copied to clipboard`,
      duration: 2000,
    });
  };

  const handleInsert = (template: LaTeXTemplate) => {
    if (onInsert) {
      onInsert(template);
    }
    
    // Update recently used
    setRecentlyUsed(prev => [template.id, ...prev.filter(id => id !== template.id)].slice(0, 10));
  };

  const toggleFavorite = (templateId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(templateId)) {
        newFavorites.delete(templateId);
      } else {
        newFavorites.add(templateId);
      }
      return newFavorites;
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'physics': return <Atom className="h-4 w-4" />;
      case 'chemistry': return <Beaker className="h-4 w-4" />;
      case 'mathematics': return <Calculator className="h-4 w-4" />;
      case 'biology': return <Dna className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'basic': return 'text-green-600';
      case 'intermediate': return 'text-yellow-600';
      case 'advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className={cn('latex-templates', className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>LaTeX Formula Templates</span>
          <div className="flex items-center gap-2">
            {recentlyUsed.length > 0 && (
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                {recentlyUsed.length} recent
              </Badge>
            )}
            {favorites.size > 0 && (
              <Badge variant="secondary">
                <Star className="h-3 w-3 mr-1" />
                {favorites.size} favorites
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="physics">Physics</TabsTrigger>
              <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
              <TabsTrigger value="mathematics">Math</TabsTrigger>
              <TabsTrigger value="biology">Biology</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Difficulty Filter */}
        <div className="flex gap-2 mb-4">
          <Badge
            variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedDifficulty('all')}
          >
            All Levels
          </Badge>
          <Badge
            variant={selectedDifficulty === 'basic' ? 'default' : 'outline'}
            className={cn('cursor-pointer', selectedDifficulty === 'basic' && 'bg-green-100')}
            onClick={() => setSelectedDifficulty('basic')}
          >
            Basic
          </Badge>
          <Badge
            variant={selectedDifficulty === 'intermediate' ? 'default' : 'outline'}
            className={cn('cursor-pointer', selectedDifficulty === 'intermediate' && 'bg-yellow-100')}
            onClick={() => setSelectedDifficulty('intermediate')}
          >
            Intermediate
          </Badge>
          <Badge
            variant={selectedDifficulty === 'advanced' ? 'default' : 'outline'}
            className={cn('cursor-pointer', selectedDifficulty === 'advanced' && 'bg-red-100')}
            onClick={() => setSelectedDifficulty('advanced')}
          >
            Advanced
          </Badge>
        </div>

        {/* Templates */}
        <ScrollArea className="h-[500px] pr-4">
          {Object.entries(groupedTemplates).map(([category, subcategories]) => (
            <div key={category} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                {getCategoryIcon(category)}
                <h3 className="font-semibold capitalize">{category}</h3>
              </div>
              
              {Object.entries(subcategories).map(([subcategory, templates]) => (
                <div key={subcategory} className="mb-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2 capitalize">
                    {subcategory}
                  </h4>
                  <div className="grid gap-2">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={cn(
                          "group relative p-3 rounded-lg border transition-all",
                          "hover:bg-accent hover:shadow-sm",
                          recentlyUsed.includes(template.id) && "border-primary/20"
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-sm">{template.name}</h5>
                              <span className={cn(
                                "text-xs",
                                getDifficultyColor(template.difficulty)
                              )}>
                                {template.difficulty}
                              </span>
                              {recentlyUsed.includes(template.id) && (
                                <Badge variant="secondary" className="text-xs">
                                  <Clock className="h-2 w-2 mr-1" />
                                  Recent
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {template.description}
                            </p>
                            <div className="mb-2">
                              <LaTeXRenderer
                                content={template.latex}
                                inline
                                className="text-sm"
                              />
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {template.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => toggleFavorite(template.id)}
                            >
                              <Star className={cn(
                                "h-4 w-4",
                                favorites.has(template.id) && "fill-current text-yellow-500"
                              )} />
                            </Button>
                            {onInsert && (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleInsert(template)}
                              >
                                Insert
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => handleCopy(template)}
                            >
                              {copiedId === template.id ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No templates found matching your criteria
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LaTeXTemplates;