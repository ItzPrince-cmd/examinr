import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';

  import {
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  BarChart3,
  Edit,
  UserPlus,
  Download,
  Mail,
  MoreVertical,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  Search} from 'lucide-react';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

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

  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from '../../components/ui/select';
import { toast } from '../../components/ui/use-toast';

// Types 
interface Student { 
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrollmentDate: string;
  attendance: number;
  testsCompleted: number;
  averageScore: number;
  lastActive: string;status: 'active' | 'inactive' | 'suspended'
}

  interface ScheduledClass { id: string;
  date: string;
  time: string;
  topic: string;
  subject: string;
  duration: number;status: 'upcoming' | 'completed' | 'cancelled';
  attendanceCount?: number
}

  interface Assignment { id: string;
  title: string;type: 'test' | 'dpp' | 'assignment';
  subject: string;
  dueDate: string;
  totalQuestions: number;
  submittedCount: number;
  averageScore?: number;status: 'active' | 'completed' | 'draft'
}

  interface BatchStats { totalStudents: number;
  activeStudents: number;
  averageAttendance: number;
  averagePerformance: number;
  testsCompleted: number;
  upcomingTests: number;
  assignmentsActive: number;
  classesCompleted: number
}

  const BatchDetails: React.FC = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  // Mock data - replace with API calls 
  const [batchInfo] = useState({
    id: batchId,
    name: 'JEE Advanced Batch A',
    subject: 'Physics + Chemistry + Math',
    level: 'JEE Advanced',
    schedule: 'Mon, Wed, Fri - 10:00 AM',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    description: 'Comprehensive JEE Advanced preparation batch covering all three subjects with regular tests and DPPs.'
  });
    const [stats] = useState<BatchStats>({
    totalStudents: 32,
    activeStudents: 30,
    averageAttendance: 92,
    averagePerformance: 78,
    testsCompleted: 15,
    upcomingTests: 3,
    assignmentsActive: 5,
    classesCompleted: 45
    });
    const [students] = useState<Student[]>([ {id: '1',name: 'Rahul Kumar',email: 'rahul.kumar@example.com',avatar: '',enrollmentDate: '2024-01-05',
    attendance: 95,
    testsCompleted: 14,
    averageScore: 82,lastActive: '2 hours ago',status: 'active'
      }, {id: '2',name: 'Priya Sharma',email: 'priya.sharma@example.com',avatar: '',enrollmentDate: '2024-01-03',
    attendance: 88,
    testsCompleted: 15,
    averageScore: 78,lastActive: '1 day ago',status: 'active'
      }, {id: '3',name: 'Amit Singh',email: 'amit.singh@example.com',avatar: '',enrollmentDate: '2024-01-10',
    attendance: 75,
    testsCompleted: 12,
    averageScore: 65,lastActive: '3 days ago',status: 'inactive'
    } ]

  );
    const [scheduledClasses] = useState<ScheduledClass[]>([ {id: '1',date: '2024-01-15',time: '10:00 AM',topic: 'Mechanics - Newton\'s Laws',subject: 'Physics',
    duration: 90,status: 'upcoming'
      }, {id: '2',date: '2024-01-12',time: '10:00 AM',topic: 'Organic Chemistry - Alkanes',subject: 'Chemistry',
    duration: 90,status: 'completed',
    attendanceCount: 28
    } ]

  );
    const [assignments] = useState<Assignment[]>([ {id: '1',title: 'Physics Chapter Test - Mechanics',type: 'test',subject: 'Physics',dueDate: '2024-01-20',
    totalQuestions: 30,
    submittedCount: 25,
    averageScore: 72,status: 'active'
      }, {id: '2',title: 'Daily Practice Problem #15',type: 'dpp',subject: 'Mathematics',dueDate: '2024-01-16',
    totalQuestions: 10,
    submittedCount: 30,status: 'active'
    } ]

  );
  // Filter students 
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  const handleStudentAction = (studentId: string, action: string) => {
    toast({ 
      title: `${action} action`, 
      description: `Action ${action} performed for student`
    });
  }

    const getStatusBadge = (status: string) => {switch (status) { case 'active': return <Badge variant="default">Active</Badge>;case 'inactive': return <Badge variant="secondary">Inactive</Badge>;case 'suspended': return <Badge variant="destructive">Suspended</Badge>;
      default: return null
} };

  return (<div className="min-h-screen bg-background p-6"><div className="max-w-7xl mx-auto space-y-6">
      {
    /* Header */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4" ><div className="flex items-center gap-4"><Button variant="ghost" size="icon" onClick={() => navigate('/teacher/batches')} ><ArrowLeft className="h-4 w-4" />
  </Button><div className="flex-1"><div className="flex items-center gap-4"><h1 className="text-3xl font-bold">
      {batchInfo.name}
    </h1><Badge variant={batchInfo.status === 'active' ? 'default' : 'secondary'}>
      {batchInfo.status}
    </Badge><Badge variant="outline">
      {batchInfo.level}
    </Badge>
  </div><p className="text-muted-foreground mt-1">
      {batchInfo.description}
    </p>
  </div><div className="flex gap-2"><Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Data </Button>
  <Button><Edit className="mr-2 h-4 w-4" /> Edit Batch </Button>
  </div>
  </div>
      {
    /* Quick Info */
    }<div className="flex flex-wrap gap-4 text-sm text-muted-foreground"><div className="flex items-center gap-2"><BookOpen className="h-4 w-4" />
      {batchInfo.subject}
    </div><div className="flex items-center gap-2"><Calendar className="h-4 w-4" />
      {batchInfo.schedule}
    </div><div className="flex items-center gap-2"><Clock className="h-4 w-4" />
      {batchInfo.startDate} - {batchInfo.endDate}
    </div>
  </div>
  </motion.div>
      {
    /* Stats Cards */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" >
  <Card><CardContent className="p-6"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Students</p><p className="text-2xl font-bold">
      {stats.activeStudents}/{stats.totalStudents}
    </p><p className="text-xs text-green-500 mt-1">
      {Math.round((stats.activeStudents / stats.totalStudents) * 100)}% active </p>
  </div><Users className="h-8 w-8 text-primary opacity-20" />
  </div>
  </CardContent>
  </Card>
  <Card><CardContent className="p-6"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Avg. Attendance</p><p className="text-2xl font-bold">
      {stats.averageAttendance}%</p><p className="text-xs text-blue-500 mt-1">Last 30 days</p>
  </div><CheckCircle className="h-8 w-8 text-secondary opacity-20" />
  </div>
  </CardContent>
  </Card>
  <Card><CardContent className="p-6"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Avg. Performance</p><p className="text-2xl font-bold">
      {stats.averagePerformance}%</p><p className="text-xs text-green-500 mt-1">↑ 5% this month</p>
  </div><TrendingUp className="h-8 w-8 text-accent opacity-20" />
  </div>
  </CardContent>
  </Card>
  <Card><CardContent className="p-6"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Tests Completed</p><p className="text-2xl font-bold">
      {stats.testsCompleted}
    </p><p className="text-xs text-orange-500 mt-1">
      {stats.upcomingTests} upcoming</p>
  </div><FileText className="h-8 w-8 text-orange-500 opacity-20" />
  </div>
  </CardContent>
  </Card>
  </motion.div>
      {
    /* Tabs */
    }
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} >
  <Tabs value={activeTab} onValueChange={setActiveTab}><TabsList className="grid w-full grid-cols-4 max-w-[600px]"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="students">Students</TabsTrigger><TabsTrigger value="schedule">Schedule</TabsTrigger><TabsTrigger value="assignments">Assignments</TabsTrigger>
  </TabsList>
      {
    /* Overview Tab */
    }<TabsContent value="overview" className="space-y-6"><div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {
    /* Recent Activity */
    }
    <Card>
  <CardHeader>
  <CardTitle>Recent Activity</CardTitle>
  <CardDescription>Latest updates from this batch</CardDescription>
  </CardHeader><CardContent className="space-y-4"><div className="space-y-3"><div className="flex items-start gap-3"><div className="h-2 w-2 bg-green-500 rounded-full mt-2" /><div className="flex-1"><p className="text-sm">25 students submitted Physics Chapter Test</p><p className="text-xs text-muted-foreground">2 hours ago</p>
  </div>
  </div><div className="flex items-start gap-3"><div className="h-2 w-2 bg-blue-500 rounded-full mt-2" /><div className="flex-1"><p className="text-sm">Class on Organic Chemistry completed</p><p className="text-xs text-muted-foreground">Yesterday</p>
  </div>
  </div><div className="flex items-start gap-3"><div className="h-2 w-2 bg-orange-500 rounded-full mt-2" /><div className="flex-1"><p className="text-sm">New DPP assigned for Mathematics</p><p className="text-xs text-muted-foreground">2 days ago</p>
  </div>
  </div>
  </div>
  </CardContent>
  </Card>
      {
    /* Performance Trends */
    }
    <Card>
  <CardHeader>
  <CardTitle>Performance Trends</CardTitle>
  <CardDescription>Subject-wise performance overview</CardDescription>
  </CardHeader><CardContent className="space-y-4"><div className="space-y-3">
  <div><div className="flex justify-between text-sm mb-1">
  <span>Physics</span><span className="font-medium">75%</span>
  </div><Progress value={75} className="h-2" />
  </div>
  <div><div className="flex justify-between text-sm mb-1">
  <span>Chemistry</span><span className="font-medium">68%</span>
  </div><Progress value={68} className="h-2" />
  </div>
  <div><div className="flex justify-between text-sm mb-1">
  <span>Mathematics</span><span className="font-medium">82%</span>
  </div><Progress value={82} className="h-2" />
  </div>
  </div>
  </CardContent>
  </Card>
  </div>
      {
    /* Quick Actions */
    }
    <Card>
  <CardHeader>
  <CardTitle>Quick Actions</CardTitle>
  </CardHeader><CardContent className="flex flex-wrap gap-2">
  <Button><FileText className="mr-2 h-4 w-4" /> Create Test </Button><Button variant="outline"><UserPlus className="mr-2 h-4 w-4" /> Add Students </Button><Button variant="outline"><Calendar className="mr-2 h-4 w-4" /> Schedule Class </Button><Button variant="outline"><Mail className="mr-2 h-4 w-4" /> Send Announcement </Button>
  </CardContent>
  </Card>
  </TabsContent>
      {
    /* Students Tab */
    }<TabsContent value="students" className="space-y-4"><div className="flex flex-col md:flex-row gap-4 justify-between"><div className="flex gap-4 flex-1"><div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
  </div>
  <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by status" />
  </SelectTrigger>
  <SelectContent><SelectItem value="all">All Students</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="suspended">Suspended</SelectItem>
  </SelectContent>
  </Select>
  </div>
  <Button><UserPlus className="mr-2 h-4 w-4" /> Add Students </Button>
  </div>
  <Card><CardContent className="p-0">
  <Table>
  <TableHeader>
  <TableRow>
  <TableHead>Student</TableHead>
  <TableHead>Enrollment Date</TableHead>
  <TableHead>Attendance</TableHead>
  <TableHead>Tests</TableHead>
  <TableHead>Avg. Score</TableHead>
  <TableHead>Status</TableHead>
  <TableHead>Last Active</TableHead>
  <TableHead>
  </TableHead>
  </TableRow>
  </TableHeader>
  <TableBody>
      {filteredStudents.map((student) => ( <TableRow key={student.id}>
    <TableCell><div className="flex items-center gap-3">
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
      {student.enrollmentDate}
    </TableCell>
    <TableCell><div className="flex items-center gap-2"><Progress value={student.attendance} className="w-16 h-2" /><span className="text-sm">
      {student.attendance}%</span>
    </div>
    </TableCell>
    <TableCell>
      {student.testsCompleted}
    </TableCell>
    <TableCell><Badge variant={student.averageScore >= 70 ? 'default' : 'secondary'}>
      {student.averageScore}% </Badge>
    </TableCell>
    <TableCell>
      {getStatusBadge(student.status)}
    </TableCell><TableCell className="text-sm text-muted-foreground">
      {student.lastActive}
    </TableCell>
    <TableCell>
    <DropdownMenu>
    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" />
    </Button>
    </DropdownMenuTrigger><DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => navigate(`/teacher/students/${student.id}`)} > View Profile </DropdownMenuItem><DropdownMenuItem onClick={() => handleStudentAction(student.id, 'message')} > Send Message </DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={() => handleStudentAction(student.id, 'suspend')} className="text-red-600" > Suspend Student </DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>
    </TableCell>
  </TableRow> ))}
    </TableBody>
  </Table>
  </CardContent>
  </Card>
  </TabsContent>
      {
    /* Schedule Tab */
    }<TabsContent value="schedule" className="space-y-4"><div className="flex justify-between items-center"><h3 className="text-lg font-medium">Class Schedule</h3>
  <Button><Calendar className="mr-2 h-4 w-4" /> Schedule New Class </Button>
  </div><div className="space-y-4">
      {scheduledClasses.map((classItem) => ( <Card key={classItem.id}><CardContent className="p-4"><div className="flex items-center justify-between"><div className="space-y-1"><div className="flex items-center gap-2"><h4 className="font-medium">
      {classItem.topic}
    </h4><Badge variant="outline">
      {classItem.subject}
    </Badge><Badge variant={ classItem.status === 'upcoming' ? 'default' : classItem.status === 'completed' ? 'secondary' : 'destructive' } >
      {classItem.status}
    </Badge>
    </div><div className="flex items-center gap-4 text-sm text-muted-foreground"><span className="flex items-center gap-1"><Calendar className="h-3 w-3" />
      {classItem.date}
    </span><span className="flex items-center gap-1"><Clock className="h-3 w-3" />
      {classItem.time} ({classItem.duration} min) </span>{classItem.attendanceCount && ( <span className="flex items-center gap-1"><Users className="h-3 w-3" />
      {classItem.attendanceCount} attended </span> )}
    </div>
    </div>
    <DropdownMenu>
    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" />
    </Button>
    </DropdownMenuTrigger><DropdownMenuContent align="end">
    <DropdownMenuItem>Edit Class</DropdownMenuItem><DropdownMenuItem>Send Reminder</DropdownMenuItem>{classItem.status === 'upcoming' && ( <DropdownMenuItem className="text-red-600"> Cancel Class </DropdownMenuItem> )}
    </DropdownMenuContent>
    </DropdownMenu>
    </div>
    </CardContent>
  </Card> ))}
    </div>
  </TabsContent>
      {
    /* Assignments Tab */
    }<TabsContent value="assignments" className="space-y-4"><div className="flex justify-between items-center"><h3 className="text-lg font-medium">Assignments & Tests</h3>
  <Button><FileText className="mr-2 h-4 w-4" /> Create New </Button>
  </div><div className="space-y-4">
      {assignments.map((assignment) => ( <Card key={assignment.id}><CardContent className="p-4"><div className="flex items-center justify-between"><div className="space-y-1"><div className="flex items-center gap-2"><h4 className="font-medium">
      {assignment.title}
    </h4><Badge variant="outline">
      {assignment.type.toUpperCase()}
    </Badge><Badge variant="outline">
      {assignment.subject}
    </Badge>
    </div><div className="flex items-center gap-4 text-sm text-muted-foreground">
    <span>Due: {assignment.dueDate}
    </span>
    <span>
      {assignment.totalQuestions} questions</span>
    <span>
      {assignment.submittedCount}/{stats.totalStudents} submitted</span>
      {assignment.averageScore && ( <span>Avg: {assignment.averageScore}%</span> )}
    </div>
    </div><div className="flex items-center gap-2"><Progress value={(assignment.submittedCount / stats.totalStudents) * 100} className="w-24 h-2" /><Button variant="ghost" size="sm"> View Results </Button>
    </div>
    </div>
    </CardContent>
  </Card> ))}
    </div>
  </TabsContent>
  </Tabs>
  </motion.div>
  </div>
  </div>
  )
}

export default BatchDetails;
