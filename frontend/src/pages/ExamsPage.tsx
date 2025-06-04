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
import { Input } from '../components/ui/input';

  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from '../components/ui/select';
import { useNavigate } from 'react-router-dom';

  import {
  Search,
  Clock,
  BookOpen,
  Users,
  TrendingUp,
  Star,
  Calendar,
  Filter} from 'lucide-react';

  interface Exam { id: number;
  title: string;
  description: string;
  subject: string;
  duration: number;
  questions: number;difficulty: 'Easy' | 'Medium' | 'Hard';
  attempts: number;
  rating: number;price: number | 'Free';
  deadline?: string
}

  const ExamsPage: React.FC = () => {
  const navigate = useNavigate();const [searchTerm, setSearchTerm] = useState(''
  );const [selectedSubject, setSelectedSubject] = useState('all'
  );const [selectedDifficulty, setSelectedDifficulty] = useState('all'
  );
  
  // Mock data
  const exams: Exam[] = [
    {
      id: 1,
      title: 'JEE Main Mock Test - Physics',
      description: 'Complete physics mock test based on latest JEE Main pattern',
      subject: 'Physics',
      duration: 180,
      questions: 75,
      difficulty: 'Hard',
      attempts: 1523,
      rating: 4.5,
      price: 'Free',

      }, {
    id: 2,title: 'NEET Biology Chapter Test',description: 'Biology chapter-wise test covering Ecology and Environment',subject: 'Biology',
    duration: 90,
    questions: 50,difficulty: 'Medium',
    attempts: 892,
    rating: 4.7,
    price: 99,

      }, {
    id: 3,title: 'Class 10 Mathematics Practice',description: 'CBSE Class 10 Mathematics full syllabus practice test',subject: 'Mathematics',
    duration: 120,
    questions: 40,difficulty: 'Easy',
    attempts: 2341,
    rating: 4.8,price: 'Free',

      }, {
    id: 4,title: 'CAT Quantitative Aptitude',description: 'MBA entrance exam preparation - Quant section',subject: 'Aptitude',
    duration: 60,
    questions: 30,difficulty: 'Hard',
    attempts: 567,
    rating: 4.3,
    price: 149,deadline: '2024-02-15',

    },
  ];
  
  const subjects = ['all', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Aptitude'];
  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];
  
  const filteredExams = exams.filter((exam) => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || exam.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'all' || exam.difficulty === selectedDifficulty;
    return matchesSearch && matchesSubject && matchesDifficulty;
  });
    const getDifficultyColor = (difficulty: string) => {switch (difficulty) { case 'Easy': return 'default';case 'Medium': return 'secondary';case 'Hard': return 'destructive';default: return 'default'
} };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20"><div className="container mx-auto px-4 py-8">
      {
    /* Header */
    }<div className="mb-8"><h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Available Exams </h1><p className="text-muted-foreground mt-2"> Choose from our comprehensive collection of practice tests and mock exams </p>
  </div>
      {
    /* Filters */
    }<div className="mb-8 space-y-4"><div className="flex flex-col sm:flex-row gap-4"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" /><Input type="text" placeholder="Search exams..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
  </div>
  <Select value={selectedSubject} onValueChange={setSelectedSubject}><SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="All Subjects" />
  </SelectTrigger>
  <SelectContent>
      {subjects.map(subject => ( <SelectItem key={subject} value={subject}>{subject === 'all' ? 'All Subjects' : subject}
    </SelectItem> ))}
    </SelectContent>
  </Select>
  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}><SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="All Levels" />
  </SelectTrigger>
  <SelectContent>
      {difficulties.map(difficulty => ( <SelectItem key={difficulty} value={difficulty}>{difficulty === 'all' ? 'All Levels' : difficulty}
    </SelectItem> ))}
    </SelectContent>
  </Select>
  </div><div className="flex items-center gap-2 text-sm text-muted-foreground"><Filter className="h-4 w-4" />
  <span>Showing {filteredExams.length} exams</span>
  </div>
  </div>
      {
    /* Exams Grid */
    }<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{filteredExams.map((exam) => ( <Card key={exam.id} className="transition-shadow">
    <CardHeader><div className="flex justify-between items-start mb-2">
    <Badge variant={getDifficultyColor(exam.difficulty)}>
      {exam.difficulty}</Badge>{exam.price === 'Free' ? ( <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"> Free </Badge> ) : ( <Badge variant="outline">₹{exam.price}
    </Badge> )}
    </div><CardTitle className="line-clamp-2">
      {exam.title}
    </CardTitle><CardDescription className="line-clamp-2">
      {exam.description}
    </CardDescription>
    </CardHeader>
    <CardContent><div className="space-y-2 text-sm"><div className="flex items-center justify-between"><span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-4 w-4" />
      {exam.duration} mins </span><span className="flex items-center gap-1 text-muted-foreground"><BookOpen className="h-4 w-4" />
      {exam.questions} questions </span>
    </div><div className="flex items-center justify-between"><span className="flex items-center gap-1 text-muted-foreground"><Users className="h-4 w-4" />
      {exam.attempts} attempts </span><span className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      {exam.rating}
    </span>
    </div>{exam.deadline && ( <div className="flex items-center gap-1 text-destructive"><Calendar className="h-4 w-4" /><span className="text-xs">Deadline: {new Date(exam.deadline).toLocaleDateString()}
      </span>
    </div> )}
    </div>
    </CardContent>
    <CardFooter><Button className="w-full" onClick={() => navigate(`/exam/${exam.id}`)} > Start Exam </Button>
    </CardFooter>
  </Card> ))}
    </div>{filteredExams.length === 0 && ( <div className="text-center py-12"><p className="text-muted-foreground">No exams found matching your criteria.</p>
  </div> )}
    </div>
  </div>
  )
}

export default ExamsPage;
