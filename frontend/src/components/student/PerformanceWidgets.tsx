import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import {
  TrendingUp,
  Clock,
  Flame,
  Star,
  Zap,
  Brain,
  Target,
  Activity,
  BarChart3,
  Sparkles,
  ChevronRight,
  BookOpen,
  Award,
  Timer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useDesignSystem } from '../../design-system/theme-context';
import { useSound } from '../../design-system/sound';

// Play icon component 
const Play = (props: any) => ( 
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

interface SubjectStrength {
  subject: string;
  strength: number; trend: 'up' | 'down' | 'stable';
  topics: {
    mastered: number;
    learning: number;
    notStarted: number
  }
}

interface StudySession {
  date: Date;
  duration: number;
  productivity: number;
  subject: string
}

interface Topic {
  id: string;
  name: string;
  subject: string; status: 'mastered' | 'learning' | 'prerequisite' | 'locked';
  connections: string[];
  position: {
    x: number;
    y: number
  }
}

interface PerformanceWidgetsProps {
  subjectStrengths: SubjectStrength[];
  studySessions: StudySession[];
  topics: Topic[];
  totalStudyTime: number;
  averageScore: number;
  classAverage: number
}

const PerformanceWidgets: React.FC<PerformanceWidgetsProps> = ({
  subjectStrengths,
  studySessions,
  topics,
  totalStudyTime,
  averageScore,
  classAverage
}) => {
  const { palette } = useDesignSystem();
  const { playSound } = useSound();
  const colors = palette;
  const canvasRef = useRef<HTMLCanvasElement>(null

  );
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null

  );
  const [focusTime, setFocusTime] = useState(0
  );
  const [isStudying, setIsStudying] = useState(false
  );
  
  // Subject Strength Radar Chart 
  const RadarChart = () => {
    const [isAnimated, setIsAnimated] = useState(false
    );
  const center = { x: 150, y: 150 };

  const radius = 100;
  const subjects = subjectStrengths.map(s => s.subject

  );
  const angleStep = (2 * Math.PI) / subjects.length;
  useEffect(() => {
    setIsAnimated(true

    )
  }, []);
  const getCoordinates = (value: number, index: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center.x + r * Math.cos(angle),
      y: center.y + r * Math.sin(angle)
    }
  }

  return (
    <div className="relative"><svg width="300" height="300" className="mx-auto">
      {
      /* Grid circles */} {[20, 40, 60, 80, 100].map((value) => (<circle key={value} cx={center.x} cy={center.y} r={(value / 100) * radius} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />))} {
        /* Axes */
      } {subjects.map((_, index) => {
        const angle = angleStep * index - Math.PI / 2;
        const x2 = center.x + radius * Math.cos(angle

        );
        const y2 = center.y + radius * Math.sin(angle

        );
        return (<line key={index} x1={center.x} y1={center.y} x2={x2} y2={y2} stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
        )
      }
      )
      } {
        /* Student performance polygon */
      }
      <motion.polygon points={subjectStrengths.map((s, i) => {
        const coord = getCoordinates(s.strength, i

        ); return `${coord.x},${coord.y}`
      }).join(' ')} fill="url(#strength-gradient)" fillOpacity="0.3" stroke="url(#strength-gradient)" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: isAnimated ? 1 : 0 }} transition={{ duration: 1, ease: "easeOut" }} />
      {
        /* Class average polygon (ghost) */
      }
      <polygon points={subjectStrengths.map((_, i) => {
        const coord = getCoordinates(classAverage, i

        ); return `${coord.x},${coord.y}`
      }).join(' ')} fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="5,5" />
      {
        /* Data points */
      } {subjectStrengths.map((subject, index) => {
        const coord = getCoordinates(subject.strength, index

        );
        return (
          <motion.g key={subject.subject}><motion.circle cx={coord.x} cy={coord.y} r="6" fill={colors.primary.solid} initial={{ scale: 0 }} animate={{ scale: isAnimated ? 1 : 0 }} transition={{ delay: index * 0.1 }} className="cursor-pointer" onClick={() => setSelectedSubject(subject.subject)} />{subject.trend === 'up' && (<motion.text x={coord.x + 10} y={coord.y - 10} fontSize="12" fill="rgb(34 197 94)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} > ↑ </motion.text>)}
          </motion.g>
        )
      }
      )
      } {
        /* Labels */
      } {subjects.map((subject, index) => {
        const angle = angleStep * index - Math.PI / 2;
        const labelRadius = radius + 30;
        const x = center.x + labelRadius * Math.cos(angle

        );
        const y = center.y + labelRadius * Math.sin(angle

        );
        return (<text key={subject} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="14" className="fill-current" >
          {subject}
        </text>
        )
      }
      )
      }
      <defs><linearGradient id="strength-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={colors.primary.solid} /><stop offset="100%" stopColor={colors.primary.dark} />
      </linearGradient>
      </defs>
    </svg>
      {
        /* Legend */
      }<div className="flex justify-center gap-4 mt-4 text-sm"><div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary rounded-full" />
        <span>Your Performance</span>
      </div><div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-current opacity-30" style={{ borderTop: '2px dashed' }} />
          <span>Class Average</span>
        </div>
      </div>
      {
      /* Subject detail popup */} {selectedSubject && (<motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border rounded-lg p-4 shadow-lg z-10" ><h4 className="font-semibold mb-2">
        {selectedSubject}
      </h4>{subjectStrengths.find(s => s.subject === selectedSubject) && (<div className="space-y-2 text-sm"><div className="flex justify-between">
        <span>Mastered</span><span className="font-medium">
          {subjectStrengths.find(s => s.subject === selectedSubject)?.topics.mastered}
        </span>
      </div><div className="flex justify-between">
          <span>Learning</span><span className="font-medium">
            {subjectStrengths.find(s => s.subject === selectedSubject)?.topics.learning}
          </span>
        </div><Button size="sm" className="w-full mt-2" onClick={() => setSelectedSubject(null)} > Close </Button>
      </div>)}
      </motion.div>)}
    </div>
  )
  }

  // Study Time Tracker
  const StudyTimeTracker = () => {
  const hours = Math.floor(totalStudyTime / 60

  );
  const minutes = totalStudyTime % 60;
  const todayStudyTime = studySessions.filter(s => s.date.toDateString() === new Date().toDateString()).reduce((acc, s) => acc + s.duration, 0

  );
  return (<div className="space-y-4">
    {
      /* Circular clock */
    }<div className="relative w-48 h-48 mx-auto"><svg className="w-full h-full -rotate-90"><circle cx="96" cy="96" r="88" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="8" /><motion.circle cx="96" cy="96" r="88" fill="none" stroke="url(#time-gradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 88}`} initial={{ strokeDashoffset: 2 * Math.PI * 88 }} animate={{
      strokeDashoffset: 2 * Math.PI * 88 * (1 - todayStudyTime / 180) /* 3 hour goal */ }} transition={{ duration: 1, ease:"easeOut" }} />
        <defs><linearGradient id="time-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={colors.primary.solid} /><stop offset="100%" stopColor={colors.primary.dark} />
        </linearGradient>
        </defs>
    </svg><div className="absolute inset-0 flex flex-col items-center justify-center"><Clock className="h-8 w-8 mb-2 text-primary" /><div className="text-2xl font-bold">
      {hours}h {minutes}m</div><div className="text-sm text-muted-foreground">Total Study Time</div>
    </div>
  </div>
      {
    /* Productivity flames */
  } <div className="flex justify-center items-center gap-2"><span className="text-sm font-medium">Productivity</span><div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((level) => {
      const avgProductivity = studySessions.reduce((acc, s) => acc + s.productivity, 0) / studySessions.length;
      const isActive = level <= Math.ceil(avgProductivity / 20

      );
      return (
        <motion.div key={level} animate={{
          scale: isActive ? [1,
            1.2,
            1] : 1,
          opacity: isActive ? 1 : 0.3
        }} transition={{
          duration: 2,
          repeat: isActive ? Infinity : 0,
          delay: level * 0.1
        }} ><Flame className={`h-5 w-5 ${isActive ? 'text-orange-500' : 'text-gray-300'}`} />
        </motion.div>
      )
    }
    )
    }
  </div>
  </div>
  {
    /* Study timer */
  } <div className="space-y-2"><Button className="w-full" variant={isStudying ? "destructive" : "default"} onClick={() => {
    setIsStudying(!isStudying

    ); playSound(isStudying ? 'stop' : 'start'

    )
  }} >
    {isStudying ? (<><Timer className="h-4 w-4 mr-2 animate-pulse" /> End Study Session </>) : (<><Play className="h-4 w-4 mr-2" /> Start Study Session </>)}</Button>{isStudying && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-center text-sm text-muted-foreground" > Focus time: {Math.floor(focusTime / 60)}:{(focusTime % 60).toString().padStart(2, '0')}
    </motion.div>)}
  </div>
  {
    /* Break reminder */
} {
    todayStudyTime > 120 && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-yellow-500/10 rounded-lg text-sm text-center" ><p className="flex items-center justify-center gap-2"><Activity className="h-4 w-4 text-yellow-500" /> Time for a break! Stretch and hydrate 💪 </p>
    </motion.div>)
  }
    </div >
    )
}

  // Knowledge Map
  const KnowledgeMap = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d'

  );
  if (!ctx) return;
  const drawMap = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height

    );
    // Draw connections
    topics.forEach((topic) => {
      topic.connections.forEach((connId) => {
    const connectedTopic = topics.find(t => t.id === connId

    );
    if (connectedTopic) {
      ctx.beginPath();
      ctx.moveTo(topic.position.x,
        topic.position.y

      );
      ctx.lineTo(connectedTopic.position.x,
        connectedTopic.position.y

      );
        ctx.strokeStyle = topic.status === 'mastered' ? '#10B981' : '#6B7280';
        ctx.lineWidth = topic.status === 'mastered' ? 2 : 1;
        ctx.stroke();
        }
      })
    });
    
    // Draw nodes
    topics.forEach((topic) => {
      const radius = 20;
      // Node background
      ctx.beginPath();
ctx.arc(topic.position.x, topic.position.y, radius, 0, 2 * Math.PI

);
      if (topic.status === 'mastered') {
        ctx.fillStyle = '#10B981';
      } else if (topic.status === 'learning') {
        ctx.fillStyle = '#3B82F6';
      } else if (topic.status === 'prerequisite') {
        ctx.fillStyle = '#F59E0B';
      } else {
        ctx.fillStyle = '#6B7280';
      }
      ctx.fill();
      
      // Star icon for mastered topics
      if (topic.status === 'mastered') {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⭐', topic.position.x, topic.position.y);
      }
    });
  }

    drawMap();
    
    // Animation loop for pulsing effect
    let animationId: number;
    const animate = () => {
      drawMap();
      animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, [topics]);
  
  return (<div className="relative"><canvas ref={canvasRef} width={400} height={300} className="w-full h-full rounded-lg border" />
  {
    /* Legend */
  }<div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur rounded p-2 text-xs space-y-1"><div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full" />
    <span>Mastered</span>
  </div><div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full" />
      <span>Learning</span>
    </div><div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full" />
      <span>Prerequisite</span>
    </div><div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-500 rounded-full" />
      <span>Locked</span>
    </div>
  </div>
</div>
)
  }

  // Focus timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStudying) {
      interval = setInterval(() => {
        setFocusTime(prev => prev + 1);
      }, 1000);
    } else {
      setFocusTime(0);
    }
    return () => clearInterval(interval);
  }, [isStudying]);
  
  return (<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  {
    /* Subject Strength Radar */
  }<Card className="md:col-span-2 xl:col-span-1">
    <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Subject Strength Analysis </CardTitle>
    </CardHeader>
    <CardContent>
      <RadarChart />
    </CardContent>
  </Card>
  {
    /* Study Time Tracker */
  }
  <Card>
    <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-blue-500" /> Study Time Tracker </CardTitle>
    </CardHeader>
    <CardContent>
      <StudyTimeTracker />
    </CardContent>
  </Card>
  {
    /* Knowledge Map */
  }<Card className="md:col-span-2 xl:col-span-1">
    <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-purple-500" /> Knowledge Constellation </CardTitle>
    </CardHeader>
    <CardContent>
      <KnowledgeMap />
    </CardContent>
  </Card>
</div>
)
}

export default PerformanceWidgets;
