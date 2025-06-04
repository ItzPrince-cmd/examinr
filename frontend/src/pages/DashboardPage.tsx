import React from 'react';
import { useAuth } from '../contexts/AuthContext';

  import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router-dom';

  import {
  BookOpen,
  Trophy,
  Clock,
  TrendingUp,
  Calendar,
  Target,
  BarChart,
  Users} from 'lucide-react';

  const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Mock data for now
  const stats = {
    totalExams: 12,
    completedExams: 8,
    averageScore: 78,
    studyStreak: 5
  };

    const recentExams = [ {
    id: 1,name: 'Mathematics Mock Test',
    score: 85,date: '2024-01-15',status: 'completed' as const
      }, {
    id: 2,name: 'Physics Practice Set',
    score: 72,date: '2024-01-14',status: 'completed' as const
      }, {
    id: 3,name: 'Chemistry Quiz',
    score: null,date: '2024-01-16',status: 'upcoming' as const
    } ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20"><div className="container mx-auto px-4 py-8">
      {
    /* Welcome Section */
    }<div className="mb-8"><h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Welcome back, {user?.name || 'Student'}! </h1><p className="text-muted-foreground mt-2"> Track your progress and continue your exam preparation journey. </p>
  </div>
      {
    /* Stats Grid */
    }<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"><Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Exams</CardTitle><BookOpen className="h-4 w-4 text-primary" />
  </CardHeader>
  <CardContent><div className="text-2xl font-bold">
      {stats.totalExams}
    </div><p className="text-xs text-muted-foreground">Available to attempt</p>
  </CardContent>
  </Card><Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Completed</CardTitle><Trophy className="h-4 w-4 text-secondary" />
  </CardHeader>
  <CardContent><div className="text-2xl font-bold">
      {stats.completedExams}
    </div><p className="text-xs text-muted-foreground">Successfully finished</p>
  </CardContent>
  </Card><Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Average Score</CardTitle><TrendingUp className="h-4 w-4 text-accent" />
  </CardHeader>
  <CardContent><div className="text-2xl font-bold">
      {stats.averageScore}%</div><p className="text-xs text-muted-foreground">Overall performance</p>
  </CardContent>
  </Card><Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Study Streak</CardTitle><Target className="h-4 w-4 text-primary" />
  </CardHeader>
  <CardContent><div className="text-2xl font-bold">
      {stats.studyStreak} days</div><p className="text-xs text-muted-foreground">Keep it going!</p>
  </CardContent>
  </Card>
  </div>
      {
    /* Main Content Grid */
    }<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {
    /* Recent Activity */
    }<div className="lg:col-span-2">
  <Card>
  <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Recent Activity </CardTitle>
  <CardDescription>Your latest exam attempts and upcoming tests</CardDescription>
  </CardHeader>
  <CardContent><div className="space-y-4">{recentExams.map((exam) => ( <div key={exam.id} className="flex items-center justify-between p-4 rounded-lg border bg-card transition-colors" ><div className="flex-1"><h4 className="font-medium">
      {exam.name}
    </h4><p className="text-sm text-muted-foreground"><Calendar className="inline h-3 w-3 mr-1" />
      {new Date(exam.date).toLocaleDateString()}
    </p>
    </div><div className="flex items-center gap-2">{exam.status === 'completed' && exam.score !== null ? ( <><span className="text-sm font-medium">
      {exam.score}%</span><Badge variant={exam.score >= 80 ? 'default' : 'secondary'}> Completed </Badge></> ) : ( <Badge variant="outline">Upcoming</Badge> )}
    </div>
  </div> ))}</div><Button className="w-full mt-4" variant="outline" onClick={() => navigate('/exams')} > View All Exams </Button>
  </CardContent>
  </Card>
  </div>
      {
    /* Quick Actions */
    }
    <div>
  <Card>
  <CardHeader>
  <CardTitle>Quick Actions</CardTitle>
  <CardDescription>Jump right back into preparation</CardDescription>
  </CardHeader><CardContent className="space-y-2"><Button className="w-full justify-start" variant="outline" onClick={() => navigate('/exams')} ><BookOpen className="mr-2 h-4 w-4" /> Browse Exams </Button><Button className="w-full justify-start" variant="outline" onClick={() => navigate('/courses')} ><BarChart className="mr-2 h-4 w-4" /> My Courses </Button><Button className="w-full justify-start" variant="outline" onClick={() => navigate('/profile')} ><Users className="mr-2 h-4 w-4" /> View Profile </Button>
  </CardContent>
  </Card>
      {
    /* Progress Card */
    }<Card className="mt-6">
  <CardHeader>
  <CardTitle>Overall Progress</CardTitle>
  <CardDescription>Your exam completion rate</CardDescription>
  </CardHeader>
  <CardContent><div className="space-y-2"><div className="flex justify-between text-sm">
  <span>Completed</span><span className="font-medium">
      {stats.completedExams} / {stats.totalExams}
    </span>
  </div><Progress value={(stats.completedExams / stats.totalExams) * 100} className="h-2" /><p className="text-xs text-muted-foreground text-center mt-2">
      {Math.round((stats.completedExams / stats.totalExams) * 100)}% Complete </p>
  </div>
  </CardContent>
  </Card>
  </div>
  </div>
  </div>
  </div>
  )
}

export default DashboardPage; 
