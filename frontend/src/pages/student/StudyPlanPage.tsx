import React from 'react';
import { motion } from 'framer-motion';
import StudyPlanHub from '../../components/student/StudyPlanHub';
import { Calendar, Target, Brain, Clock } from 'lucide-react';

  interface StudySession { id: string;
  subject: string;
  topic: string;
  duration: number;
  completed: boolean;
  date: Date;timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  productivity?: number;
  notes?: string
}

  interface StudyGoal { id: string;
  title: string;
  targetHours: number;
  currentHours: number;
  deadline: Date;
  subject?: string;
  priority: 'high' | 'medium' | 'low';
}

  const StudyPlanPage: React.FC = () => {
  // Mock data - replace with actual data from your backend
  const generateStudySessions = (): StudySession[] => {
    const sessions: StudySession[] = [];
    const subjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
    const topics = [
      'Quantum Mechanics', 'Organic Chemistry', 'Calculus', 'Cell Biology',
      'Thermodynamics', 'Inorganic Chemistry', 'Algebra', 'Genetics'
    ];
    
    // Generate sessions for the past 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // 70% chance of having a study session
      if (Math.random() < 0.7) {
        const numSessions = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numSessions; j++) {
          sessions.push({
            id: `session-${i}-${j}`,
            subject: subjects[Math.floor(Math.random() * subjects.length)],
            topic: topics[Math.floor(Math.random() * topics.length)],
            duration: Math.floor(Math.random() * 90) + 30, // 30-120 minutes
            completed: true,
            date: new Date(date),
            timeOfDay: ['morning', 'afternoon', 'evening', 'night'][Math.floor(Math.random() * 4)] as any,
            productivity: Math.floor(Math.random() * 30) + 70 // 70-100%
          });
        }
      }
    }
    return sessions;
  };

  const studySessions = generateStudySessions();
  
  const studyGoals: StudyGoal[] = [
    {
      id: '1',
      title: 'Master Calculus Fundamentals',
      targetHours: 40,
      currentHours: 28,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      subject: 'Mathematics',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Complete Organic Chemistry Chapter',
      targetHours: 25,
      currentHours: 15,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      subject: 'Chemistry',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Physics Problem Sets',
      targetHours: 20,
      currentHours: 20,
      deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (completed)
      subject: 'Physics',
      priority: 'low'
    }
  ];
  
  const currentStreak = 15;
  const bestStreak = 23;
  
  const handleSessionComplete = (session: StudySession) => {
    console.log('Session completed:', session);
    // Implement your session completion logic here
  };

  const handleGoalCreate = (goal: StudyGoal) => {
    console.log('Goal created:', goal);
    // Implement your goal creation logic here
  };

  const handleGoalUpdate = (goalId: string, updates: Partial<StudyGoal>) => {
    console.log('Goal updated:', goalId, updates);
    // Implement your goal update logic here
  };

  return (
    <div className="container py-8 space-y-8">
      {
    /* Page Header */
    }<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4" ><h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Study Plan </h1><p className="text-muted-foreground text-lg"> Plan your study sessions, track progress, and achieve your goals </p>
  </motion.div>
      {
    /* Quick Stats */
    }<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" ><div className="bg-card rounded-lg p-6 border"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Total Study Time</p><p className="text-2xl font-bold">156 hrs</p>
  </div><Clock className="h-8 w-8 text-primary opacity-50" />
  </div>
  </div><div className="bg-card rounded-lg p-6 border"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Sessions Completed</p><p className="text-2xl font-bold">87</p>
  </div><Calendar className="h-8 w-8 text-green-500 opacity-50" />
  </div>
  </div><div className="bg-card rounded-lg p-6 border"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Active Goals</p><p className="text-2xl font-bold">3</p>
  </div><Target className="h-8 w-8 text-blue-500 opacity-50" />
  </div>
  </div><div className="bg-card rounded-lg p-6 border"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground">Avg. Productivity</p><p className="text-2xl font-bold">85%</p>
  </div><Brain className="h-8 w-8 text-purple-500 opacity-50" />
  </div>
  </div>
  </motion.div>
      {
    /* Study Plan Hub Component */
    }
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} >
  <StudyPlanHub studySessions={studySessions} studyGoals={studyGoals} currentStreak={currentStreak} bestStreak={bestStreak} onSessionComplete={handleSessionComplete} onGoalCreate={handleGoalCreate} onGoalUpdate={handleGoalUpdate} />
  </motion.div>
  </div>
  )
}

export default StudyPlanPage;
