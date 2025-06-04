import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

  import {
  Filter,
  Download,
  FileText,
  Plus,
  Flag,
  Copy,
  Trash2,
  ChevronRight,
  Search,
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Clock,
  BookOpen,
  Hash,
  GraduationCap,
  Target,
  Shuffle,
  Eye,
  EyeOff} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';

  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { toast } from '../../components/ui/use-toast';

  import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';

// Types 
interface Question { 
  id: string;
  serialNumber: number;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'mcq' | 'numerical' | 'subjective' | 'assertion';
  question: string;
  options?: string[];
  correctAnswer?: string;
  solution: string;
  marks: number;
  usedCount: number;
  tags: string[];
  createdAt: Date;
  lastUsed?: Date
}

// Mock Data 
const mockQuestions: Question[] = [
  {id: 'PHY001',
  serialNumber: 1,
  subject: 'Physics',
  chapter: 'Mechanics',
  topic: 'Newton\'s Laws',
  difficulty: 'medium',
  type: 'mcq',
  question: 'A block of mass 5 kg is placed on a rough horizontal surface with coefficient of friction μ = 0.2. If a horizontal force of 15 N is applied on the block, find the acceleration of the block. (g = 10 m/s²)',
  options: [ 'a) 1 m/s²','b) 2 m/s²','c) 3 m/s²','d) The block does not move' ],
  correctAnswer: 'a',
  solution: 'Given: m = 5 kg, μ = 0.2, F = 15 N, g = 10 m/s²\n\nMaximum static friction = μmg = 0.2 × 5 × 10 = 10 N\n\nSince applied force (15 N) > maximum static friction (10 N), the block will move.\n\nNet force = Applied force - Kinetic friction\n= 15 - μmg = 15 - 10 = 5 N\n\nAcceleration = Net force / mass = 5/5 = 1 m/s²',
  marks: 4,
  usedCount: 12,tags: ['friction','newton-laws','dynamics'],createdAt: new Date('2024-01-15'),lastUsed: new Date('2024-03-10')
    }, {id: 'CHE002',
  serialNumber: 2,subject: 'Chemistry',chapter: 'Chemical Bonding',topic: 'Hybridization',difficulty: 'hard',type: 'mcq',question: 'Which of the following molecules has sp³d² hybridization?',options: [ 'a) SF₆','b) PCl₅','c) ClF₃','d) XeF₄' ],correctAnswer: 'a',solution: 'SF₆ has sp³d² hybridization.\n\nElectronic configuration of S: [Ne] 3s² 3p⁴\n\nIn SF₆:\n- S uses all 6 valence electrons to form 6 bonds with F atoms\n- Requires 6 hybrid orbitals: 1s + 3p + 2d = sp³d²\n- Geometry: Octahedral\n\nOther options:\n- PCl₅: sp³d (Trigonal bipyramidal)\n- ClF₃: sp³d (T-shaped)\n- XeF₄: sp³d² (Square planar)',
  marks: 4,
  usedCount: 8,tags: ['hybridization','vsepr','molecular-geometry'],createdAt: new Date('2024-01-20'),lastUsed: new Date('2024-03-05')
    }, {id: 'MAT003',
  serialNumber: 3,subject: 'Mathematics',chapter: 'Calculus',topic: 'Differentiation',difficulty: 'easy',type: 'numerical',question: 'Find the derivative of f(x) = x³ - 3x² + 2x - 5 at x = 2.',correctAnswer: '2',solution: 'Given: f(x) = x³ - 3x² + 2x - 5\n\nf\'(x) = 3x² - 6x + 2\n\nAt x = 2:\nf\'(2) = 3(2)² - 6(2) + 2\n= 3(4) - 12 + 2\n= 12 - 12 + 2\n= 2',
  marks: 3,
  usedCount: 15,tags: ['differentiation','polynomial','basic-calculus'],createdAt: new Date('2024-02-01'),lastUsed: new Date('2024-03-12')
} ];

  const QuestionBankPage: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(mockQuestions[0]

  );
    const [filters, setFilters] = useState({subject: 'all',chapter: 'all',topic: 'all',difficulty: 'all',type: 'all'
    });const [searchQuery, setSearchQuery] = useState(''
  );
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]

  );
  const [showUsedQuestions, setShowUsedQuestions] = useState(true);
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [showSolution, setShowSolution] = useState(true);
  
  // Filter questions based on criteria 
  const filteredQuestions = mockQuestions.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         q.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filters.subject === 'all' || q.subject === filters.subject;
    const matchesChapter = filters.chapter === 'all' || q.chapter === filters.chapter;
    const matchesTopic = filters.topic === 'all' || q.topic === filters.topic;
    const matchesDifficulty = filters.difficulty === 'all' || q.difficulty === filters.difficulty;
    const matchesType = filters.type === 'all' || q.type === filters.type;
    const matchesUsed = showUsedQuestions || q.usedCount === 0;
    return matchesSearch && matchesSubject && matchesChapter && matchesTopic && matchesDifficulty && matchesType && matchesUsed;
  });
  const handleQuestionSelect = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) { 
      setSelectedQuestions(prev => prev.filter(id => id !== questionId));
    } else {
      setSelectedQuestions(prev => [...prev, questionId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedQuestions.length === filteredQuestions.length) { 
      setSelectedQuestions([]);
    } else { 
      setSelectedQuestions(filteredQuestions.map(q => q.id));
    }
  };

    const handleFetchQuestions = () => {
    toast({ title:"Fetching Questions", description: `Found ${filteredQuestions.length} questions matching your criteria.`, }

    )
}

    const handleGeneratePaper = () => {
        if (selectedQuestions.length === 0) { toast({title:"No Questions Selected",description:"Please select questions to generate a paper.",variant:"destructive"
        });
      return} toast({ title:"Paper Generated", description: `Generated paper with ${selectedQuestions.length} questions.`, }

    )
}

    const handleCreateDPP = () => {
        if (selectedQuestions.length === 0) { toast({title:"No Questions Selected",description:"Please select questions to create a DPP.",variant:"destructive"
        });
      return} toast({ title:"DPP Created", description: `Created DPP with ${selectedQuestions.length} questions.`, }

    )
}

    const handleReportQuestion = (questionId: string) => {
      toast({title:"Question Reported",description:"Thank you for reporting. We'll review this question.",

      }

    )
}

    const getDifficultyColor = (difficulty: string) => {
      switch (difficulty) { case 'easy': return 'bg-green-500';case 'medium': return 'bg-yellow-500';case 'hard': return 'bg-red-500';default: return 'bg-gray-500'
} };
const getTypeIcon = (type: string) => {switch (type) { case 'mcq': return <CheckCircle2 className="h-4 w-4" />;case 'numerical': return <Hash className="h-4 w-4" />;case 'subjective': return <FileText className="h-4 w-4" />;case 'assertion': return <AlertCircle className="h-4 w-4" />;
      default: return null
} };

  return (<div className="container max-w-[1600px] py-8 space-y-8">
      {
    /* Header */
    }<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <div><h1 className="text-4xl font-bold tracking-tight">Question Bank</h1><p className="text-lg text-muted-foreground mt-1">Browse and manage your question repository</p>
  </div><div className="flex gap-4"><Button size="lg" variant="outline" onClick={() => setShowSolution(!showSolution)}>{showSolution ? <Eye className="h-5 w-5 mr-2" /> : <EyeOff className="h-5 w-5 mr-2" />} {showSolution ? 'Hide' : 'Show'} Solutions </Button><Button size="lg" variant="outline"><Plus className="h-5 w-5 mr-2" /> Add Question </Button>
  </div>
  </div>
      {
    /* Filters Card */
    }<Card className="shadow-lg"><CardHeader className="pb-6"><CardTitle className="text-xl flex items-center gap-2"><Filter className="h-6 w-6" /> Filters & Settings </CardTitle>
  </CardHeader><CardContent className="space-y-6">
      {
    /* Filter Dropdowns */
    }<div className="grid gap-6 md:grid-cols-5"><div className="space-y-3"><Label htmlFor="subject" className="text-base font-medium">Subject</Label>
    <Select value={filters.subject} onValueChange={(value) => setFilters({...filters, subject: value}
    )
    }><SelectTrigger id="subject" className="h-12 text-base"><SelectValue placeholder="Select subject" />
  </SelectTrigger>
  <SelectContent><SelectItem value="all">All Subjects</SelectItem><SelectItem value="Physics">Physics</SelectItem><SelectItem value="Chemistry">Chemistry</SelectItem><SelectItem value="Mathematics">Mathematics</SelectItem><SelectItem value="Biology">Biology</SelectItem>
  </SelectContent>
  </Select>
  </div><div className="space-y-3"><Label htmlFor="chapter" className="text-base font-medium">Chapter</Label>
    <Select value={filters.chapter} onValueChange={(value) => setFilters({...filters, chapter: value}
    )
    }><SelectTrigger id="chapter" className="h-12 text-base"><SelectValue placeholder="Select chapter" />
  </SelectTrigger>
  <SelectContent><SelectItem value="all">All Chapters</SelectItem><SelectItem value="Mechanics">Mechanics</SelectItem><SelectItem value="Chemical Bonding">Chemical Bonding</SelectItem><SelectItem value="Calculus">Calculus</SelectItem>
  </SelectContent>
  </Select>
  </div><div className="space-y-3"><Label htmlFor="topic" className="text-base font-medium">Topic</Label>
    <Select value={filters.topic} onValueChange={(value) => setFilters({...filters, topic: value}
    )
    }><SelectTrigger id="topic" className="h-12 text-base"><SelectValue placeholder="Select topic" />
  </SelectTrigger>
  <SelectContent><SelectItem value="all">All Topics</SelectItem><SelectItem value="Newton's Laws">Newton's Laws</SelectItem><SelectItem value="Hybridization">Hybridization</SelectItem><SelectItem value="Differentiation">Differentiation</SelectItem>
  </SelectContent>
  </Select>
  </div><div className="space-y-3"><Label htmlFor="difficulty" className="text-base font-medium">Difficulty</Label>
    <Select value={filters.difficulty} onValueChange={(value) => setFilters({...filters, difficulty: value}
    )
    }><SelectTrigger id="difficulty" className="h-12 text-base"><SelectValue placeholder="Select difficulty" />
  </SelectTrigger>
  <SelectContent><SelectItem value="all">All Levels</SelectItem><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem>
  </SelectContent>
  </Select>
  </div><div className="space-y-3"><Label htmlFor="type" className="text-base font-medium">Question Type</Label>
    <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value}
    )
    }><SelectTrigger id="type" className="h-12 text-base"><SelectValue placeholder="Select type" />
  </SelectTrigger>
  <SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="mcq">MCQ</SelectItem><SelectItem value="numerical">Numerical</SelectItem><SelectItem value="subjective">Subjective</SelectItem><SelectItem value="assertion">Assertion-Reason</SelectItem>
  </SelectContent>
  </Select>
  </div>
  </div>
  <Separator />
      {
    /* Settings and Actions */
    }<div className="flex flex-wrap items-center justify-between gap-6"><div className="flex flex-wrap gap-6"><div className="flex items-center space-x-3"><Switch id="used-questions" checked={showUsedQuestions} onCheckedChange={setShowUsedQuestions} className="scale-125" /><Label htmlFor="used-questions" className="text-base cursor-pointer">Show Used Questions</Label>
  </div><div className="flex items-center space-x-3"><Switch id="auto-generate" checked={autoGenerate} onCheckedChange={setAutoGenerate} className="scale-125" /><Label htmlFor="auto-generate" className="text-base cursor-pointer">Auto-generate Similar</Label>
  </div>
  </div><div className="flex gap-3"><Button size="lg" onClick={handleFetchQuestions}><RefreshCw className="h-5 w-5 mr-2" /> Fetch Questions </Button><Button size="lg" variant="outline" onClick={handleSelectAll}>{selectedQuestions.length === filteredQuestions.length ? 'Deselect All' : 'Select All'}
    </Button>
  </div>
  </div>
  </CardContent>
  </Card>
      {
    /* Main Content Area */
    }<div className="grid gap-8 lg:grid-cols-12">
      {
    /* Question List (Left Side) */
    }<Card className="lg:col-span-3 shadow-lg"><CardHeader className="pb-4"><CardTitle className="text-lg flex items-center justify-between">
  <span>Questions ({filteredQuestions.length})</span><Badge variant="secondary" className="text-sm px-3 py-1">
      {selectedQuestions.length} selected</Badge>
  </CardTitle>
  </CardHeader><CardContent className="p-0"><ScrollArea className="h-[750px]"><div className="p-6 space-y-3">
      {filteredQuestions.map((question) => ( <TooltipProvider key={question.id}>
    <Tooltip>
    <TooltipTrigger asChild><motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${ selectedQuestion?.id === question.id ? 'bg-gray-100 dark:bg-gray-800 border-gray-400 dark:border-gray-600 shadow-lg ring-2 ring-gray-300 dark:ring-gray-700' : ' dark: dark: border-transparent' }`} onClick={() => setSelectedQuestion(question)} ><div className="flex items-start gap-4"><Checkbox checked={selectedQuestions.includes(question.id)} onCheckedChange={() => handleQuestionSelect(question.id)} onClick={(e) => e.stopPropagation()} className="mt-1 h-5 w-5" /><div className="flex-1 min-w-0"><div className="flex items-center gap-3 mb-2"><span className="font-bold text-lg">#{question.serialNumber}
    </span><Badge variant="outline" className="text-sm px-2 py-0.5">
      {question.id}
    </Badge>
    </div><div className="flex items-center gap-3 text-sm">
    <Badge className={`${getDifficultyColor(question.difficulty)} text-white px-3 py-1`}>
      {question.difficulty}
    </Badge><span className="flex items-center gap-1">
      {getTypeIcon(question.type)}<span className="text-xs">
      {question.type.toUpperCase()}
    </span>
    </span>{question.usedCount > 0 && ( <span className="text-muted-foreground text-xs"> Used {question.usedCount}x </span> )}
    </div>
    </div>
    </div>
    </motion.div>
    </TooltipTrigger><TooltipContent side="right" className="max-w-md p-4"><p className="font-medium mb-1">
      {question.subject} - {question.chapter}
    </p><p className="text-sm">
      {question.question.substring(0, 100)}...</p>
    </TooltipContent>
    </Tooltip>
  </TooltipProvider> ))}
    </div>
  </ScrollArea>
  </CardContent>
  </Card>
      {
    /* Question Display (Middle) */
    }<Card className="lg:col-span-5 shadow-lg"><CardHeader className="pb-6"><CardTitle className="text-xl flex items-center justify-between">
  <span>Question</span>{selectedQuestion && ( <div className="flex gap-3"><Button size="sm" variant="ghost" className="h-10 w-10"><Copy className="h-5 w-5" />
    </Button><Button size="sm" variant="ghost" className="h-10 w-10" onClick={() => handleReportQuestion(selectedQuestion.id)}><Flag className="h-5 w-5" />
    </Button>
  </div> )}
    </CardTitle>
  </CardHeader><CardContent className="px-8">{selectedQuestion ? ( <div className="space-y-6">
      {
      /* Question Metadata */
      }<div className="flex flex-wrap gap-3"><Badge variant="outline" className="text-base px-4 py-2"><BookOpen className="h-4 w-4 mr-2" />
      {selectedQuestion.subject}
    </Badge><Badge variant="outline" className="text-base px-4 py-2"><GraduationCap className="h-4 w-4 mr-2" />
      {selectedQuestion.chapter}
    </Badge><Badge variant="outline" className="text-base px-4 py-2"><Target className="h-4 w-4 mr-2" />
      {selectedQuestion.topic}
    </Badge><Badge variant="outline" className="text-base px-4 py-2"> Marks: {selectedQuestion.marks}
    </Badge>
    </div>
    <Separator />
      {
      /* Question Content */
      }<div className="space-y-4"><p className="text-xl font-medium leading-relaxed">
      {selectedQuestion.question}
    </p>{selectedQuestion.options && ( <div className="space-y-3 ml-6">{selectedQuestion.options.map((option, index) => ( <div key={index} className={`p-4 rounded-lg text-lg border-2 ${ showSolution && option.startsWith(selectedQuestion.correctAnswer!) ? 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-800' : 'border-border' }`} >
        {option}</div> ))}</div> )} {selectedQuestion.type === 'numerical' && showSolution && ( <div className="p-5 rounded-lg bg-green-50 dark:bg-green-950/20 border-2 border-green-300 dark:border-green-800"><p className="font-medium text-lg">Answer: {selectedQuestion.correctAnswer}
      </p>
    </div> )}
    </div>
      {
      /* Question Stats */
      }<div className="flex items-center gap-6 text-base text-muted-foreground"><span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Created: {selectedQuestion.createdAt.toLocaleDateString()}
    </span>{selectedQuestion.lastUsed && ( <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Last used: {selectedQuestion.lastUsed.toLocaleDateString()}
    </span> )}
    </div>
      {
      /* Tags */
      }<div className="flex flex-wrap gap-2">{selectedQuestion.tags.map((tag, index) => ( <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
      {tag}
    </Badge> ))}
    </div></div> ) : ( <p className="text-center text-muted-foreground py-16 text-lg"> Select a question to view details </p> )}
    </CardContent>
  </Card>
      {
    /* Solution Display (Right) */
    }<Card className="lg:col-span-4 shadow-lg"><CardHeader className="pb-6"><CardTitle className="text-xl">Solution</CardTitle>
  </CardHeader><CardContent className="px-8">{selectedQuestion && showSolution ? ( <div className="space-y-6"><div className="prose dark:prose-invert max-w-none"><pre className="whitespace-pre-wrap font-sans text-lg leading-relaxed bg-muted/30 p-6 rounded-lg">
      {selectedQuestion.solution}
    </pre>
    </div>
      {
      /* Additional Solution Info */
      }<div className="mt-6 p-5 rounded-lg bg-muted/50"><p className="text-base font-medium mb-3">Key Concepts:</p><div className="flex flex-wrap gap-2">{selectedQuestion.tags.map((tag, index) => ( <Badge key={index} variant="outline" className="text-sm px-3 py-1">
      {tag}
    </Badge> ))}
    </div>
    </div></div> ) : ( <p className="text-center text-muted-foreground py-16 text-lg">{!selectedQuestion ? 'Select a question to view solution' : 'Solutions are hidden'}
    </p> )}
    </CardContent>
  </Card>
  </div>
      {
    /* Action Buttons */
    }<Card className="shadow-lg"><CardContent className="py-8"><div className="flex flex-wrap gap-4 justify-center"><Button size="lg" onClick={handleGeneratePaper} disabled={selectedQuestions.length === 0} className="px-8 py-6 text-lg" ><FileText className="h-6 w-6 mr-3" /> Generate Paper ({selectedQuestions.length} questions) </Button><Button size="lg" variant="outline" onClick={handleCreateDPP} disabled={selectedQuestions.length === 0} className="px-8 py-6 text-lg" ><FileSpreadsheet className="h-6 w-6 mr-3" /> Create DPP </Button><Button size="lg" variant="outline" className="px-8 py-6 text-lg"><Shuffle className="h-6 w-6 mr-3" /> Randomize Order </Button><Button size="lg" variant="outline" className="px-8 py-6 text-lg"><Download className="h-6 w-6 mr-3" /> Export Selected </Button>
  </div>
  </CardContent>
  </Card>
  </div>
  )
}

export default QuestionBankPage;
