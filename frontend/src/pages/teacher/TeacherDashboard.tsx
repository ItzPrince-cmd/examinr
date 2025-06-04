import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresenceWrapper } from '../../components/teacher/AnimatePresenceWrapper';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../components/ui/use-toast';
// Import new command center components
import TeacherCommandCenter from '../../components/teacher/TeacherCommandCenterSimple';
import SmartNotificationsPanel from '../../components/teacher/SmartNotificationsPanelSimple';
import QuickActionsDock from '../../components/teacher/QuickActionsDockPolished';
import TestCreationWizard from '../../components/teacher/TestCreationWizard';
// Import gradient overlays and particle system
import { ParticleSystem } from '../../design-system/components/ParticleSystemOptimized';

// Types 
interface ClassEcosystem { 
  id: string;
  name: string;
  subject: string;
  grade: string;
    students: { 
    id: string;
    name: string;
    avatar?: string;
    performance: 'excellent' | 'good' | 'average' | 'struggling';
    lastActive: Date;
    activityLevel: number;
    recentScore?: number
}[];
  nextClass: Date;
  averagePerformance: number;
  activeNow: number;
  recentActivity: { 
    type: 'test' | 'assignment' | 'discussion';
    title: string;
    time: Date
}[]
}

  interface Notification { id: string;type: 'urgent' | 'insight' | 'achievement' | 'reminder' | 'message';
  title: string;
  description: string;
  time: Date;
  read: boolean;
  actionable: boolean;
    action?: { label: string;
    onClick: () => void
}

    metadata?: { studentName?: string;
    studentAvatar?: string;
    className?: string;
    score?: number;trend?: 'up' | 'down'
}
}

  interface AIInsight { id: string;type: 'performance' | 'engagement' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  confidence: number;impact: 'high' | 'medium' | 'low';
  suggestedAction?: string
}

  interface ScheduleSlot { id: string;
  time: string;
  duration: number;
  available: boolean;type?: 'class' | 'meeting' | 'office-hours'
}

  interface Question { id: string;type: 'mcq' | 'short' | 'long' | 'numerical' | 'code' | 'audio' | 'video';
  title: string;
  subject: string;
  topic: string;difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeEstimate: number;
  tags: string[];
  usageCount: number;
  successRate: number
}

  const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showTestWizard, setShowTestWizard] = useState(false);
  
  // Mock data for the command center 
  const [classes] = useState<ClassEcosystem[]>([
    { 
      id: '1', 
      name: 'JEE Advanced Batch A', 
      subject: 'Physics', 
      grade: '11th Grade', 
      students: [
        {
          id: '1',
          name: 'Rahul Kumar',
          performance: 'excellent',
      lastActive: new Date(),
      activityLevel: 0.9,
      recentScore: 92
        }, {id: '2',name: 'Priya Sharma',performance: 'good',
      lastActive: new Date(),
      activityLevel: 0.7,
      recentScore: 78
        }, {id: '3',name: 'Amit Singh',performance: 'average',
      lastActive: new Date(),
      activityLevel: 0.5,
      recentScore: 65
        }, {id: '4',name: 'Sneha Patel',performance: 'struggling',
      lastActive: new Date(),
      activityLevel: 0.3,
      recentScore: 48
        }, {id: '5',name: 'Arun Kumar',performance: 'excellent',
      lastActive: new Date(),
      activityLevel: 0.8,
      recentScore: 88
        }, {id: '6',name: 'Neha Gupta',performance: 'good',
      lastActive: new Date(),
      activityLevel: 0.6,
      recentScore: 72
        }, ], nextClass: new Date(Date.now() + 2 * 60 * 60 * 1000), averagePerformance: 74, activeNow: 4, recentActivity: [ {type: 'test',title: 'Mechanics Quiz #5',
      time: new Date(Date.now() - 30 * 60 * 1000)
        }, {type: 'assignment',title: 'Chapter 3 Problems',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000)}, ] }, { id: '2', name: 'NEET Morning Batch', subject: 'Biology', grade: '12th Grade', students: [ {id: '7',name: 'Kiran Raj',performance: 'good',
      lastActive: new Date(),
      activityLevel: 0.8,
      recentScore: 82
        }, {id: '8',name: 'Maya Singh',performance: 'excellent',
      lastActive: new Date(),
      activityLevel: 0.9,
      recentScore: 95
        }, {id: '9',name: 'Ravi Kumar',performance: 'average',
      lastActive: new Date(),
      activityLevel: 0.4,
      recentScore: 58
        }, {id: '10',name: 'Pooja Sharma',performance: 'good',
      lastActive: new Date(),
      activityLevel: 0.7,
      recentScore: 76
        }, ], nextClass: new Date(Date.now() + 4 * 60 * 60 * 1000), averagePerformance: 78, activeNow: 2, recentActivity: [ {type: 'discussion',title: 'Cell Biology Forum',
      time: new Date(Date.now() - 15 * 60 * 1000)
        }, {type: 'test',title: 'Weekly Assessment',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000)}, ] }, { id: '3', name: 'JEE Main Batch B', subject: 'Mathematics', grade: '11th Grade', students: [ {id: '11',name: 'Ankit Verma',performance: 'struggling',
      lastActive: new Date(),
      activityLevel: 0.2,
      recentScore: 42
        }, {id: '12',name: 'Sonia Kapoor',performance: 'average',
      lastActive: new Date(),
      activityLevel: 0.6,
      recentScore: 68
        }, {id: '13',name: 'Rohit Sharma',performance: 'good',
      lastActive: new Date(),
      activityLevel: 0.8,
      recentScore: 80
        }, {id: '14',name: 'Anjali Patel',performance: 'excellent',
      lastActive: new Date(),
      activityLevel: 0.95,
      recentScore: 96
        }, {id: '15',name: 'Vikram Singh',performance: 'average',
      lastActive: new Date(),
      activityLevel: 0.5,
      recentScore: 63
        }, ], nextClass: new Date(Date.now() + 6 * 60 * 60 * 1000), averagePerformance: 70, activeNow: 3, recentActivity: [ {type: 'assignment',title: 'Calculus Practice Set',
      time: new Date(Date.now() - 45 * 60 * 1000)
    }, ] } ]

  );const [notifications] = useState<Notification[]>([ { id: '1', type: 'urgent', title: 'Low Performance Alert', description: 'Amit Singh scored below 50% in recent tests', time: new Date(Date.now() - 10 * 60 * 1000), read: false, actionable: true, action: { label: 'Schedule 1-on-1', onClick: () => toast({ title: 'Opening calendar...' }
      )
        }, metadata: {studentName: 'Amit Singh',studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',className: 'JEE Advanced Batch A',
      score: 48,trend: 'down'} }, { id: '2', type: 'insight', title: 'Performance Trend', description: 'Biology batch showing 15% improvement this week', time: new Date(Date.now() - 30 * 60 * 1000), read: false, actionable: false, metadata: { className: 'NEET Morning Batch', trend: 'up' } }, { id: '3', type: 'achievement', title: 'Student Achievement', description: 'Maya Singh achieved perfect score in Biology test', time: new Date(Date.now() - 2 * 60 * 60 * 1000), read: true, actionable: true, action: { label: 'Send Congratulations', onClick: () => toast({ title: 'Message sent!' }
      )
        }, metadata: {studentName: 'Maya Singh',studentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
      score: 100} }, { id: '4', type: 'reminder', title: 'Upload Study Material', description: 'Physics Chapter 6 notes pending for JEE Advanced Batch', time: new Date(Date.now() - 3 * 60 * 60 * 1000), read: false, actionable: true, action: {label: 'Upload Now',onClick: () => navigate('/teacher/content')
    } } ]

  );
    const [aiInsights] = useState<AIInsight[]>([ {id: '1',type: 'performance',title: 'Performance Pattern Detected',description: 'Students perform 23% better in morning sessions',
    confidence: 0.87,impact: 'high',suggestedAction: 'Schedule difficult topics in morning'
      }, {id: '2',type: 'engagement',title: 'Low Engagement Alert',description: '3 students haven\'t accessed materials in 5 days',
    confidence: 0.95,impact: 'medium',suggestedAction: 'Send reminder message'
      }, {id: '3',type: 'recommendation',title: 'Test Difficulty Optimization',description: 'Current tests may be too challenging for average performers',
    confidence: 0.78,impact: 'high',suggestedAction: 'Add more medium difficulty questions'
    } ]

  );
    const [scheduleSlots] = useState<ScheduleSlot[]>([ {id: '1',time: '9:00',
    duration: 60,
    available: false,type: 'class'
      }, {id: '2',time: '10:00',
    duration: 60,
    available: false,type: 'class'
      }, {id: '3',time: '11:00',
    duration: 60,
    available: true
      }, {id: '4',time: '12:00',
    duration: 60,
    available: true
      }, {id: '5',time: '1:00',
    duration: 60,
    available: false,type: 'meeting'
      }, {id: '6',time: '2:00',
    duration: 60,
    available: false,type: 'class'
      }, {id: '7',time: '3:00',
    duration: 60,
    available: true
      }, {id: '8',time: '4:00',
    duration: 60,
    available: false,type: 'office-hours'
    }, ]

  );
    const [questionBank] = useState<Question[]>([ {id: '1',type: 'mcq',title: 'What is the speed of light in vacuum?',subject: 'Physics',topic: 'Optics',difficulty: 'easy',
    points: 5,
    timeEstimate: 2,tags: ['light','speed','fundamental'],
    usageCount: 45,
    successRate: 82
      }, {id: '2',type: 'numerical',title: 'Calculate the momentum of a particle with mass 2kg moving at 10m/s',subject: 'Physics',topic: 'Mechanics',difficulty: 'medium',
    points: 10,
    timeEstimate: 5,tags: ['momentum','mechanics'],
    usageCount: 32,
    successRate: 67
      }, {id: '3',type: 'long',title: 'Explain the process of photosynthesis in detail',subject: 'Biology',topic: 'Plant Biology',difficulty: 'hard',
    points: 20,
    timeEstimate: 15,tags: ['photosynthesis','plants'],
    usageCount: 28,
    successRate: 54
    } ]

  );
  // Handlers 
  const handleClassSelect = (classId: string) => {
    navigate(`/teacher/batches/${classId}`);
  }

  const handleStudentSelect = (studentId: string, classId: string) => {
    navigate(`/teacher/students/${studentId}?class=${classId}`);
  }

  const handleNotificationRead = (id: string) => {
    // Mark notification as read 
    toast({ title: "Notification marked as read" });
  }

  const handleMarkAllRead = () => {
    toast({ title: "All notifications marked as read" });
  }

  const handleCreateTest = () => {
    setShowTestWizard(true);
  }

  const handleCreateAssignment = () => {
    navigate('/teacher/assignments/create');
  }

  const handleScheduleClass = () => {
    navigate('/teacher/schedule');
  }

  const handleStartLiveClass = () => {
    navigate('/teacher/live-class');
  }

  const handleBatchOperation = (operation: string) => {
    toast({ 
      title: `Batch ${operation} initiated`, 
      description: "Processing selected items..." 
    });
  }

  const handleTestCreated = (test: any) => {
    toast({ 
      title: "Test created successfully!", 
      description: `${test.questions.length} questions added to the test.` 
    });
    setShowTestWizard(false);
  }

  return (<div className="min-h-screen bg-background fullscreen-layout relative overflow-hidden teacher-dashboard">
      {
    /* Static Gradient Overlays */
    }<div className="fixed inset-0 pointer-events-none"><div className="gradient-overlay gradient-overlay-1" /><div className="gradient-overlay gradient-overlay-2" /><div className="gradient-overlay gradient-overlay-3" /><div className="gradient-overlay gradient-overlay-4" /><div className="gradient-overlay gradient-overlay-5" />
  </div>
      {
    /* Particle System */
    }<div className="fixed inset-0 pointer-events-none"><ParticleSystem type="ambient" particleCount={30} colors={['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B']} emojis={['📚', '🎯', '🏆', '💡', '🚀']} />
  </div>
      {
    /* Test Creation Wizard Modal */
    }<AnimatePresenceWrapper mode="wait">{showTestWizard && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto" ><div className="min-h-screen p-6"><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="max-w-6xl mx-auto bg-background rounded-xl shadow-2xl border p-6" >
    <TestCreationWizard questionBank={questionBank} onCreateTest={handleTestCreated} onCancel={() => setShowTestWizard(false)} />
    </motion.div>
    </div>
  </motion.div> )}
    </AnimatePresenceWrapper><div className="max-w-full mx-auto p-8 space-y-8 relative z-10">
      {
    /* Welcome Header with Gradient Text */
    }<div className="text-center space-y-4 mb-12" ><h1 className="text-6xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent" > Welcome to Your Command Center </h1><p className="text-xl text-muted-foreground max-w-2xl mx-auto"> Empowering educators with intelligent tools, real-time insights, and delightful teaching experiences </p>
      {
    /* Quick Stats Bar */
    }<div className="flex justify-center gap-8 mt-8">
      {[ {label: 'Active Students',value: '245',color: 'text-purple-500'
        }, {label: 'Classes Today',value: '5',color: 'text-blue-500'
        }, {label: 'Pending Reviews',value: '23',color: 'text-orange-500'
        }, {label: 'Avg Performance',value: '78%',color: 'text-green-500'}, ].map((stat) => ( <div key={stat.label} className="text-center" >
    <p className={`text-3xl font-bold ${stat.color}`}>
      {stat.value}
    </p><p className="text-sm text-muted-foreground">
      {stat.label}
    </p>
  </div> ))}
    </div>
  </div>
      {
    /* Main Content Grid */
    }<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {
    /* Teacher Command Center - Full Width on Mobile */
    }<div className="xl:col-span-2"><div className="fullscreen-card p-6">
  <TeacherCommandCenter classes={classes} onClassSelect={handleClassSelect} onStudentSelect={handleStudentSelect} />
  </div>
  </div>
      {
    /* Smart Notifications Panel */
    }
    <div><div className="fullscreen-card p-6 h-full"><SmartNotificationsPanel notifications={notifications} aiInsights={aiInsights} onNotificationRead={handleNotificationRead} onMarkAllRead={handleMarkAllRead} onAction={(id) => console.log('Action:', id)} />
  </div>
  </div>
      {
    /* Performance Overview */
    }
    <div><div className="fullscreen-card p-6 h-full"><h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
  <span>⚡</span> Real-time Performance Analytics </h2>
      {
    /* Performance Charts */
    }<div className="space-y-6">
      {
    /* Class Performance Comparison */
    }<div className="space-y-3">{classes.map((cls) => ( <div key={cls.id} className="relative" ><div className="flex justify-between items-center mb-2"><span className="font-medium">
      {cls.name}
    </span><span className="text-sm text-muted-foreground">
      {cls.averagePerformance}%</span>
    </div><div className="h-8 bg-muted rounded-full overflow-hidden"><div className={`h-full rounded-full ${ cls.averagePerformance >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : cls.averagePerformance >= 60 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-orange-500 to-red-500' }`} style={{ width: `${cls.averagePerformance}%` }} />
    </div><div className="flex justify-between mt-1 text-xs text-muted-foreground">
    <span>
      {cls.students.length} students</span>
    <span>
      {cls.activeNow} active now</span>
    </div>
  </div> ))}
    </div>
      {
    /* AI Insights Summary */
    }<div className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20"><h3 className="font-semibold mb-3 flex items-center gap-2">
  <span>🤖</span> AI Teaching Assistant Says: </h3><p className="text-sm text-muted-foreground">"Your morning classes show 23% better engagement. Consider scheduling challenging topics before noon for optimal results." </p>
  </div>
  </div>
  </div>
  </div>
  </div>
      {
    /* Teaching Resources Grid */
    }<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {[
        {title: 'Question Bank', count: '2,456', icon: '📝', color: 'from-purple-500 to-pink-500', description: 'Curated questions'},
        {title: 'Study Materials', count: '342', icon: '📚', color: 'from-blue-500 to-cyan-500', description: 'Resources uploaded'},
        {title: 'Test Templates', count: '87', icon: '📋', color: 'from-green-500 to-emerald-500', description: 'Ready to use'},
        {title: 'Student Reports', count: '1,234', icon: '📊', color: 'from-orange-500 to-red-500', description: 'Generated this month'}
      ].map((resource) => ( <div key={resource.title} className="fullscreen-card p-6 cursor-pointer" >
    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${resource.color} p-4 mb-4 flex items-center justify-center`}><span className="text-2xl">
      {resource.icon}
    </span>
    </div><h3 className="font-semibold text-lg">
      {resource.title}
    </h3>
    <p className={`text-3xl font-bold mt-2 bg-gradient-to-r ${resource.color} bg-clip-text text-transparent`}>
      {resource.count}
    </p><p className="text-sm text-muted-foreground mt-1">
      {resource.description}
    </p>
  </div> ))}
    </div>
  </div>
      {
    /* Quick Actions Dock */
    }
    <QuickActionsDock onCreateTest={handleCreateTest} onCreateAssignment={handleCreateAssignment} onScheduleClass={handleScheduleClass} onStartLiveClass={handleStartLiveClass} onBatchOperation={handleBatchOperation} scheduleSlots={scheduleSlots} />
  </div>
  )
}

export default TeacherDashboard;
