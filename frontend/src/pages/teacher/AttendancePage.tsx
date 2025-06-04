import React, { useState } from 'react';
import { motion } from 'framer-motion';

  import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  Search,
  BarChart3,
  FileText,
  User,
  Mail,
  Phone,
  Edit2,
  Save} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';

  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

  import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Checkbox } from '../../components/ui/checkbox';
import { toast } from '../../components/ui/use-toast';

  import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer} from 'recharts';

// Types
interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  rollNumber: string;
}

interface AttendanceRecord {
  studentId: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

interface BatchAttendance {
  batchId: string;
  batchName: string;
  date: Date;
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  percentage: number
}

// Mock Data 
const mockStudents: Student[] = [
  {id: '1',name: 'Alex Johnson',email: 'alex@example.com',phone: '+91 98765 43210',rollNumber: 'JEE24001'
    }, {id: '2',name: 'Sarah Williams',email: 'sarah@example.com',phone: '+91 98765 43211',rollNumber: 'JEE24002'
    }, {id: '3',name: 'Michael Chen',email: 'michael@example.com',phone: '+91 98765 43212',rollNumber: 'JEE24003'
    }, {id: '4',name: 'Emily Davis',email: 'emily@example.com',phone: '+91 98765 43213',rollNumber: 'JEE24004'
    }, {id: '5',name: 'David Brown',email: 'david@example.com',phone: '+91 98765 43214',rollNumber: 'JEE24005'
} ];
  const mockAttendanceRecords: AttendanceRecord[] = [ {studentId: '1',
  date: new Date(),status: 'present'
    }, {studentId: '2',
  date: new Date(),status: 'present'
    }, {studentId: '3',
  date: new Date(),status: 'late',remarks: 'Arrived 15 minutes late'
    }, {studentId: '4',
  date: new Date(),status: 'absent'
    }, {studentId: '5',
  date: new Date(),status: 'present'
} ];const attendanceTrend = [ { date: '1 Mar', percentage: 92 }, { date: '2 Mar', percentage: 88 }, { date: '3 Mar', percentage: 90 }, { date: '4 Mar', percentage: 85 }, { date: '5 Mar', percentage: 87 }, { date: '6 Mar', percentage: 91 }, { date: '7 Mar', percentage: 89 } ];const monthlyStats = [ { month: 'Jan', attendance: 88, target: 85 }, { month: 'Feb', attendance: 90, target: 85 }, { month: 'Mar', attendance: 85, target: 85 }, { month: 'Apr', attendance: 92, target: 85 }, { month: 'May', attendance: 87, target: 85 }, { month: 'Jun', attendance: 89, target: 85 } ];

