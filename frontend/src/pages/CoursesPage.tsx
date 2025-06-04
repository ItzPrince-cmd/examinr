import React, { useState } from 'react';

  import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useNavigate } from 'react-router-dom';

  import {
  BookOpen,
  Clock,
  Users,
  Award,
  PlayCircle,
  CheckCircle,
  Lock} from 'lucide-react';

  interface Course { id: number;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  lessons: number;
  students: number;level: 'Beginner' | 'Intermediate' | 'Advanced';
  progress?: number;
  enrolled: boolean;
  thumbnail: string
}

  const CoursesPage: React.FC = () => {
  const navigate = useNavigate();const [filter, setFilter] = useState<'all' | 'enrolled'>('all'

  );
  
  // Mock data
  const courses: Course[] = [
    {
      id: 1,
      title: 'Complete JEE Physics Master Course',
      description: 'Master physics concepts for JEE Main and Advanced with in-depth explanations',
      instructor: 'Dr. Rajesh Kumar',
      duration: '40 hours',
      lessons: 120,
      students: 5234,
      level: 'Advanced',
      progress: 65,
      enrolled: true,
      thumbnail: '🔬',
    },
    {
    id: 2,title: 'NEET Biology Crash Course',description: 'Comprehensive biology preparation for NEET with practice questions',instructor: 'Dr. Priya Sharma',duration: '30 hours',
    lessons: 85,
    students: 3421,level: 'Intermediate',
    progress: 30,
    enrolled: true,thumbnail: '🧬',

      }, {
    id: 3,title: 'Mathematics for Class 10 CBSE',description: 'Complete mathematics syllabus with solved examples and practice tests',instructor: 'Prof. Amit Verma',duration: '25 hours',
    lessons: 60,
    students: 8923,level: 'Beginner',
    progress: 0,
    enrolled: false,thumbnail: '📐',

      },
      {
        id: 4,
        title: 'CAT Preparation Complete Guide',
        description: 'Master quantitative aptitude, verbal ability, and logical reasoning',
        instructor: 'MBA Guru Team',
        duration: '50 hours',
        lessons: 150,
        students: 2156,
        level: 'Advanced',
        progress: 0,
        enrolled: false,
        thumbnail: '📊',

    }, ];const filteredCourses = filter === 'enrolled' ? courses.filter(course => course.enrolled) : courses;
    const getLevelColor = (level: string) => {switch (level) { case 'Beginner': return 'default';case 'Intermediate': return 'secondary';case 'Advanced': return 'destructive';default: return 'default'
} };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20"><div className="container mx-auto px-4 py-8">
      {
    /* Header */
    }<div className="mb-8"><h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Courses </h1><p className="text-muted-foreground mt-2"> Explore our comprehensive courses designed for exam success </p>
  </div>
      {
    /* Filter Tabs */
    }<div className="mb-6"><div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"><button onClick={() => setFilter('all')} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all ${ filter === 'all' ? 'bg-background text-foreground shadow-sm' : '' }`} > All Courses </button><button onClick={() => setFilter('enrolled')} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all ${ filter === 'enrolled' ? 'bg-background text-foreground shadow-sm' : '' }`} > My Courses </button>
  </div>
  </div>
      {
    /* Courses Grid */
    }<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{filteredCourses.map((course) => ( <Card key={course.id} className="transition-shadow overflow-hidden"><div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-6xl">
      {course.thumbnail}
    </div><CardHeader className="pb-3"><div className="flex justify-between items-start mb-2"><Badge variant={getLevelColor(course.level)} className="text-xs">
      {course.level}
    </Badge>{course.enrolled && ( <CheckCircle className="h-5 w-5 text-green-500" /> )}
    </div><CardTitle className="line-clamp-2 text-lg">
      {course.title}
    </CardTitle><CardDescription className="line-clamp-2 text-sm">
      {course.description}
    </CardDescription>
    </CardHeader><CardContent className="pb-3"><p className="text-sm text-muted-foreground mb-3">by {course.instructor}
    </p><div className="space-y-2 text-sm"><div className="flex items-center justify-between text-muted-foreground"><span className="flex items-center gap-1"><Clock className="h-3 w-3" />
      {course.duration}
    </span><span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />
      {course.lessons} lessons </span>
    </div><div className="flex items-center gap-1 text-muted-foreground"><Users className="h-3 w-3" />
    <span>
      {course.students.toLocaleString()} students</span>
    </div>
    </div>{course.enrolled && course.progress !== undefined && ( <div className="mt-3 space-y-1"><div className="flex justify-between text-xs">
      <span>Progress</span>
      <span>
      {course.progress}%</span>
      </div><Progress value={course.progress} className="h-2" />
    </div> )}
    </CardContent><CardFooter className="pt-3">{course.enrolled ? ( <Button className="w-full" onClick={() => navigate(`/course/${course.id}`)} ><PlayCircle className="h-4 w-4 mr-2" /> Continue Learning </Button> ) : ( <Button className="w-full" variant="outline" onClick={() => navigate(`/course/${course.id}`)} ><Lock className="h-4 w-4 mr-2" /> Enroll Now </Button> )}
    </CardFooter>
  </Card> ))}
    </div>{filteredCourses.length === 0 && ( <div className="text-center py-12"><Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">{filter === 'enrolled' ?"You haven't enrolled in any courses yet." :"No courses available at the moment."}</p>{filter === 'enrolled' && ( <Button className="mt-4" variant="outline" onClick={() => setFilter('all')} > Browse All Courses </Button> )}
    </div> )}
    </div>
  </div>
  )
}

export default CoursesPage; 
