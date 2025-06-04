import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

  import {
  Trophy,
  Clock,
  Target,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BookOpen,
  BarChart3,
  Download,
  Share2,
  Eye,
  ChevronRight,
  Award,
  Brain,
  Zap,
  RotateCcw,
  Lightbulb} from 'lucide-react';

  import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Separator } from '../../components/ui/separator';

  import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

// Types
interface TestResult {
  testDetails: {
    id: string;
    title: string;
    duration: number;
    totalQuestions: number;
    totalMarks: number;
    sections: Array<{
      id: string;
      name: string;
      questions: Array<{
        id: string;
        question: string;
        options: string[];
        correctAnswer: number;
        marks: number;
        negativeMarks: number;
      }>;
    }>;
  };
  answers: Record<string, {
    selectedOption: number;
    timeTaken: number;
    marked: boolean;
  }>;
  totalTimeTaken: number;
  timeRemaining: number;
}

interface SectionAnalysis {
  sectionName: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  marksObtained: number;
  totalMarks: number;
  accuracy: number;
  avgTimePerQuestion: number
}

  const TestResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSolutionDialog, setShowSolutionDialog] = useState(false
  );
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null

  );
  // Get test data from navigation state
  const testData = location.state as TestResult || mockTestResult();
  
  // Mock data generator for demo
  function mockTestResult(): TestResult {
    return {
      testDetails: {
        id: '1',
        title: 'JEE Main Mock Test - Full Syllabus',
        duration: 10800,
        totalQuestions: 90,
        totalMarks: 360,
        sections: [
          {
            id: 'physics',
            name: 'Physics',
            questions: Array.from({ length: 30 }, (_, i) => ({
              id: `p${i + 1}`,
              question: `Physics question ${i + 1}`,
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: Math.floor(Math.random() * 4),
              marks: 4,
              negativeMarks: -1
            }))
          },
          {
            id: 'chemistry',
            name: 'Chemistry',
            questions: Array.from({ length: 30 }, (_, i) => ({
              id: `c${i + 1}`,
              question: `Chemistry question ${i + 1}`,
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: Math.floor(Math.random() * 4),
              marks: 4,
              negativeMarks: -1
            }))
          },
          {
            id: 'mathematics',
            name: 'Mathematics',
            questions: Array.from({ length: 30 }, (_, i) => ({
              id: `m${i + 1}`,
              question: `Mathematics question ${i + 1}`,
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: Math.floor(Math.random() * 4),
              marks: 4,
              negativeMarks: -1
            }))
          }
        ]
      },
      answers: {},
      totalTimeTaken: 9000,
      timeRemaining: 1800
    };
  }
  
  // Generate random answers for demo
  if (Object.keys(testData.answers).length === 0) {
    testData.testDetails.sections.forEach(section => {
      section.questions.forEach((question, index) => {
        if (Math.random() > 0.1) { // 90% attempted
          testData.answers[question.id] = {
            selectedOption: Math.floor(Math.random() * 4),
            timeTaken: 60 + Math.random() * 120,
            marked: Math.random() > 0.8
          };
        }
      });
    });
  }
  
  // Calculate results
  const calculateResults = () => {
    let totalMarksObtained = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalAttempted = 0;
    const allQuestions = testData.testDetails.sections.flatMap(s => s.questions);
    
    allQuestions.forEach(question => {
      const answer = testData.answers[question.id];
      if (answer?.selectedOption !== undefined) {
        totalAttempted++;
        if (answer.selectedOption === question.correctAnswer) {
          totalCorrect++;
          totalMarksObtained += question.marks;
        } else {
          totalIncorrect++;
          totalMarksObtained += question.negativeMarks;
        }
      }
    });
    const totalQuestions = allQuestions.length;
    const accuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;
    const percentile = Math.min(95, Math.max(20, totalMarksObtained / testData.testDetails.totalMarks * 100 + Math.random() * 20));
    
    return {
      totalMarksObtained,
      totalCorrect,
      totalIncorrect,
      totalAttempted,
      totalUnattempted: totalQuestions - totalAttempted,
      accuracy,
      percentile,
      totalQuestions
      }
    }

  // Calculate section-wise analysis
  const calculateSectionAnalysis = (): SectionAnalysis[] => {
    return testData.testDetails.sections.map(section => {
      let correct = 0;
      let incorrect = 0;
      let attempted = 0;
      let marksObtained = 0;
      let totalTime = 0;
      
      section.questions.forEach(question => {
        const answer = testData.answers[question.id];
        if (answer?.selectedOption !== undefined) {
          attempted++;
          totalTime += answer.timeTaken || 0;
          if (answer.selectedOption === question.correctAnswer) {
            correct++;
            marksObtained += question.marks;
          } else {
            incorrect++;
            marksObtained += question.negativeMarks;
          }
        }
      });
      
      const totalMarks = section.questions.reduce((sum, q) => sum + q.marks, 0);
      const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
      const avgTimePerQuestion = attempted > 0 ? totalTime / attempted : 0;
        return {
        sectionName: section.name,
        totalQuestions: section.questions.length,
        attempted,
        correct,
        incorrect,
        marksObtained,
        totalMarks,
        accuracy,
        avgTimePerQuestion
        }
      }

    )
}

  const results = calculateResults();
  const sectionAnalysis = calculateSectionAnalysis();
  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  // Get performance message
  const getPerformanceMessage = () => {
    const percentage = (results.totalMarksObtained / testData.testDetails.totalMarks) * 100;
    if (percentage >= 80) return {
      message: "Outstanding Performance! 🎉",
      color: "text-green-500"
    };
    if (percentage >= 60) return {
      message: "Good Performance! 👏",
      color: "text-blue-500"
    };
    if (percentage >= 40) return {
      message: "Average Performance 📚",
      color: "text-yellow-500"
    };
    return {
      message: "Needs Improvement 💪",
      color: "text-red-500"
    };
  };

  const performance = getPerformanceMessage();
  // Show solution for a question
  const showSolution = (question: any, section: any) => {
    setSelectedQuestion({ ...question, section });
    setShowSolutionDialog(true);
  };

  return (<div className="min-h-screen bg-background p-6"><div className="max-w-7xl mx-auto space-y-6">
      {
    /* Header */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2" ><h1 className="text-3xl font-bold">Test Results</h1><p className="text-muted-foreground">
      {testData.testDetails.title}
    </p>
  </motion.div>
      {
    /* Score Card */
    }
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} ><Card className="border-2"><CardHeader className="text-center pb-4"><Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
  <CardTitle className={`text-4xl ${performance.color}`}>
      {results.totalMarksObtained} / {testData.testDetails.totalMarks}
    </CardTitle><CardDescription className="text-lg mt-2">
      {performance.message}
    </CardDescription>
  </CardHeader>
  <CardContent><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"><div className="text-center p-4 bg-muted rounded-lg"><p className="text-2xl font-bold text-green-500">
      {results.totalCorrect}
    </p><p className="text-sm text-muted-foreground">Correct</p>
  </div><div className="text-center p-4 bg-muted rounded-lg"><p className="text-2xl font-bold text-red-500">
      {results.totalIncorrect}
    </p><p className="text-sm text-muted-foreground">Incorrect</p>
  </div><div className="text-center p-4 bg-muted rounded-lg"><p className="text-2xl font-bold text-gray-500">
      {results.totalUnattempted}
    </p><p className="text-sm text-muted-foreground">Unattempted</p>
  </div><div className="text-center p-4 bg-muted rounded-lg"><p className="text-2xl font-bold text-blue-500">
      {results.accuracy.toFixed(1)}%</p><p className="text-sm text-muted-foreground">Accuracy</p>
  </div>
  </div><div className="space-y-4">
  <div><div className="flex justify-between items-center mb-2"><span className="text-sm font-medium">Percentile</span><span className="text-sm font-bold">
      {results.percentile.toFixed(1)}%</span>
  </div><Progress value={results.percentile} className="h-3" /><p className="text-xs text-muted-foreground mt-1"> You performed better than {results.percentile.toFixed(1)}% of students </p>
  </div><div className="flex items-center justify-between pt-4"><div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><span className="text-sm"> Time Taken: {formatTime(testData.totalTimeTaken)}
    </span>
  </div><div className="flex gap-2"><Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Download Report </Button><Button variant="outline" size="sm"><Share2 className="mr-2 h-4 w-4" /> Share </Button>
  </div>
  </div>
  </div>
  </CardContent>
  </Card>
  </motion.div>
      {
    /* Detailed Analysis */
    }<Tabs defaultValue="section" className="space-y-4">
  <TabsList><TabsTrigger value="section">Section Analysis</TabsTrigger><TabsTrigger value="questions">Question Review</TabsTrigger><TabsTrigger value="time">Time Analysis</TabsTrigger>
  </TabsList>
      {
    /* Section Analysis */
    }<TabsContent value="section" className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sectionAnalysis.map((section, index) => ( <motion.div key={section.sectionName} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} >
    <Card>
    <CardHeader><CardTitle className="text-lg">
      {section.sectionName}
    </CardTitle>
    <CardDescription>
      {section.marksObtained} / {section.totalMarks} marks </CardDescription>
    </CardHeader><CardContent className="space-y-4"><div className="space-y-2"><div className="flex justify-between text-sm">
    <span>Questions Attempted</span><span className="font-medium">
      {section.attempted}/{section.totalQuestions}
    </span>
    </div><Progress value={(section.attempted / section.totalQuestions) * 100} className="h-2" />
    </div><div className="grid grid-cols-3 gap-2 text-center">
    <div><p className="text-lg font-bold text-green-500">
      {section.correct}
    </p><p className="text-xs text-muted-foreground">Correct</p>
    </div>
    <div><p className="text-lg font-bold text-red-500">
      {section.incorrect}
    </p><p className="text-xs text-muted-foreground">Wrong</p>
    </div>
    <div><p className="text-lg font-bold text-blue-500">
      {section.accuracy.toFixed(1)}%</p><p className="text-xs text-muted-foreground">Accuracy</p>
    </div>
    </div><div className="pt-2 border-t"><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Avg. Time/Question</span><span className="font-medium">
      {formatTime(section.avgTimePerQuestion)}
    </span>
    </div>
    </div>
    </CardContent>
    </Card>
  </motion.div> ))}
    </div>
  </TabsContent>
      {
    /* Question Review */
    }<TabsContent value="questions">
  <Card>
  <CardHeader>
  <CardTitle>Question-wise Review</CardTitle>
  <CardDescription> Review your answers and see correct solutions </CardDescription>
  </CardHeader>
  <CardContent><ScrollArea className="h-[600px] pr-4">{testData.testDetails.sections.map(section => ( <div key={section.id} className="mb-8"><h3 className="font-semibold mb-4">
      {section.name}
    </h3><div className="space-y-4">
        {section.questions.map((question, qIndex) => {
        const answer = testData.answers[question.id];
        const isCorrect = answer?.selectedOption === question.correctAnswer;
        const isAttempted = answer?.selectedOption !== undefined;
        return (<div key={question.id} className={`p-4 rounded-lg border ${ !isAttempted ? 'bg-gray-50 dark:bg-gray-900' : isCorrect ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800' }`} ><div className="flex items-start justify-between"><div className="flex-1"><div className="flex items-center gap-2 mb-2"><span className="font-medium">Q{qIndex + 1}.</span>{isAttempted ? ( isCorrect ? ( <Badge variant="default" className="bg-green-500"><CheckCircle2 className="mr-1 h-3 w-3" /> Correct </Badge> ) : ( <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" /> Incorrect </Badge> ) ) : ( <Badge variant="secondary"><AlertCircle className="mr-1 h-3 w-3" /> Not Attempted </Badge> )} {answer?.marked && ( <Badge variant="outline">Marked</Badge> )}
        </div><p className="text-sm mb-2">
        {question.question}
        </p><div className="flex items-center gap-4 text-sm text-muted-foreground"><span>Your Answer: { isAttempted ? question.options[answer.selectedOption] : 'Not Answered' }
        </span>
        <span>•</span>
        <span>Correct Answer: {question.options[question.correctAnswer]}
        </span>
        </div>
        </div><Button variant="outline" size="sm" onClick={() => showSolution(question, section)} ><Eye className="mr-2 h-4 w-4" /> Solution </Button>
        </div>
        </div>
        )
}
      )
      }
    </div>
  </div> ))}
    </ScrollArea>
  </CardContent>
  </Card>
  </TabsContent>
      {
    /* Time Analysis */
    }<TabsContent value="time"><div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <Card>
  <CardHeader>
  <CardTitle>Time Distribution</CardTitle>
  <CardDescription>How you spent your time</CardDescription>
  </CardHeader>
  <CardContent><div className="space-y-4"><div className="flex items-center justify-between">
  <span>Total Test Duration</span><span className="font-semibold">
      {formatTime(testData.testDetails.duration)}
    </span>
  </div><div className="flex items-center justify-between">
  <span>Time Taken</span><span className="font-semibold">
      {formatTime(testData.totalTimeTaken)}
    </span>
  </div><div className="flex items-center justify-between">
  <span>Time Remaining</span><span className="font-semibold">
      {formatTime(testData.timeRemaining)}
    </span>
  </div>
  <Separator /><div className="space-y-3">
      {sectionAnalysis.map(section => ( <div key={section.sectionName}><div className="flex justify-between items-center mb-1"><span className="text-sm">
      {section.sectionName}
    </span><span className="text-sm font-medium">
      {formatTime(section.avgTimePerQuestion * section.attempted)}
    </span>
    </div><Progress value={ (section.avgTimePerQuestion * section.attempted / testData.totalTimeTaken) * 100 } className="h-2" />
  </div> ))}
    </div>
  </div>
  </CardContent>
  </Card>
  <Card>
  <CardHeader>
  <CardTitle>Speed Analysis</CardTitle>
  <CardDescription>Question solving speed by section</CardDescription>
  </CardHeader>
  <CardContent><div className="space-y-4">{sectionAnalysis.map(section => ( <div key={section.sectionName} className="space-y-2"><div className="flex justify-between items-center"><span className="font-medium">
      {section.sectionName}
    </span><Badge variant={ section.avgTimePerQuestion < 120 ? 'default' : section.avgTimePerQuestion < 180 ? 'secondary' : 'destructive' }>
      {formatTime(section.avgTimePerQuestion)}/question </Badge>
    </div><div className="text-sm text-muted-foreground">{section.avgTimePerQuestion < 120 ? '⚡ Fast pace - Good speed!' : section.avgTimePerQuestion < 180 ? '⏱️ Moderate pace - Can improve' : '🐌 Slow pace - Need more practice' }
    </div>
  </div> ))}
    </div>
  </CardContent>
  </Card>
  </div>
  </TabsContent>
  </Tabs>
      {
    /* Action Buttons */
    }<div className="flex flex-col md:flex-row gap-4 justify-center"><Button onClick={() => navigate('/practice')}><Brain className="mr-2 h-4 w-4" /> Practice Weak Areas </Button><Button variant="outline" onClick={() => navigate('/tests')}><RotateCcw className="mr-2 h-4 w-4" /> Take Another Test </Button><Button variant="outline" onClick={() => navigate('/analytics')}><BarChart3 className="mr-2 h-4 w-4" /> View Analytics </Button>
  </div>
  </div>
      {
    /* Solution Dialog */
    }
    <Dialog open={showSolutionDialog} onOpenChange={setShowSolutionDialog}><DialogContent className="max-w-2xl">
  <DialogHeader>
  <DialogTitle>Solution</DialogTitle>
  <DialogDescription>
      {selectedQuestion?.section.name} - Question { selectedQuestion?.section.questions.findIndex((q: any) => q.id === selectedQuestion?.id) + 1 }
    </DialogDescription>
  </DialogHeader>{selectedQuestion && ( <div className="space-y-4">
    <div><h4 className="font-medium mb-2">Question:</h4>
    <p>
      {selectedQuestion.question}
    </p>
    </div>
    <div><h4 className="font-medium mb-2">Options:</h4><div className="space-y-2">{selectedQuestion.options.map((option: string, index: number) => ( <div key={index} className={`p-2 rounded ${ index === selectedQuestion.correctAnswer ? 'bg-green-100 dark:bg-green-900 font-medium' : '' }`} >
      {String.fromCharCode(65 + index)}. {option}
    </div> ))}
    </div>
    </div>
    <div><h4 className="font-medium mb-2">Explanation:</h4><p className="text-muted-foreground"> This is a detailed explanation of why option {String.fromCharCode(65 + selectedQuestion.correctAnswer)} is correct. The solution involves understanding the fundamental concepts and applying the appropriate formulas. </p>
    </div><div className="flex items-center gap-2 pt-4"><Lightbulb className="h-4 w-4 text-yellow-500" /><p className="text-sm text-muted-foreground"> Tip: Practice more questions on this topic to improve your understanding. </p>
    </div>
  </div> )}
    </DialogContent>
  </Dialog>
  </div>
  )
}

export default TestResults;
