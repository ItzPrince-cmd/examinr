import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

  import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  UserPlus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  GraduationCap,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
  BookOpen,
  Target} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

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

  import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from '../../components/ui/use-toast';

// Types 
interface Student { 
  id: string;
  name: string;
  email: string;
  avatar?: string;
  batch: string;
  enrollmentDate: Date;
  lastActive: Date;
  status: 'active' | 'inactive' | 'suspended';
  performance: { 
    overall: number;
    trend: 'up' | 'down' | 'stable';
    testsCompleted: number;
    averageScore: number;
    attendance: number
}

    subjects: { name: string;
    score: number;
    progress: number
  }[]
}

// Mock Data 
const mockStudents: Student[] = [
  { 
    id: '1', 
    name: 'Alex Johnson', 
    email: 'alex.j@example.com', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', 
    batch: 'JEE Advanced 2024', 
    enrollmentDate: new Date('2024-01-15'), 
    lastActive: new Date('2024-03-15'), 
    status: 'active', 
    performance: {
      overall: 85,
      trend: 'up',
    testsCompleted: 24,
    averageScore: 82,
    attendance: 92}, subjects: [ { name: 'Physics', score: 88, progress: 75 }, { name: 'Chemistry', score: 82, progress: 70 }, { name: 'Mathematics', score: 85, progress: 80 } ] }, { id: '2', name: 'Sarah Williams', email: 'sarah.w@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', batch: 'NEET 2024', enrollmentDate: new Date('2024-02-01'), lastActive: new Date('2024-03-14'), status: 'active', performance: {
    overall: 78,trend: 'stable',
    testsCompleted: 20,
    averageScore: 76,
    attendance: 88}, subjects: [ { name: 'Biology', score: 82, progress: 85 }, { name: 'Chemistry', score: 78, progress: 75 }, { name: 'Physics', score: 74, progress: 70 } ] }, { id: '3', name: 'Michael Chen', email: 'michael.c@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', batch: 'JEE Advanced 2024', enrollmentDate: new Date('2024-01-20'), lastActive: new Date('2024-03-10'), status: 'inactive', performance: {
    overall: 65,trend: 'down',
    testsCompleted: 15,
    averageScore: 68,
    attendance: 72}, subjects: [ { name: 'Physics', score: 70, progress: 60 }, { name: 'Chemistry', score: 65, progress: 55 }, { name: 'Mathematics', score: 63, progress: 58 } ] } ];

  const StudentsPage: React.FC = () => {const [searchQuery, setSearchQuery] = useState(''
  );const [selectedBatch, setSelectedBatch] = useState('all'
  );const [selectedStatus, setSelectedStatus] = useState('all'
  );const [selectedView, setSelectedView] = useState<'list' | 'grid'>('list'

  );
  // Filter students 
  const filteredStudents = useMemo(() => {
    return mockStudents.filter((student) => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           student.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBatch = selectedBatch === 'all' || student.batch === selectedBatch;
      const matchesStatus = selectedStatus === 'all' || student.status === selectedStatus;
      return matchesSearch && matchesBatch && matchesStatus;
    });
  }, [searchQuery, selectedBatch, selectedStatus]

  );
  
  // Stats 
  const stats = useMemo(() => {
    const total = mockStudents.length;const active = mockStudents.filter(s => s.status === 'active').length;
    const avgPerformance = mockStudents.reduce((acc, s) => acc + s.performance.overall, 0) / total;
    const avgAttendance = mockStudents.reduce((acc, s) => acc + s.performance.attendance, 0) / total;
      return {
      total,
      active,
      inactive: total - active,
      avgPerformance: Math.round(avgPerformance),
      avgAttendance: Math.round(avgAttendance)
      }
    }, []);
    const handleStudentAction = (action: string, studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId

    );switch (action) { case 'view': toast({ title:"View Student", description: `Viewing details for ${student?.name}`, });break;case 'edit': toast({ title:"Edit Student", description: `Editing ${student?.name}'s profile`, });break;case 'email': toast({ title:"Email Sent", description: `Email sent to ${student?.email}`, });break;case 'delete': toast({ title:"Delete Student", description: `Are you sure you want to remove ${student?.name}?`, variant:"destructive" });
      break
} };
const getStatusIcon = (status: string) => {switch (status) { case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;case 'inactive': return <XCircle className="h-4 w-4 text-red-500" />;case 'suspended': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return null
} };
const getTrendIcon = (trend: string) => {switch (trend) { case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />
} };

  return (<div className="container py-6 space-y-6">
      {
    /* Header */
    }<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <div><h1 className="text-3xl font-bold tracking-tight">Students</h1><p className="text-muted-foreground">Manage and monitor your students</p>
  </div><div className="flex gap-3"><Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export </Button>
  <Button><UserPlus className="h-4 w-4 mr-2" /> Add Student </Button>
  </div>
  </div>
      {
    /* Stats Cards */
    }<div className="grid gap-4 md:grid-cols-5">
  <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Students</CardTitle><Users className="h-4 w-4 text-muted-foreground" />
  </CardHeader>
  <CardContent><div className="text-2xl font-bold">
      {stats.total}
    </div>
  </CardContent>
  </Card>
  <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active</CardTitle><CheckCircle className="h-4 w-4 text-green-500" />
  </CardHeader>
  <CardContent><div className="text-2xl font-bold">
      {stats.active}
    </div>
  </CardContent>
  </Card>
  <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Inactive</CardTitle><XCircle className="h-4 w-4 text-red-500" />
  </CardHeader>
  <CardContent><div className="text-2xl font-bold">
      {stats.inactive}
    </div>
  </CardContent>
  </Card>
  <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Avg Performance</CardTitle><TrendingUp className="h-4 w-4 text-blue-500" />
  </CardHeader>
  <CardContent><div className="text-2xl font-bold">
      {stats.avgPerformance}%</div>
  </CardContent>
  </Card>
  <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Avg Attendance</CardTitle><Calendar className="h-4 w-4 text-purple-500" />
  </CardHeader>
  <CardContent><div className="text-2xl font-bold">
      {stats.avgAttendance}%</div>
  </CardContent>
  </Card>
  </div>
      {
    /* Filters and Search */
    }
    <Card><CardContent className="p-4"><div className="flex flex-col gap-4 md:flex-row md:items-center"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search students by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
  </div><div className="flex gap-3">
  <Select value={selectedBatch} onValueChange={setSelectedBatch}><SelectTrigger className="w-[180px]"><SelectValue placeholder="Select batch" />
  </SelectTrigger>
  <SelectContent><SelectItem value="all">All Batches</SelectItem><SelectItem value="JEE Advanced 2024">JEE Advanced 2024</SelectItem><SelectItem value="NEET 2024">NEET 2024</SelectItem>
  </SelectContent>
  </Select>
  <Select value={selectedStatus} onValueChange={setSelectedStatus}><SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" />
  </SelectTrigger>
  <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="suspended">Suspended</SelectItem>
  </SelectContent>
  </Select><Button variant="outline" size="icon"><Filter className="h-4 w-4" />
  </Button>
  </div>
  </div>
  </CardContent>
  </Card>
      {
    /* Students Table */
    }
    <Card><CardContent className="p-0">
  <Table>
  <TableHeader>
  <TableRow>
  <TableHead>Student</TableHead>
  <TableHead>Batch</TableHead>
  <TableHead>Status</TableHead>
  <TableHead>Performance</TableHead>
  <TableHead>Attendance</TableHead>
  <TableHead>Last Active</TableHead><TableHead className="text-right">Actions</TableHead>
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
      {student.batch}
    </TableCell><TableCell><Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="gap-1">
      {getStatusIcon(student.status)} {student.status}
    </Badge>
    </TableCell>
    <TableCell><div className="flex items-center gap-2"><Progress value={student.performance.overall} className="w-[60px]" /><span className="text-sm font-medium">
      {student.performance.overall}%</span>
      {getTrendIcon(student.performance.trend)}
    </div>
    </TableCell>
    <TableCell><div className="flex items-center gap-2"><Progress value={student.performance.attendance} className="w-[60px]" /><span className="text-sm">
      {student.performance.attendance}%</span>
    </div>
    </TableCell>
    <TableCell><div className="flex items-center gap-1 text-sm text-muted-foreground"><Clock className="h-3 w-3" />
      {new Date(student.lastActive).toLocaleDateString()}
    </div>
    </TableCell><TableCell className="text-right">
    <DropdownMenu>
    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" />
    </Button>
    </DropdownMenuTrigger><DropdownMenuContent align="end">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator /><DropdownMenuItem onClick={() => handleStudentAction('view', student.id)}><Eye className="h-4 w-4 mr-2" /> View Details </DropdownMenuItem><DropdownMenuItem onClick={() => handleStudentAction('edit', student.id)}><Edit className="h-4 w-4 mr-2" /> Edit Profile </DropdownMenuItem><DropdownMenuItem onClick={() => handleStudentAction('email', student.id)}><Mail className="h-4 w-4 mr-2" /> Send Email </DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={() => handleStudentAction('delete', student.id)} className="text-destructive" ><Trash2 className="h-4 w-4 mr-2" /> Remove Student </DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>
    </TableCell>
  </TableRow> ))}
    </TableBody>
  </Table>
  </CardContent>
  </Card>
  </div>
  )
}

export default StudentsPage;
