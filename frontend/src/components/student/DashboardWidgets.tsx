import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Target,
  Clock,
  Award,
  BookOpen,
  Calendar,
  MessageSquare,
  Headphones,
  Cpu,
  Brain,
  Zap,
  Star,
  Activity,
  BarChart3,
  Coffee,
  Moon,
  Calculator,
  Atom,
  Beaker,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

// Learning Insights Widget 
export const LearningInsightsWidget = () => {
    const insights = [ {label: 'Best Study Time',value: '10:00 AM - 12:00 PM',
    icon: Clock,color: 'text-blue-500'
      }, {label: 'Strongest Subject',value: 'Mathematics',
    icon: Brain,color: 'text-purple-500'
      }, {label: 'Focus Score',value: '87%',
    icon: Target,color: 'text-green-500'
      }, {label: 'Retention Rate',value: '92%',
    icon: TrendingUp,color: 'text-orange-500'
    } ];
  return (
    <Card className="glass-gradient hover-lift gradient-border">
  <CardHeader><CardTitle className="flex items-center gap-2"><motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease:"linear" }} ><Cpu className="h-5 w-5 text-primary" />
  </motion.div> AI Learning Insights </CardTitle>
  </CardHeader><CardContent className="grid grid-cols-2 gap-4">
      {insights.map((insight, index) => {
      const Icon = insight.icon;
      return (
        <motion.div 
          key={insight.label} 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: index * 0.1 }} 
          className="space-y-2 p-3 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }} >
              <Icon className={`h-4 w-4 ${insight.color}`} />
            </motion.div>
            <span>
              {insight.label}
            </span>
          </div>
          <p className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {insight.value}
          </p>
        </motion.div>
      );
    })}
    </CardContent>
  </Card>
  );
};

// Study Group Widget 
export const StudyGroupWidget = () => {
  const groups = [ {name: 'Physics Masters',
  members: 24,
  active: 8,nextSession: '2:00 PM'
    }, {name: 'Chem Warriors',
  members: 18,
  active: 12,nextSession: '4:00 PM'
    }, {name: 'Math Wizards',
  members: 32,
  active: 15,nextSession: 'Tomorrow'
} ];
 return (<Card className="glass hover-lift">
<CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-blue-500" /> Your Study Groups </CardTitle>
</CardHeader><CardContent className="space-y-3">{groups.map((group, index) => ( <motion.div key={group.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 transition-colors" ><div className="space-y-1"><p className="font-medium">
      {group.name}
    </p><div className="flex items-center gap-3 text-sm text-muted-foreground"><span className="flex items-center gap-1"><Users className="h-3 w-3" />
      {group.members}
    </span><span className="flex items-center gap-1"><div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
      {group.active} online </span>
  </div>
  </div><Badge variant="outline">
      {group.nextSession}
    </Badge>
</motion.div> ))}
    </CardContent>
  </Card>
  );
};

// Mood Tracker Widget 
export const MoodTrackerWidget = () => {
  const [mood, setMood] = useState<string>('focused');
  
  const moods = [
    {
      value: 'energized',
      emoji: '⚡',
      label: 'Energized',
      color: 'from-yellow-400 to-orange-500'
    }, 
    {
      value: 'focused',
      emoji: '🎯',
      label: 'Focused',
      color: 'from-blue-400 to-indigo-500'
    }, 
    {
      value: 'relaxed',
      emoji: '😌',
      label: 'Relaxed',
      color: 'from-green-400 to-teal-500'
    }, 
    {
      value: 'tired',
      emoji: '😴',
      label: 'Tired',
      color: 'from-purple-400 to-pink-500'
    }
  ];
 return (<Card className="glass hover-lift">
<CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-pink-500" /> How are you feeling? </CardTitle>
</CardHeader>
<CardContent>
  <div className="grid grid-cols-2 gap-3">
    {moods.map((m) => ( 
      <motion.button 
        key={m.value} 
        whileTap={{ scale: 0.95 }} 
        onClick={() => setMood(m.value)} 
        className={`p-4 rounded-lg border-2 transition-all ${
          mood === m.value ? 'border-primary bg-primary/10' : 'border-border'
        }`} 
      >
          <div className="text-3xl mb-2">
            {m.emoji}
          </div>
          <p className="text-sm font-medium">
            {m.label}
          </p>
        </motion.button> 
      ))}
    </div>
    <div className="mt-4 p-3 rounded-lg bg-muted/50">
      <p className="text-sm text-center">
        {mood === 'energized' && "Great energy! Perfect time for challenging topics!"} 
        {mood === 'focused' && "You're in the zone! Keep up the great work!"} 
        {mood === 'relaxed' && "Nice and calm. Good for revision!"} 
        {mood === 'tired' && "Take a break! Rest is important too."}
      </p>
    </div>
  </CardContent>
  </Card>
  );
};

// Focus Music Widget 
export const FocusMusicWidget = () => {
  const [isPlaying, setIsPlaying] = useState(false);
 const playlists = [ {name: 'Deep Focus',duration: '2h 15m',
tracks: 28,gradient: 'from-purple-500 to-indigo-500' 
}, {name: 'Study Lo-Fi',duration: '3h 30m',
tracks: 45,gradient: 'from-pink-500 to-rose-500' 
}, {name: 'Nature Sounds',duration: '1h 45m',
tracks: 12,gradient: 'from-green-500 to-teal-500' 
}, {name: 'White Noise',duration: '4h 00m',
tracks: 8,gradient: 'from-gray-500 to-gray-700' 
} ];
 return (<Card className="glass hover-lift">
<CardHeader><CardTitle className="flex items-center gap-2"><Headphones className="h-5 w-5 text-purple-500" /> Focus Music </CardTitle>
</CardHeader><CardContent className="space-y-3">
      {playlists.map((playlist, index) => ( 
        <motion.div 
          key={playlist.name} 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: index * 0.1 }} 
          className={`relative p-4 rounded-lg bg-gradient-to-r ${playlist.gradient} text-white cursor-pointer group`} 
          onClick={() => setIsPlaying(!isPlaying)} 
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                {playlist.name}
              </p>
              <p className="text-sm opacity-90">
                {playlist.tracks} tracks • {playlist.duration}
              </p>
            </div>
            <motion.div 
              whileTap={{ scale: 0.9 }} 
              className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur" 
            >
              {isPlaying ? '⏸️' : '▶️'}
            </motion.div>
          </div>
        </motion.div> 
      ))}
    </CardContent>
  </Card>
  );
};

