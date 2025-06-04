import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

  import {
  Sparkles,
  Target,
  Coffee,
  Calendar,
  AlertCircle,
  Rocket,
  Heart,
  Book,
  Trophy,
  Clock,
  TrendingUp,
  RefreshCw,
  Award,
  Zap,
  Brain,
  PartyPopper,
  Star} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useDesignSystem } from '../../design-system/theme-context';
import { useSound } from '../../design-system/sound';
import { ParticleSystem } from '../../design-system/components/ParticleSystem';
import { DelightfulButton } from '../../design-system/components/DelightfulButton';

  interface DashboardContext { isFirstLogin: boolean;
  daysSinceLastLogin: number;
  isExamSeason: boolean;
  hasAchievement: boolean;achievementType?: 'level_up' | 'streak_milestone' | 'perfect_score' | 'new_badge';
  examDaysLeft?: number;
    missedContent?: { tests: number;
    topics: number;
    announcements: number
}
}

  interface AdaptiveDashboardStatesProps { context: DashboardContext;
  onDismiss: () => void;
  onAction: (action: string) => void
}

  const AdaptiveDashboardStates: React.FC<AdaptiveDashboardStatesProps> = ({ context, onDismiss, onAction }) => {
  const { playSound } = useSound();
  const [showState, setShowState] = useState(true
  );const [dailyTip, setDailyTip] = useState(''
  );
  const [goals, setGoals] = useState<string[]>([]

  );
    // Daily tips
    const tips = [
      {
        text: "Students who study in 25-minute intervals retain 30% more information!",
        icon: Brain
      },
      {
        text: "Taking practice tests improves exam scores by up to 20%!",
        icon: Target
      },
      {
        text: "Morning study sessions lead to better long-term retention!",
        icon: Coffee
      },
      {
        text: "Explaining concepts to others helps you understand them better!",
        icon: Heart
      },
      {
        text: "Regular breaks every hour boost productivity by 40%!",
        icon: Clock
      }
    ];
    // Motivational quotes
    const quotes = [
      {
        text: "Success is the sum of small efforts repeated day in and day out.",
        author: "Robert Collier"
      },
      {
        text: "The expert in anything was once a beginner.",
        author: "Helen Hayes"
      },
      {
        text: "Your limitation—it's only your imagination.",
        author: "Unknown"
      },
      {
        text: "Great things never come from comfort zones.",
        author: "Unknown"
      },
      {
        text: "Dream it. Wish it. Do it.",
        author: "Unknown"
    } ];
    useEffect(() => {
    // Select random tip
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setDailyTip(randomTip.text

    )
}, []);
    // First login experience
    const FirstLoginExperience = () => {
    const [step, setStep] = useState(0
    );
    const steps = ['welcome', 'goals', 'tips', 'ready'];
    return (<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50 p-4" ><Card className="max-w-2xl w-full overflow-hidden"><div className="relative">
      {
      /* Background animation */
      }<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" /><CardContent className="relative p-8">{step === 0 && ( <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center space-y-6" >
      <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} ><Sparkles className="h-16 w-16 mx-auto text-yellow-500" />
      </motion.div><h2 className="text-3xl font-bold">Welcome to Your Learning Journey! 🎉</h2><p className="text-lg text-muted-foreground"> Let's set you up for success. This will only take a moment. </p><DelightfulButton onClick={() => setStep(1)} variant="primary" size="lg" > Let's Get Started </DelightfulButton></motion.div> )} {step === 1 && ( <motion.div key="goals" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6" ><h3 className="text-2xl font-bold text-center">Set Your Daily Goals 🎯</h3><p className="text-center text-muted-foreground"> Choose goals that inspire you to learn every day </p><div className="grid grid-cols-2 gap-4">{[ { goal: 'Study 30 minutes daily', icon: Clock }, {goal: 'Complete 5 practice questions',
          icon: Target}, { goal: 'Review one topic', icon: Book }, { goal: 'Maintain streak', icon: Rocket } ].map((item) => (
            <motion.div
              key={item.goal}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const newGoals = goals.includes(item.goal)
                  ? goals.filter(g => g !== item.goal)
                  : [...goals, item.goal];
                setGoals(newGoals);
                playSound('click');
}} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${ goals.includes(item.goal) ? 'border-primary bg-primary/10' : 'border-border ' }`} ><item.icon className="h-8 w-8 mb-2 mx-auto" /><p className="text-sm text-center">
      {item.goal}
      </p>
    </motion.div> ))}
    </div><Button onClick={() => setStep(2)} disabled={goals.length === 0} className="w-full" > Continue ({goals.length} goals selected) </Button></motion.div> )} {step === 2 && ( <motion.div key="tips" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 text-center" ><Brain className="h-16 w-16 mx-auto text-blue-500" /><h3 className="text-2xl font-bold">Pro Tip for Success 💡</h3><Card className="bg-blue-500/10 border-blue-500/20"><CardContent className="p-6"><p className="text-lg italic">
      {dailyTip}
    </p>
    </CardContent>
    </Card><Button onClick={() => setStep(3)} className="w-full"> Got it! </Button></motion.div> )} {step === 3 && ( <motion.div key="ready" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="text-center space-y-6" ><ParticleSystem type="celebration" particleCount={50} colors={['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1']} triggerAnimation={true} />
    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} ><Trophy className="h-20 w-20 mx-auto text-yellow-500" /></motion.div><h2 className="text-3xl font-bold">You're All Set! 🚀</h2><p className="text-lg text-muted-foreground"> Your personalized learning dashboard is ready </p>
        <DelightfulButton onClick={() => {
        onAction('complete_onboarding'

        );
        setShowState(false

        )}} size="lg" className="min-w-[200px]" > Start Learning </DelightfulButton>
  </motion.div> )}
    </CardContent>
  </div>
  </Card>
  </motion.div>
  )
}

    // Welcome back after absence
    const WelcomeBackExperience = () => {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    return (<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6" ><Card className="relative overflow-hidden"><div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10" /><CardContent className="relative p-8"><div className="flex items-start gap-6"><motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease:"linear" }} ><RefreshCw className="h-12 w-12 text-purple-500" />
  </motion.div><div className="flex-1 space-y-4"><h2 className="text-2xl font-bold">Welcome Back! We Missed You 👋</h2><p className="text-muted-foreground"> You've been away for {context.daysSinceLastLogin} days. Let's get you back on track! </p>
      {
    /* What you missed */} {context.missedContent && ( <div className="grid grid-cols-3 gap-4 my-4"><Card className="bg-blue-500/10 border-blue-500/20"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-500">
      {context.missedContent.tests}
    </p><p className="text-sm">New Tests</p>
    </CardContent>
    </Card><Card className="bg-green-500/10 border-green-500/20"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-500">
      {context.missedContent.topics}
    </p><p className="text-sm">New Topics</p>
    </CardContent>
    </Card><Card className="bg-purple-500/10 border-purple-500/20"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-purple-500">
      {context.missedContent.announcements}
    </p><p className="text-sm">Announcements</p>
    </CardContent>
    </Card>
    </div> )} {
    /* Motivational quote */
    }<Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-0"><CardContent className="p-4"><p className="italic text-lg">"{quote.text}"</p><p className="text-sm text-muted-foreground mt-2">— {quote.author}
    </p>
  </CardContent>
  </Card><div className="flex gap-3"><Button onClick={() => onAction('start_easy_challenge')}><Zap className="h-4 w-4 mr-2" /> Start Easy Challenge </Button><Button variant="outline" onClick={() => onAction('view_summary')}> View Summary </Button><Button variant="ghost" onClick={() => setShowState(false)}> Skip </Button>
  </div>
  </div>
  </div>
  </CardContent>
  </Card>
  </motion.div>
  )
}

    // Exam mode
    const ExamModeExperience = () => {
    return (<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6" ><Card className="relative overflow-hidden border-2 border-red-500/50"><div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10" /><CardContent className="relative p-8"><div className="flex items-center justify-between"><div className="space-y-4"><div className="flex items-center gap-3">
  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} ><AlertCircle className="h-8 w-8 text-red-500" />
  </motion.div><h2 className="text-2xl font-bold">Exam Mode Activated 🎯</h2><Badge variant="destructive" className="text-lg px-3 py-1">
      {context.examDaysLeft} days left </Badge>
  </div><p className="text-muted-foreground"> Your dashboard has been optimized for focused exam preparation </p><div className="flex gap-3"><Button variant="destructive" onClick={() => onAction('start_mock_test')}><Target className="h-4 w-4 mr-2" /> Take Mock Test </Button><Button variant="outline" onClick={() => onAction('revision_mode')}> Quick Revision </Button><Button variant="ghost" onClick={() => setShowState(false)}> Continue to Dashboard </Button>
  </div>
  </div><motion.div className="text-6xl" animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 3, repeat: Infinity }} > 📚 </motion.div>
  </div>
  </CardContent>
  </Card>
  </motion.div>
  )
}

    // Achievement celebration
    const AchievementCelebration = () => {
      const achievementConfig = { level_up: {icon: Trophy,title: 'Level Up!',message:"You've reached a new level! Keep up the amazing work!",
      color: 'from-yellow-400 to-orange-500'
        }, streak_milestone: {
      icon: Rocket,title: 'Streak Milestone!',message: 'Your dedication is paying off! Keep the streak alive!',color: 'from-orange-400 to-red-500'
        }, perfect_score: {icon: Star,title: 'Perfect Score!',message:"Absolutely brilliant! You've mastered this topic!",
      color: 'from-green-400 to-emerald-500'
        }, new_badge: {
      icon: Award,title: 'New Badge Earned!',message: 'Your trophy collection is growing! Check it out!',color: 'from-purple-400 to-pink-500'
    } };
const achievement = achievementConfig[context.achievementType || 'level_up'];

  const Icon = achievement.icon;
    useEffect(() => {playSound('achievement'

    )
}, []);
  return (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50 p-4" onClick={() => setShowState(false)} ><motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type:"spring", bounce: 0.5 }} className="relative" onClick={(e) => e.stopPropagation()} ><Card className="relative overflow-hidden min-w-[400px]">
  <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-20`} /><CardContent className="relative p-8 text-center space-y-6"><ParticleSystem type="celebration" particleCount={100} colors={['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1']} triggerAnimation={true} />
      <motion.div animate={{
      rotate: [0,
      -10,
      10,
      -10,
      10,
      0],
      scale: [1,
      1.1,
      1]
    }} transition={{ duration: 0.5 }} ><Icon className="h-20 w-20 mx-auto text-yellow-500" />
  </motion.div>
  <div><h2 className="text-3xl font-bold mb-2">
      {achievement.title}
    </h2><p className="text-lg text-muted-foreground">
      {achievement.message}
    </p>
  </div><div className="flex gap-3 justify-center"><Button onClick={() => onAction('view_achievement')}> View Achievement </Button><Button variant="outline" onClick={() => onAction('share_achievement')}> Share 🎉 </Button>
  </div>
  </CardContent>
  </Card>
  </motion.div>
  </motion.div>
  )
}

    if (!showState) return null;
    return (
      <>
        {context.isFirstLogin && <FirstLoginExperience />} {context.daysSinceLastLogin > 7 && !context.isFirstLogin && <WelcomeBackExperience />} {context.isExamSeason && !context.isFirstLogin && <ExamModeExperience />} {context.hasAchievement && <AchievementCelebration />}
      </>
    )
  }

export default AdaptiveDashboardStates;
