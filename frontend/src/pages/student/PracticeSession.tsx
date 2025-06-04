import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence as AnimatePresenceBase } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Type fix for AnimatePresence
const AnimatePresence = AnimatePresenceBase as any;

import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Lightbulb,
  Check,
  X,
  Clock,
  BookOpen,
  RotateCcw,
  Home,
  BarChart,
  Eye,
  EyeOff} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Alert, AlertDescription, AlertTitle, } from '../../components/ui/alert';
import { toast } from '../../components/ui/use-toast';

// Types
interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  hints: string[];
  diagram?: string;
}

interface SessionStats {
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracy: number;
  timeSpent: number;
}

const PracticeSession: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subject = searchParams.get('subject') || 'physics';
  const topic = searchParams.get('topic');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  
  // Mock questions - in real app, fetch from API based on subject/topic
  const questions: Question[] = [
    {
      id: '1',
      question: 'A projectile is launched at an angle of 45° with an initial velocity of 20 m/s. What is the maximum height reached by the projectile? (Take g = 10 m/s²)',
      options: ['10 m', '20 m', '5 m', '15 m'],
      correctAnswer: 0,
      explanation: 'For a projectile launched at angle θ with initial velocity v, the maximum height is given by H = (v²sin²θ)/(2g). Here, v = 20 m/s, θ = 45°, g = 10 m/s². So H = (20² × sin²45°)/(2 × 10) = (400 × 0.5)/(20) = 10 m.',
      difficulty: 'medium',
      topic: 'Kinematics',
      hints: ['Remember the formula for maximum height in projectile motion', 'At 45°, sin²θ = 0.5']
    },
    {
      id: '2',
      question: 'A body of mass 2 kg is moving with a velocity of 10 m/s. What is its kinetic energy?',
      options: ['100 J', '200 J', '50 J', '150 J'],
      correctAnswer: 0,
      explanation: 'Kinetic energy is given by KE = ½mv². Here, m = 2 kg, v = 10 m/s. So KE = ½ × 2 × 10² = 1 × 100 = 100 J.',
      difficulty: 'easy',
      topic: 'Work, Energy & Power',
      hints: ['Use the formula KE = ½mv²', 'Square the velocity before multiplying']
    },
    {
      id: '3',
      question: 'The second law of thermodynamics states that:',
      options: ['Energy cannot be created or destroyed', 'The entropy of an isolated system always increases', 'Heat flows from cold to hot bodies', 'Work can be completely converted to heat'],
      correctAnswer: 1,
      explanation: 'The second law of thermodynamics states that the entropy of an isolated system always increases over time. This means that natural processes tend to move toward a state of maximum disorder or randomness.',
      difficulty: 'medium',
      topic: 'Thermodynamics',
      hints: ['Think about the direction of natural processes', 'Consider what happens to disorder in isolated systems']
    }
  ];
  const currentQuestion = questions[currentQuestionIndex];
  
  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
    setShowExplanation(false);
  };

  // Submit answer
  const handleSubmitAnswer = () => {
if (!selectedAnswer) {
  toast({
    title: "No answer selected",description: "Please select an answer before submitting",variant: "destructive"
  });
      return;
    }
    
    const answerIndex = parseInt(selectedAnswer);
    setAnswers({ ...answers, [currentQuestion.id]: answerIndex });
    setShowExplanation(true);
    
    // Track time spent on this question
    const timeOnQuestion = (Date.now() - questionStartTime) / 1000;
    // In a real app, this time tracking data would be sent to analytics
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowHint(false);
      setShowExplanation(false);
      setQuestionStartTime(Date.now());
    } else {
      setShowEndDialog(true);
    }
  };

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const previousAnswer = answers[questions[currentQuestionIndex - 1].id];
      setSelectedAnswer(previousAnswer !== undefined ? previousAnswer.toString() : '');
      setShowHint(false);
      setShowExplanation(!!previousAnswer);
    }
  };

  // Toggle mark for review
  const toggleMarkForReview = () => {
    const questionId = currentQuestion.id;
    if (markedForReview.includes(questionId)) {
      setMarkedForReview(markedForReview.filter(id => id !== questionId));
    } else {
      setMarkedForReview([...markedForReview, questionId]);
    }
  };

  // Show hint
  const handleShowHint = () => {
    setShowHint(true);
    if (!hintsUsed.includes(currentQuestionIndex)) {
      setHintsUsed([...hintsUsed, currentQuestionIndex]);
    }
  };

  // Calculate stats
  const calculateStats = (): SessionStats => {
    const attempted = Object.keys(answers).length;
    const correct = Object.entries(answers).filter(([qId, answer]) => questions.find(q => q.id === qId)?.correctAnswer === answer).length;
    const incorrect = attempted - correct;
    const skipped = questions.length - attempted;
    const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
    return {
      totalQuestions: questions.length,
      attempted,
      correct,
      incorrect,
      skipped,
      accuracy,
      timeSpent
    };
  };

  // End session
  const handleEndSession = () => {
    const stats = calculateStats();
    navigate('/practice/results', { state: { stats, questions, answers, hintsUsed } });
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
      {
        /* Header */
      }<div className="flex items-center justify-between"><div className="flex items-center gap-4"><Button variant="ghost" onClick={() => navigate('/practice')}><ChevronLeft className="mr-2 h-4 w-4" /> Back </Button>
          <div><h1 className="text-xl font-semibold capitalize">
              {subject} Practice</h1>{topic && <p className="text-sm text-muted-foreground">
              {topic}
            </p>}
          </div>
        </div><div className="flex items-center gap-4"><div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><span className="font-mono">
              {formatTime(timeSpent)}
            </span>
          </div><Button variant="outline" size="sm" onClick={() => setShowEndDialog(true)}> End Session </Button>
        </div>
      </div>
      {
        /* Progress */
      }<div className="space-y-2"><div className="flex justify-between text-sm">
          <span>Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span>
            {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete</span>
        </div>
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />
      </div>
      {
        /* Question Card */
      }
      <Card>
        <CardHeader><div className="flex items-start justify-between"><div className="space-y-2"><div className="flex items-center gap-2"><Badge variant="outline" className={`${getDifficultyColor(currentQuestion.difficulty)} text-white`}>
                  {currentQuestion.difficulty}
                </Badge><Badge variant="outline">
                  {currentQuestion.topic}
                </Badge>
              </div><CardTitle className="text-lg leading-relaxed">
                {currentQuestion.question}
              </CardTitle>
            </div><Button variant={markedForReview.includes(currentQuestion.id) ? "default" : "outline"} size="sm" onClick={toggleMarkForReview} ><Flag className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader><CardContent className="space-y-6">
          {
            /* Options */
          }
          <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}><div className="space-y-3">
              {currentQuestion.options.map((option, index) => (<motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} ><Label htmlFor={`option-${index}`} className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${showExplanation ? index === currentQuestion.correctAnswer ? 'border-green-500 bg-green-50 dark:bg-green-950' : selectedAnswer === index.toString() && index !== currentQuestion.correctAnswer ? 'border-red-500 bg-red-50 dark:bg-red-950' : 'border-border' : selectedAnswer === index.toString() ? 'border-primary bg-primary/5' : 'border-border '}`} >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} /><span className="flex-1">
                    {option}
                  </span>
                  {showExplanation && (<>{index === currentQuestion.correctAnswer && (<Check className="h-5 w-5 text-green-500" />)} {selectedAnswer === index.toString() && index !== currentQuestion.correctAnswer && (<X className="h-5 w-5 text-red-500" />)}
                  </>)}
                </Label>
              </motion.div>))}
            </div>
          </RadioGroup>
          {
            /* Hint */}
          {!showExplanation && (
            <div className="flex justify-center">
              <Button variant="outline" size="sm" onClick={handleShowHint} disabled={showHint}>
                <Lightbulb className="mr-2 h-4 w-4" />
                {showHint ? 'Hint Used' : 'Show Hint'} ({currentQuestion.hints.length} available)
              </Button>
            </div>
          )}
          
          <AnimatePresence>
            {showHint && !showExplanation && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Hint</AlertTitle>
                  <AlertDescription>
                    {currentQuestion.hints[0]}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4"><Alert className={parseInt(selectedAnswer) === currentQuestion.correctAnswer ? 'border-green-500' : 'border-red-500'}><AlertTitle className="flex items-center gap-2">
                {parseInt(selectedAnswer) === currentQuestion.correctAnswer ? (<><Check className="h-4 w-4 text-green-500" /> Correct! </>) : (<><X className="h-4 w-4 text-red-500" /> Incorrect </>)}
              </AlertTitle><AlertDescription className="mt-2"><p className="font-medium mb-2">Explanation:</p>
                <p>
                  {currentQuestion.explanation}
                </p>
              </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          
          {
            /* Action Buttons */
          }<div className="flex justify-between"><Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} ><ChevronLeft className="mr-2 h-4 w-4" /> Previous </Button>
            {!showExplanation ? (<Button onClick={handleSubmitAnswer} disabled={!selectedAnswer}> Submit Answer </Button>) : (<Button onClick={handleNextQuestion}>{currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'}<ChevronRight className="ml-2 h-4 w-4" />
            </Button>)}
          </div>
        </CardContent>
      </Card>
      {
        /* Question Navigation */
      }
      <Card>
        <CardHeader><CardTitle className="text-sm">Question Navigator</CardTitle>
        </CardHeader>
        <CardContent><div className="grid grid-cols-5 gap-2">{questions.map((q, index) => (<Button key={q.id} variant={index === currentQuestionIndex ? 'default' : answers[q.id] !== undefined ? 'secondary' : 'outline'} size="sm" className={`relative ${markedForReview.includes(q.id) ? 'ring-2 ring-orange-500' : ''}`} onClick={() => {
              setCurrentQuestionIndex(index);
              const answer = answers[q.id];
              setSelectedAnswer(answer !== undefined ? answer.toString() : '');
              setShowExplanation(answer !== undefined);
              setShowHint(false);
            }} >{index + 1} {markedForReview.includes(q.id) && (<Flag className="absolute -top-1 -right-1 h-3 w-3 text-orange-500" />)}
          </Button> ))}
        </div><div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground"><div className="flex items-center gap-1"><div className="h-3 w-3 bg-secondary rounded" />
            <span>Attempted</span>
          </div><div className="flex items-center gap-1"><div className="h-3 w-3 border border-border rounded" />
            <span>Not Attempted</span>
          </div><div className="flex items-center gap-1"><Flag className="h-3 w-3 text-orange-500" />
            <span>Marked</span>
          </div>
        </div>
      </CardContent>
    </Card>

      {/* End Session Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>End Practice Session?</DialogTitle>
      <DialogDescription> Are you sure you want to end this practice session? Your progress will be saved. </DialogDescription>
    </DialogHeader><div className="space-y-4"><div className="grid grid-cols-2 gap-4 text-center"><div className="p-4 bg-muted rounded-lg"><p className="text-2xl font-bold">
            {Object.keys(answers).length}/{questions.length}
          </p><p className="text-sm text-muted-foreground">Questions Attempted</p>
        </div><div className="p-4 bg-muted rounded-lg"><p className="text-2xl font-bold">
            {formatTime(timeSpent)}
          </p><p className="text-sm text-muted-foreground">Time Spent</p>
        </div>
      </div>
    </div>
    <DialogFooter><Button variant="outline" onClick={() => setShowEndDialog(false)}> Continue Practice </Button>
      <Button onClick={handleEndSession}> End Session </Button>
    </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default PracticeSession;