// Daily Goals Widget 
export const DailyGoalsWidget = () => {
  const goals = [
    {
      task: 'Complete Physics Chapter 5',
      progress: 75,
icon: BookOpen 
}, {task: 'Practice 20 Math Problems',
progress: 45,
icon: Calculator 
}, {task: 'Review Chemistry Notes',
progress: 100,
icon: Award }, { task: 'Take Mock Test', progress: 0, icon: Target } ];
 return (<Card className="glass hover-lift">
<CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-green-500" /> Today's Goals </CardTitle>
</CardHeader><CardContent className="space-y-4">
      {goals.map((goal, index) => {
const Icon = goal.icon;
 return (<motion.div key={goal.task} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="space-y-2" ><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Icon className="h-4 w-4 text-muted-foreground" />
<span className={`text-sm ${goal.progress === 100 ? 'line-through opacity-60' : ''}`}>
      {goal.task}
    </span>
</div><span className="text-sm font-medium">
      {goal.progress}%</span>
</div><Progress value={goal.progress} className="h-2" />
</motion.div>
  )
}
  )
}
    </CardContent>
  </Card>
  );
};

// Study Recommendations Widget 
export const StudyRecommendationsWidget = () => {
  const recommendations = [
    {
      subject: 'Physics',
      topic: 'Quantum Mechanics',
      reason: 'Based on your test performance',
      difficulty: 'Hard',
      time: '45 min',
      icon: Atom 
    }, 
    {
      subject: 'Mathematics',
      topic: 'Calculus Integration',
      reason: 'Strengthen weak areas',
      difficulty: 'Medium',
      time: '30 min',
      icon: Calculator 
    }, 
    {
      subject: 'Chemistry',
      topic: 'Organic Reactions',
      reason: 'Upcoming in syllabus',
      difficulty: 'Medium',
      time: '40 min',
      icon: Beaker 
    }
  ];
 return (<Card className="glass hover-lift">
<CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-yellow-500" /> AI Recommendations </CardTitle>
</CardHeader><CardContent className="space-y-3">
      {recommendations.map((rec, index) => {
const Icon = rec.icon;
 return (<motion.div key={rec.topic} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="p-4 rounded-lg border transition-colors cursor-pointer group" ><div className="flex items-start gap-3"><div className={`p-2 rounded-lg bg-gradient-to-br ${ rec.subject === 'Physics' ? 'from-blue-500/20 to-indigo-500/20' : rec.subject === 'Mathematics' ? 'from-purple-500/20 to-pink-500/20' : 'from-green-500/20 to-teal-500/20' }`}><Icon className="h-5 w-5" />
</div><div className="flex-1 space-y-1"><div className="flex items-center justify-between"><h4 className="font-medium">
      {rec.topic}
    </h4><Badge variant={rec.difficulty === 'Hard' ? 'destructive' : 'secondary'}>
      {rec.difficulty}
    </Badge>
</div><p className="text-sm text-muted-foreground">
      {rec.subject} • {rec.time}
    </p><p className="text-xs text-muted-foreground">
      {rec.reason}
    </p>
</div>
</div><Button size="sm" className="w-full mt-3 opacity-0 group- transition-opacity"> Start Learning </Button>
</motion.div>
  )
}
  )
}
    </CardContent>
  </Card>
  );
};
export default {
  LearningInsightsWidget,
  StudyGroupWidget,
  MoodTrackerWidget,
  FocusMusicWidget,
  DailyGoalsWidget,
  StudyRecommendationsWidget
};
