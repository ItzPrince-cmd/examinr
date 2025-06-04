import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useDesignSystem } from '../../design-system/theme-context';
import { useSound } from '../../design-system/sound';
import { useLayout } from '../../contexts/LayoutContext';
import { toast } from '../../components/ui/use-toast';
import {
  Zap,
  Trophy,
  Clock,
  Brain,
  TrendingUp,
  Award,
  BookOpen,
  Calendar
} from 'lucide-react';

// Import new components
import HeroWelcome from '../../components/student/HeroWelcome';
import AchievementShowcase from '../../components/student/AchievementShowcase';
import SmartStudyCards from '../../components/student/SmartStudyCards';
import GamificationHub from '../../components/student/GamificationHub';
import PerformanceWidgets from '../../components/student/PerformanceWidgets';
import AdaptiveDashboardStates from '../../components/student/AdaptiveDashboardStates';
import StudyPlanHub from '../../components/student/StudyPlanHub';
// Mock data - Replace with real API calls
const getMockCourses = () => [
  {
    id: '1',
    name: 'Physics Fundamentals',
    subject: 'physics' as const,
    progress: 72,
    difficulty: 'medium' as const,
    estimatedTime: 45,
    lastStudied: new Date(Date.now() - 86400000),
    nextTopic: 'Quantum Mechanics Basics',
    totalTopics: 45,
    completedTopics: 32,
    averageScore: 78,
    friendsStudying: [
      { id: '1', name: 'Alex Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
      { id: '2', name: 'Sarah Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }
    ],
    aiRecommendation: 'You excel at mechanics! Try quantum physics next.',
    bestTimeToStudy: '10:00 AM'
  },
  {
    id: '2',
    name: 'Organic Chemistry',
    subject: 'chemistry' as const,
    progress: 65,
    difficulty: 'hard' as const,
    estimatedTime: 60,
    nextTopic: 'Aromatic Compounds',
    totalTopics: 38,
    completedTopics: 25,
    averageScore: 72,
    friendsStudying: [
      { id: '3', name: 'Mike Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' }
    ],
    aiRecommendation: 'Focus on reaction mechanisms for better understanding.'
  },
  {
    id: '3',
    name: 'Calculus Advanced',
    subject: 'mathematics' as const,
    progress: 85,
    difficulty: 'easy' as const,
    estimatedTime: 30,
    nextTopic: 'Integration by Parts',
    totalTopics: 42,
    completedTopics: 36,
    averageScore: 92,
    bestTimeToStudy: '2:00 PM'
  }
];
const getMockLeaderboard = () => [{
  rank: 1,
  previousRank: 2, userId: '1', name: 'Emma Wilson',
  score: 15420,
  streak: 45,
  isCurrentUser: false, trend: 'up' as const, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
}, {
  rank: 2,
  previousRank: 1, userId: '2', name: 'You',
  score: 14850,
  streak: 12,
  isCurrentUser: true, trend: 'down' as const
}, {
  rank: 3,
  previousRank: 3, userId: '3', name: 'David Lee',
  score: 14200,
  streak: 30,
  isCurrentUser: false, trend: 'same' as const, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
}, {
  rank: 4,
  previousRank: 5, userId: '4', name: 'Lisa Chen',
  score: 13800,
  streak: 18,
  isCurrentUser: false, trend: 'up' as const, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa'
}];
const getMockChallenges = () => [{
  id: '1', title: 'Speed Demon', description: 'Complete 10 questions in 5 minutes', type: 'daily' as const,
  icon: Zap,
  progress: 7,
  total: 10, reward: '50 XP', timeLeft: '18h 23m'
}, {
  id: '2', title: 'Perfect Week', description: 'Get 100% on 5 tests this week', type: 'weekly' as const,
  icon: Trophy,
  progress: 3,
  total: 5, reward: '200 XP', timeLeft: '4d 12h',
  multiplier: 2
}, {
  id: '3', title: 'Study Marathon', description: 'Study for 3 hours today', type: 'daily' as const,
  icon: Clock,
  progress: 126,
  total: 180, reward: '75 XP', timeLeft: '6h 45m'
}, {
  id: '4', title: 'Knowledge Seeker', description: 'Master 3 new topics', type: 'special' as const,
  icon: Brain,
  progress: 1,
  total: 3, reward: 'Mystery Badge'
}];
const getMockStudyBuddies = () => [{
  id: '1', name: 'Alex Chen', status: 'online' as const, subject: 'Physics',
  matchScore: 95, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexBuddy'
}, {
  id: '2', name: 'Sarah Kim', status: 'studying' as const, subject: 'Chemistry',
  matchScore: 88, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahBuddy'
}, {
  id: '3', name: 'Mike Johnson', status: 'offline' as const,
  matchScore: 76, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MikeBuddy'
}]; const getMockSubjectStrengths = () => [{ subject: 'Physics', strength: 78, trend: 'up' as const, topics: { mastered: 32, learning: 10, notStarted: 3 } }, { subject: 'Chemistry', strength: 65, trend: 'stable' as const, topics: { mastered: 25, learning: 8, notStarted: 5 } }, { subject: 'Mathematics', strength: 92, trend: 'up' as const, topics: { mastered: 36, learning: 4, notStarted: 2 } }, { subject: 'Biology', strength: 58, trend: 'down' as const, topics: { mastered: 23, learning: 12, notStarted: 5 } }]; const getMockTopics = () => [{ id: '1', name: 'Mechanics', subject: 'Physics', status: 'mastered' as const, connections: ['2', '3'], position: { x: 100, y: 100 } }, { id: '2', name: 'Thermodynamics', subject: 'Physics', status: 'learning' as const, connections: ['1', '4'], position: { x: 200, y: 150 } }, { id: '3', name: 'Calculus', subject: 'Mathematics', status: 'mastered' as const, connections: ['1', '5'], position: { x: 150, y: 200 } }, { id: '4', name: 'Quantum Physics', subject: 'Physics', status: 'prerequisite' as const, connections: ['2'], position: { x: 300, y: 100 } }, { id: '5', name: 'Linear Algebra', subject: 'Mathematics', status: 'locked' as const, connections: ['3'], position: { x: 250, y: 250 } }];

const StudentDashboard: React.FC = memo(() => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { playSound } = useSound();
  const { isSidebarOpen } = useLayout();
  
  // Dashboard context state
  const [dashboardContext, setDashboardContext] = useState({
    isFirstLogin: false,
    daysSinceLastLogin: 0,
    isExamSeason: false,
    hasAchievement: false,
    achievementType: undefined as 'level_up' | 'streak_milestone' | 'perfect_score' | 'new_badge' | undefined,
    examDaysLeft: 15,
    missedContent: undefined as {
      tests: number;
      topics: number;
      announcements: number;
    } | undefined
  });
  
  // Check for special states on mount
  useEffect(() => {
    const checkDashboardContext = () => {
      const lastLogin = localStorage.getItem('lastLogin');
      const isFirst = !lastLogin;
      const daysSince = lastLogin ? Math.floor((Date.now() - parseInt(lastLogin)) / (1000 * 60 * 60 * 24)) : 0;
      
      // Check for achievements
      const hasNewAchievement = Math.random() > 0.7; // 30% chance for demo
      
      setDashboardContext({
        isFirstLogin: isFirst,
        daysSinceLastLogin: daysSince,
        isExamSeason: true, // Demo: always show exam mode
        hasAchievement: hasNewAchievement,
        achievementType: hasNewAchievement ? 'streak_milestone' : undefined,
        examDaysLeft: 15,
        missedContent: daysSince > 7 ? { tests: 3, topics: 12, announcements: 5 } : undefined
      });
      
      // Update last login
      localStorage.setItem('lastLogin', Date.now().toString());
    };
    
    checkDashboardContext();
  }, []);
  
  // Memoize mock data
  const mockCourses = useMemo(() => getMockCourses(), []);
  const mockLeaderboard = useMemo(() => getMockLeaderboard(), []);
  const mockChallenges = useMemo(() => getMockChallenges(), []);
  const mockStudyBuddies = useMemo(() => getMockStudyBuddies(), []);
  const mockSubjectStrengths = useMemo(() => getMockSubjectStrengths(), []);
  const mockTopics = useMemo(() => getMockTopics(), []);
  
  // Memoized handlers
  const handleCourseSelect = useCallback((courseId: string) => {
    playSound('click');
    navigate(`/practice/${courseId}`);
  }, [navigate, playSound]);
  
  const handleChallengeSelect = useCallback((challengeId: string) => {
    playSound('click');
    toast({
      title: "Challenge Started!",
      description: "Good luck with your challenge!",
    });
  }, [playSound]);
  
  const handleBuddyConnect = useCallback((buddyId: string) => {
    playSound('success');
    toast({
      title: "Study Buddy Request Sent!",
      description: "We'll notify you when they accept.",
    });
  }, [playSound]);
  
  const handleVersusChallenge = useCallback((opponentId: string) => {
    playSound('click');
    toast({
      title: "Challenge Sent!",
      description: "May the best learner win!",
    });
  }, [playSound]);
  
  const handleContextAction = useCallback((action: string) => {
    switch (action) {
      case 'start_learning':
        navigate('/courses');
        break;
      case 'take_tour':
        toast({
          title: "Welcome Tour",
          description: "Starting interactive tour of the dashboard...",
        });
        break;
      case 'view_achievements':
        navigate('/achievements');
        break;
      case 'continue_streak':
        navigate('/practice');
        break;
      default:
        toast({
          title: "Action Performed",
          description: `Action: ${action}`,
        });
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
  {
    /* Adaptive Dashboard States */
  }
  <AdaptiveDashboardStates context={dashboardContext} onDismiss={() => setDashboardContext(prev => ({ ...prev, hasAchievement: false }))} onAction={handleContextAction} /><div className="w-full space-y-8">
    {
      /* Hero Welcome Section */
    }<HeroWelcome userName={user?.name || 'Student'} streak={12} />
    {
      /* Smart Study Cards */
    }
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} ><h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><BookOpen className="h-6 w-6 text-primary" /> Continue Learning </h2>
      <SmartStudyCards courses={mockCourses} onCourseSelect={handleCourseSelect} />
    </motion.section>
    {
      /* Gamification Hub */
    }<motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="gamification-section relative" style={{ zIndex: 10 }} ><h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Trophy className="h-6 w-6 text-yellow-500" /> Competition & Challenges </h2>
      <GamificationHub leaderboard={mockLeaderboard} challenges={mockChallenges} studyBuddies={mockStudyBuddies} onChallengeSelect={handleChallengeSelect} onBuddyConnect={handleBuddyConnect} onVersusChallenge={handleVersusChallenge} />
    </motion.section>
    {
      /* Study Plan Hub */
    }
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} ><h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Calendar className="h-6 w-6 text-blue-500" /> Study Plan & Focus Tools </h2>
      <StudyPlanHub studySessions={[]} studyGoals={[]} currentStreak={12} bestStreak={45} onSessionComplete={(session) => {
        toast({ title: "Session Completed!", description: `Great job completing your ${session.subject} session!`, }

        )
      }} onGoalCreate={(goal) => {
        toast({
          title: "Goal Created!", description: "Your study goal has been added successfully.",

        }

        )
      }} onGoalUpdate={(goalId, updates) => {
        toast({
          title: "Goal Updated!", description: "Your study goal has been updated.",

        }

        )
      }} />
    </motion.section>
    {
      /* Achievement Showcase */
    }
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} ><h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Award className="h-6 w-6 text-purple-500" /> Your Achievements </h2>
      <AchievementShowcase trophies={[]} currentStreak={12} longestStreak={45} streakHistory={[]} currentLevel={8} currentXP={3420} nextLevelXP={4000} />
    </motion.section>
    {
      /* Performance Widgets */
    }
    <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} ><h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><TrendingUp className="h-6 w-6 text-green-500" /> Performance Analytics </h2>
      <PerformanceWidgets subjectStrengths={mockSubjectStrengths} studySessions={[{
        date: new Date(),
        duration: 45,
        productivity: 85, subject: 'Physics'
      }, {
        date: new Date(Date.now() - 86400000),
        duration: 60,
        productivity: 90, subject: 'Chemistry'
      }]} topics={mockTopics} totalStudyTime={156 * 60} averageScore={78} classAverage={72} />
    </motion.section>
      </div>
    </div>
  );
});

StudentDashboard.displayName = 'StudentDashboard';

export default StudentDashboard;
