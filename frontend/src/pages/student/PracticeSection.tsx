import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

  import {
  BookOpen,
  Brain,
  Atom,
  Calculator,
  Microscope,
  ChevronRight,
  ChevronDown,
  Play,
  Clock,
  Target,
  TrendingUp,
  Lock,
  Star,
  Filter,
  Search} from 'lucide-react';

  import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';

  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

  // Types
  interface Subject {
    id: string;
  name: string;
  icon: any;
  color: string;
  totalChapters: number;
  completedChapters: number;
  totalQuestions: number;
  attemptedQuestions: number;
  averageScore: number;
  lastPracticed?: string;
}

  interface Chapter {
    id: string;
  name: string;
  topics: Topic[];
  totalQuestions: number;
  attemptedQuestions: number;
  locked: boolean;difficulty: 'easy' | 'medium' | 'hard'
}

  interface Topic { id: string;
  name: string;
  totalQuestions: number;
  attemptedQuestions: number;
  averageScore: number;
  locked: boolean
}

  const PracticeSection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null

  );
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null

  );const [searchQuery, setSearchQuery] = useState(''
  );const [difficultyFilter, setDifficultyFilter] = useState<string>('all'

  );
    const subjects: Subject[] = [ {id: 'physics',name: 'Physics',
    icon: Atom,color: 'bg-blue-500',
    totalChapters: 12,
    completedChapters: 8,
    totalQuestions: 3500,
    attemptedQuestions: 2100,
    averageScore: 78,lastPracticed: '2 hours ago'
      }, {id: 'chemistry',name: 'Chemistry',
    icon: Brain,color: 'bg-green-500',
    totalChapters: 10,
    completedChapters: 6,
    totalQuestions: 3200,
    attemptedQuestions: 1800,
    averageScore: 72,lastPracticed: 'Yesterday'
      }, {id: 'mathematics',name: 'Mathematics',
    icon: Calculator,color: 'bg-purple-500',
    totalChapters: 14,
    completedChapters: 10,
    totalQuestions: 4200,
    attemptedQuestions: 3100,
    averageScore: 85,lastPracticed: '3 hours ago'
      }, {id: 'biology',name: 'Biology',
    icon: Microscope,color: 'bg-orange-500',
    totalChapters: 11,
    completedChapters: 5,
    totalQuestions: 3800,
    attemptedQuestions: 1500,
    averageScore: 70,lastPracticed: '2 days ago'
    } ];const chapters: Record<string, Chapter[]> = { physics: [ { id: 'p1', name: 'Mechanics', difficulty: 'medium', totalQuestions: 450, attemptedQuestions: 320, locked: false, topics: [ {id: 't1',name: 'Kinematics',
        totalQuestions: 120,
        attemptedQuestions: 100,
        averageScore: 82,
        locked: false
          }, {id: 't2',name: 'Laws of Motion',
        totalQuestions: 150,
        attemptedQuestions: 120,
        averageScore: 78,
        locked: false
          }, {id: 't3',name: 'Work, Energy & Power',
        totalQuestions: 180,
        attemptedQuestions: 100,
        averageScore: 75,
        locked: false} ] }, { id: 'p2', name: 'Thermodynamics', difficulty: 'hard', totalQuestions: 300, attemptedQuestions: 150, locked: false, topics: [ {id: 't4',name: 'Heat & Temperature',
        totalQuestions: 100,
        attemptedQuestions: 60,
        averageScore: 70,
        locked: false
          }, {id: 't5',name: 'Laws of Thermodynamics',
        totalQuestions: 200,
        attemptedQuestions: 90,
        averageScore: 68,
        locked: false
        } ] }, {id: 'p3',name: 'Electromagnetism',difficulty: 'hard',
      totalQuestions: 400,
      attemptedQuestions: 0,
      locked: true,
      topics: []} ], chemistry: [ { id: 'c1', name: 'Physical Chemistry', difficulty: 'medium', totalQuestions: 400, attemptedQuestions: 280, locked: false, topics: [ {id: 't6',name: 'Atomic Structure',
        totalQuestions: 150,
        attemptedQuestions: 120,
        averageScore: 75,
        locked: false
          }, {id: 't7',name: 'Chemical Bonding',
        totalQuestions: 250,
        attemptedQuestions: 160,
        averageScore: 72,
        locked: false} ] } ], mathematics: [ { id: 'm1', name: 'Algebra', difficulty: 'easy', totalQuestions: 500, attemptedQuestions: 450, locked: false, topics: [ {id: 't8',name: 'Quadratic Equations',
        totalQuestions: 200,
        attemptedQuestions: 180,
        averageScore: 88,
        locked: false
          }, {id: 't9',name: 'Sequences & Series',
        totalQuestions: 300,
        attemptedQuestions: 270,
        averageScore: 85,
        locked: false} ] } ], biology: [ { id: 'b1', name: 'Cell Biology', difficulty: 'easy', totalQuestions: 350, attemptedQuestions: 200, locked: false, topics: [ {id: 't10',name: 'Cell Structure',
        totalQuestions: 150,
        attemptedQuestions: 100,
        averageScore: 72,
        locked: false
          }, {id: 't11',name: 'Cell Division',
        totalQuestions: 200,
        attemptedQuestions: 100,
        averageScore: 70,
        locked: false
    } ] } ] };

    const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId

    );
    setExpandedChapter(null

    )
}

    const handleStartPractice = (subjectId: string, topicId?: string) => {
    const params = new URLSearchParams();params.append('subject', subjectId

    );if (topicId) params.append('topic', topicId

    );
    navigate(`/practice/session?${params.toString()}`

    )
}

    const getDifficultyColor = (difficulty: string) => {switch (difficulty) { case 'easy': return 'text-green-500';case 'medium': return 'text-yellow-500';case 'hard': return 'text-red-500';default: return 'text-gray-500'
} };

    const filteredChapters = selectedSubject ? chapters[selectedSubject]?.filter((chapter) => {
      const matchesSearch = chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        chapter.topics.some(topic => topic.name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDifficulty = difficultyFilter === 'all' || chapter.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    }) : [];
  return (
    <div className="min-h-screen bg-background p-6"><div className="max-w-7xl mx-auto space-y-6">
      {
    /* Header */
    }
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} ><h1 className="text-3xl font-bold">Practice Section</h1><p className="text-muted-foreground mt-1"> Choose a subject and topic to start practicing </p>
  </motion.div>{!selectedSubject ? ( /* Subject Selection */ <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6" >
      {subjects.map((subject, index) => ( <motion.div key={subject.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} ><Card className="cursor-pointer transition-all" onClick={() => handleSubjectSelect(subject.id)} >
      <CardHeader><div className="flex items-center justify-between"><div className="flex items-center gap-3">
      <div className={`h-12 w-12 ${subject.color} rounded-lg flex items-center justify-center text-white`}><subject.icon className="h-6 w-6" />
      </div>
      <div>
      <CardTitle>
      {subject.name}
      </CardTitle>
      <CardDescription>
      {subject.lastPracticed && `Last practiced ${subject.lastPracticed}`}
      </CardDescription>
      </div>
      </div><ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
      </CardHeader>
      <CardContent><div className="space-y-4"><div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Chapter Progress</span><span className="text-sm font-medium">
      {subject.completedChapters}/{subject.totalChapters} completed </span>
      </div><Progress value={(subject.completedChapters / subject.totalChapters) * 100} className="h-2" /><div className="grid grid-cols-3 gap-4 pt-2"><div className="text-center"><p className="text-2xl font-bold">
      {subject.totalQuestions}
      </p><p className="text-xs text-muted-foreground">Total Questions</p>
      </div><div className="text-center"><p className="text-2xl font-bold">
      {subject.attemptedQuestions}
      </p><p className="text-xs text-muted-foreground">Attempted</p>
      </div><div className="text-center"><p className="text-2xl font-bold">
      {subject.averageScore}%</p><p className="text-xs text-muted-foreground">Avg Score</p>
      </div>
      </div><Button className="w-full" onClick={(e) => {
          e.stopPropagation();
          handleStartPractice(subject.id

          )
}} ><Play className="mr-2 h-4 w-4" /> Quick Practice </Button>
      </div>
      </CardContent>
      </Card>
    </motion.div> ))}</motion.div> ) : ( /* Chapter and Topic Selection */ <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6" >
      {
      /* Back button and filters */
      }<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"><Button variant="ghost" onClick={() => setSelectedSubject(null)} className="mb-4 md:mb-0" > ← Back to Subjects </Button><div className="flex gap-3 w-full md:w-auto"><div className="relative flex-1 md:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search chapters or topics..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
    </div>
    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}><SelectTrigger className="w-[140px]"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Difficulty" />
    </SelectTrigger>
    <SelectContent><SelectItem value="all">All Levels</SelectItem><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem>
    </SelectContent>
    </Select>
    </div>
    </div>
      {
      /* Subject header */
      }
    <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div className="flex items-center gap-4">
    <div className={`h-14 w-14 ${subjects.find(s => s.id === selectedSubject)?.color} rounded-lg flex items-center justify-center text-white`}>{React.createElement(subjects.find(s => s.id === selectedSubject)?.icon || BookOpen, { className:"h-7 w-7" }
      )
      }
    </div>
    <div><h2 className="text-2xl font-bold">
      {subjects.find(s => s.id === selectedSubject)?.name}
    </h2><p className="text-muted-foreground">Select a chapter to start practicing</p>
    </div>
    </div>
    <Button onClick={() => handleStartPractice(selectedSubject)}><Play className="mr-2 h-4 w-4" /> Practice All Topics </Button>
    </div>
    </CardContent>
    </Card>
      {
      /* Chapters list */
      }<div className="space-y-4">{filteredChapters.map((chapter) => ( <motion.div key={chapter.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="group" ><Card className={chapter.locked ? 'opacity-60' : ''}><CardHeader className="cursor-pointer" onClick={() => !chapter.locked && setExpandedChapter( expandedChapter === chapter.id ? null : chapter.id )} ><div className="flex items-center justify-between"><div className="flex items-center gap-3">{chapter.locked && <Lock className="h-5 w-5 text-muted-foreground" />}
      <div><CardTitle className="text-lg">
      {chapter.name}
      </CardTitle><div className="flex items-center gap-4 mt-1"><Badge variant="outline" className={getDifficultyColor(chapter.difficulty)}>
      {chapter.difficulty}
      </Badge><span className="text-sm text-muted-foreground">
      {chapter.totalQuestions} questions </span>{chapter.attemptedQuestions > 0 && ( <span className="text-sm text-muted-foreground"> • {Math.round((chapter.attemptedQuestions / chapter.totalQuestions) * 100)}% completed </span> )}
      </div>
      </div>
      </div>{!chapter.locked && ( <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${ expandedChapter === chapter.id ? 'rotate-180' : '' }`} /> )}
      </div>
      </CardHeader>{(AnimatePresence as any)({}, expandedChapter === chapter.id && !chapter.locked && ( <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} ><CardContent className="pt-0"><div className="space-y-3">{chapter.topics.map((topic) => ( <div key={topic.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 transition-colors" ><div className="flex-1"><div className="flex items-center gap-2">{topic.locked && <Lock className="h-4 w-4 text-muted-foreground" />}<h4 className="font-medium">
          {topic.name}
          </h4>
          </div><div className="flex items-center gap-4 mt-1"><span className="text-sm text-muted-foreground">
          {topic.totalQuestions} questions </span>
            {topic.attemptedQuestions > 0 && ( <><span className="text-sm text-muted-foreground">•</span><span className="text-sm text-muted-foreground">
            {topic.attemptedQuestions} attempted </span><span className="text-sm text-muted-foreground">•</span><Badge variant="secondary" className="text-xs">
            {topic.averageScore}% avg </Badge>
          </> )}
          </div>
          </div><Button size="sm" disabled={topic.locked} onClick={
            () => handleStartPractice(selectedSubject,
            topic.id)
            } > Practice </Button>
        </div> ))}
        </div>
        </CardContent>
      </motion.div> ) )}
      </Card>
    </motion.div> ))}
    </div>
  </motion.div> )}
    </div>
  </div>
  )
}

export default PracticeSection;
