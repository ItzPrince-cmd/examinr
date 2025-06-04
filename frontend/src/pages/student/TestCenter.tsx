import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

  import {
  Clock,
  Calendar,
  Users,
  BookOpen,
  Award,
  Filter,
  Search,
  ChevronRight,
  Timer,
  AlertCircle,
  TrendingUp,
  FileText,
  Play,
  Lock,
  Star,
  Target} from 'lucide-react';

  import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

  import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Progress } from '../../components/ui/progress';
import { Alert, AlertDescription, } from '../../components/ui/alert';

// Types
interface Test {
  id: string;
  title: string;
  description: string;
  type: 'mock' | 'chapter' | 'subject' | 'full-length';
  subject: string;
  duration: number; // in minutes
  totalQuestions: number;
  totalMarks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  attemptsAllowed: number;
  attemptsUsed: number;
  bestScore?: number;
  lastAttempted?: string;
  scheduledDate?: string;
  isPremium: boolean;
  isLocked: boolean;
  passingScore: number;
  topics: string[];
  instructions: string[];
}

interface TestStats {
  totalAttempts: number;
  avgScore: number;
  successRate: number;
  avgTimeTaken: number;
}

  const TestCenter: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState<Test | null>(null

  );
  const [showInstructions, setShowInstructions] = useState(false
  );const [searchQuery, setSearchQuery] = useState(''
  );const [subjectFilter, setSubjectFilter] = useState('all'
  );const [difficultyFilter, setDifficultyFilter] = useState('all'
  );const [typeFilter, setTypeFilter] = useState('all'
  );
  // Mock data - in real app, fetch from API
  const availableTests: Test[] = [
    {
      id: '1',
      title: 'JEE Main Mock Test - Full Syllabus',
      description: 'Complete mock test covering Physics, Chemistry, and Mathematics',
      type: 'full-length',
      subject: 'All Subjects',
      duration: 180,
      totalQuestions: 90,
      totalMarks: 360,
      difficulty: 'hard',
      attemptsAllowed: 3,
      attemptsUsed: 1,
      bestScore: 285,
      lastAttempted: '2 days ago',
      isPremium: false,
      isLocked: false,
      passingScore: 150,
      topics: ['Physics', 'Chemistry', 'Mathematics'],
      instructions: [
        'This test consists of 90 questions (30 each from Physics, Chemistry, and Mathematics)',
        'Each correct answer awards 4 marks',
        'Each incorrect answer deducts 1 mark (negative marking)',
        'No marks are deducted for unattempted questions',
        'Use of calculator is not allowed',
        'Once started, the test cannot be paused'
      ]
    },
    {
      id: '2',
      title: 'Physics Chapter Test - Mechanics',
      description: 'Focused test on Mechanics topics including Kinematics, Laws of Motion, and Work-Energy',
      type: 'chapter',
      subject: 'Physics',
      duration: 60,
      totalQuestions: 30,
      totalMarks: 120,
      difficulty: 'medium',
    attemptsAllowed: 5,
    attemptsUsed: 2,
    bestScore: 96,
    isPremium: false,
    isLocked: false,
      passingScore: 60,
      topics: ['Kinematics', 'Laws of Motion', 'Work, Energy & Power'],
      instructions: [
        '30 questions from Mechanics chapter',
        'Each question carries 4 marks',
        'Negative marking of -1 for wrong answers',
        'Time limit: 60 minutes'
      ]
    },
    {
      id: '3',
      title: 'Chemistry Weekly Test - Organic Chemistry',
      description: 'Weekly assessment on Organic Chemistry fundamentals',
      type: 'subject',
      subject: 'Chemistry',
      duration: 45,
      totalQuestions: 20,
      totalMarks: 80,
      difficulty: 'medium',
      attemptsAllowed: 2,
      attemptsUsed: 0,
      isPremium: true,
      isLocked: true,
      passingScore: 40,
      topics: ['Hydrocarbons', 'Organic Compounds', 'Reaction Mechanisms'],
      instructions: [
        '20 questions on Organic Chemistry',
        'No negative marking',
        'Focus on reaction mechanisms and nomenclature'
      ]
    },
    {
      id: '4',
      title: 'Mathematics Quick Test - Calculus',
      description: 'Quick assessment on Differential and Integral Calculus',
      type: 'chapter',
      subject: 'Mathematics',
      duration: 30,
      totalQuestions: 15,
      totalMarks: 60,
      difficulty: 'easy',
      attemptsAllowed: -1, // unlimited
      attemptsUsed: 5,
      bestScore: 52,
      lastAttempted: '1 week ago',
      isPremium: false,
      isLocked: false,
      passingScore: 30,
      topics: ['Differentiation', 'Integration', 'Applications of Derivatives'],
      instructions: [
        '15 questions on Calculus',
        'Each question carries 4 marks',
        'No negative marking for this test'
      ]
    }
  ];
  
  const upcomingTests: Test[] = [
    {
      id: '5',
      title: 'JEE Main Weekly Mock Test #12',
      description: 'Scheduled weekly mock test for all registered students',
      type: 'mock',
      subject: 'All Subjects',
      duration: 180,
      totalQuestions: 90,
      totalMarks: 360,
      difficulty: 'hard',
      attemptsAllowed: 1,
      attemptsUsed: 0,
      scheduledDate: '2024-01-15T10:00:00',
      isPremium: false,
      isLocked: true,
      passingScore: 150,
      topics: ['Full Syllabus'],
      instructions: []
    }
  ];
  
  const testStats: TestStats = {
    totalAttempts: 23,
    avgScore: 72.5,
    successRate: 78,
    avgTimeTaken: 45
  };

  // Filter tests
  const filteredTests = availableTests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         test.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || test.subject.toLowerCase().includes(subjectFilter.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || test.difficulty === difficultyFilter;
    const matchesType = typeFilter === 'all' || test.type === typeFilter;
    return matchesSearch && matchesSubject && matchesDifficulty && matchesType;
  });
  
  // Handle test start
  const handleStartTest = (test: Test) => {
    if (test.isLocked) {
      // Show premium dialog or unlock message
      return;
    }
    setSelectedTest(test);
    setShowInstructions(true);
  };

  const confirmStartTest = () => {
    if (selectedTest) {
      navigate(`/test/${selectedTest.id}`);
    }
  };

  // Format date
  const formatScheduledDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffDays === 0 && diffHours > 0) return `In ${diffHours} hours`;
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mock': return FileText;
      case 'chapter': return BookOpen;
      case 'subject': return Award;
      case 'full-length': return Timer;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6"><div className="max-w-7xl mx-auto space-y-6">
      {
    /* Header */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2" ><h1 className="text-3xl font-bold">Test Center</h1><p className="text-muted-foreground"> Take mock tests, chapter tests, and track your performance </p>
  </motion.div>
      {
    /* Stats Overview */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-4" >
  <Card><CardContent className="p-6"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Total Tests</p><p className="text-2xl font-bold">
      {testStats.totalAttempts}
    </p>
  </div><FileText className="h-8 w-8 text-primary opacity-20" />
  </div>
  </CardContent>
  </Card>
  <Card><CardContent className="p-6"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Average Score</p><p className="text-2xl font-bold">
      {testStats.avgScore}%</p>
  </div><TrendingUp className="h-8 w-8 text-secondary opacity-20" />
  </div>
  </CardContent>
  </Card>
  <Card><CardContent className="p-6"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Success Rate</p><p className="text-2xl font-bold">
      {testStats.successRate}%</p>
  </div><Award className="h-8 w-8 text-accent opacity-20" />
  </div>
  </CardContent>
  </Card>
  <Card><CardContent className="p-6"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Avg. Time</p><p className="text-2xl font-bold">
      {testStats.avgTimeTaken}m</p>
  </div><Clock className="h-8 w-8 text-orange-500 opacity-20" />
  </div>
  </CardContent>
  </Card>
  </motion.div>
      {
    /* Test Tabs */
    }<Tabs defaultValue="available" className="space-y-4"><div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
  <TabsList><TabsTrigger value="available">Available Tests</TabsTrigger><TabsTrigger value="upcoming">Upcoming Tests</TabsTrigger><TabsTrigger value="completed">Completed Tests</TabsTrigger>
  </TabsList>
      {
    /* Filters */
    }<div className="flex flex-wrap gap-3"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search tests..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-[200px]" />
  </div>
  <Select value={subjectFilter} onValueChange={setSubjectFilter}><SelectTrigger className="w-[140px]"><SelectValue placeholder="Subject" />
  </SelectTrigger>
  <SelectContent><SelectItem value="all">All Subjects</SelectItem><SelectItem value="physics">Physics</SelectItem><SelectItem value="chemistry">Chemistry</SelectItem><SelectItem value="mathematics">Mathematics</SelectItem><SelectItem value="biology">Biology</SelectItem>
  </SelectContent>
  </Select>
  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}><SelectTrigger className="w-[120px]"><SelectValue placeholder="Difficulty" />
  </SelectTrigger>
  <SelectContent><SelectItem value="all">All Levels</SelectItem><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem>
  </SelectContent>
  </Select>
  <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger className="w-[120px]"><SelectValue placeholder="Type" />
  </SelectTrigger>
  <SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="mock">Mock Test</SelectItem><SelectItem value="chapter">Chapter Test</SelectItem><SelectItem value="subject">Subject Test</SelectItem><SelectItem value="full-length">Full Length</SelectItem>
  </SelectContent>
  </Select>
  </div>
  </div>
      {/* Available Tests */}
      <TabsContent value="available" className="space-y-4">
        {filteredTests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tests found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTests.map((test) => (
              <motion.div 
                key={test.id} 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className={`h-full ${test.isLocked ? 'opacity-75' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {React.createElement(getTypeIcon(test.type), { 
                            className: "h-5 w-5 text-muted-foreground" 
                          })}
                          <CardTitle className="text-lg">
                            {test.title}
                          </CardTitle>
                          {test.isPremium && (
                            <Badge variant="secondary" className="ml-2">
                              <Star className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
    </div>
    <CardDescription>
      {test.description}
    </CardDescription>
    </div>{test.isLocked && <Lock className="h-5 w-5 text-muted-foreground" />}
    </div>
    </CardHeader><CardContent className="space-y-4"><div className="flex flex-wrap gap-2"><Badge variant="outline">
      {test.subject}
    </Badge><Badge variant="outline" className={getDifficultyColor(test.difficulty)}>
      {test.difficulty}
    </Badge><Badge variant="outline"><Clock className="h-3 w-3 mr-1" />
      {test.duration} min </Badge><Badge variant="outline">
      {test.totalQuestions} Questions </Badge>
    </div>{test.attemptsUsed > 0 && ( <div className="space-y-2"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Best Score</span><span className="font-medium">
      {test.bestScore}/{test.totalMarks} ({Math.round((test.bestScore! / test.totalMarks) * 100)}%) </span>
      </div><Progress value={(test.bestScore! / test.totalMarks) * 100} className="h-2" />
    </div> )}<div className="flex items-center justify-between"><div className="text-sm text-muted-foreground">
      {test.attemptsAllowed === -1 ? ( <span>Unlimited attempts</span> ) : ( <span>
      {test.attemptsUsed}/{test.attemptsAllowed} attempts used </span> )}
    </div>
    <Button onClick={() => handleStartTest(test)} disabled={test.isLocked || (test.attemptsAllowed !== -1 && test.attemptsUsed >= test.attemptsAllowed)} >
      {test.isLocked ? ( <><Lock className="mr-2 h-4 w-4" /> Unlock </> ) : test.attemptsUsed > 0 ? ( <><Play className="mr-2 h-4 w-4" /> Retake Test </> ) : ( <><Play className="mr-2 h-4 w-4" /> Start Test </> )}
    </Button>
    </div>{test.lastAttempted && ( <p className="text-xs text-muted-foreground text-center"> Last attempted {test.lastAttempted}
    </p> )}
    </CardContent>
    </Card>
  </motion.div> ))}
    </div> )}
    </TabsContent>
      {
  /* Upcoming Tests */
}<TabsContent value="upcoming" className="space-y-4">
      {upcomingTests.map((test) => ( <Card key={test.id}>
  <CardHeader><div className="flex items-start justify-between">
  <div>
  <CardTitle>
      {test.title}
    </CardTitle>
  <CardDescription>
      {test.description}
    </CardDescription>
  </div>
  <Badge><Calendar className="h-3 w-3 mr-1" /> Scheduled </Badge>
  </div>
  </CardHeader>
  <CardContent><div className="flex items-center justify-between"><div className="space-y-2"><div className="flex items-center gap-4 text-sm"><span className="flex items-center gap-1"><Clock className="h-4 w-4" />
      {formatScheduledDate(test.scheduledDate!)}
    </span><span className="flex items-center gap-1"><Timer className="h-4 w-4" />
      {test.duration} minutes </span><span className="flex items-center gap-1"><BookOpen className="h-4 w-4" />
      {test.totalQuestions} questions </span>
  </div><div className="flex gap-2">{test.topics.map((topic) => ( <Badge key={topic} variant="outline">
      {topic}
    </Badge> ))}
    </div>
  </div><Button variant="outline" disabled><Lock className="mr-2 h-4 w-4" /> Starts Soon </Button>
  </div>
  </CardContent>
</Card> ))}
    </TabsContent>
      {
  /* Completed Tests */
}<TabsContent value="completed">
<Card><CardContent className="p-12 text-center"><Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground">Your completed tests will appear here</p><Button variant="outline" className="mt-4" onClick={() => navigate('/results')}> View All Results </Button>
</CardContent>
</Card>
</TabsContent>
</Tabs>
</div>
      {
  /* Test Instructions Dialog */
}
    <Dialog open={showInstructions} onOpenChange={setShowInstructions}><DialogContent className="max-w-2xl">
<DialogHeader>
<DialogTitle>
      {selectedTest?.title}
    </DialogTitle>
<DialogDescription> Please read the instructions carefully before starting the test </DialogDescription>
</DialogHeader>{selectedTest && ( <div className="space-y-6"><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div className="text-center p-4 bg-muted rounded-lg"><Clock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" /><p className="text-sm text-muted-foreground">Duration</p><p className="font-semibold">
      {selectedTest.duration} min</p>
  </div><div className="text-center p-4 bg-muted rounded-lg"><BookOpen className="h-6 w-6 mx-auto mb-2 text-muted-foreground" /><p className="text-sm text-muted-foreground">Questions</p><p className="font-semibold">
      {selectedTest.totalQuestions}
    </p>
  </div><div className="text-center p-4 bg-muted rounded-lg"><Award className="h-6 w-6 mx-auto mb-2 text-muted-foreground" /><p className="text-sm text-muted-foreground">Total Marks</p><p className="font-semibold">
      {selectedTest.totalMarks}
    </p>
  </div><div className="text-center p-4 bg-muted rounded-lg"><Target className="h-6 w-6 mx-auto mb-2 text-muted-foreground" /><p className="text-sm text-muted-foreground">Passing</p><p className="font-semibold">
      {selectedTest.passingScore}
    </p>
  </div>
  </div>
  <div><h3 className="font-semibold mb-3">Instructions:</h3><ul className="space-y-2">{selectedTest.instructions.map((instruction, index) => ( <li key={index} className="flex items-start gap-2"><span className="text-primary mt-1">•</span><span className="text-sm">
      {instruction}
    </span>
  </li> ))}
    </ul>
  </div>
  <Alert><AlertCircle className="h-4 w-4" />
  <AlertDescription> Once you start the test, it cannot be paused. Make sure you have a stable internet connection and sufficient time to complete the test. </AlertDescription>
  </Alert>
</div> )}
    <DialogFooter><Button variant="outline" onClick={() => setShowInstructions(false)}> Cancel </Button><Button onClick={confirmStartTest}> Start Test <ChevronRight className="ml-2 h-4 w-4" />
</Button>
</DialogFooter>
</DialogContent>
</Dialog>
</div>
  )
}

export default TestCenter;
