import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';

  import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Award,
  AlertCircle,
  Mail,
  MessageSquare,
  Download,
  FileText,
  Target,
  Activity,
  BookOpen,
  BarChart3,
  CheckCircle,
  XCircle,
  ChevronRight} from 'lucide-react';

  import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';

  import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow} from '../../components/ui/table';

  import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger} from '../../components/ui/dialog';
import { toast } from '../../components/ui/use-toast';

// Types 
interface TestResult { 
  id: string;
  testName: string;
  testType: 'chapter' | 'mock' | 'dpp';
  subject: string;
  date: string;
  score: number;
  totalMarks: number;
  percentage: number;
  rank?: number;
  totalStudents?: number;
  duration: number;
  questionsAttempted: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  status: 'completed' | 'absent' | 'late';
}

  interface TopicPerformance { topic: string;
  subject: string;
  questionsAttempted: number;
  correctAnswers: number;
  accuracy: number;
  lastPracticed: string;strength: 'weak' | 'average' | 'strong'
}

  interface LearningPath { id: string;
  recommendation: string;priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  resources: string[]
}

  const StudentPerformance: React.FC = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();const [activeTab, setActiveTab] = useState('overview'
  );
  const [showGradeDialog, setShowGradeDialog] = useState(false
  );
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null

  );
  // Mock student data 
  const [studentInfo] = useState({
    id: studentId,name: 'Rahul Kumar',email: 'rahul.kumar@example.com',avatar: '',batch: 'JEE Advanced Batch A',enrollmentDate: '2024-01-05',phone: '+91 98765 43210',parentPhone: '+91 98765 43211',
    overallScore: 82,
    rank: 3,
    totalStudents: 35,
    attendance: 95,
    testsCompleted: 18,
    totalTests: 20,lastActive: '2 hours ago',performanceTrend: 'up'
    });
    const [testResults] = useState<TestResult[]>([ {id: '1',testName: 'Physics Chapter 5 - Mechanics',testType: 'chapter',subject: 'Physics',date: '2024-01-14',
    score: 85,
    totalMarks: 100,
    percentage: 85,
    rank: 2,
    totalStudents: 35,
    duration: 90,
    questionsAttempted: 28,
    totalQuestions: 30,
    correctAnswers: 24,
    incorrectAnswers: 4,status: 'completed'
      }, {id: '2',testName: 'JEE Advanced Mock Test #5',testType: 'mock',subject: 'All Subjects',date: '2024-01-12',
    score: 234,
    totalMarks: 300,
    percentage: 78,
    rank: 5,
    totalStudents: 35,
    duration: 180,
    questionsAttempted: 85,
    totalQuestions: 90,
    correctAnswers: 72,
    incorrectAnswers: 13,status: 'completed'
      }, {id: '3',testName: 'Chemistry DPP #15',testType: 'dpp',subject: 'Chemistry',date: '2024-01-10',
    score: 32,
    totalMarks: 40,
    percentage: 80,
    duration: 30,
    questionsAttempted: 10,
    totalQuestions: 10,
    correctAnswers: 8,
    incorrectAnswers: 2,status: 'completed'
    } ]

  );
    const [topicPerformance] = useState<TopicPerformance[]>([ {topic: 'Mechanics',subject: 'Physics',
    questionsAttempted: 120,
    correctAnswers: 102,
    accuracy: 85,lastPracticed: '2 days ago',strength: 'strong'
      }, {topic: 'Organic Chemistry',subject: 'Chemistry',
    questionsAttempted: 80,
    correctAnswers: 48,
    accuracy: 60,lastPracticed: '1 week ago',strength: 'weak'
      }, {topic: 'Calculus',subject: 'Mathematics',
    questionsAttempted: 95,
    correctAnswers: 83,
    accuracy: 87,lastPracticed: '3 days ago',strength: 'strong'
      }, {topic: 'Thermodynamics',subject: 'Physics',
    questionsAttempted: 65,
    correctAnswers: 42,
    accuracy: 65,lastPracticed: '5 days ago',strength: 'average'
    } ]

  );
    const [learningPaths] = useState<LearningPath[]>([ {id: '1',recommendation: 'Focus on Organic Chemistry - Reaction Mechanisms',priority: 'high',estimatedTime: '2 weeks',resources: ['Video lectures on reaction mechanisms','Practice problems set','Previous year questions']
      }, {id: '2',recommendation: 'Revise Thermodynamics concepts',priority: 'medium',estimatedTime: '1 week',resources: ['Concept notes','Solved examples','Mock tests']
    } ]

  );
    const getScoreBadge = (percentage: number) => {
    if (percentage >= 80) return <Badge variant="default">Excellent</Badge>;if (percentage >= 60) return <Badge variant="secondary">Good</Badge>;return <Badge variant="destructive">Needs Improvement</Badge>
}

    const getStrengthColor = (strength: string) => {switch (strength) { case 'strong': return 'text-green-600';case 'average': return 'text-yellow-600';case 'weak': return 'text-red-600';default: return ''
} };

    const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowGradeDialog(false

    );
      toast({title:"Grade updated",description:"The test grade has been updated successfully",

      }

    )
}

    const sendMessage = () => {
      toast({title:"Message sent",description:"Your message has been sent to the student",

      }

    )
}

    const generateReport = () => {
      toast({title:"Report generated",description:"Performance report is being generated",

      }

    )
}

  return (<div className="min-h-screen bg-background p-6"><div className="max-w-7xl mx-auto space-y-6">
      {
    /* Header */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4" ><div className="flex items-center gap-4"><Button variant="ghost" size="icon" onClick={() => navigate('/teacher/students')} ><ArrowLeft className="h-4 w-4" />
  </Button><div className="flex-1"><h1 className="text-3xl font-bold">Student Performance</h1><p className="text-muted-foreground mt-1"> Detailed performance analysis and progress tracking </p>
  </div><div className="flex gap-2"><Button variant="outline" onClick={sendMessage}><Mail className="mr-2 h-4 w-4" /> Message </Button>
  <Button onClick={generateReport}><Download className="mr-2 h-4 w-4" /> Generate Report </Button>
  </div>
  </div>
  </motion.div>
      {
    /* Student Info Card */
    }
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} >
  <Card><CardContent className="p-6"><div className="flex flex-col md:flex-row items-start md:items-center gap-6"><Avatar className="h-20 w-20">
  <AvatarImage src={studentInfo.avatar} />
  <AvatarFallback>{studentInfo.name.split(' ').map(n => n[0]).join('')}
    </AvatarFallback>
  </Avatar><div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
  <div><h2 className="text-2xl font-bold">
      {studentInfo.name}
    </h2><p className="text-muted-foreground">
      {studentInfo.email}
    </p><div className="flex items-center gap-2 mt-2"><Badge variant="outline">
      {studentInfo.batch}</Badge><Badge variant={studentInfo.performanceTrend === 'up' ? 'default' : 'secondary'}>{studentInfo.performanceTrend === 'up' ? ( <TrendingUp className="h-3 w-3 mr-1" /> ) : ( <TrendingDown className="h-3 w-3 mr-1" /> )} Trending {studentInfo.performanceTrend}
    </Badge>
  </div>
  </div><div className="space-y-1"><p className="text-sm text-muted-foreground">Performance</p><div className="flex items-baseline gap-2"><span className="text-2xl font-bold">
      {studentInfo.overallScore}%</span>
      {getScoreBadge(studentInfo.overallScore)}
    </div><p className="text-sm text-muted-foreground"> Rank: {studentInfo.rank}/{studentInfo.totalStudents}
    </p>
  </div><div className="space-y-1"><p className="text-sm text-muted-foreground">Progress</p><div className="space-y-2"><div className="flex items-center gap-2"><Progress value={(studentInfo.testsCompleted / studentInfo.totalTests) * 100} className="flex-1 h-2" /><span className="text-sm">
      {studentInfo.testsCompleted}/{studentInfo.totalTests} tests </span>
  </div><div className="flex items-center gap-2"><Progress value={studentInfo.attendance} className="flex-1 h-2" /><span className="text-sm">
      {studentInfo.attendance}% attendance</span>
  </div>
  </div>
  </div>
  </div>
  </div>
  </CardContent>
  </Card>
  </motion.div>
      {
    /* Tabs */
    }
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} >
  <Tabs value={activeTab} onValueChange={setActiveTab}><TabsList className="grid w-full grid-cols-4 max-w-[600px]"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="tests">Test Results</TabsTrigger><TabsTrigger value="topics">Topic Analysis</TabsTrigger><TabsTrigger value="recommendations">Recommendations</TabsTrigger>
  </TabsList>
      {
    /* Overview Tab */
    }<TabsContent value="overview" className="space-y-6"><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {
    /* Subject Performance */
    }
    <Card>
  <CardHeader>
  <CardTitle>Subject-wise Performance</CardTitle>
  <CardDescription>Average scores by subject</CardDescription>
  </CardHeader><CardContent className="space-y-4"><div className="space-y-3">
  <div><div className="flex justify-between items-center mb-1"><span className="text-sm">Physics</span><div className="flex items-center gap-2"><Badge variant="default">Strong</Badge><span className="font-medium">85%</span>
  </div>
  </div><Progress value={85} className="h-2" />
  </div>
  <div><div className="flex justify-between items-center mb-1"><span className="text-sm">Chemistry</span><div className="flex items-center gap-2"><Badge variant="destructive">Weak</Badge><span className="font-medium">62%</span>
  </div>
  </div><Progress value={62} className="h-2" />
  </div>
  <div><div className="flex justify-between items-center mb-1"><span className="text-sm">Mathematics</span><div className="flex items-center gap-2"><Badge variant="default">Strong</Badge><span className="font-medium">88%</span>
  </div>
  </div><Progress value={88} className="h-2" />
  </div>
  </div>
  </CardContent>
  </Card>
      {
    /* Recent Performance */
    }
    <Card>
  <CardHeader>
  <CardTitle>Recent Test Performance</CardTitle>
  <CardDescription>Last 5 test scores</CardDescription>
  </CardHeader>
  <CardContent><div className="space-y-3">{testResults.slice(0, 5).map((test) => ( <div key={test.id} className="flex items-center justify-between">
    <div><p className="font-medium text-sm">
      {test.testName}
    </p><p className="text-xs text-muted-foreground">
      {test.date}
    </p>
    </div><div className="flex items-center gap-2"><Progress value={test.percentage} className="w-20 h-2" /><Badge variant={test.percentage >= 80 ? 'default' : 'secondary'}>
      {test.percentage}% </Badge>
    </div>
  </div> ))}
    </div>
  </CardContent>
  </Card>
  </div>
      {
    /* Learning Stats */
    }<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <Card><CardContent className="p-6"><div className="space-y-2"><p className="text-sm text-muted-foreground">Study Time</p><p className="text-2xl font-bold">156 hrs</p><p className="text-xs text-green-500">+12 hrs this week</p>
  </div>
  </CardContent>
  </Card>
  <Card><CardContent className="p-6"><div className="space-y-2"><p className="text-sm text-muted-foreground">Questions Solved</p><p className="text-2xl font-bold">3,242</p><p className="text-xs text-blue-500">+145 this week</p>
  </div>
  </CardContent>
  </Card>
  <Card><CardContent className="p-6"><div className="space-y-2"><p className="text-sm text-muted-foreground">Accuracy Rate</p><p className="text-2xl font-bold">78%</p><p className="text-xs text-green-500">↑ 3% improvement</p>
  </div>
  </CardContent>
  </Card>
  <Card><CardContent className="p-6"><div className="space-y-2"><p className="text-sm text-muted-foreground">Practice Streak</p><p className="text-2xl font-bold">12 days</p><p className="text-xs text-orange-500">Keep it up!</p>
  </div>
  </CardContent>
  </Card>
  </div>
  </TabsContent>
      {
    /* Test Results Tab */
    }<TabsContent value="tests" className="space-y-4">
  <Card>
  <CardHeader>
  <CardTitle>Test History</CardTitle>
  <CardDescription>Complete test performance record</CardDescription>
  </CardHeader><CardContent className="p-0">
  <Table>
  <TableHeader>
  <TableRow>
  <TableHead>Test Name</TableHead>
  <TableHead>Type</TableHead>
  <TableHead>Subject</TableHead>
  <TableHead>Date</TableHead>
  <TableHead>Score</TableHead>
  <TableHead>Rank</TableHead>
  <TableHead>Accuracy</TableHead>
  <TableHead>Status</TableHead>
  <TableHead>
  </TableHead>
  </TableRow>
  </TableHeader>
  <TableBody>
      {testResults.map((test) => ( <TableRow key={test.id}><TableCell className="font-medium">
      {test.testName}
    </TableCell>
    <TableCell><Badge variant="outline">
      {test.testType.toUpperCase()}
    </Badge>
    </TableCell>
    <TableCell>
      {test.subject}
    </TableCell>
    <TableCell>
      {test.date}
    </TableCell>
    <TableCell><div className="flex items-center gap-2">
    <span>
      {test.score}/{test.totalMarks}
    </span>
      {getScoreBadge(test.percentage)}
    </div>
    </TableCell>
    <TableCell>{test.rank && ( <Badge variant="outline">
      {test.rank}/{test.totalStudents}
    </Badge> )}
    </TableCell>
    <TableCell><div className="flex items-center gap-2"><Progress value={(test.correctAnswers / test.questionsAttempted) * 100} className="w-16 h-2" /><span className="text-sm">
      {Math.round((test.correctAnswers / test.questionsAttempted) * 100)}% </span>
    </div>
    </TableCell>
    <TableCell><Badge variant={test.status === 'completed' ? 'default' : 'destructive'} >
      {test.status}
    </Badge>
    </TableCell>
    <TableCell><Button variant="ghost" size="sm" onClick={() => {
        setSelectedTest(test

        );
        setShowGradeDialog(true

        )
}} > Grade </Button>
    </TableCell>
  </TableRow> ))}
    </TableBody>
  </Table>
  </CardContent>
  </Card>
  </TabsContent>
      {
    /* Topic Analysis Tab */
    }<TabsContent value="topics" className="space-y-4">
  <Card>
  <CardHeader>
  <CardTitle>Topic-wise Performance</CardTitle>
  <CardDescription>Detailed analysis by topic</CardDescription>
  </CardHeader>
  <CardContent><div className="space-y-4">{topicPerformance.map((topic, idx) => ( <div key={idx} className="p-4 border rounded-lg"><div className="flex items-center justify-between mb-3">
    <div><h4 className="font-medium">
      {topic.topic}
    </h4><p className="text-sm text-muted-foreground">
      {topic.subject}
    </p>
    </div><Badge variant={ topic.strength === 'strong' ? 'default' : topic.strength === 'average' ? 'secondary' : 'destructive' } >
      {topic.strength}
    </Badge>
    </div><div className="grid grid-cols-4 gap-4 text-sm">
    <div><p className="text-muted-foreground">Questions</p><p className="font-medium">
      {topic.questionsAttempted}
    </p>
    </div>
    <div><p className="text-muted-foreground">Correct</p><p className="font-medium">
      {topic.correctAnswers}
    </p>
    </div>
    <div><p className="text-muted-foreground">Accuracy</p>
    <p className={`font-medium ${getStrengthColor(topic.strength)}`}>
      {topic.accuracy}% </p>
    </div>
    <div><p className="text-muted-foreground">Last Practiced</p><p className="font-medium">
      {topic.lastPracticed}
    </p>
    </div>
    </div><Progress value={topic.accuracy} className="mt-3 h-2" />
  </div> ))}
    </div>
  </CardContent>
  </Card>
  </TabsContent>
      {
    /* Recommendations Tab */
    }<TabsContent value="recommendations" className="space-y-4">
  <Card>
  <CardHeader>
  <CardTitle>Personalized Learning Path</CardTitle>
  <CardDescription> Recommended focus areas based on performance analysis </CardDescription>
  </CardHeader><CardContent className="space-y-4">{learningPaths.map((path) => ( <div key={path.id} className="p-4 border rounded-lg space-y-3" ><div className="flex items-start justify-between"><div className="space-y-1"><h4 className="font-medium">
      {path.recommendation}
    </h4><div className="flex items-center gap-2"><Badge variant={ path.priority === 'high' ? 'destructive' : path.priority === 'medium' ? 'secondary' : 'outline' } >
      {path.priority} priority </Badge><span className="text-sm text-muted-foreground"> Est. time: {path.estimatedTime}
    </span>
    </div>
    </div><Target className="h-5 w-5 text-muted-foreground" />
    </div><div className="space-y-2"><p className="text-sm font-medium">Recommended Resources:</p><ul className="space-y-1">{path.resources.map((resource, idx) => ( <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2"><CheckCircle className="h-3 w-3 text-green-500" />
      {resource}
    </li> ))}
    </ul>
    </div>
  </div> ))}
    </CardContent>
  </Card>
      {
    /* Action Buttons */
    }
    <Card>
  <CardHeader>
  <CardTitle>Quick Actions</CardTitle>
  </CardHeader><CardContent className="flex flex-wrap gap-2">
  <Button><Calendar className="mr-2 h-4 w-4" /> Schedule Extra Classes </Button><Button variant="outline"><FileText className="mr-2 h-4 w-4" /> Assign Practice Tests </Button><Button variant="outline"><MessageSquare className="mr-2 h-4 w-4" /> Parent Meeting </Button><Button variant="outline"><Award className="mr-2 h-4 w-4" /> Create Study Plan </Button>
  </CardContent>
  </Card>
  </TabsContent>
  </Tabs>
  </motion.div>
  </div>
      {
    /* Grade Dialog */
    }
    <Dialog open={showGradeDialog} onOpenChange={setShowGradeDialog}>
  <DialogContent>
  <form onSubmit={handleGradeSubmit}>
  <DialogHeader>
  <DialogTitle>Update Test Grade</DialogTitle>
  <DialogDescription> Modify the score for {selectedTest?.testName}
    </DialogDescription>
  </DialogHeader><div className="space-y-4 py-4"><div className="space-y-2"><Label htmlFor="score">Score</Label><Input id="score" type="number" defaultValue={selectedTest?.score} max={selectedTest?.totalMarks} />
  </div><div className="space-y-2"><Label htmlFor="feedback">Feedback (Optional)</Label><Textarea id="feedback" placeholder="Add feedback for the student..." rows={3} />
  </div>
  </div>
  <DialogFooter><Button type="button" variant="outline" onClick={() => setShowGradeDialog(false)}> Cancel </Button><Button type="submit">Update Grade</Button>
  </DialogFooter>
  </form>
  </DialogContent>
  </Dialog>
  </div>
  )
}

export default StudentPerformance;
