import React from 'react';
import { motion } from 'framer-motion';
import AchievementShowcase from '../../components/student/AchievementShowcase';

  import {
  Trophy,
  Star,
  Flame,
  Target,
  Brain,
  Zap,
  Crown,
  Medal} from 'lucide-react';

  interface Trophy { id: string;
  name: string;
  description: string;
  icon: any;rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: number;
  total?: number
}

  interface StreakDay { date: Date;
  studied: boolean;
  minutes?: number
}

  const AchievementsPage: React.FC = () => {
    // Mock data - replace with actual data from your backend
    const trophies: Trophy[] = [
      {
        id: '1',
        name: 'First Steps',
        description: 'Complete your first quiz',
        icon: Star,
        rarity: 'common',
        unlockedAt: new Date()
      },
      {
        id: '2',
        name: 'Week Warrior',
        description: '7-day streak',
        icon: Flame,
        rarity: 'rare',
        unlockedAt: new Date()
      },
      {
        id: '3',
        name: 'Knowledge Seeker',
        description: '100 questions answered',
        icon: Brain,
        rarity: 'epic',
        progress: 75,
    total: 100
      }, {id: '4',name: 'Perfect Score',description: 'Get 100% on any test',
    icon: Trophy,rarity: 'legendary'
      }, {id: '5',name: 'Speed Demon',description: 'Complete a test in record time',
    icon: Zap,rarity: 'rare'
      }, {id: '6',name: 'Consistency King',description: '30-day streak',
    icon: Crown,rarity: 'legendary',
    progress: 15,
    total: 30
      }, {id: '7',name: 'Early Bird',description: 'Study 5 days before 7 AM',
    icon: Target,rarity: 'common',
    unlockedAt: new Date()
      }, {id: '8',name: 'Night Owl',description: 'Study 5 days after 10 PM',
    icon: Medal,rarity: 'common',
    progress: 3,
    total: 5
      }, {id: '9',name: 'Subject Master',description: 'Score 90%+ in all subjects',
    icon: Brain,rarity: 'epic'
      }, {id: '10',name: 'Marathon Runner',description: 'Study for 100 hours total',
    icon: Star,rarity: 'rare',
    progress: 45,
    total: 100
    }, ];
    // Generate streak history for the last 30 days
    const generateStreakHistory = (): StreakDay[] => {
      const history: StreakDay[] = [];
      const today = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        // Randomly generate study data for demo
        const studied = Math.random() > 0.3;
        const minutes = studied ? Math.floor(Math.random() * 120) + 30 : 0;
        history.push({ date, studied, minutes });
      }
      return history;
    };

  const streakHistory = generateStreakHistory();
  const currentStreak = 15;
  const longestStreak = 23;
  const currentLevel = 12;
  const currentXP = 3450;
  const nextLevelXP = 4000;
  return (
    <div className="container py-8 space-y-8">
      {
    /* Page Header */
    }<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4" ><h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Your Achievements </h1><p className="text-muted-foreground text-lg"> Track your progress and unlock rewards as you learn </p>
  </motion.div>
      {
    /* Achievement Showcase Component */
    }
    <AchievementShowcase trophies={trophies} currentStreak={currentStreak} longestStreak={longestStreak} streakHistory={streakHistory} currentLevel={currentLevel} currentXP={currentXP} nextLevelXP={nextLevelXP} />
  </div>
  )
}

export default AchievementsPage;
