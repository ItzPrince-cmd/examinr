import React, { useState, memo, useMemo } from 'react';
import { motion } from 'framer-motion';

  import {
  Play,
  Clock,
  TrendingUp,
  Users,
  Sparkles,
  Brain,
  Atom,
  Calculator,
  Dna,
  Globe,
  ChevronRight,
  Star,
  Zap,
  Target,
  BarChart,
  Timer,
  BookOpen} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { useDesignSystem } from '../../design-system/theme-context';
import { useSound } from '../../design-system/sound';

  interface Friend { id: string;
  name: string;
  avatar?: string
}

  interface Course { id: string;
  name: string;subject: 'physics' | 'chemistry' | 'mathematics' | 'biology';
  progress: number;difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  lastStudied?: Date;
  nextTopic: string;
  totalTopics: number;
  completedTopics: number;
  averageScore: number;
  friendsStudying?: Friend[];
  aiRecommendation?: string;
  bestTimeToStudy?: string
}

interface SmartStudyCardsProps { 
  courses: Course[];
  onCourseSelect: (courseId: string) => void
} 

// Custom Beaker icon component 
const Beaker = (props: any) => ( 
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M4.5 3h15v16a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V3Z" />
    <path d="M6 3v8l3 3 3-3 3 3 3-3V3" />
    <line x1="6" y1="3" x2="6" y2="8" />
    <line x1="18" y1="3" x2="18" y2="8" />
  </svg>
);

  const SmartStudyCards: React.FC<SmartStudyCardsProps> = memo(({ courses, onCourseSelect }) => {
  const { playSound } = useSound();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null

  );
  
  // Subject configurations 
  const subjectConfig = useMemo(() => ({ 
    physics: {
      icon: Atom,
      gradient: 'from-blue-400 via-blue-500 to-indigo-600',
      pattern: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
      visualization: 'rocket',
      particleColor: '#3B82F6'
    }, 
    chemistry: {
      icon: Beaker,
      gradient: 'from-green-400 via-emerald-500 to-teal-600',
      pattern: 'radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)',
      visualization: 'beaker',
      particleColor: '#10B981'
    }, 
    mathematics: {
      icon: Calculator,
      gradient: 'from-purple-400 via-purple-500 to-pink-600',
      pattern: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)',
      visualization: 'graph',
      particleColor: '#A855F7'
    }, 
    biology: {
      icon: Dna,
      gradient: 'from-orange-400 via-orange-500 to-red-600',
      pattern: 'radial-gradient(circle at 30% 70%, rgba(251, 146, 60, 0.3) 0%, transparent 50%)',
      visualization: 'tree',
      particleColor: '#FB923C'
    } 
  }), []

  );
  
  // Animated visualizations 
  const ProgressVisualization = ({ type, progress }: { 
    type: string;
    progress: number 
  }) => {
    switch (type) { 
      case 'rocket': 
        return (
          <motion.div className="relative w-full h-24" animate={{ y: -progress * 0.8 }} transition={{ duration: 1, ease: "easeOut" }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <motion.div animate={{ y: [0, -5, 0], rotate: [-2, 2, -2] }} transition={{ duration: 2, repeat: Infinity }}> 🚀 </motion.div>
              {progress > 50 && ( 
                <motion.div 
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-16" 
                  animate={{ opacity: [0.3, 0.8, 0.3] }} 
                  transition={{ duration: 0.5, repeat: Infinity }} 
                  style={{
                    background: 'linear-gradient(to bottom, orange, transparent)',
                    filter: 'blur(8px)'
                  }} 
                /> 
              )}
            </div>
          </motion.div>
        );
      
      case 'beaker': 
        return (
          <div className="relative w-20 h-24 mx-auto">
            <Beaker className="w-full h-full text-green-600" />
            <motion.div 
              className="absolute bottom-2 left-2 right-2 bg-green-400 rounded-b" 
              initial={{ height: 0 }} 
              animate={{ height: `${progress * 0.7}%` }} 
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.div 
                className="absolute inset-0 bg-green-300" 
                animate={{ y: [0, -2, 0] }} 
                transition={{ duration: 2, repeat: Infinity }} 
              />
            </motion.div>
          </div>
        );
        
      case 'graph': 
        return (
          <svg className="w-full h-24" viewBox="0 0 100 60">
            <motion.path 
              d={`M 10,50 Q 30,${50 - progress * 0.4} 50,${50 - progress * 0.3} T 90,${50 - progress * 0.5}`} 
              stroke="url(#purple-gradient)" 
              strokeWidth="3" 
              fill="none" 
              initial={{ pathLength: 0 }} 
              animate={{ pathLength: 1 }} 
              transition={{ duration: 1.5, ease: "easeOut" }} 
            />
            <defs>
              <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
        );
        
      case 'tree': 
        return (
          <div className="relative w-20 h-24 mx-auto">
            <motion.div className="text-6xl" animate={{ scale: 0.8 + (progress / 100) * 0.4 }} transition={{ duration: 1 }}> 🌳 </motion.div>
            {progress < 30 && <span className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl">🍂</span>} 
            {progress > 70 && <span className="absolute top-2 right-2 text-lg">🌸</span>}
          </div>
        );
        
      default: 
        return null;
    }
  };

  // Difficulty emoji faces 
  const DifficultyFace = ({ difficulty }: { difficulty: string }) => {
    const faces = { 
      easy: { emoji: '😊', animation: { rotate: [0, -10, 10, 0] } }, 
      medium: { emoji: '🤔', animation: { y: [0, -5, 0] } }, 
      hard: { emoji: '🔥', animation: { scale: [1, 1.2, 1] } } 
    };

    const face = faces[difficulty as keyof typeof faces];
    return (<motion.span className="text-2xl" animate={face.animation} transition={{ duration: 2, repeat: Infinity }} >
      {face.emoji}
    </motion.span>
    )
  }

  // Time estimate hourglass 
  const TimeEstimate = ({ minutes }: { minutes: number }) => {
    return (<div className="flex items-center gap-2"><motion.div animate={{ rotate: [0, 180, 360] }} transition={{ duration: 3, repeat: Infinity, ease:"linear" }} ><Timer className="h-4 w-4" />
    </motion.div><span className="text-sm">
      {minutes} min</span>
    </div>
    )
  }

  // Smart recommendation bubble 
  const RecommendationBubble = ({ message, type }: { 
    message: string;
    type: 'ai' | 'social' | 'time' 
  }) => {
    const icons = { ai: Sparkles, social: Users, time: Clock };

    const Icon = icons[type];
    return (<motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type:"spring", bounce: 0.5 }} className="absolute -top-2 -right-2 bg-background border rounded-full p-2 shadow-lg z-10" >
    <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }} ><Icon className="h-4 w-4 text-primary" />
    </motion.div><motion.div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-background border rounded-lg p-2 min-w-[200px] shadow-lg" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} ><p className="text-xs">
      {message}
    </p><div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-background border-t border-l rotate-45" />
    </motion.div>
    </motion.div>
    )
}

  return (<div className="fullscreen-grid">
      {courses.map((course) => {
      const config = subjectConfig[course.subject];

      const Icon = config.icon;
      const isHovered = hoveredCard === course.id;
      return (
        <motion.div key={course.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="relative overflow-hidden h-full">
      {
    /* Animated background pattern */
    }<div className="absolute inset-0 opacity-20" style={{ background: config.pattern }} />
      {
    /* Smart recommendations */
      } {isHovered && ( <>{course.aiRecommendation && ( <RecommendationBubble message={course.aiRecommendation} type="ai" /> )} {course.friendsStudying && course.friendsStudying.length > 0 && ( <motion.div className="absolute top-2 right-2 flex -space-x-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} >{course.friendsStudying.slice(0, 3).map((friend) => ( <Avatar key={friend.id} className="h-8 w-8 border-2 border-background">
        <AvatarImage src={friend.avatar} />
        <AvatarFallback>
        {friend.name[0]}
        </AvatarFallback></Avatar> ))} {course.friendsStudying.length > 3 && ( <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium"> +{course.friendsStudying.length - 3}
      </div> )}
    </motion.div> )}
    </> )}<div className="relative p-6 space-y-4">
      {
    /* Header */
    }<div className="flex items-start justify-between"><div className="flex items-center gap-3">
  <div className={`p-3 rounded-lg bg-gradient-to-br ${config.gradient}`}><Icon className="h-6 w-6 text-white" />
  </div>
  <div><h3 className="font-semibold text-lg">
      {course.name}
    </h3><p className="text-sm text-muted-foreground">
      {course.completedTopics}/{course.totalTopics} topics </p>
  </div>
  </div>
  <DifficultyFace difficulty={course.difficulty} />
  </div>
      {
    /* Progress visualization */
    }<div className="relative h-24">
  <ProgressVisualization type={config.visualization} progress={course.progress} />
  </div>
      {
    /* Stats */
    }<div className="grid grid-cols-2 gap-4 text-sm"><div className="flex items-center gap-2"><BarChart className="h-4 w-4 text-muted-foreground" />
  <span>Avg: {course.averageScore}%</span>
  </div>
  <TimeEstimate minutes={course.estimatedTime} />
  </div>
      {
    /* Next topic */
    }<div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground mb-1">Next up:</p><p className="text-sm font-medium">
      {course.nextTopic}
    </p>
  </div>
      {
    /* Action button */
    }<Button className="w-full group" onClick={() => {playSound('click'

      );
      onCourseSelect(course.id

      )
}}>
              <motion.div className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                <span>Continue Learning</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
</motion.div>
</Button>
      {
  /* Best time indicator */} {course.bestTimeToStudy && isHovered && ( <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-2 left-2 right-2 bg-primary/10 rounded-lg p-2 text-xs text-center" ><Clock className="h-3 w-3 inline mr-1" /> You perform best at {course.bestTimeToStudy}
    </motion.div> )}
    </div>
      {
  /* Hover particles */} {isHovered && ( <motion.div className="absolute inset-0 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} >{[...Array(5)].map((_, i) => ( <motion.div key={i} className="absolute w-1 h-1 rounded-full" style={{ backgroundColor: config.particleColor, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} animate={{
        y: [0,
        -20,
        0],
        opacity: [0,
        1,
        0],
        scale: [0,
        1.5,
        0]
    }} transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }} /> ))}
    </motion.div> )}
    </Card>
</motion.div>
  )
}
  )
}
    </div>
  )
});SmartStudyCards.displayName = 'SmartStudyCards';

export default SmartStudyCards;
