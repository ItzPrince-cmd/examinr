import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Sparkles,
  Rocket,
  Star,
  Heart,
  Coffee,
  Music,
  BookOpen,
  Trophy,
  Zap,
  Brain,
  Target,
  TrendingUp,
  Clock,
  Users,
  Gift,
  Flame
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { DraggableWidget } from './DraggableWidget';
import { WidgetState } from '../../hooks/useWidgetManager';

// Motivational quotes
const quotes = [
  {
    text: "Every expert was once a beginner",
    author: "Helen Hayes"
  },
  {
    text: "The future belongs to those who learn",
    author: "Malcolm X"
  },
  {
    text: "Success is the sum of small efforts",
    author: "Robert Collier"
  },
  {
    text: "Dream big and dare to fail",
    author: "Norman Vaughan"
  },
  {
    text: "Learning never exhausts the mind",
    author: "Leonardo da Vinci"
  }
];
// Achievements data
const achievements = [
  {
    icon: Flame,
    name: "Hot Streak",
    desc: "7 days in a row!",
    color: "text-orange-500"
  },
  {
    icon: Trophy,
    name: "Top Performer",
    desc: "Ranked in top 10%",
    color: "text-yellow-500"
  },
  {
    icon: Brain,
    name: "Quick Learner",
    desc: "Mastered 5 topics",
    color: "text-purple-500"
  },
  {
    icon: Target,
    name: "Goal Crusher",
    desc: "All goals achieved",
    color: "text-green-500"
  }
];
// Quick Stats Widget interface
interface WidgetProps {
  widgetState: WidgetState;
  onClose: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  sidebarOpen?: boolean;
}

