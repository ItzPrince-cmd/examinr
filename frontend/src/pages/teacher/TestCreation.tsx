import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

  import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Settings,
  Users,
  Calendar,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  Search,
  Filter,
  Check,
  X,
  AlertCircle,
  Clock,
  Target,
  BookOpen,
  Hash,
  Calculator} from 'lucide-react';

  import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Checkbox } from '../../components/ui/checkbox';
import { Switch } from '../../components/ui/switch';

  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { toast } from '../../components/ui/use-toast';

  import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger} from '../../components/ui/dialog';

  // Types 
  interface Question { 
    id: string;
    text: string;
    type: 'mcq' | 'numerical' | 'subjective';
    subject: string;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    marks: number;
    negativeMarks?: number;
    options?: string[];
    correctAnswer?: string | number;
    solution?: string;
    tags: string[];
  }

  interface TestConfig { 
    // Basic Info 
    title: string;
    type: 'test' | 'dpp' | 'mock';
    description: string;
    instructions: string;
    // Settings 
    duration: number; // in minutes 
    totalMarks: number;
    passingMarks?: number;
    negativeMarking: boolean;
    negativeMarkingRatio?: number;
    // Schedule 
    startDate: string;
    startTime: string;
    endDate?: string;
    endTime?: string;
    // Access 
    batches: string[];
    attemptLimit: number;
    showResult: 'immediate' | 'after-deadline' | 'manual';
    showSolution: boolean;
    // Sections 
    sections: TestSection[];
  }

  interface TestSection { 
    id: string;
    name: string;
    instructions?: string;
    questions: Question[];
  }

  const TestCreation: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1
  );const [activeTab, setActiveTab] = useState('bank'
  );const [searchQuery, setSearchQuery] = useState(''
  );const [selectedSubject, setSelectedSubject] = useState('all'
  );const [selectedDifficulty, setSelectedDifficulty] = useState('all'
  );
  const [showCreateQuestion, setShowCreateQuestion] = useState(false
  );const [testConfig, setTestConfig] = useState<TestConfig>({ title: '', type: 'test', description: '', instructions: '', duration: 60, totalMarks: 100, passingMarks: undefined, negativeMarking: false, negativeMarkingRatio: 0.25, startDate: '', startTime: '', endDate: '', endTime: '', batches: [], attemptLimit: 1, showResult: 'immediate', showSolution: true, sections: [ {id: '1',name: 'Section A',instructions: '',
      questions: []
    } ] });
    // Mock question bank 
    const [questionBank] = useState<Question[]>([
      {
        id: 'q1',
        text: 'What is the SI unit of force?',
        type: 'mcq',
        subject: 'Physics',
        topic: 'Mechanics',
        difficulty: 'easy',
        marks: 4,
        negativeMarks: 1,
        options: ['Newton','Joule','Watt','Pascal'],
        correctAnswer: 'Newton',
        solution: 'Force is measured in Newtons (N) in the SI system.',
        tags: ['SI Units','Basic Concepts']
      }, 
      {
        id: 'q2',
        text: 'Calculate the derivative of f(x) = x² + 3x - 5',
        type: 'subjective',
        subject: 'Mathematics',
        topic: 'Calculus',
        difficulty: 'medium',
        marks: 6,
        solution: "f'(x) = 2x + 3",
        tags: ['Differentiation','Polynomials']
      }, 
      {
        id: 'q3',
        text: 'What is the atomic number of Carbon?',
        type: 'numerical',
        subject: 'Chemistry',
        topic: 'Atomic Structure',
        difficulty: 'easy',
        marks: 2,
        correctAnswer: 6,
        solution: 'Carbon has 6 protons, so its atomic number is 6.',
        tags: ['Periodic Table','Basic Chemistry']
      } 
    ]);
    
    // Batches mock data 
    const [availableBatches] = useState([
      { id: '1', name: 'JEE Advanced Batch A' }, 
      { id: '2', name: 'JEE Main Batch B' }, 
      { id: '3', name: 'NEET Morning Batch' }, 
      { id: '4', name: 'Foundation Batch 2025' } 
    ]);
    
    const steps = [
      { number: 1, title: 'Basic Info', icon: FileText }, 
      { number: 2, title: 'Questions', icon: BookOpen }, 
      { number: 3, title: 'Settings', icon: Settings }, 
      {
        number: 4,
        title: 'Schedule & Access',
    icon: Calendar
    } ];
    const addQuestionToTest = (question: Question) => {
    const updatedSections = [...testConfig.sections];
    updatedSections[0].questions.push(question

    );
    setTestConfig({ ...testConfig, sections: updatedSections });
      toast({title:"Question added",description:"Question has been added to the test",

      }

    )
}

    const removeQuestionFromTest = (questionId: string) => {
      const updatedSections = testConfig.sections.map(section => ({
        ...section,
        questions: section.questions.filter(q => q.id !== questionId)
      }));
      setTestConfig({ ...testConfig, sections: updatedSections });
    };

    const calculateTotalMarks = () => {
    return testConfig.sections.reduce((total,
    section) => total + section.questions.reduce((sectionTotal,
    q) => sectionTotal + q.marks,
    0),
    0

    )
}

    const handleNext = () => {
      if (currentStep < steps.length) { setCurrentStep(currentStep + 1

      )
} else { handlePublish()
} };

    const handlePrevious = () => {
      if (currentStep > 1) { setCurrentStep(currentStep - 1

      )
} };

    const handlePublish = () => {
      // Validate test configuration 
      if (!testConfig.title) { 
        toast({
          title: "Missing title",
          description: "Please provide a title for the test",
          variant: "destructive"
        });
        return;
      } 
      
      if (testConfig.sections.every(s => s.questions.length === 0)) { 
        toast({
          title: "No questions",
          description: "Please add at least one question to the test",
          variant: "destructive"
        });
        return;
      } 
      
      // Publish test 
      toast({ 
        title: "Test published successfully", 
        description: `${testConfig.title} is now available to students`, 
      });
      navigate('/teacher/tests');
    };

    // Filter questions 
    const filteredQuestions = questionBank.filter((q) => {
      const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSubject = selectedSubject === 'all' || q.subject === selectedSubject;
      const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      return matchesSearch && matchesSubject && matchesDifficulty;
});
    const getDifficultyColor = (difficulty: string) => {switch (difficulty) { case 'easy': return 'text-green-600';case 'medium': return 'text-yellow-600';case 'hard': return 'text-red-600';default: return ''
} };

  return (<div className="min-h-screen bg-background p-6"><div className="max-w-7xl mx-auto space-y-6">
      {
    /* Header */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4" ><Button variant="ghost" size="icon" onClick={() => navigate('/teacher/dashboard')} ><ArrowLeft className="h-4 w-4" />
  </Button><div className="flex-1"><h1 className="text-3xl font-bold">Create Test/DPP</h1><p className="text-muted-foreground mt-1"> Design assessments for your students </p>
  </div><Button variant="outline" onClick={() => {
    }}><Eye className="mr-2 h-4 w-4" /> Preview </Button>
  </motion.div>
      {
    /* Progress Steps */
    }<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex justify-between items-center" >{steps.map((step, index) => ( <div key={step.number} className="flex items-center flex-1"><div className="flex flex-col items-center"><div className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${ currentStep >= step.number ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground' }`} ><step.icon className="h-5 w-5" />
    </div><span className="text-sm mt-2 text-center hidden sm:block">
      {step.title}
    </span>
    </div>{index < steps.length - 1 && ( <div className="flex-1 mx-4"><div className={`h-1 rounded transition-colors ${ currentStep > step.number ? 'bg-primary' : 'bg-muted' }`} />
    </div> )}
    </div> ))}
    </motion.div>
      {
    /* Form Content */
    }
    <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} >
      {
    /* Step 1: Basic Info */
      } {currentStep === 1 && ( <Card>
    <CardHeader>
    <CardTitle>Basic Information</CardTitle>
    <CardDescription>Set up the basic details of your test</CardDescription>
    </CardHeader><CardContent className="space-y-6"><div className="space-y-2"><Label htmlFor="title">Test Title *</Label><Input id="title" placeholder="e.g., Physics Chapter 5 Test" value={testConfig.title} onChange={(e) => setTestConfig({ ...testConfig, title: e.target.value }
      )
      } />
    </div><div className="space-y-2">
    <Label>Test Type *</Label><RadioGroup value={testConfig.type} onValueChange={(value: 'test' | 'dpp' | 'mock') => setTestConfig({ ...testConfig, type: value }
      )
      } ><div className="grid grid-cols-3 gap-4"><div className="flex items-center space-x-2"><RadioGroupItem value="test" id="test" /><Label htmlFor="test" className="cursor-pointer"> Chapter Test </Label>
    </div><div className="flex items-center space-x-2"><RadioGroupItem value="dpp" id="dpp" /><Label htmlFor="dpp" className="cursor-pointer"> DPP </Label>
    </div><div className="flex items-center space-x-2"><RadioGroupItem value="mock" id="mock" /><Label htmlFor="mock" className="cursor-pointer"> Mock Test </Label>
    </div>
    </div>
    </RadioGroup>
    </div><div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" placeholder="Brief description of the test..." value={testConfig.description} onChange={(e) => setTestConfig({ ...testConfig, description: e.target.value }
      )
      } rows={3} />
    </div><div className="space-y-2"><Label htmlFor="instructions">Instructions for Students</Label><Textarea id="instructions" placeholder="Test instructions and rules..." value={testConfig.instructions} onChange={(e) => setTestConfig({ ...testConfig, instructions: e.target.value }
      )
      } rows={4} />
    </div>
    </CardContent>
    </Card> )} {
    /* Step 2: Questions */} {currentStep === 2 && ( <div className="space-y-6">
      {
      /* Selected Questions Summary */
      }
    <Card>
    <CardHeader>
    <CardTitle>Test Overview</CardTitle>
    </CardHeader>
    <CardContent><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-sm text-muted-foreground">Total Questions</p><p className="text-2xl font-bold">
      {
      testConfig.sections.reduce((total,
      s) => total + s.questions.length,
      0)
      }
    </p>
    </div><Separator orientation="vertical" className="h-12" /><div className="space-y-1"><p className="text-sm text-muted-foreground">Total Marks</p><p className="text-2xl font-bold">
      {calculateTotalMarks()}
    </p>
    </div><Separator orientation="vertical" className="h-12" /><div className="space-y-1"><p className="text-sm text-muted-foreground">Duration</p><p className="text-2xl font-bold">
      {testConfig.duration} min</p>
    </div>
    </div>
    </CardContent>
    </Card>
      {
      /* Question Selection */
      }
    <Card>
    <CardHeader>
    <CardTitle>Add Questions</CardTitle>
    <CardDescription>Select questions from the bank or create new ones</CardDescription>
    </CardHeader><CardContent className="space-y-4">
    <Tabs value={activeTab} onValueChange={setActiveTab}><TabsList className="grid w-full grid-cols-2 max-w-[400px]"><TabsTrigger value="bank">Question Bank</TabsTrigger><TabsTrigger value="selected">Selected ({testConfig.sections[0].questions.length})</TabsTrigger>
    </TabsList><TabsContent value="bank" className="space-y-4">
      {
      /* Filters */
      }<div className="flex flex-col md:flex-row gap-4"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search questions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
    </div>
    <Select value={selectedSubject} onValueChange={setSelectedSubject}><SelectTrigger className="w-[180px]"><SelectValue placeholder="All Subjects" />
    </SelectTrigger>
    <SelectContent><SelectItem value="all">All Subjects</SelectItem><SelectItem value="Physics">Physics</SelectItem><SelectItem value="Chemistry">Chemistry</SelectItem><SelectItem value="Mathematics">Mathematics</SelectItem><SelectItem value="Biology">Biology</SelectItem>
    </SelectContent>
    </Select>
    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}><SelectTrigger className="w-[180px]"><SelectValue placeholder="All Difficulty" />
    </SelectTrigger>
    <SelectContent><SelectItem value="all">All Difficulty</SelectItem><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem>
    </SelectContent>
    </Select>
    <Button onClick={() => setShowCreateQuestion(true)}><Plus className="mr-2 h-4 w-4" /> Create New </Button>
    </div>
      {
      /* Question List */
      }<div className="space-y-4">
        {filteredQuestions.map((question) => {
          const isSelected = testConfig.sections.some(s => s.questions.some(q => q.id === question.id));
          return (
            <Card key={question.id} className={isSelected ? 'opacity-50' : ''}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {question.type.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
        {question.subject}
        </Badge><Badge variant="outline">
        {question.topic}
        </Badge><Badge variant="outline" className={getDifficultyColor(question.difficulty)} >
        {question.difficulty}
        </Badge>
        </div><p className="text-sm">
        {question.text}
        </p>{question.options && ( <div className="space-y-1 mt-2">{question.options.map((option, idx) => ( <p key={idx} className="text-sm text-muted-foreground">
            {String.fromCharCode(65 + idx)}. {option}
          </p> ))}
        </div> )}<div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>Marks: {question.marks}
        </span>
          {question.negativeMarks && ( <span>Negative: -{question.negativeMarks}
        </span> )}
        </div>
        </div><Button size="sm" variant={isSelected ?"secondary" :"default"} onClick={() => !isSelected && addQuestionToTest(question)} disabled={isSelected} >
          {isSelected ? ( <><Check className="mr-2 h-4 w-4" /> Added </> ) : ( <><Plus className="mr-2 h-4 w-4" /> Add </> )}
        </Button>
        </div>
        </div>
        </CardContent>
        </Card>
        )
}
      )
      }
    </div>
    </TabsContent><TabsContent value="selected" className="space-y-4">{testConfig.sections[0].questions.length === 0 ? ( <div className="text-center py-12"><BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-medium mb-2">No questions selected</h3><p className="text-muted-foreground"> Add questions from the question bank to build your test </p></div> ) : ( <div className="space-y-4">
        {testConfig.sections[0].questions.map((question, index) => ( <Card key={question.id}><CardContent className="p-4"><div className="flex items-start gap-4"><div className="text-2xl font-bold text-muted-foreground">
        {index + 1}
        </div><div className="flex-1 space-y-2"><div className="flex items-center gap-2"><Badge variant="outline">
        {question.type.toUpperCase()}
        </Badge><Badge variant="outline">
        {question.subject}
        </Badge><Badge variant="outline" className={getDifficultyColor(question.difficulty)} >
        {question.difficulty}
        </Badge>
        </div><p className="text-sm">
        {question.text}
        </p><div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>Marks: {question.marks}
        </span>
          {question.negativeMarks && ( <span>Negative: -{question.negativeMarks}
        </span> )}
        </div>
        </div><Button size="icon" variant="ghost" onClick={() => removeQuestionFromTest(question.id)} ><Trash2 className="h-4 w-4" />
        </Button>
        </div>
        </CardContent>
      </Card> ))}
    </div> )}
    </TabsContent>
    </Tabs>
    </CardContent>
    </Card>
    </div> )} {
    /* Step 3: Settings */
      } {currentStep === 3 && ( <Card>
    <CardHeader>
    <CardTitle>Test Settings</CardTitle>
    <CardDescription>Configure test parameters and rules</CardDescription>
    </CardHeader><CardContent className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-2"><Label htmlFor="duration">Duration (minutes) *</Label><Input id="duration" type="number" value={testConfig.duration} onChange={(e) => setTestConfig({
        ...testConfig,
        duration: parseInt(e.target.value) || 0
        }
      )} min="5" max="300" />
    </div><div className="space-y-2"><Label htmlFor="totalMarks">Total Marks</Label><Input id="totalMarks" type="number" value={calculateTotalMarks()} disabled /><p className="text-xs text-muted-foreground"> Auto-calculated based on questions </p>
    </div><div className="space-y-2"><Label htmlFor="passingMarks">Passing Marks (Optional)</Label><Input id="passingMarks" type="number" placeholder="Leave empty for no passing criteria" value={testConfig.passingMarks || ''} onChange={(e) => setTestConfig({
        ...testConfig,
        passingMarks: e.target.value ? parseInt(e.target.value) : undefined
        }
      )
      } />
    </div><div className="space-y-2"><Label htmlFor="attemptLimit">Attempt Limit</Label>
        <Select value={testConfig.attemptLimit.toString()} onValueChange={(value) => setTestConfig({ ...testConfig, attemptLimit: parseInt(value)
        }
      )
      } >
    <SelectTrigger>
    <SelectValue />
    </SelectTrigger>
    <SelectContent><SelectItem value="1">1 Attempt</SelectItem><SelectItem value="2">2 Attempts</SelectItem><SelectItem value="3">3 Attempts</SelectItem><SelectItem value="-1">Unlimited</SelectItem>
    </SelectContent>
    </Select>
    </div>
    </div>
    <Separator /><div className="space-y-4"><div className="flex items-center justify-between"><div className="space-y-0.5">
    <Label>Negative Marking</Label><p className="text-sm text-muted-foreground"> Deduct marks for incorrect answers </p>
    </div>
      <Switch checked={testConfig.negativeMarking} onCheckedChange={(checked) => setTestConfig({ ...testConfig, negativeMarking: checked }
      )
      } />
    </div>{testConfig.negativeMarking && ( <div className="pl-4 space-y-2">
      <Label>Negative Marking Ratio</Label>
          <RadioGroup value={testConfig.negativeMarkingRatio?.toString()} onValueChange={(value) => setTestConfig({
          ...testConfig,
          negativeMarkingRatio: parseFloat(value)
          }
        )
        } ><div className="flex items-center space-x-2"><RadioGroupItem value="0.25" id="nm-25" /><Label htmlFor="nm-25" className="cursor-pointer"> 1/4 (25% deduction) </Label>
      </div><div className="flex items-center space-x-2"><RadioGroupItem value="0.33" id="nm-33" /><Label htmlFor="nm-33" className="cursor-pointer"> 1/3 (33% deduction) </Label>
      </div><div className="flex items-center space-x-2"><RadioGroupItem value="0.5" id="nm-50" /><Label htmlFor="nm-50" className="cursor-pointer"> 1/2 (50% deduction) </Label>
      </div>
      </RadioGroup>
    </div> )}
    </div>
    <Separator /><div className="space-y-4"><div className="space-y-2">
    <Label>Result Display</Label><RadioGroup value={testConfig.showResult} onValueChange={(value: 'immediate' | 'after-deadline' | 'manual') => setTestConfig({ ...testConfig, showResult: value }
      )
      } ><div className="flex items-center space-x-2"><RadioGroupItem value="immediate" id="result-immediate" /><Label htmlFor="result-immediate" className="cursor-pointer"> Show immediately after submission </Label>
    </div><div className="flex items-center space-x-2"><RadioGroupItem value="after-deadline" id="result-deadline" /><Label htmlFor="result-deadline" className="cursor-pointer"> Show after test deadline </Label>
    </div><div className="flex items-center space-x-2"><RadioGroupItem value="manual" id="result-manual" /><Label htmlFor="result-manual" className="cursor-pointer"> Manual release by teacher </Label>
    </div>
    </RadioGroup>
    </div><div className="flex items-center justify-between"><div className="space-y-0.5">
    <Label>Show Solutions</Label><p className="text-sm text-muted-foreground"> Allow students to view solutions after submission </p>
    </div>
      <Switch checked={testConfig.showSolution} onCheckedChange={(checked) => setTestConfig({ ...testConfig, showSolution: checked }
      )
      } />
    </div>
    </div>
    </CardContent>
    </Card> )} {
    /* Step 4: Schedule & Access */} {currentStep === 4 && ( <div className="space-y-6">
    <Card>
    <CardHeader>
    <CardTitle>Schedule</CardTitle>
    <CardDescription>Set when the test will be available</CardDescription>
    </CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="space-y-2"><Label htmlFor="startDate">Start Date *</Label><Input id="startDate" type="date" value={testConfig.startDate} onChange={(e) => setTestConfig({ ...testConfig, startDate: e.target.value }
      )
      } />
    </div><div className="space-y-2"><Label htmlFor="startTime">Start Time *</Label><Input id="startTime" type="time" value={testConfig.startTime} onChange={(e) => setTestConfig({ ...testConfig, startTime: e.target.value }
      )
      } />
    </div><div className="space-y-2"><Label htmlFor="endDate">End Date (Optional)</Label><Input id="endDate" type="date" value={testConfig.endDate} onChange={(e) => setTestConfig({ ...testConfig, endDate: e.target.value }
      )
      } />
    </div><div className="space-y-2"><Label htmlFor="endTime">End Time</Label><Input id="endTime" type="time" value={testConfig.endTime} onChange={(e) => setTestConfig({ ...testConfig, endTime: e.target.value }
      )
      } disabled={!testConfig.endDate} />
    </div>
    </div>
    </CardContent>
    </Card>
    <Card>
    <CardHeader>
    <CardTitle>Access Control</CardTitle>
    <CardDescription>Choose which batches can take this test</CardDescription>
    </CardHeader><CardContent className="space-y-4"><div className="space-y-2">
    <Label>Select Batches *</Label><div className="space-y-2">{availableBatches.map((batch) => ( <div key={batch.id} className="flex items-center space-x-2">
          <Checkbox id={batch.id} checked={testConfig.batches.includes(batch.id)} onCheckedChange={(checked) => {
              if (checked) { setTestConfig({
              ...testConfig,
              batches: [...testConfig.batches,
              batch.id]
              }

            )
} else { setTestConfig({
              ...testConfig,
              batches: testConfig.batches.filter(id => id !== batch.id)
              }
            )
} }} /><Label htmlFor={batch.id} className="cursor-pointer">
      {batch.name}
      </Label>
    </div> ))}
    </div>
    </div>
    </CardContent>
    </Card>
      {
      /* Summary */
      }
    <Card>
    <CardHeader>
    <CardTitle>Test Summary</CardTitle>
    <CardDescription>Review your test configuration</CardDescription>
    </CardHeader>
    <CardContent><div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
    <div><p className="text-muted-foreground">Title</p><p className="font-medium">{testConfig.title || 'Not set'}
    </p>
    </div>
    <div><p className="text-muted-foreground">Type</p><p className="font-medium">
      {testConfig.type.toUpperCase()}
    </p>
    </div>
    <div><p className="text-muted-foreground">Total Questions</p><p className="font-medium">
      {
      testConfig.sections.reduce((total,
      s) => total + s.questions.length,
      0)
      }
    </p>
    </div>
    <div><p className="text-muted-foreground">Total Marks</p><p className="font-medium">
      {calculateTotalMarks()}
    </p>
    </div>
    <div><p className="text-muted-foreground">Duration</p><p className="font-medium">
      {testConfig.duration} minutes</p>
    </div>
    <div><p className="text-muted-foreground">Negative Marking</p><p className="font-medium">{testConfig.negativeMarking ? `Yes (${testConfig.negativeMarkingRatio})` : 'No'}
    </p>
    </div>
    <div><p className="text-muted-foreground">Available From</p><p className="font-medium">
      {testConfig.startDate} {testConfig.startTime}
    </p>
    </div>
    <div><p className="text-muted-foreground">Selected Batches</p><p className="font-medium">
      {testConfig.batches.length} batch(es) selected </p>
    </div>
    </div>
    </CardContent>
    </Card>
  </div> )}
    </motion.div>
      {
    /* Navigation Buttons */
    }<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between" ><Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1} ><ArrowLeft className="mr-2 h-4 w-4" /> Previous </Button><div className="flex gap-2"><Button variant="outline" onClick={() => {}}> Save as Draft </Button><Button onClick={handleNext} className={currentStep === steps.length ? 'bg-gradient-to-r from-primary to-secondary' : ''} >{currentStep === steps.length ? 'Publish Test' : 'Next'} {currentStep < steps.length && <ArrowRight className="ml-2 h-4 w-4" />}
    </Button>
  </div>
  </motion.div>
  </div>
      {
    /* Create Question Dialog */
    }
    <Dialog open={showCreateQuestion} onOpenChange={setShowCreateQuestion}><DialogContent className="max-w-2xl">
  <DialogHeader>
  <DialogTitle>Create New Question</DialogTitle>
  <DialogDescription> Add a custom question to your question bank </DialogDescription>
  </DialogHeader><div className="space-y-4 py-4"><p className="text-center text-muted-foreground"> Question creation form would go here </p>
  </div>
  <DialogFooter><Button variant="outline" onClick={() => setShowCreateQuestion(false)}> Cancel </Button>
      <Button onClick={() => {
      setShowCreateQuestion(false

      );
        toast({title:"Question created",description:"Your question has been added to the bank",

        }

      )
}}> Create Question </Button>
  </DialogFooter>
  </DialogContent>
  </Dialog>
  </div>
  )
}

export default TestCreation;
