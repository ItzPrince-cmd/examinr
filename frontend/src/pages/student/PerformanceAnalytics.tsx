import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Clock,
  BookOpen,
  BarChart3,
  Activity,
  Calendar,
  Filter,
  Download,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Zap
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart
} from 'recharts';

// Types
interface PerformanceData {
  overallScore: number;
percentile: number;
totalTests: number;
averageScore: number;
improvement: number;
consistency: number;
strongSubjects: string[];
weakSubjects: string[];
}

interface SubjectPerformance {
  subject: string;
  averageScore: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number; trend: 'up' | 'down' | 'stable';
  improvement: number
}

interface TestHistory {
  date: string;
  testName: string;
  score: number;
  percentile: number;
  totalMarks: number;
  timeTaken: number
}

interface TopicAnalysis {
  topic: string;
  subject: string;
  mastery: number;
  questionsAttempted: number;
  accuracy: number;
  avgTime: number; difficulty: 'easy' | 'medium' | 'hard'
}

const PerformanceAnalytics: React.FC = () => {
  const navigate = useNavigate(); const [timeRange, setTimeRange] = useState('month'
  ); const [selectedSubject, setSelectedSubject] = useState('all'
  );
  // Mock data
  const performanceData: PerformanceData = {
    overallScore: 78.5,
    percentile: 85.2,
    totalTests: 24,
    averageScore: 282,
    improvement: 12.5,
    consistency: 82,
    strongSubjects: ['Mathematics', 'Physics'],
    weakSubjects: ['Chemistry']
  };

const subjectPerformance: SubjectPerformance[] = [{
  subject: 'Physics',
  averageScore: 82,
  totalQuestions: 450,
  correctAnswers: 369,
  accuracy: 82, trend: 'up',
  improvement: 8
}, {
  subject: 'Chemistry',
  averageScore: 68,
  totalQuestions: 420,
  correctAnswers: 286,
  accuracy: 68, trend: 'down',
  improvement: -3
}, {
  subject: 'Mathematics',
  averageScore: 85,
  totalQuestions: 480,
  correctAnswers: 408,
  accuracy: 85, trend: 'up',
  improvement: 15
}];

  // Chart data
  const performanceTrendData = [
    { month: 'Jan', score: 65, percentile: 70 },
    { month: 'Feb', score: 68, percentile: 72 },
    { month: 'Mar', score: 72, percentile: 75 },
    { month: 'Apr', score: 70, percentile: 74 },
    { month: 'May', score: 75, percentile: 80 },
    { month: 'Jun', score: 78.5, percentile: 85.2 }
  ];

  const subjectRadarData = [
    { subject: 'Physics', score: 82, fullMark: 100 },
    { subject: 'Chemistry', score: 68, fullMark: 100 },
    { subject: 'Mathematics', score: 85, fullMark: 100 },
    { subject: 'Problem Solving', score: 78, fullMark: 100 },
    { subject: 'Time Management', score: 72, fullMark: 100 },
    { subject: 'Accuracy', score: 80, fullMark: 100 }
  ];
const topicMasteryData: TopicAnalysis[] = [{
  topic: 'Calculus', subject: 'Mathematics',
  mastery: 92,
  questionsAttempted: 120,
  accuracy: 92,
  avgTime: 85, difficulty: 'hard'
}, {
  topic: 'Mechanics', subject: 'Physics',
  mastery: 88,
  questionsAttempted: 150,
  accuracy: 88,
  avgTime: 90, difficulty: 'medium'
}, {
  topic: 'Organic Chemistry', subject: 'Chemistry',
  mastery: 65,
  questionsAttempted: 100,
  accuracy: 65,
  avgTime: 120, difficulty: 'hard'
}, {
  topic: 'Algebra', subject: 'Mathematics',
  mastery: 85,
  questionsAttempted: 140,
  accuracy: 85,
  avgTime: 70, difficulty: 'easy'
}, {
  topic: 'Thermodynamics', subject: 'Physics',
  mastery: 78,
  questionsAttempted: 80,
  accuracy: 78,
  avgTime: 95, difficulty: 'medium'
}];

  const timeDistributionData = [
    { name: 'Physics', value: 35, color: '#3B82F6' },
    { name: 'Chemistry', value: 30, color: '#10B981' },
    { name: 'Mathematics', value: 35, color: '#8B5CF6' }
  ];

  const weeklyActivityData = [
    { day: 'Mon', questions: 45, time: 120 },
    { day: 'Tue', questions: 38, time: 95 },
    { day: 'Wed', questions: 52, time: 140 },
    { day: 'Thu', questions: 41, time: 105 },
    { day: 'Fri', questions: 48, time: 125 },
    { day: 'Sat', questions: 65, time: 180 },
    { day: 'Sun', questions: 58, time: 150 }
  ];

  // Get performance badge
  const getPerformanceBadge = (score: number) => {
    if (score >= 90) return { text: 'Excellent', color: 'bg-green-500' };
    if (score >= 80) return { text: 'Very Good', color: 'bg-blue-500' };
    if (score >= 70) return { text: 'Good', color: 'bg-yellow-500' };
    if (score >= 60) return { text: 'Average', color: 'bg-orange-500' };
    return { text: 'Needs Improvement', color: 'bg-red-500' };
  };

  const performanceBadge = getPerformanceBadge(performanceData.overallScore);
return (
  <div className="min-h-screen bg-background p-6"><div className="max-w-7xl mx-auto space-y-6">
    {
      /* Header */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" >
      <div><h1 className="text-3xl font-bold">Performance Analytics</h1><p className="text-muted-foreground mt-1"> Track your progress and identify areas for improvement </p>
      </div><div className="flex gap-3">
        <Select value={timeRange} onValueChange={setTimeRange}><SelectTrigger className="w-[140px]"><Calendar className="mr-2 h-4 w-4" />
          <SelectValue />
        </SelectTrigger>
          <SelectContent><SelectItem value="week">This Week</SelectItem><SelectItem value="month">This Month</SelectItem><SelectItem value="quarter">This Quarter</SelectItem><SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select><Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Report </Button>
      </div>
    </motion.div>
    {
      /* Overall Performance Card */
    }
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} ><Card className="border-2">
      <CardHeader><div className="flex items-center justify-between">
        <div>
          <CardTitle>Overall Performance</CardTitle>
          <CardDescription>Your performance summary for {timeRange}
          </CardDescription>
        </div>
        <Badge className={`${performanceBadge.color} text-white`}>
          {performanceBadge.text}
        </Badge>
      </div>
      </CardHeader>
      <CardContent><div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"><div className="text-center p-4 bg-muted rounded-lg"><Target className="h-8 w-8 mx-auto mb-2 text-primary opacity-70" /><p className="text-2xl font-bold">
        {performanceData.overallScore}%</p><p className="text-xs text-muted-foreground">Overall Score</p>
      </div><div className="text-center p-4 bg-muted rounded-lg"><TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500 opacity-70" /><p className="text-2xl font-bold">
        {performanceData.percentile}%</p><p className="text-xs text-muted-foreground">Percentile</p>
        </div><div className="text-center p-4 bg-muted rounded-lg"><Award className="h-8 w-8 mx-auto mb-2 text-yellow-500 opacity-70" /><p className="text-2xl font-bold">
          {performanceData.totalTests}
        </p><p className="text-xs text-muted-foreground">Tests Taken</p>
        </div><div className="text-center p-4 bg-muted rounded-lg"><BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-500 opacity-70" /><p className="text-2xl font-bold">
          {performanceData.averageScore}
        </p><p className="text-xs text-muted-foreground">Avg Score</p>
        </div><div className="text-center p-4 bg-muted rounded-lg"><Activity className="h-8 w-8 mx-auto mb-2 text-purple-500 opacity-70" /><p className="text-2xl font-bold">+{performanceData.improvement}%</p><p className="text-xs text-muted-foreground">Improvement</p>
        </div><div className="text-center p-4 bg-muted rounded-lg"><Zap className="h-8 w-8 mx-auto mb-2 text-orange-500 opacity-70" /><p className="text-2xl font-bold">
          {performanceData.consistency}%</p><p className="text-xs text-muted-foreground">Consistency</p>
        </div>
      </div>
      </CardContent>
    </Card>
    </motion.div>
    {
      /* Charts Section */
    }<Tabs defaultValue="trends" className="space-y-4">
      <TabsList><TabsTrigger value="trends">Performance Trends</TabsTrigger><TabsTrigger value="subjects">Subject Analysis</TabsTrigger><TabsTrigger value="topics">Topic Mastery</TabsTrigger><TabsTrigger value="activity">Study Activity</TabsTrigger>
      </TabsList>
      {
        /* Performance Trends */
      }<TabsContent value="trends" className="space-y-4"><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Score Progression</CardTitle>
            <CardDescription>Your score and percentile trends over time</CardDescription>
          </CardHeader>
          <CardContent><ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceTrendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend /><Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} name="Average Score (%)" /><Line type="monotone" dataKey="percentile" stroke="#10B981" strokeWidth={2} name="Percentile" />
            </LineChart>
          </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Performance Radar</CardTitle>
            <CardDescription>Your strengths across different areas</CardDescription>
          </CardHeader>
          <CardContent><ResponsiveContainer width="100%" height={300}>
            <RadarChart data={subjectRadarData}>
              <PolarGrid /><PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} /><Radar name="Performance" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      </TabsContent>
      {
        /* Subject Analysis */
      }<TabsContent value="subjects" className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subjectPerformance.map((subject) => (<Card key={subject.subject}>
          <CardHeader><div className="flex items-center justify-between"><CardTitle className="text-lg">
            {subject.subject}
          </CardTitle><div className="flex items-center gap-1">{subject.trend === 'up' ? (<ChevronUp className="h-4 w-4 text-green-500" />) : subject.trend === 'down' ? (<ChevronDown className="h-4 w-4 text-red-500" />) : null}<span className={`text-sm font-medium ${subject.improvement > 0 ? 'text-green-500' : 'text-red-500'}`}>{subject.improvement > 0 ? '+' : ''}{subject.improvement}% </span>
            </div>
          </div>
          </CardHeader><CardContent className="space-y-4"><div className="text-center"><div className="text-3xl font-bold">
            {subject.averageScore}%</div><p className="text-sm text-muted-foreground">Average Score</p>
          </div><div className="space-y-2"><div className="flex justify-between text-sm">
            <span>Accuracy</span>
            <span>
              {subject.accuracy}%</span>
          </div><Progress value={subject.accuracy} className="h-2" />
            </div><div className="grid grid-cols-2 gap-4 text-center">
              <div><p className="text-sm text-muted-foreground">Questions</p><p className="font-semibold">
                {subject.totalQuestions}
              </p>
              </div>
              <div><p className="text-sm text-muted-foreground">Correct</p><p className="font-semibold text-green-500">
                {subject.correctAnswers}
              </p>
              </div>
            </div>
          </CardContent>
        </Card>))}
      </div>
        <Card>
          <CardHeader>
            <CardTitle>Time Distribution by Subject</CardTitle>
            <CardDescription>How you allocate your study time</CardDescription>
          </CardHeader>
          <CardContent><ResponsiveContainer width="100%" height={300}>
            <PieChart><Pie data={timeDistributionData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value" >
              {timeDistributionData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
            </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          </CardContent>
        </Card>
      </TabsContent>
      {
        /* Topic Mastery */
      }<TabsContent value="topics">
        <Card>
          <CardHeader><div className="flex items-center justify-between">
            <div>
              <CardTitle>Topic-wise Mastery</CardTitle>
              <CardDescription>Your proficiency in different topics</CardDescription>
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}><SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
              <SelectContent><SelectItem value="all">All Subjects</SelectItem><SelectItem value="physics">Physics</SelectItem><SelectItem value="chemistry">Chemistry</SelectItem><SelectItem value="mathematics">Mathematics</SelectItem>
              </SelectContent>
            </Select>
          </div>
          </CardHeader>
          <CardContent><div className="space-y-4">{topicMasteryData.filter(topic => selectedSubject === 'all' || topic.subject.toLowerCase() === selectedSubject).sort((a, b) => b.mastery - a.mastery).map((topic) => (<div key={topic.topic} className="space-y-2"><div className="flex items-center justify-between"><div className="flex items-center gap-3">
            <div><p className="font-medium">
              {topic.topic}
            </p><div className="flex items-center gap-2 text-sm text-muted-foreground"><Badge variant="outline">
              {topic.subject}
            </Badge>
                <span>•</span>
                <span>
                  {topic.questionsAttempted} questions</span>
                <span>•</span>
                <span>Avg. {Math.round(topic.avgTime)}s/question</span>
              </div>
            </div>
          </div><div className="text-right"><p className="text-2xl font-bold">{topic.mastery}%</p><Badge variant={topic.mastery >= 80 ? 'default' : topic.mastery >= 60 ? 'secondary' : 'destructive'} className="text-xs" >{topic.mastery >= 80 ? 'Mastered' : topic.mastery >= 60 ? 'Proficient' : 'Needs Practice'}
          </Badge>
            </div>
          </div><Progress value={topic.mastery} className="h-3" />
          </div>))}
          </div>
          </CardContent>
        </Card>
      </TabsContent>
      {
        /* Study Activity */
      }<TabsContent value="activity" className="space-y-4"><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Questions attempted and time spent each day</CardDescription>
          </CardHeader>
          <CardContent><ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyActivityData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend /><Bar yAxisId="left" dataKey="questions" fill="#3B82F6" name="Questions" /><Bar yAxisId="right" dataKey="time" fill="#10B981" name="Time (min)" />
            </BarChart>
          </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Study Insights</CardTitle>
            <CardDescription>Key findings from your study patterns</CardDescription>
          </CardHeader><CardContent className="space-y-4"><div className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
            <div><p className="font-medium">Peak Performance Time</p><p className="text-sm text-muted-foreground"> You perform best during evening sessions (6-9 PM) </p>
            </div>
          </div><div className="flex items-start gap-3"><AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div><p className="font-medium">Consistency Gap</p><p className="text-sm text-muted-foreground"> Tuesday and Thursday show lower activity </p>
              </div>
            </div><div className="flex items-start gap-3"><TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
              <div><p className="font-medium">Improvement Area</p><p className="text-sm text-muted-foreground"> Focus more on Chemistry - currently your weakest subject </p>
              </div>
            </div><div className="flex items-start gap-3"><Award className="h-5 w-5 text-purple-500 mt-0.5" />
              <div><p className="font-medium">Strength to Leverage</p><p className="text-sm text-muted-foreground"> Mathematics is your strongest subject - maintain the momentum </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
        <Card>
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
            <CardDescription>Personalized suggestions to improve your performance</CardDescription>
          </CardHeader>
          <CardContent><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="p-4 border rounded-lg space-y-2"><div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /><h4 className="font-medium">Practice Organic Chemistry</h4>
          </div><p className="text-sm text-muted-foreground"> Your accuracy in Organic Chemistry is 65%. Practice 20 questions daily to improve. </p><Button size="sm" className="w-full" onClick={() => navigate('/practice')}>Start Practice</Button>
          </div><div className="p-4 border rounded-lg space-y-2"><div className="flex items-center gap-2"><Clock className="h-5 w-5 text-secondary" /><h4 className="font-medium">Improve Time Management</h4></div><p className="text-sm text-muted-foreground"> You're spending too much time on Chemistry questions. Try timed practice. </p><Button size="sm" variant="secondary" className="w-full" onClick={() => navigate('/practice/timed')}>Timed Practice</Button>
            </div><div className="p-4 border rounded-lg space-y-2"><div className="flex items-center gap-2"><Target className="h-5 w-5 text-accent" /><h4 className="font-medium">Take a Full Mock Test</h4></div><p className="text-sm text-muted-foreground"> You haven't taken a full-length test in 2 weeks. Stay exam-ready! </p><Button size="sm" variant="outline" className="w-full" onClick={() => navigate('/tests')}>Take Mock Test</Button>
            </div><div className="p-4 border rounded-lg space-y-2"><div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500" /><h4 className="font-medium">Review Mistakes</h4>
            </div><p className="text-sm text-muted-foreground"> You have 45 incorrect answers to review from recent tests. </p><Button size="sm" variant="outline" className="w-full" onClick={() => navigate('/review')}>Review Now</Button>
            </div>
          </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
  </div>
)
}

export default PerformanceAnalytics;