  const AttendancePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBatch, setSelectedBatch] = useState('JEE Advanced 2024');
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  
  // Calculate stats 
  const stats = {
    totalStudents: mockStudents.length,present: mockAttendanceRecords.filter(r => r.status === 'present').length,absent: mockAttendanceRecords.filter(r => r.status === 'absent').length,late: mockAttendanceRecords.filter(r => r.status === 'late').length,percentage: Math.round((mockAttendanceRecords.filter(r => r.status === 'present' || r.status === 'late').length / mockStudents.length) * 100)
    }

  const handleAttendanceChange = (studentId: string, status: string) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  }

  const handleSaveAttendance = () => {
    setIsEditing(false);
    toast({ 
      title: "Attendance Saved", 
      description: `Attendance for ${selectedDate.toLocaleDateString()} has been saved successfully.`
    });
  }
  const handleBulkAction = (action: 'present' | 'absent') => {
    const newData: Record<string, string> = {};

    mockStudents.forEach((student) => {
      newData[student.id] = action;
    });
    setAttendanceData(newData);
  }

    const getStatusColor = (status: string) => {switch (status) { case 'present': return 'text-green-500';case 'absent': return 'text-red-500';case 'late': return 'text-yellow-500';case 'excused': return 'text-blue-500';default: return 'text-gray-500'
} };
const getStatusIcon = (status: string) => {switch (status) { case 'present': return <CheckCircle className="h-4 w-4" />;case 'absent': return <XCircle className="h-4 w-4" />;case 'late': return <Clock className="h-4 w-4" />;case 'excused': return <AlertCircle className="h-4 w-4" />;
      default: return null
} };

  // Filter students based on search
  const filteredStudents = mockStudents.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (<div className="container py-6 space-y-6">
      {
    /* Header */
    }<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <div><h1 className="text-3xl font-bold tracking-tight">Attendance</h1><p className="text-muted-foreground">Track and manage student attendance</p>
  </div><div className="flex gap-3"><Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export Report </Button>
      {isEditing ? ( <><Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
    <Button onClick={handleSaveAttendance}><Save className="h-4 w-4 mr-2" /> Save Attendance </Button>
    </> ) : ( <Button onClick={() => setIsEditing(true)}><Edit2 className="h-4 w-4 mr-2" /> Mark Attendance </Button> )}
    </div>
  </div>
      {
    /* Stats Cards */
    }<div className="grid gap-4 md:grid-cols-5">
  <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Students</CardTitle><Users className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent><div className="text-2xl font-bold">
      {stats.totalStudents}
    </div>
  </CardContent>
  </Card>
  <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Present</CardTitle><CheckCircle className="h-4 w-4 text-green-500" />
  </CardHeader>
  <CardContent><div className="text-2xl font-bold">
      {stats.present}
    </div>
  </CardContent>
  </Card>
  <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Absent</CardTitle><XCircle className="h-4 w-4 text-red-500" />
  </CardHeader>
  <CardContent><div className="text-2xl font-bold">
      {stats.absent}
    </div>
  </CardContent>
  </Card>
  <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Late</CardTitle><Clock className="h-4 w-4 text-yellow-500" />
  </CardHeader>
  <CardContent><div className="text-2xl font-bold">
      {stats.late}
    </div>
  </CardContent>
  </Card>
  <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Attendance %</CardTitle><BarChart3 className="h-4 w-4 text-blue-500" />
  </CardHeader>
  <CardContent><div className="text-2xl font-bold">
      {stats.percentage}%</div><Progress value={stats.percentage} className="mt-2" />
  </CardContent>
  </Card>
  </div>
      {
    /* Filters */
    }
    <Card><CardContent className="p-4"><div className="flex flex-col gap-4 md:flex-row md:items-center">
  <Select value={selectedBatch} onValueChange={setSelectedBatch}><SelectTrigger className="w-[200px]"><SelectValue placeholder="Select batch" />
  </SelectTrigger>
  <SelectContent><SelectItem value="JEE Advanced 2024">JEE Advanced 2024</SelectItem><SelectItem value="JEE Mains 2024">JEE Mains 2024</SelectItem><SelectItem value="NEET 2024">NEET 2024</SelectItem>
  </SelectContent>
  </Select><div className="flex items-center gap-2"><Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" />
  </Button><Button variant="outline"><Calendar className="h-4 w-4 mr-2" />
      {selectedDate.toLocaleDateString()}
    </Button><Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" />
  </Button>
  </div><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
  </div>{isEditing && ( <div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => handleBulkAction('present')}> Mark All Present </Button><Button variant="outline" size="sm" onClick={() => handleBulkAction('absent')}> Mark All Absent </Button>
  </div> )}
    </div>
  </CardContent>
  </Card>
      {
    /* Attendance Tabs */
    }<Tabs defaultValue="mark" className="space-y-4"><TabsList className="grid w-full grid-cols-3"><TabsTrigger value="mark">Mark Attendance</TabsTrigger><TabsTrigger value="history">History</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger>
  </TabsList>
      {
    /* Mark Attendance Tab */
    }<TabsContent value="mark">
  <Card><CardContent className="p-0">
  <Table>
  <TableHeader>
  <TableRow>
  <TableHead>Student</TableHead>
  <TableHead>Roll Number</TableHead>
  <TableHead>Contact</TableHead>
  <TableHead>Status</TableHead>
      {isEditing && <TableHead>Actions</TableHead>}
    </TableRow>
  </TableHeader>
  <TableBody>
      {filteredStudents.map((student) => {
      const record = mockAttendanceRecords.find(r => r.studentId === student.id

      );const currentStatus = attendanceData[student.id] || record?.status || 'absent';
      return (
      <TableRow key={student.id}>
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
      {student.rollNumber}
      </TableCell>
      <TableCell><div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-3 w-3" />
      {student.phone}
      </div>
      </TableCell>
      <TableCell>
          {isEditing ? ( <Select value={currentStatus} onValueChange={
          (value) => handleAttendanceChange(student.id,
          value)
          } ><SelectTrigger className="w-[120px]">
        <SelectValue />
        </SelectTrigger>
        <SelectContent><SelectItem value="present">Present</SelectItem><SelectItem value="absent">Absent</SelectItem><SelectItem value="late">Late</SelectItem><SelectItem value="excused">Excused</SelectItem>
        </SelectContent></Select> ) : ( <Badge variant="outline" className={`gap-1 ${getStatusColor(currentStatus)}`}>
        {getStatusIcon(currentStatus)} {currentStatus}
      </Badge> )}
      </TableCell>
        {isEditing && ( <TableCell><Button size="sm" variant="ghost"> Add Note </Button>
      </TableCell> )}
      </TableRow>
      )
}
    )
    }
    </TableBody>
  </Table>
  </CardContent>
  </Card>
  </TabsContent>
      {
    /* History Tab */
    }<TabsContent value="history">
  <Card>
  <CardHeader>
  <CardTitle>Weekly Attendance Trend</CardTitle>
  </CardHeader>
  <CardContent><ResponsiveContainer width="100%" height={300}>
  <LineChart data={attendanceTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" />
  <YAxis />
  <Tooltip /><Line type="monotone" dataKey="percentage" stroke="#8B5CF6" strokeWidth={2} name="Attendance %" />
  </LineChart>
  </ResponsiveContainer>
  </CardContent>
  </Card><div className="grid gap-4 md:grid-cols-2">
  <Card>
  <CardHeader>
  <CardTitle>Recent Attendance Records</CardTitle>
  </CardHeader>
  <CardContent><div className="space-y-3"><div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
  <div><p className="font-medium">6 March 2024</p><p className="text-sm text-muted-foreground">Wednesday</p>
  </div><div className="text-right"><p className="font-bold text-green-500">91%</p><p className="text-xs text-muted-foreground">41/45 present</p>
  </div>
  </div><div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
  <div><p className="font-medium">5 March 2024</p><p className="text-sm text-muted-foreground">Tuesday</p>
  </div><div className="text-right"><p className="font-bold text-yellow-500">87%</p><p className="text-xs text-muted-foreground">39/45 present</p>
  </div>
  </div><div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
  <div><p className="font-medium">4 March 2024</p><p className="text-sm text-muted-foreground">Monday</p>
  </div><div className="text-right"><p className="font-bold text-red-500">85%</p><p className="text-xs text-muted-foreground">38/45 present</p>
  </div>
  </div>
  </div>
  </CardContent>
  </Card>
  <Card>
  <CardHeader>
  <CardTitle>Student Attendance Summary</CardTitle>
  </CardHeader>
  <CardContent><div className="space-y-3">{mockStudents.slice(0, 3).map((student) => ( <div key={student.id} className="flex items-center justify-between"><div className="flex items-center gap-3"><Avatar className="h-8 w-8">
    <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}
    </AvatarFallback>
    </Avatar>
    <div><p className="text-sm font-medium">
      {student.name}
    </p><p className="text-xs text-muted-foreground">Last 30 days</p>
    </div>
    </div><div className="text-right"><p className="text-sm font-bold">92%</p><Progress value={92} className="w-[60px] h-2" />
    </div>
  </div> ))}
    </div>
  </CardContent>
  </Card>
  </div>
  </TabsContent>
      {
    /* Analytics Tab */
    }<TabsContent value="analytics">
  <Card>
  <CardHeader>
  <CardTitle>Monthly Attendance vs Target</CardTitle>
  </CardHeader>
  <CardContent><ResponsiveContainer width="100%" height={300}>
  <BarChart data={monthlyStats}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Legend /><Bar dataKey="attendance" fill="#8B5CF6" name="Actual Attendance" /><Bar dataKey="target" fill="#10B981" name="Target" />
  </BarChart>
  </ResponsiveContainer>
  </CardContent>
  </Card><div className="grid gap-4 md:grid-cols-3">
  <Card>
  <CardHeader>
  <CardTitle>Low Attendance Alert</CardTitle>
  </CardHeader>
  <CardContent><div className="space-y-2">{mockStudents.slice(3, 6).map((student) => ( <div key={student.id} className="flex items-center justify-between p-2 rounded bg-red-50 dark:bg-red-900/20"><span className="text-sm">
      {student.name}
    </span><Badge variant="destructive">65%</Badge>
  </div> ))}
    </div>
  </CardContent>
  </Card>
  <Card>
  <CardHeader>
  <CardTitle>Perfect Attendance</CardTitle>
  </CardHeader>
  <CardContent><div className="space-y-2">{mockStudents.slice(0, 3).map((student) => ( <div key={student.id} className="flex items-center justify-between p-2 rounded bg-green-50 dark:bg-green-900/20"><span className="text-sm">
      {student.name}
    </span><Badge className="bg-green-500">100%</Badge>
  </div> ))}
    </div>
  </CardContent>
  </Card>
  <Card>
  <CardHeader>
  <CardTitle>Attendance Stats</CardTitle>
  </CardHeader><CardContent className="space-y-3"><div className="flex items-center justify-between"><span className="text-sm">Average Attendance</span><span className="font-bold">88.5%</span>
  </div><div className="flex items-center justify-between"><span className="text-sm">Best Day</span><span className="font-bold">Wednesday</span>
  </div><div className="flex items-center justify-between"><span className="text-sm">Worst Day</span><span className="font-bold">Monday</span>
  </div><div className="flex items-center justify-between"><span className="text-sm">This Month</span><span className="font-bold text-green-500">↑ 3%</span>
  </div>
  </CardContent>
  </Card>
  </div>
  </TabsContent>
  </Tabs>
  </div>
  )
}

export default AttendancePage;
