import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

  import {
  Users,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  UserPlus,
  BarChart3,
  BookOpen,
  AlertCircle,
  CheckCircle} from 'lucide-react';

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

  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from '../../components/ui/select';

  import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger} from '../../components/ui/dropdown-menu';

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
interface Batch { 
  id: string;
  name: string;
  subject: string;
  level: 'JEE Main' | 'JEE Advanced' | 'NEET' | 'Foundation';
  studentCount: number;
  maxStudents: number;
  schedule: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'completed';
  averageAttendance: number;
  averagePerformance: number;
  nextClass?: string;
  testsCompleted: number;
  totalTests: number;
}

  const BatchManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [batches] = useState<Array<Batch>>([
    {
      id: '1',
      name: 'JEE Advanced Batch A',
      subject: 'Physics + Chemistry + Math',
      level: 'JEE Advanced',
      studentCount: 32,
      maxStudents: 40,
      schedule: 'Mon, Wed, Fri - 10:00 AM',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'active',
      averageAttendance: 92,
      averagePerformance: 78,
      nextClass: 'Today, 10:00 AM',
      testsCompleted: 15,
      totalTests: 30
    }, 
    {
      id: '2',
      name: 'NEET Morning Batch',
      subject: 'Biology + Chemistry',
      level: 'NEET',
      studentCount: 28,
      maxStudents: 35,
      schedule: 'Tue, Thu, Sat - 8:00 AM',
      startDate: '2024-01-15',
      endDate: '2024-11-30',
      status: 'active',
      averageAttendance: 88,
      averagePerformance: 71,
      nextClass: 'Tomorrow, 8:00 AM',
      testsCompleted: 12,
      totalTests: 25
    }, 
    {
      id: '3',
      name: 'JEE Main Batch B',
      subject: 'Physics + Chemistry + Math',
      level: 'JEE Main',
      studentCount: 35,
      maxStudents: 40,
      schedule: 'Mon, Wed, Fri - 4:00 PM',
      startDate: '2024-02-01',
      endDate: '2024-12-15',
      status: 'active',
      averageAttendance: 85,
      averagePerformance: 69,
      testsCompleted: 10,
      totalTests: 28
    }, 
    {
      id: '4',
      name: 'Foundation Batch 2025',
      subject: 'All Subjects',
      level: 'Foundation',
      studentCount: 8,
      maxStudents: 30,
      schedule: 'To be decided',
      startDate: '2025-01-10',
      endDate: '2025-12-20',
      status: 'upcoming',
      averageAttendance: 0,
      averagePerformance: 0,
      testsCompleted: 0,
      totalTests: 20
    }
  ]);
  // Filter batches 
  const filteredBatches = batches.filter((batch) => {
    const matchesSearch = batch.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         batch.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'all' || batch.subject.includes(filterSubject);
    const matchesStatus = filterStatus === 'all' || batch.status === filterStatus;
    return matchesSearch && matchesSubject && matchesStatus;
  });
    const handleDeleteBatch = () => {
      if (selectedBatch) { toast({ title:"Batch deleted", description: `${selectedBatch.name} has been removed`, });
      setShowDeleteDialog(false

      );
      setSelectedBatch(null

      )
} };

    const getStatusColor = (status: string) => {switch (status) { case 'active': return 'default';case 'upcoming': return 'secondary';case 'completed': return 'outline';default: return 'default'
} };

  return (<div className="min-h-screen bg-background p-6"><div className="max-w-7xl mx-auto space-y-6">
      {
    /* Header */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" >
  <div><h1 className="text-3xl font-bold">Batch Management</h1><p className="text-muted-foreground mt-1"> Manage your student batches and schedules </p>
  </div><Link to="/teacher/batches/create"><Button className="bg-gradient-to-r from-primary to-secondary"><Plus className="mr-2 h-4 w-4" /> Create New Batch </Button>
  </Link>
  </motion.div>
      {
    /* Filters */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col md:flex-row gap-4" ><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search batches..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
  </div>
  <Select value={filterSubject} onValueChange={setFilterSubject}><SelectTrigger className="w-full md:w-[200px]"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Filter by subject" />
  </SelectTrigger>
  <SelectContent><SelectItem value="all">All Subjects</SelectItem><SelectItem value="Physics">Physics</SelectItem><SelectItem value="Chemistry">Chemistry</SelectItem><SelectItem value="Math">Mathematics</SelectItem><SelectItem value="Biology">Biology</SelectItem>
  </SelectContent>
  </Select>
  <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Filter by status" />
  </SelectTrigger>
  <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="upcoming">Upcoming</SelectItem><SelectItem value="completed">Completed</SelectItem>
  </SelectContent>
  </Select>
  </motion.div>
      {
    /* Batch Grid */
    }<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" >
      {filteredBatches.map((batch, index) => ( <motion.div key={batch.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} ><Card className="transition-shadow">
    <CardHeader><div className="flex justify-between items-start"><div className="space-y-1"><CardTitle className="text-lg">
      {batch.name}
    </CardTitle>
    <CardDescription>
      {batch.subject}
    </CardDescription>
    </div>
    <DropdownMenu>
    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" />
    </Button>
    </DropdownMenuTrigger><DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => navigate(`/teacher/batches/${batch.id}`)}><BarChart3 className="mr-2 h-4 w-4" /> View Details </DropdownMenuItem>
    <DropdownMenuItem onClick={() => navigate(`/teacher/batches/${batch.id}/edit`)}><Edit className="mr-2 h-4 w-4" /> Edit Batch </DropdownMenuItem>
    <DropdownMenuItem><UserPlus className="mr-2 h-4 w-4" /> Add Students </DropdownMenuItem>
    <DropdownMenuSeparator /><DropdownMenuItem className="text-red-600" onClick={() => {
        setSelectedBatch(batch

        );
        setShowDeleteDialog(true

        )
}} ><Trash2 className="mr-2 h-4 w-4" /> Delete Batch </DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>
    </div><div className="flex gap-2 mt-2">
    <Badge variant={getStatusColor(batch.status)}>
      {batch.status}
    </Badge><Badge variant="outline">
      {batch.level}
    </Badge>
    </div>
    </CardHeader><CardContent className="space-y-4">
      {
      /* Student Count */
      }<div className="space-y-2"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Students</span><span className="font-medium">
      {batch.studentCount}/{batch.maxStudents}
    </span>
    </div><Progress value={(batch.studentCount / batch.maxStudents) * 100} className="h-2" />
    </div>
      {
      /* Schedule */
      }<div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" />
    <span>
      {batch.schedule}
    </span>
    </div>
      {
      /* Next Class */} {batch.nextClass && ( <div className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-muted-foreground" />
      <span>Next: {batch.nextClass}
      </span>
      </div> )} {/* Stats */} {batch.status === 'active' && ( <div className="grid grid-cols-2 gap-4 pt-2 border-t"><div className="text-center"><p className="text-2xl font-bold">
      {batch.averageAttendance}%</p><p className="text-xs text-muted-foreground">Avg. Attendance</p>
      </div><div className="text-center"><p className="text-2xl font-bold">
      {batch.averagePerformance}%</p><p className="text-xs text-muted-foreground">Avg. Performance</p>
      </div>
      </div> )} {
      /* Tests Progress */
      }<div className="space-y-1"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Tests Progress</span><span className="font-medium">
      {batch.testsCompleted}/{batch.totalTests}
    </span>
    </div><Progress value={(batch.testsCompleted / batch.totalTests) * 100} className="h-2" />
    </div>
      {
      /* Action Button */
      }<Button className="w-full" onClick={() => navigate(`/teacher/batches/${batch.id}`)} ><BookOpen className="mr-2 h-4 w-4" /> Manage Batch </Button>
    </CardContent>
    </Card>
  </motion.div> ))}
    </motion.div>
      {
    /* Empty State */} {filteredBatches.length === 0 && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12" ><Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-medium mb-2">No batches found</h3><p className="text-muted-foreground mb-4">{searchQuery || filterSubject !== 'all' || filterStatus !== 'all' ? 'Try adjusting your filters' : 'Create your first batch to get started'}</p>{!searchQuery && filterSubject === 'all' && filterStatus === 'all' && ( <Link to="/teacher/batches/create">
      <Button><Plus className="mr-2 h-4 w-4" /> Create New Batch </Button>
    </Link> )}
    </motion.div> )}
    </div>
      {
    /* Delete Confirmation Dialog */
    }
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
  <DialogContent>
  <DialogHeader>
  <DialogTitle>Delete Batch</DialogTitle><DialogDescription> Are you sure you want to delete"{selectedBatch?.name}"? This action cannot be undone. All associated data including student progress and test results will be permanently removed. </DialogDescription>
  </DialogHeader>
  <DialogFooter><Button variant="outline" onClick={() => setShowDeleteDialog(false)}> Cancel </Button><Button variant="destructive" onClick={handleDeleteBatch}> Delete Batch </Button>
  </DialogFooter>
  </DialogContent>
  </Dialog>
  </div>
  )
}

export default BatchManagement;
