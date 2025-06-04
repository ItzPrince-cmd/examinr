import React, { useState } from 'react';
import { motion } from 'framer-motion';

  import {
  TrendingUp,
  TrendingDown,
  Activity,
  Award,
  Users,
  BookOpen,
  BarChart3,
  PieChart,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Download,
  Filter,
  ArrowUp,
  ArrowDown} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';

  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

  import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
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
  Radar} from 'recharts';

// Mock Data 
const performanceOverTime = [
  {
    month: 'Jan',
    average: 72,
    highest: 89,
    lowest: 45
  }, 
  {
    month: 'Feb',
    average: 75,
    highest: 92,
    lowest: 48
  }, 
  {
    month: 'Mar',
  average: 78,
  highest: 95,
  lowest: 52
    }, {month: 'Apr',
  average: 80,
  highest: 96,
  lowest: 55
    }, {month: 'May',
  average: 82,
  highest: 97,
  lowest: 58
    }, {month: 'Jun',
  average: 85,
  highest: 98,
  lowest: 62
} ];const subjectPerformance = [ { subject: 'Physics', average: 82, students: 120 }, { subject: 'Chemistry', average: 78, students: 120 }, {subject: 'Mathematics',
  average: 85,
  students: 120}, { subject: 'Biology', average: 80, students: 80 } ];const gradeDistribution = [ { grade: 'A+', count: 15, percentage: 12.5 }, { grade: 'A', count: 25, percentage: 20.8 }, { grade: 'B+', count: 30, percentage: 25.0 }, { grade: 'B', count: 25, percentage: 20.8 }, { grade: 'C', count: 20, percentage: 16.7 }, { grade: 'D', count: 5, percentage: 4.2 } ];
  const topPerformers = [ {name: 'Alex Johnson',batch: 'JEE Advanced',
  score: 98,
  improvement: 12
    }, {name: 'Sarah Williams',batch: 'NEET',
  score: 96,
  improvement: 8
    }, {name: 'Michael Chen',batch: 'JEE Advanced',
  score: 95,
  improvement: 15
    }, {name: 'Emily Davis',batch: 'NEET',
  score: 94,
  improvement: 10
    }, {name: 'David Brown',batch: 'JEE Mains',
  score: 93,
  improvement: 7
} ];
  const strugglingStudents = [ {name: 'John Doe',batch: 'JEE Advanced',
  score: 45,topics: ['Mechanics','Calculus']
    }, {name: 'Jane Smith',batch: 'NEET',
  score: 48,topics: ['Organic Chemistry','Genetics']
    }, {name: 'Robert Wilson',batch: 'JEE Mains',
  score: 52,topics: ['Algebra','Thermodynamics']
} ];
  const batchComparison = [ {batch: 'JEE Advanced',
  avgScore: 85,
  attendance: 92,
  completion: 88
    }, {batch: 'JEE Mains',
  avgScore: 78,
  attendance: 88,
  completion: 85
    }, {batch: 'NEET',
  avgScore: 82,
  attendance: 90,
  completion: 87
    }, {batch: 'Foundation',
  avgScore: 75,
  attendance: 85,
  completion: 80
} ];
const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  const PerformancePage: React.FC = () => {const [selectedBatch, setSelectedBatch] = useState('all'
  );
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  // Calculate statistics 
  const stats = {
    avgScore: 82,
    scoreChange: 5.2,
    totalStudents: 320,
    activeStudents: 295,
    avgAttendance: 89,
    attendanceChange: -2.1,
    completionRate: 85,
    completionChange: 3.5
    }

  return (
    <div className="container py-6 space-y-6">
      {
    /* Header */
    }<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <div><h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1><p className="text-muted-foreground">Track and analyze student performance across batches</p>
  </div><div className="flex gap-3">
  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}><SelectTrigger className="w-[150px]"><SelectValue placeholder="Period" />
  </SelectTrigger>
  <SelectContent><SelectItem value="week">This Week</SelectItem><SelectItem value="month">This Month</SelectItem><SelectItem value="quarter">This Quarter</SelectItem><SelectItem value="year">This Year</SelectItem>
  </SelectContent>
  </Select><Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filters </Button><Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export Report </Button>
  </div>
  </div>
      {
    /* Key Metrics */
    }<div className="grid gap-4 md:grid-cols-4">
  <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Average Score</CardTitle><BarChart3 className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent><div className="text-2xl font-bold">
      {stats.avgScore}%</div><p className="text-xs text-muted-foreground"><span className={stats.scoreChange > 0 ? 'text-green-500' : 'text-red-500'}>{stats.scoreChange > 0 ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />} {Math.abs(stats.scoreChange)}% </span>{' '}from last period </p>
  </CardContent>
  </Card>
  <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active Students</CardTitle><Users className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent><div className="text-2xl font-bold">
      {stats.activeStudents}/{stats.totalStudents}
    </div><Progress value={(stats.activeStudents / stats.totalStudents) * 100} className="mt-2" />
  </CardContent>
  </Card>
  <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Attendance Rate</CardTitle><Calendar className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent><div className="text-2xl font-bold">
      {stats.avgAttendance}%</div><p className="text-xs text-muted-foreground"><span className={stats.attendanceChange > 0 ? 'text-green-500' : 'text-red-500'}>{stats.attendanceChange > 0 ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />} {Math.abs(stats.attendanceChange)}% </span>{' '}from last period </p>
  </CardContent>
  </Card>
  <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Completion Rate</CardTitle><CheckCircle className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent><div className="text-2xl font-bold">
      {stats.completionRate}%</div><p className="text-xs text-muted-foreground"><span className={stats.completionChange > 0 ? 'text-green-500' : 'text-red-500'}>{stats.completionChange > 0 ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />} {Math.abs(stats.completionChange)}% </span>{' '}from last period </p>
  </CardContent>
  </Card>
  </div>
      {
    /* Performance Tabs */
    }<Tabs defaultValue="overview" className="space-y-4"><TabsList className="grid w-full grid-cols-4"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="subjects">Subject Analysis</TabsTrigger><TabsTrigger value="students">Student Performance</TabsTrigger><TabsTrigger value="batches">Batch Comparison</TabsTrigger>
  </TabsList><TabsContent value="overview" className="space-y-4">
      {
    /* Performance Trend */
    }
    <Card>
  <CardHeader>
  <CardTitle>Performance Trend</CardTitle>
  </CardHeader>
  <CardContent><ResponsiveContainer width="100%" height={300}>
  <LineChart data={performanceOverTime}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Legend /><Line type="monotone" dataKey="average" stroke="#8B5CF6" name="Average" strokeWidth={2} /><Line type="monotone" dataKey="highest" stroke="#10B981" name="Highest" strokeWidth={2} /><Line type="monotone" dataKey="lowest" stroke="#EF4444" name="Lowest" strokeWidth={2} />
  </LineChart>
  </ResponsiveContainer>
  </CardContent>
  </Card>
      {
    /* Grade Distribution */
    }<div className="grid gap-4 md:grid-cols-2">
  <Card>
  <CardHeader>
  <CardTitle>Grade Distribution</CardTitle>
  </CardHeader>
  <CardContent><ResponsiveContainer width="100%" height={300}>
  <RePieChart><Pie data={gradeDistribution} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.grade}: ${entry.percentage}%`} outerRadius={80} fill="#8884d8" dataKey="count" >
      {gradeDistribution.map((entry, index) => ( <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> ))}
    </Pie>
  <Tooltip />
  </RePieChart>
  </ResponsiveContainer>
  </CardContent>
  </Card>
  <Card>
  <CardHeader>
  <CardTitle>Quick Stats</CardTitle>
  </CardHeader><CardContent className="space-y-4"><div className="space-y-2"><div className="flex items-center justify-between"><span className="text-sm font-medium">Tests Conducted</span><span className="text-2xl font-bold">24</span>
  </div><div className="flex items-center justify-between"><span className="text-sm font-medium">Assignments Given</span><span className="text-2xl font-bold">36</span>
  </div><div className="flex items-center justify-between"><span className="text-sm font-medium">Average Study Time</span><span className="text-2xl font-bold">3.5 hrs</span>
  </div><div className="flex items-center justify-between"><span className="text-sm font-medium">Content Completion</span><span className="text-2xl font-bold">78%</span>
  </div>
  </div>
  </CardContent>
  </Card>
  </div>
  </TabsContent><TabsContent value="subjects" className="space-y-4">
  <Card>
  <CardHeader>
  <CardTitle>Subject Performance Comparison</CardTitle>
  </CardHeader>
  <CardContent><ResponsiveContainer width="100%" height={300}>
  <BarChart data={subjectPerformance}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="subject" />
  <YAxis />
  <Tooltip /><Bar dataKey="average" fill="#8B5CF6" name="Average Score" />
  </BarChart>
  </ResponsiveContainer>
  </CardContent>
  </Card><div className="grid gap-4 md:grid-cols-4">
      {subjectPerformance.map((subject, index) => ( <Card key={subject.subject}><CardHeader className="pb-2"><CardTitle className="text-sm">
      {subject.subject}
    </CardTitle>
    </CardHeader>
    <CardContent><div className="text-2xl font-bold">
      {subject.average}%</div><Progress value={subject.average} className="mt-2" /><p className="text-xs text-muted-foreground mt-2">
      {subject.students} students </p>
    </CardContent>
  </Card> ))}
    </div>
  </TabsContent><TabsContent value="students" className="space-y-4"><div className="grid gap-4 md:grid-cols-2">
      {
    /* Top Performers */
    }
    <Card>
  <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-yellow-500" /> Top Performers </CardTitle>
  </CardHeader>
  <CardContent><div className="space-y-3">{topPerformers.map((student, index) => ( <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
    <div><p className="font-medium">
      {student.name}
    </p><p className="text-sm text-muted-foreground">
      {student.batch}
    </p>
    </div><div className="text-right"><p className="font-bold">
      {student.score}%</p><p className="text-xs text-green-500"><TrendingUp className="inline h-3 w-3" />{' '}+{student.improvement}% </p>
    </div>
  </div> ))}
    </div>
  </CardContent>
  </Card>
      {
    /* Students Needing Attention */
    }
    <Card>
  <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-500" /> Need Attention </CardTitle>
  </CardHeader>
  <CardContent><div className="space-y-3">{strugglingStudents.map((student, index) => ( <div key={index} className="p-3 rounded-lg bg-muted/50"><div className="flex items-center justify-between mb-2"><p className="font-medium">
      {student.name}
    </p><Badge variant="destructive">
      {student.score}%</Badge>
    </div><p className="text-sm text-muted-foreground">
      {student.batch}
    </p><div className="flex gap-1 mt-2">{student.topics.map((topic, i) => ( <Badge key={i} variant="outline" className="text-xs">
      {topic}
    </Badge> ))}
    </div>
  </div> ))}
    </div>
  </CardContent>
  </Card>
  </div>
  </TabsContent><TabsContent value="batches" className="space-y-4">
  <Card>
  <CardHeader>
  <CardTitle>Batch Performance Comparison</CardTitle>
  </CardHeader>
  <CardContent><ResponsiveContainer width="100%" height={300}>
  <RadarChart data={batchComparison}>
  <PolarGrid /><PolarAngleAxis dataKey="batch" />
  <PolarRadiusAxis /><Radar name="Average Score" dataKey="avgScore" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} /><Radar name="Attendance" dataKey="attendance" stroke="#10B981" fill="#10B981" fillOpacity={0.6} /><Radar name="Completion" dataKey="completion" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
  <Legend />
  </RadarChart>
  </ResponsiveContainer>
  </CardContent>
  </Card><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {batchComparison.map((batch) => ( <Card key={batch.batch}>
    <CardHeader><CardTitle className="text-sm">
      {batch.batch}
    </CardTitle>
    </CardHeader><CardContent className="space-y-2">
    <div><div className="flex items-center justify-between text-sm">
    <span>Average Score</span><span className="font-medium">
      {batch.avgScore}%</span>
    </div><Progress value={batch.avgScore} className="h-2" />
    </div>
    <div><div className="flex items-center justify-between text-sm">
    <span>Attendance</span><span className="font-medium">
      {batch.attendance}%</span>
    </div><Progress value={batch.attendance} className="h-2" />
    </div>
    <div><div className="flex items-center justify-between text-sm">
    <span>Completion</span><span className="font-medium">
      {batch.completion}%</span>
    </div><Progress value={batch.completion} className="h-2" />
    </div>
    </CardContent>
  </Card> ))}
    </div>
  </TabsContent>
  </Tabs>
  </div>
  )
}

export default PerformancePage;
