import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';

  import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Save,
  Send,
  Pause,
  Play,
  RotateCcw,
  Home} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';

  import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Alert, AlertDescription, AlertTitle, } from '../../components/ui/alert';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';
import { toast } from '../../components/ui/use-toast';

// Types
interface Question {
  id: string;
  sectionId: string;
  sectionName: string;
  question: string;
  options: string[];
  correctAnswer?: number;
  marks: number;
  negativeMarks: number;
  diagram?: string;
  type: 'single' | 'multiple' | 'numerical';
}

interface TestDetails {
  id: string;
  title: string;
  duration: number; // in seconds
  totalQuestions: number;
  totalMarks: number;
  sections: Section[];
  instructions: string[];
}

interface Section {
  id: string;
  name: string;
  questions: Question[];
}

interface Answer {
  questionId: string;
  selectedOption: number | number[] | string;
  timeTaken: number;
  marked: boolean;
  visited: boolean;
}

  const TestInterface: React.FC = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showNavigator, setShowNavigator] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [testStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  
  // Mock test data - in real app, fetch from API
  const testDetails: TestDetails = {
    id: testId || '1',
    title: 'JEE Main Mock Test - Full Syllabus',
    duration: 10800, // 3 hours in seconds
    totalQuestions: 90,
    totalMarks: 360,
    sections: [
      {
        id: 'physics',
        name: 'Physics',
        questions: Array.from({ length: 30 }, (_, i) => ({
          id: `p${i + 1}`,
          sectionId: 'physics',
          sectionName: 'Physics',
          question: `A particle moves along a straight line with velocity v = ${3 + i} m/s. Find the acceleration at t = ${i + 1} seconds.`,
          options: [
            `${2 + i} m/s²`,
            `${3 + i} m/s²`,
            `${4 + i} m/s²`,
            `${5 + i} m/s²`
          ],
          marks: 4,
          negativeMarks: -1,
          type: 'single' as const
        }))
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        questions: Array.from({ length: 30 }, (_, i) => ({
          id: `c${i + 1}`,
          sectionId: 'chemistry',
          sectionName: 'Chemistry',
          question: `Which of the following compounds shows ${i % 2 === 0 ? 'optical' : 'geometrical'} isomerism?`,
          options: [
            'Compound A',
            'Compound B',
            'Compound C',
            'Compound D'
          ],
          marks: 4,
          negativeMarks: -1,
          type: 'single' as const
        }))
      },
      {
        id: 'mathematics',
        name: 'Mathematics',
        questions: Array.from({ length: 30 }, (_, i) => ({
          id: `m${i + 1}`,
          sectionId: 'mathematics',
          sectionName: 'Mathematics',
          question: `Solve the integral: ∫(x^${i + 2})dx`,
          options: [
            `x^${i + 3}/${i + 3} + C`,
            `x^${i + 3}/${i + 2} + C`,
            `${i + 2}x^${i + 1} + C`,
            `x^${i + 1}/${i + 1} + C`
          ],
          marks: 4,
          negativeMarks: -1,
          type: 'single' as const
        }))
      }
    ],
    instructions: [
      'This test has 3 sections: Physics, Chemistry, and Mathematics',
      'Each section contains 30 questions',
      'Each correct answer: +4 marks',
      'Each wrong answer: -1 mark',
      'Unattempted questions: 0 marks'
    ]
  };

  // Set initial time
  useEffect(() => {
    setTimeRemaining(testDetails.duration);
  }, [testDetails.duration]);

  // Get all questions flat array
  const allQuestions = testDetails.sections.flatMap(section => section.questions);
  const currentQuestion = allQuestions[currentQuestionIndex];
  
  // Timer
  useEffect(() => {
    if (isPaused || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPaused, timeRemaining]);
  
  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mark question as visited
  useEffect(() => {
    if (currentQuestion) {
      const answer = answers[currentQuestion.id];
      if (!answer?.visited) {
        setAnswers(prev => ({
          ...prev,
          [currentQuestion.id]: {
            ...prev[currentQuestion.id],
            visited: true,
            questionId: currentQuestion.id,
            selectedOption: prev[currentQuestion.id]?.selectedOption || '',
            marked: prev[currentQuestion.id]?.marked || false,
            timeTaken: prev[currentQuestion.id]?.timeTaken || 0
          }
        }));
      }
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex]);
  
  // Handle answer selection
  const handleAnswerSelect = (value: string) => {
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        questionId: currentQuestion.id,
        selectedOption: parseInt(value),
        timeTaken: (prev[currentQuestion.id]?.timeTaken || 0) + timeTaken,
        marked: prev[currentQuestion.id]?.marked || false,
        visited: true
      }
    }));
  };

  // Navigation
  const navigateToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    // Update section index if needed
    let questionCount = 0;
    for (let i = 0; i < testDetails.sections.length; i++) {
      if (index < questionCount + testDetails.sections[i].questions.length) {
        setCurrentSectionIndex(i);
        break;
      }
      questionCount += testDetails.sections[i].questions.length;
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      navigateToQuestion(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      navigateToQuestion(currentQuestionIndex - 1);
    }
  };

  // Mark for review
  const toggleMarkForReview = () => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        marked: !prev[currentQuestion.id]?.marked
      }
    }));
  };

  // Clear response
  const clearResponse = () => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[currentQuestion.id];
      return newAnswers;
    });
  };

  // Calculate stats
  const getQuestionStats = () => {
    const answered = Object.values(answers).filter(a => a.selectedOption !== '').length;
    const notAnswered = allQuestions.length - answered;
    const marked = Object.values(answers).filter(a => a.marked).length;
    const notVisited = allQuestions.length - Object.values(answers).filter(a => a.visited).length;
    return { answered, notAnswered, marked, notVisited };
  };

  // Submit handlers
  const handleAutoSubmit = () => {
    toast({
      title: "Time's Up!",
      description: "Your test has been automatically submitted."
    });
    submitTest();
  };

  const handleManualSubmit = () => {
    setShowSubmitDialog(true);
  };

  const submitTest = () => {
    const totalTimeTaken = (Date.now() - testStartTime) / 1000;
    // Navigate to results with test data
    navigate('/test/results', {
      state: {
        testDetails,
        answers,
        totalTimeTaken,
        timeRemaining
      }
    });
  };

  // Get question status color
  const getQuestionStatusColor = (questionId: string) => {
    const answer = answers[questionId];
    if (!answer?.visited) return 'bg-gray-100 dark:bg-gray-800';
    if (answer.selectedOption !== '') {
      if (answer.marked) return 'bg-purple-500 text-white';
      return 'bg-green-500 text-white';
    }
    if (answer.marked) return 'bg-yellow-500 text-white';
    return 'bg-red-500 text-white';
  };

  const stats = getQuestionStats();
  return (<div className="min-h-screen bg-background">
      {
    /* Header */
    }<div className="sticky top-0 z-50 bg-background border-b"><div className="flex items-center justify-between p-4"><div className="flex items-center gap-4"><h1 className="text-lg font-semibold">
      {testDetails.title}
    </h1><Badge variant="outline">
      {currentQuestion.sectionName}
    </Badge>
  </div><div className="flex items-center gap-4"><Button variant="outline" size="sm" onClick={() => setShowInstructions(true)} ><AlertCircle className="mr-2 h-4 w-4" /> Instructions </Button><div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg"><Clock className="h-4 w-4" /><span className={`font-mono text-lg ${timeRemaining < 600 ? 'text-red-500' : ''}`}>
      {formatTime(timeRemaining)}
    </span>
  </div><Button variant={showNavigator ?"default" :"outline"} size="sm" onClick={() => setShowNavigator(!showNavigator)} ><Grid3X3 className="h-4 w-4" />
  </Button>
  </div>
  </div>
  </div><div className="flex">
      {
    /* Main Content */
    }<div className="flex-1 p-6">
  <Card>
  <CardHeader><div className="flex items-center justify-between"><CardTitle className="text-lg"> Question {currentQuestionIndex + 1} of {allQuestions.length}
    </CardTitle><div className="flex items-center gap-2"><Badge variant="outline"> +{currentQuestion.marks} / {currentQuestion.negativeMarks}
    </Badge><Button variant={answers[currentQuestion.id]?.marked ?"default" :"outline"} size="sm" onClick={toggleMarkForReview} ><Flag className="h-4 w-4" />
  </Button>
  </div>
  </div>
  </CardHeader><CardContent className="space-y-6"><div className="text-lg leading-relaxed">
      {currentQuestion.question}
    </div>{currentQuestion.diagram && ( <div className="flex justify-center p-4 bg-muted rounded-lg"><img src={currentQuestion.diagram} alt="Question diagram" className="max-w-full h-auto" />
  </div> )}<RadioGroup value={answers[currentQuestion.id]?.selectedOption?.toString() || ''} onValueChange={handleAnswerSelect} ><div className="space-y-3">{currentQuestion.options.map((option, index) => ( <Label key={index} htmlFor={`option-${index}`} className="flex items-center space-x-3 p-4 rounded-lg border cursor-pointer" >
    <RadioGroupItem value={index.toString()} id={`option-${index}`} /><span className="flex-1">
      {option}
    </span>
  </Label> ))}
    </div>
  </RadioGroup><div className="flex justify-between pt-4"><div className="flex gap-2"><Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0} ><ChevronLeft className="mr-2 h-4 w-4" /> Previous </Button><Button variant="outline" onClick={clearResponse} disabled={!answers[currentQuestion.id]?.selectedOption} ><RotateCcw className="mr-2 h-4 w-4" /> Clear </Button>
  </div><div className="flex gap-2">
      <Button onClick={() => {
      toggleMarkForReview();
      handleNext()}} variant="secondary" > Mark & Next </Button><Button onClick={handleNext} disabled={currentQuestionIndex === allQuestions.length - 1} > Save & Next <ChevronRight className="ml-2 h-4 w-4" />
  </Button>
  </div>
  </div>
  </CardContent>
  </Card>
  </div>
      {
    /* Question Navigator */} {React.createElement(AnimatePresence as any, {}, showNavigator && ( <motion.div initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }} className="w-80 border-l bg-background p-4 h-[calc(100vh-73px)] overflow-y-auto" ><div className="space-y-4">
    <div><h3 className="font-semibold mb-3">Question Palette</h3>
      {
      /* Legend */
      }<div className="grid grid-cols-2 gap-2 text-xs mb-4"><div className="flex items-center gap-2"><div className="h-6 w-6 bg-green-500 rounded text-white flex items-center justify-center"> 0 </div>
    <span>Answered</span>
    </div><div className="flex items-center gap-2"><div className="h-6 w-6 bg-red-500 rounded text-white flex items-center justify-center"> 0 </div>
    <span>Not Answered</span>
    </div><div className="flex items-center gap-2"><div className="h-6 w-6 bg-purple-500 rounded text-white flex items-center justify-center"> 0 </div>
    <span>Marked</span>
    </div><div className="flex items-center gap-2"><div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center"> 0 </div>
    <span>Not Visited</span>
    </div>
    </div><Separator className="my-4" />
      {
      /* Stats */
      }<div className="grid grid-cols-2 gap-2 mb-4"><div className="text-center p-2 bg-muted rounded"><p className="text-2xl font-bold text-green-500">
      {stats.answered}
    </p><p className="text-xs">Answered</p>
    </div><div className="text-center p-2 bg-muted rounded"><p className="text-2xl font-bold text-red-500">
      {stats.notAnswered}
    </p><p className="text-xs">Not Answered</p>
    </div><div className="text-center p-2 bg-muted rounded"><p className="text-2xl font-bold text-purple-500">
      {stats.marked}
    </p><p className="text-xs">Marked</p>
    </div><div className="text-center p-2 bg-muted rounded"><p className="text-2xl font-bold text-gray-500">
      {stats.notVisited}
    </p><p className="text-xs">Not Visited</p>
    </div>
    </div>
    </div>
      {
      /* Section-wise Questions */
        } {testDetails.sections.map((section, sectionIdx) => ( <div key={section.id}><h4 className="font-medium mb-2">
      {section.name}
      </h4><div className="grid grid-cols-5 gap-2">
          {section.questions.map((question, qIdx) => {
          const globalIndex = testDetails.sections .slice(0, sectionIdx) .reduce((acc, s) => acc + s.questions.length, 0) + qIdx;
          return (<Button key={question.id} variant="outline" size="sm" className={`h-10 w-10 p-0 ${getQuestionStatusColor(question.id)}`} onClick={() => navigateToQuestion(globalIndex)} >
          {globalIndex + 1}
          </Button>
          )
}
        )
        }
      </div>
    </div> ))}<Separator className="my-4" /><Button className="w-full" onClick={handleManualSubmit} variant="destructive" ><Send className="mr-2 h-4 w-4" /> Submit Test </Button>
    </div>
  </motion.div> ) )}
    </div>
      {
    /* Submit Confirmation Dialog */
    }
    <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
  <DialogContent>
  <DialogHeader>
  <DialogTitle>Submit Test?</DialogTitle><DialogDescription> Are you sure you want to submit your test? You won't be able to change your answers after submission. </DialogDescription>
  </DialogHeader><div className="space-y-4"><div className="grid grid-cols-2 gap-4">
  <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-500">
      {stats.answered}
    </p><p className="text-sm text-muted-foreground">Answered</p>
  </CardContent>
  </Card>
  <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-500">
      {stats.notAnswered}
    </p><p className="text-sm text-muted-foreground">Not Answered</p>
  </CardContent>
  </Card>
  </div>
      {stats.notAnswered > 0 && ( <Alert><AlertCircle className="h-4 w-4" />
    <AlertDescription> You have {stats.notAnswered} unanswered questions. These will be marked as incorrect. </AlertDescription>
  </Alert> )}
    </div>
  <DialogFooter><Button variant="outline" onClick={() => setShowSubmitDialog(false)}> Continue Test </Button><Button variant="destructive" onClick={submitTest}> Submit Test </Button>
  </DialogFooter>
  </DialogContent>
  </Dialog>
      {
    /* Instructions Dialog */
    }
    <Dialog open={showInstructions} onOpenChange={setShowInstructions}><DialogContent className="max-w-2xl">
  <DialogHeader>
  <DialogTitle>Test Instructions</DialogTitle>
  </DialogHeader><ScrollArea className="h-[400px] pr-4"><div className="space-y-4">{testDetails.instructions.map((instruction, index) => ( <div key={index} className="flex items-start gap-2"><span className="text-primary">•</span>
    <span>
      {instruction}
    </span>
  </div> ))}
    </div>
  </ScrollArea>
  <DialogFooter>
  <Button onClick={() => setShowInstructions(false)}> Close </Button>
  </DialogFooter>
  </DialogContent>
  </Dialog>
  </div>
  )
}

export default TestInterface;
