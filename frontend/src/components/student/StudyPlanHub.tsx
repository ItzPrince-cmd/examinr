import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';

  import {
  Calendar,
  Clock,
  Target,
  Flame,
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  AlertCircle,
  TrendingUp,
  Brain,
  Coffee,
  Moon,
  Sun,
  Zap,
  BookOpen,
  Star,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Settings,
  Plus,
  X,
  Edit2,
  Trophy} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from '../ui/select';
import { useSound } from '../../design-system/sound';
import { ParticleSystem } from '../../design-system/components/ParticleSystem';
import { toast } from '../ui/use-toast';

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
  subject?: string;priority: 'high' | 'medium' | 'low'
}

  interface PomodoroSettings { workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean
}

  interface StudyPlanHubProps {
  studySessions: StudySession[];
  studyGoals: StudyGoal[];
  currentStreak: number;
  bestStreak: number;
  onSessionComplete: (session: StudySession) => void;
  onGoalCreate: (goal: StudyGoal) => void;
  onGoalUpdate: (goalId: string,
  updates: Partial<StudyGoal>) => void
}

  const StudyPlanHub: React.FC<StudyPlanHubProps> = memo(({
  studySessions = [],
  studyGoals = [],
  currentStreak,
  bestStreak,
  onSessionComplete,
  onGoalCreate,
  onGoalUpdate
    }) => {
  const { playSound } = useSound();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTab, setSelectedTab] = useState<'calendar' | 'pomodoro' | 'goals'>('calendar');
  
  // Pomodoro state 
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    autoStartBreaks: true,
    autoStartPomodoros: false,
    soundEnabled: true
    });
    const [pomodoroState, setPomodoroState] = useState({
    isRunning: false,
    isPaused: false,currentPhase: 'work' as 'work' | 'shortBreak' | 'longBreak',
    timeRemaining: pomodoroSettings.workDuration * 60,
    completedSessions: 0,
    totalFocusTime: 0
    });
  const [showSettings, setShowSettings] = useState(false
  );
  const [showGoalForm, setShowGoalForm] = useState(false
  );
    // Calendar Component
    const StudyCalendar = () => {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const currentMonth = selectedDate.getMonth();
      const currentYear = selectedDate.getFullYear();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
      
      const getSessionsForDate = (date: Date) => {
        return studySessions.filter(session => session.date.toDateString() === date.toDateString());
      };

      const navigateMonth = (direction: number) => {
        setSelectedDate(new Date(currentYear, currentMonth + direction, 1));
      };

      // Generate calendar days
      const calendarDays = [];
      for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
      }
      for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(new Date(currentYear, currentMonth, day));
      }
      
      const getTimeOfDayIcon = (timeOfDay: string) => {
        switch (timeOfDay) {
          case 'morning': return <Sun className="h-3 w-3" />;
          case 'afternoon': return <Sun className="h-3 w-3 text-yellow-500" />;
          case 'evening': return <Moon className="h-3 w-3 text-blue-500" />;
          case 'night': return <Moon className="h-3 w-3 text-indigo-500" />;
          default: return null;
        }
      };

      return (
        <div className="space-y-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {monthNames[currentMonth]} {currentYear}
            </h3>
            <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Streak Display */}
          <div className="flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Current Streak: {currentStreak} days</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Best: {bestStreak} days</span>
            </div>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            {calendarDays.map((date, index) => {
              if (!date) return <div key={`empty-${index}`} />;
              const sessions = getSessionsForDate(date);
              const hasStudied = sessions.some(s => s.completed);
              const totalHours = sessions.reduce((acc, s) => acc + s.duration, 0) / 60;
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <motion.div
                  key={date.getTime()}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={`
                    aspect-square p-2 rounded-lg border cursor-pointer transition-all
                    ${hasStudied ? 'bg-green-500/10 border-green-500' : ''}
                    ${isToday ? 'ring-2 ring-primary' : ''}
                  `}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="h-full flex flex-col justify-between">
                    <span className={`text-sm ${isToday ? 'font-bold' : ''}`}>
                      {date.getDate()}
                    </span>
                    {sessions.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1">
                          {sessions.slice(0, 3).map((session, i) => (
                            <div key={i} className="h-1.5 w-1.5 rounded-full bg-primary" />
                          ))}
                        </div>
                        {totalHours > 0 && (
                          <span className="text-[10px] text-center block">
                            {totalHours.toFixed(1)}h
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Selected Date Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getSessionsForDate(selectedDate).length > 0 ? (
                <div className="space-y-2">
                  {getSessionsForDate(selectedDate).map(session => (
                    <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <div className="flex items-center gap-3">
                        {getTimeOfDayIcon(session.timeOfDay)}
                        <div>
                          <p className="font-medium">{session.subject}</p>
                          <p className="text-sm text-muted-foreground">{session.topic}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={session.completed ? 'default' : 'outline'}>
                          {session.duration} min
                        </Badge>
                        {session.productivity && (
                          <Badge variant="secondary">
                            {session.productivity}% productive
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No study sessions planned for this day
                </p>
              )}
              <Button 
                className="w-full mt-4" 
                onClick={() => {
                  toast({
                    title: "Add Study Session",
                    description: "Feature coming soon!"
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Study Session
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    };

    // Pomodoro Timer Component
    const PomodoroTimer = () => {
      const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };

      const startTimer = () => {
        setPomodoroState(prev => ({ ...prev, isRunning: true, isPaused: false }));
        if (pomodoroSettings.soundEnabled) playSound('start');
      };

      const pauseTimer = () => {
        setPomodoroState(prev => ({ ...prev, isPaused: true }));
        if (pomodoroSettings.soundEnabled) playSound('pause');
      };

      const resetTimer = () => {
        setPomodoroState(prev => ({
          ...prev,
          isRunning: false,
          isPaused: false,
          timeRemaining: pomodoroSettings.workDuration * 60,
          currentPhase: 'work'
        }));
      };

      const skipPhase = () => {
        const nextPhase = getNextPhase();
        setPomodoroState(prev => ({
          ...prev,
          currentPhase: nextPhase,
          timeRemaining: getPhaseSeconds(nextPhase),
          completedSessions: nextPhase === 'work' ? prev.completedSessions : prev.completedSessions + 1
        }));
      };

      const getNextPhase = () => {
        if (pomodoroState.currentPhase === 'work') {
          const sessionsCompleted = pomodoroState.completedSessions + 1;
          return sessionsCompleted % pomodoroSettings.sessionsUntilLongBreak === 0 ? 'longBreak' : 'shortBreak';
        }
        return 'work';
      };

      const getPhaseSeconds = (phase: string) => {
        switch (phase) {
          case 'work': return pomodoroSettings.workDuration * 60;
          case 'shortBreak': return pomodoroSettings.shortBreakDuration * 60;
          case 'longBreak': return pomodoroSettings.longBreakDuration * 60;
          default: return pomodoroSettings.workDuration * 60;
        }
      };

      // Timer effect
      useEffect(() => {
        if (!pomodoroState.isRunning || pomodoroState.isPaused) return;
        
        const interval = setInterval(() => {
          setPomodoroState(prev => {
            if (prev.timeRemaining <= 1) {
              // Phase completed
              if (pomodoroSettings.soundEnabled) playSound('success');
              
              const nextPhase = getNextPhase();
              const shouldAutoStart = (nextPhase !== 'work' && pomodoroSettings.autoStartBreaks) || 
                                    (nextPhase === 'work' && pomodoroSettings.autoStartPomodoros);
              
              return {
                ...prev,
                currentPhase: nextPhase,
                timeRemaining: getPhaseSeconds(nextPhase),
                isRunning: shouldAutoStart,
                completedSessions: prev.currentPhase === 'work' ? prev.completedSessions + 1 : prev.completedSessions,
                totalFocusTime: prev.currentPhase === 'work' ? prev.totalFocusTime + pomodoroSettings.workDuration : prev.totalFocusTime
              };
            }
            return { ...prev, timeRemaining: prev.timeRemaining - 1 };
          });
        }, 1000);
        
        return () => clearInterval(interval);
      }, [pomodoroState.isRunning, pomodoroState.isPaused, pomodoroSettings]);
      
      const phaseColors = {
        work: 'from-red-500 to-orange-500',
        shortBreak: 'from-green-500 to-teal-500',
        longBreak: 'from-blue-500 to-purple-500'
      };

      const phaseIcons = {
        work: <Brain className="h-6 w-6" />,
        shortBreak: <Coffee className="h-6 w-6" />,
        longBreak: <Moon className="h-6 w-6" />
      };

    return (<div className="space-y-6">
      {
      /* Timer Display */
      }
        <motion.div className={`relative mx-auto w-64 h-64 rounded-full bg-gradient-to-br ${phaseColors[pomodoroState.currentPhase]} p-2`} animate={{
        scale: pomodoroState.isRunning && !pomodoroState.isPaused ? [1,
        1.02,
        1] : 1
      }} transition={{ duration: 2, repeat: Infinity }} ><div className="w-full h-full rounded-full bg-background flex flex-col items-center justify-center">
    <motion.div animate={{ y: pomodoroState.isRunning ? [0, -5, 0] : 0 }} transition={{ duration: 2, repeat: Infinity }} >
      {phaseIcons[pomodoroState.currentPhase]}
    </motion.div><h2 className="text-4xl font-bold mt-4">
      {formatTime(pomodoroState.timeRemaining)}
    </h2><p className="text-muted-foreground capitalize mt-2">
      {
      pomodoroState.currentPhase.replace(/([A-Z])/g,' $1').trim()
      }
    </p>
    </div>
      {
      /* Progress Ring */
      }<svg className="absolute inset-0 w-full h-full -rotate-90"><circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.2" /><circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray={`${2 * Math.PI * 120}`} strokeDashoffset={`${2 * Math.PI * 120 * (pomodoroState.timeRemaining / getPhaseSeconds(pomodoroState.currentPhase))}`} className="transition-all duration-1000" />
    </svg>
    </motion.div>
      {
      /* Controls */
      }<div className="flex justify-center gap-4">{!pomodoroState.isRunning || pomodoroState.isPaused ? ( <Button size="lg" onClick={startTimer} className="gap-2"><Play className="h-5 w-5" />{pomodoroState.isPaused ? 'Resume' : 'Start'}</Button> ) : ( <Button size="lg" variant="outline" onClick={pauseTimer} className="gap-2"><Pause className="h-5 w-5" /> Pause </Button> )}<Button size="lg" variant="outline" onClick={resetTimer} className="gap-2"><RotateCcw className="h-5 w-5" /> Reset </Button><Button size="lg" variant="outline" onClick={skipPhase} className="gap-2"><ChevronRight className="h-5 w-5" /> Skip </Button>
    </div>
      {
      /* Statistics */
      }<div className="grid grid-cols-2 gap-4">
    <Card><CardContent className="p-4"><div className="flex items-center justify-between">
    <div><p className="text-sm text-muted-foreground">Sessions</p><p className="text-2xl font-bold">
      {pomodoroState.completedSessions}
    </p>
    </div><CheckCircle2 className="h-8 w-8 text-green-500" />
    </div>
    </CardContent>
    </Card>
    <Card><CardContent className="p-4"><div className="flex items-center justify-between">
    <div><p className="text-sm text-muted-foreground">Focus Time</p><p className="text-2xl font-bold">
      {pomodoroState.totalFocusTime}m</p>
    </div><Timer className="h-8 w-8 text-blue-500" />
    </div>
    </CardContent>
    </Card>
    </div>
      {
      /* Settings Button */
      }<div className="flex justify-center"><Button variant="outline" onClick={() => setShowSettings(true)} className="gap-2"><Settings className="h-4 w-4" /> Pomodoro Settings </Button>
    </div>
    </div>
    )
}

    // Study Goals Component
    const StudyGoals = () => {
      const priorityColors = {
        high: 'text-red-500',
        medium: 'text-yellow-500',
        low: 'text-green-500'
      };

      const calculateProgress = (goal: StudyGoal) => {
        return Math.min((goal.currentHours / goal.targetHours) * 100, 100);
      };

      const getDaysRemaining = (deadline: Date) => {
        const days = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return days;
      };

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Study Goals</h3>
            <Button onClick={() => setShowGoalForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Goal
            </Button>
          </div>
          {studyGoals.length > 0 ? (
            <div className="space-y-3">
              {studyGoals.map(goal => {
                const progress = calculateProgress(goal);
                const daysRemaining = getDaysRemaining(goal.deadline);
                const isOverdue = daysRemaining < 0;
                
                return (
                  <motion.div key={goal.id} className="relative">
                    <Card className={isOverdue ? 'border-red-500' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{goal.title}</h4>
                              <Badge variant="outline" className={priorityColors[goal.priority]}>
                                {goal.priority}
                              </Badge>
                              {goal.subject && (
                                <Badge variant="secondary">
                                  {goal.subject}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {goal.currentHours} / {goal.targetHours} hours completed
                            </p>
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => {
                              toast({
                                title: "Edit Goal",
                                description: "Feature coming soon!"
                              });
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Progress value={progress} className="h-2 mb-2" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {progress.toFixed(0)}% complete
                          </span>
                          <span className={`${isOverdue ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {isOverdue ? (
                              <>Overdue by {Math.abs(daysRemaining)} days</>
                            ) : (
                              <>{daysRemaining} days remaining</>
                            )}
                          </span>
                        </div>
                        {progress === 100 && (
                          <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            className="absolute -top-2 -right-2"
                          >
                            <div className="bg-green-500 text-white rounded-full p-2">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No study goals yet. Create your first goal to stay motivated!
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* Study Tips */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Study Tips
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Set specific, measurable goals</li>
                <li>• Break large goals into smaller milestones</li>
                <li>• Review and adjust goals weekly</li>
                <li>• Celebrate when you achieve your goals!</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      );
    };

    return (
      <div className="w-full space-y-6">
        {/* Tab Navigation */}
        <Tabs value={selectedTab} onValueChange={(value: any) => setSelectedTab(value)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="h-4 w-4" />
              Study Calendar
            </TabsTrigger>
            <TabsTrigger value="pomodoro" className="gap-2">
              <Timer className="h-4 w-4" />
              Pomodoro Timer
            </TabsTrigger>
            <TabsTrigger value="goals" className="gap-2">
              <Target className="h-4 w-4" />
              Study Goals
            </TabsTrigger>
          </TabsList>
          <TabsContent value="calendar" className="mt-6">
            <StudyCalendar />
          </TabsContent>
          <TabsContent value="pomodoro" className="mt-6">
            <PomodoroTimer />
          </TabsContent>
          <TabsContent value="goals" className="mt-6">
            <StudyGoals />
          </TabsContent>
        </Tabs>
        
        {/* Pomodoro Settings Modal */}
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
            onClick={() => setShowSettings(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              onClick={(e) => e.stopPropagation()} 
              className="bg-background rounded-lg p-6 max-w-md w-full space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Pomodoro Settings</h3>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setShowSettings(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
  <div>
  <Label>Work Duration (minutes)</Label><Slider value={[pomodoroSettings.workDuration]} onValueChange={([value]) => setPomodoroSettings(prev => ({ ...prev, workDuration: value }))} min={1} max={60} step={1} className="mt-2" /><span className="text-sm text-muted-foreground">
      {pomodoroSettings.workDuration} minutes</span>
  </div>
  <div>
  <Label>Short Break Duration (minutes)</Label><Slider value={[pomodoroSettings.shortBreakDuration]} onValueChange={([value]) => setPomodoroSettings(prev => ({ ...prev, shortBreakDuration: value }))} min={1} max={30} step={1} className="mt-2" /><span className="text-sm text-muted-foreground">
      {pomodoroSettings.shortBreakDuration} minutes</span>
  </div>
  <div>
  <Label>Long Break Duration (minutes)</Label><Slider value={[pomodoroSettings.longBreakDuration]} onValueChange={([value]) => setPomodoroSettings(prev => ({ ...prev, longBreakDuration: value }))} min={5} max={60} step={1} className="mt-2" /><span className="text-sm text-muted-foreground">
      {pomodoroSettings.longBreakDuration} minutes</span>
  </div>
  <div>
  <Label>Sessions Until Long Break</Label><Slider value={[pomodoroSettings.sessionsUntilLongBreak]} onValueChange={([value]) => setPomodoroSettings(prev => ({ ...prev, sessionsUntilLongBreak: value }))} min={2} max={8} step={1} className="mt-2" /><span className="text-sm text-muted-foreground">
      {pomodoroSettings.sessionsUntilLongBreak} sessions</span>
  </div><div className="space-y-3"><div className="flex items-center justify-between"><Label htmlFor="auto-start-breaks">Auto-start breaks</Label><Switch id="auto-start-breaks" checked={pomodoroSettings.autoStartBreaks} onCheckedChange={(checked) => setPomodoroSettings(prev => ({ ...prev, autoStartBreaks: checked }))} />
  </div><div className="flex items-center justify-between"><Label htmlFor="auto-start-pomodoros">Auto-start pomodoros</Label><Switch id="auto-start-pomodoros" checked={pomodoroSettings.autoStartPomodoros} onCheckedChange={(checked) => setPomodoroSettings(prev => ({ ...prev, autoStartPomodoros: checked }))} />
  </div><div className="flex items-center justify-between"><Label htmlFor="sound-enabled">Sound notifications</Label><Switch id="sound-enabled" checked={pomodoroSettings.soundEnabled} onCheckedChange={(checked) => setPomodoroSettings(prev => ({ ...prev, soundEnabled: checked }))} />
  </div>
  </div>
  </div><Button className="w-full" onClick={() => setShowSettings(false)}> Save Settings </Button>
  </motion.div>
          </motion.div>
        )}
        
        {/* Goal Form Modal */}
        {showGoalForm && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
            onClick={() => setShowGoalForm(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              onClick={(e) => e.stopPropagation()} 
              className="bg-background rounded-lg p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Create Study Goal</h3>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setShowGoalForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <form 
                className="space-y-4" 
                onSubmit={(e) => {
                  e.preventDefault();
                  // Handle form submission
                  toast({
                    title: "Goal Created!",
                    description: "Your study goal has been added successfully."
                  });
                  setShowGoalForm(false);
                }}
              >
                <div>
                  <Label htmlFor="goal-title">Goal Title</Label>
                  <Input id="goal-title" placeholder="e.g., Master Calculus Fundamentals" required />
                </div>
                <div>
                  <Label htmlFor="target-hours">Target Hours</Label>
                  <Input id="target-hours" type="number" placeholder="e.g., 20" min="1" required />
                </div>
                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" type="date" required />
                </div>
                <div>
                  <Label htmlFor="subject">Subject (Optional)</Label>
                  <Select>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Create Goal
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  });

StudyPlanHub.displayName = 'StudyPlanHub';

export default StudyPlanHub;
