import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

  import {
  Users,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Clock,
  Award,
  AlertCircle,
  ChevronRight,
  MoreVertical,
  Mail,
  MessageSquare,
  FileText,
  Target,
  Activity} from 'lucide-react';

  import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from '../../components/ui/select';

  import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow} from '../../components/ui/table';

  import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger} from '../../components/ui/dropdown-menu';
import { toast } from '../../components/ui/use-toast';

// Types 
interface Student { 
  id: string;
  name: string;
  email: string;
  avatar?: string;
  batch: string;
  enrollmentDate: string;
  overallScore: number;
  testsCompleted: number;
  totalTests: number;
  attendance: number;
  lastActive: string;
  performanceTrend: 'up' | 'down' | 'stable';
  weakSubjects: string[];
  strongSubjects: string[];
  rank: number;
  totalStudents: number
}

  interface SubjectPerformance { subject: string;
  averageScore: number;
  testsAttempted: number;
  improvement: number;
    topics: { name: string;
    score: number;status: 'strong' | 'average' | 'weak'
}[]
}

  interface RecentActivity { id: string;type: 'test' | 'assignment' | 'practice';
  title: string;
  date: string;
  score?: number;
  duration?: number;status: 'completed' | 'pending' | 'missed'
}

  const StudentMonitoring: React.FC = () => {
  const navigate = useNavigate();const [searchQuery, setSearchQuery] = useState(''
  );const [selectedBatch, setSelectedBatch] = useState('all'
  );
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data 
  const [students] = useState<Student[]>([
    {
      id: '1',
      name: 'Rahul Kumar',
      email: 'rahul.kumar@example.com',
      avatar: '',
      batch: 'JEE Advanced Batch A',
      enrollmentDate: '2024-01-05',
    overallScore: 82,
    testsCompleted: 18,
    totalTests: 20,
    attendance: 95,lastActive: '2 hours ago',performanceTrend: 'up',weakSubjects: ['Chemistry'],strongSubjects: ['Mathematics','Physics'],
    rank: 3,
    totalStudents: 35
      }, {id: '2',name: 'Priya Sharma',email: 'priya.sharma@example.com',avatar: '',batch: 'NEET Morning Batch',enrollmentDate: '2024-01-03',
    overallScore: 78,
    testsCompleted: 16,
    totalTests: 20,
    attendance: 88,lastActive: '1 day ago',performanceTrend: 'stable',weakSubjects: ['Physics'],strongSubjects: ['Biology','Chemistry'],
    rank: 8,
    totalStudents: 28
      }, {id: '3',name: 'Amit Singh',email: 'amit.singh@example.com',avatar: '',batch: 'JEE Main Batch B',enrollmentDate: '2024-01-10',
    overallScore: 65,
    testsCompleted: 14,
    totalTests: 20,
    attendance: 75,lastActive: '3 days ago',performanceTrend: 'down',weakSubjects: ['Mathematics','Chemistry'],strongSubjects: ['Physics'],
    rank: 22,
    totalStudents: 35
    } ]

  );const [batches] = useState([ { id: 'all', name: 'All Batches' }, { id: '1', name: 'JEE Advanced Batch A' }, { id: '2', name: 'JEE Main Batch B' }, { id: '3', name: 'NEET Morning Batch' }, { id: '4', name: 'NEET Evening Batch' } ]
  );
  // Filter students 
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = selectedBatch === 'all' || student.batch.includes(selectedBatch);
    const matchesPerformance = performanceFilter === 'all' || 
                              (performanceFilter === 'top' && student.overallScore >= 80) || 
                              (performanceFilter === 'average' && student.overallScore >= 60 && student.overallScore < 80) || 
                              (performanceFilter === 'struggling' && student.overallScore < 60);
    return matchesSearch && matchesBatch && matchesPerformance;
  });
    const getPerformanceBadge = (score: number) => {
    if (score >= 80) return <Badge variant="default">Excellent</Badge>;if (score >= 60) return <Badge variant="secondary">Good</Badge>;return <Badge variant="destructive">Needs Attention</Badge>
}
const getTrendIcon = (trend: string) => {switch (trend) { case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;default: return <Activity className="h-4 w-4 text-yellow-500" />
} };

    const handleStudentAction = (studentId: string, action: string) => {
    toast({ title: `${action} initiated`, description: `Action ${action} started for student`, }

    )
}

    const exportData = () => {
      toast({title:"Export started",description:"Student performance data is being exported",

      }

    )
}

  return (<div className="min-h-screen bg-background p-6"><div className="max-w-7xl mx-auto space-y-6">
      {
    /* Header */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" >
  <div><h1 className="text-3xl font-bold">Student Monitoring</h1><p className="text-muted-foreground mt-1"> Track and analyze student performance across all batches </p>
  </div>
  <Button onClick={exportData}><Download className="mr-2 h-4 w-4" /> Export Report </Button>
  </motion.div>
      {
    /* Overview Stats */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-4" >
  <Card><CardContent className="p-6"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Total Students</p><p className="text-2xl font-bold">245</p><p className="text-xs text-green-500 mt-1">+12 this month</p>
  </div><Users className="h-8 w-8 text-primary opacity-20" />
  </div>
  </CardContent>
  </Card>
  <Card><CardContent className="p-6"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Avg. Performance</p><p className="text-2xl font-bold">74%</p><p className="text-xs text-green-500 mt-1">↑ 3% this month</p>
  </div><TrendingUp className="h-8 w-8 text-secondary opacity-20" />
  </div>
  </CardContent>
  </Card>
  <Card><CardContent className="p-6"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Struggling Students</p><p className="text-2xl font-bold">23</p><p className="text-xs text-orange-500 mt-1">Need attention</p>
  </div><AlertCircle className="h-8 w-8 text-orange-500 opacity-20" />
  </div>
  </CardContent>
  </Card>
  <Card><CardContent className="p-6"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Top Performers</p><p className="text-2xl font-bold">67</p><p className="text-xs text-blue-500 mt-1">80%+ average</p>
  </div><Award className="h-8 w-8 text-accent opacity-20" />
  </div>
  </CardContent>
  </Card>
  </motion.div>
      {
    /* Filters */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col md:flex-row gap-4" ><div className="relative flex-1"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
  </div>
  <Select value={selectedBatch} onValueChange={setSelectedBatch}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Select batch" />
  </SelectTrigger>
  <SelectContent>
      {batches.map(batch => ( <SelectItem key={batch.id} value={batch.id}>
      {batch.name}
    </SelectItem> ))}
    </SelectContent>
  </Select>
  <Select value={performanceFilter} onValueChange={setPerformanceFilter}><SelectTrigger className="w-full md:w-[200px]"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Performance filter" />
  </SelectTrigger>
  <SelectContent><SelectItem value="all">All Students</SelectItem><SelectItem value="top">Top Performers (80%+)</SelectItem><SelectItem value="average">Average (60-80%)</SelectItem><SelectItem value="struggling">Struggling (&lt;
  60%)</SelectItem>
  </SelectContent>
  </Select>
  </motion.div>
      {
    /* Student List */
    }
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} >
  <Card>
  <CardHeader>
  <CardTitle>Student Performance Overview</CardTitle>
  <CardDescription> Click on any student to view detailed performance analytics </CardDescription>
  </CardHeader><CardContent className="p-0">
  <Table>
  <TableHeader>
  <TableRow>
  <TableHead>Student</TableHead>
  <TableHead>Batch</TableHead>
  <TableHead>Overall Score</TableHead>
  <TableHead>Tests</TableHead>
  <TableHead>Attendance</TableHead>
  <TableHead>Rank</TableHead>
  <TableHead>Trend</TableHead>
  <TableHead>Weak Areas</TableHead>
  <TableHead>
  </TableHead>
  </TableRow>
  </TableHeader>
  <TableBody>{filteredStudents.map((student) => ( <TableRow key={student.id} className="cursor-pointer" onClick={() => navigate(`/teacher/students/${student.id}`)} >
    <TableCell onClick={(e) => e.stopPropagation()}><div className="flex items-center gap-3">
    <Avatar>
    <AvatarImage src={student.avatar} />
    <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}
    </AvatarFallback>
    </Avatar>
    <div><p className="font-medium">
      {student.name}
    </p><p className="text-sm text-muted-foreground">
      {student.email}
    </p>
    </div>
    </div>
    </TableCell>
    <TableCell>
      {student.batch}
    </TableCell>
    <TableCell><div className="flex items-center gap-2">
      {getPerformanceBadge(student.overallScore)}<span className="font-medium">
      {student.overallScore}%</span>
    </div>
    </TableCell>
    <TableCell><div className="flex items-center gap-2"><Progress value={(student.testsCompleted / student.totalTests) * 100} className="w-16 h-2" /><span className="text-sm">
      {student.testsCompleted}/{student.totalTests}
    </span>
    </div>
    </TableCell>
    <TableCell><div className="flex items-center gap-2"><Progress value={student.attendance} className="w-16 h-2" /><span className="text-sm">
      {student.attendance}%</span>
    </div>
    </TableCell>
    <TableCell><Badge variant="outline">
      {student.rank}/{student.totalStudents}
    </Badge>
    </TableCell>
    <TableCell>
      {getTrendIcon(student.performanceTrend)}
    </TableCell>
    <TableCell><div className="flex gap-1">{student.weakSubjects.map((subject, idx) => ( <Badge key={idx} variant="destructive" className="text-xs">
      {subject}
    </Badge> ))}
    </div>
    </TableCell>
    <TableCell onClick={(e) => e.stopPropagation()}>
    <DropdownMenu>
    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" />
    </Button>
    </DropdownMenuTrigger><DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => navigate(`/teacher/students/${student.id}`)} ><BarChart3 className="mr-2 h-4 w-4" /> View Details </DropdownMenuItem><DropdownMenuItem onClick={() => handleStudentAction(student.id, 'message')} ><Mail className="mr-2 h-4 w-4" /> Send Message </DropdownMenuItem><DropdownMenuItem onClick={() => handleStudentAction(student.id, 'schedule')} ><Calendar className="mr-2 h-4 w-4" /> Schedule Meeting </DropdownMenuItem>
    <DropdownMenuSeparator /><DropdownMenuItem onClick={() => handleStudentAction(student.id, 'report')} ><FileText className="mr-2 h-4 w-4" /> Generate Report </DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>
    </TableCell>
  </TableRow> ))}
    </TableBody>
  </Table>
  </CardContent>
  </Card>
  </motion.div>
      {
    /* Performance Insights */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6" >
      {
    /* Subject-wise Performance */
    }
    <Card>
  <CardHeader>
  <CardTitle>Subject-wise Performance</CardTitle>
  <CardDescription>Average scores across all students</CardDescription>
  </CardHeader><CardContent className="space-y-4"><div className="space-y-3">
  <div><div className="flex justify-between text-sm mb-1">
  <span>Physics</span><span className="font-medium">76%</span>
  </div><Progress value={76} className="h-2" />
  </div>
  <div><div className="flex justify-between text-sm mb-1">
  <span>Chemistry</span><span className="font-medium">68%</span>
  </div><Progress value={68} className="h-2" />
  </div>
  <div><div className="flex justify-between text-sm mb-1">
  <span>Mathematics</span><span className="font-medium">82%</span>
  </div><Progress value={82} className="h-2" />
  </div>
  <div><div className="flex justify-between text-sm mb-1">
  <span>Biology</span><span className="font-medium">71%</span>
  </div><Progress value={71} className="h-2" />
  </div>
  </div>
  </CardContent>
  </Card>
      {
    /* Recent Activities */
    }
    <Card>
  <CardHeader>
  <CardTitle>Students Requiring Attention</CardTitle>
  <CardDescription>Students showing declining performance</CardDescription>
  </CardHeader><CardContent className="space-y-4">{filteredStudents .filter(s => s.performanceTrend === 'down' || s.overallScore < 60) .slice(0, 5) .map((student) => ( <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border cursor-pointer" onClick={() => navigate(`/teacher/students/${student.id}`)} ><div className="flex items-center gap-3"><Avatar className="h-8 w-8">
    <AvatarImage src={student.avatar} />
    <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}
    </AvatarFallback>
    </Avatar>
    <div><p className="font-medium text-sm">
      {student.name}
    </p><p className="text-xs text-muted-foreground">
      {student.batch}
    </p>
    </div>
    </div><div className="flex items-center gap-2"><Badge variant="destructive" className="text-xs">
      {student.overallScore}% </Badge>
      {getTrendIcon(student.performanceTrend)}<ChevronRight className="h-4 w-4 text-muted-foreground" />
    </div>
  </div> ))}
    </CardContent>
  </Card>
  </motion.div>
  </div>
  </div>
  )
}

export default StudentMonitoring;