export const QuickStatsWidget: React.FC<WidgetProps> = memo(({
  widgetState,
  onClose,
  onPositionChange,
  sidebarOpen
}) => {
  const stats = [
    {
      label: "Today's XP",
      value: "+150",
      icon: Zap,
      trend: "+12%"
    },
    {
      label: "Questions",
      value: "45",
      icon: BookOpen,
      trend: "+8%"
    },
    {
      label: "Accuracy",
      value: "89%",
      icon: Target,
      trend: "+5%"
    },
    {
      label: "Time Saved",
      value: "23m",
      icon: Clock,
      trend: "-15%"
    }
  ];
  return (<DraggableWidget id="quickStats" title="Quick Stats" isVisible={widgetState.isVisible} position={widgetState.position} onClose={onClose} onPositionChange={onPositionChange} sidebarOpen={sidebarOpen} ><Card className="glass-gradient hover-lift p-4 w-64 gradient-border"><div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-yellow-500" /> Quick Stats </h3>
  </div><div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => {
      const Icon = stat.icon;
      return (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-2 rounded-lg bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <Icon className="h-3 w-3 text-primary" />
            <span className="text-xs text-muted-foreground">
      {stat.label}
            </span>
          </div>
          <p className="text-lg font-bold">
            {stat.value}
          </p>
          <p className={`text-xs ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {stat.trend}
          </p>
        </motion.div>
      );
    })}
    </div>
</Card>
</DraggableWidget>
  );
});

QuickStatsWidget.displayName = 'QuickStatsWidget';
// Motivational Quote Widget
export const MotivationalQuoteWidget: React.FC<WidgetProps> = memo(({
  widgetState,
  onClose,
  onPositionChange,
  sidebarOpen
}) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
 return (<DraggableWidget id="motivationalQuote" title="Daily Motivation" isVisible={widgetState.isVisible} position={widgetState.position} onClose={onClose} onPositionChange={onPositionChange} sidebarOpen={sidebarOpen} ><Card className="glass-purple hover-lift p-6 max-w-sm glow-purple">
<motion.div key={currentQuote} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} ><div className="flex items-start gap-3">
<motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity }} ><Heart className="h-5 w-5 text-pink-500 mt-1" />
</motion.div>
<div><p className="text-lg font-medium italic">"{quotes[currentQuote].text}"</p><p className="text-sm text-muted-foreground mt-2">— {quotes[currentQuote].author}
    </p>
</div>
</div>
</motion.div>
</Card>
</DraggableWidget>
  );
});

MotivationalQuoteWidget.displayName = 'MotivationalQuoteWidget';
// Achievement Popup Widget
export const AchievementPopupWidget: React.FC<WidgetProps> = memo(({
  widgetState,
  onClose,
  onPositionChange,
  sidebarOpen
}) => {
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setShowAchievement(true);
      setCurrentAchievement(Math.floor(Math.random() * achievements.length));
    }, 30000);
    return () => clearInterval(interval);
  }, []);
  if (!showAchievement) return null;
  
  return (
    <DraggableWidget 
      id="achievement" 
      title="Achievement" 
      isVisible={widgetState.isVisible && showAchievement} 
      position={widgetState.position} 
      onClose={onClose} 
      onPositionChange={onPositionChange} 
      zIndex={50} 
      sidebarOpen={sidebarOpen}
    >
      <Card className="glass-gradient p-6 min-w-[300px] gradient-border glow-purple">
        <div className="flex items-center gap-4">
          <motion.div 
            animate={{ rotate: [0, 360] }} 
            transition={{ duration: 1 }} 
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full">
              {React.createElement(achievements[currentAchievement].icon, {
                className: "h-8 w-8 text-white"
              })}
            </div>
          </motion.div>
          <div>
            <h3 className="font-bold text-lg">
              {achievements[currentAchievement].name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {achievements[currentAchievement].desc}
            </p>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.5, 1] }} 
            transition={{ duration: 2, repeat: Infinity }} 
            className="ml-auto"
          >
            <Sparkles className="h-6 w-6 text-yellow-500" />
          </motion.div>
        </div>
      </Card>
    </DraggableWidget>
  );
});

AchievementPopupWidget.displayName = 'AchievementPopupWidget';
// Study Buddy Avatar Widget
export const StudyBuddyAvatarWidget: React.FC<WidgetProps> = memo(({
  widgetState,
  onClose,
  onPositionChange,
  sidebarOpen
}) => {
  const [mood, setMood] = useState('happy');
  const moods = {
    happy: "😊",
    focused: "🤓",
    excited: "🤩",
    thinking: "🤔",
    celebrating: "🎉"
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const moodKeys = Object.keys(moods);
      setMood(moodKeys[Math.floor(Math.random() * moodKeys.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <DraggableWidget 
      id="studyBuddy" 
      title="Study Buddy" 
      isVisible={widgetState.isVisible} 
      position={widgetState.position} 
      onClose={onClose} 
      onPositionChange={onPositionChange} 
      sidebarOpen={sidebarOpen}
    >
      <Card className="glass-blue p-4 glow-blue hover-lift">
        <div className="text-center">
          <motion.div 
            animate={{
              y: [0, -10, 0],
              rotate: mood === 'celebrating' ? [0, 10, -10, 0] : 0
            }} 
            transition={{ duration: 2, repeat: Infinity }} 
            className="text-6xl mb-2"
          >
            {moods[mood as keyof typeof moods]}
          </motion.div>
          <p className="text-sm font-medium">Study Buddy</p>
          <p className="text-xs text-muted-foreground">Here to help!</p>
        </div>
      </Card>
    </DraggableWidget>
  );
});

StudyBuddyAvatarWidget.displayName = 'StudyBuddyAvatarWidget';

// Energy Level Widget 
export const EnergyLevelWidget: React.FC<WidgetProps> = memo(({
  widgetState,
  onClose,
  onPositionChange,
  sidebarOpen 
}) => {
  const [energy, setEnergy] = useState(75);
 return (<DraggableWidget id="energyLevel" title="Energy Level" isVisible={widgetState.isVisible} position={widgetState.position} onClose={onClose} onPositionChange={onPositionChange} sidebarOpen={sidebarOpen} ><Card className="glass p-4 w-64 hover-lift"><div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-sm flex items-center gap-2">
<motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} ><Coffee className="h-4 w-4 text-amber-600" />
</motion.div> Energy Level </h3><Badge variant={energy > 70 ?"default" : energy > 40 ?"secondary" :"destructive"}>
      {energy}% </Badge>
</div><Progress value={energy} className="h-3 mb-2" /><p className="text-xs text-muted-foreground">{energy > 70 ?"You're on fire! Keep going! 🔥" : energy > 40 ?"Good momentum,stay focused! 💪" :"Time for a break? ☕"
}
    </p><div className="flex gap-2 mt-3"><Button size="sm" variant="outline" onClick={() => setEnergy(Math.min(100, energy + 20))} className="flex-1" ><Coffee className="h-3 w-3 mr-1" /> Recharge </Button><Button size="sm" variant="outline" onClick={() => setEnergy(Math.max(0, energy - 10))} className="flex-1" ><Brain className="h-3 w-3 mr-1" /> Study Hard </Button>
</div>
</Card>
</DraggableWidget>
  )
});
EnergyLevelWidget.displayName = 'EnergyLevelWidget';

// Floating Emojis - Commented out as requested 
// export const FloatingEmojis = () => {
//   const emojis = ['✨', '🌟', '💫', '⭐', '🎯', '🏆', '🎓', '📚', '🧠', '💡'];
//   
//   return (
//     <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
//       {emojis.map((emoji, index) => (
//         <motion.div
//           key={index}
//           className="absolute text-2xl"
//           initial={{
//             x: Math.random() * window.innerWidth,
//             y: window.innerHeight + 50
//           }}
//           animate={{
//             y: -50,
//             x: `${Math.random() * 200 - 100}%`
//           }}
//           transition={{
//             duration: Math.random() * 10 + 10,
//             repeat: Infinity,
//             delay: index * 2,
//             ease: "linear"
//           }}
//         >
//           <motion.span
//             animate={{ rotate: 360 }}
//             transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
//           >
//             {emoji}
//           </motion.span>
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// Export all widgets 
export default {
  QuickStatsWidget,
  MotivationalQuoteWidget,
  AchievementPopupWidget,
  StudyBuddyAvatarWidget,
  EnergyLevelWidget // FloatingEmojis - removed
}; 

