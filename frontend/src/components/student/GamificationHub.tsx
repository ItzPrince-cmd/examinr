import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';

  import {
  Trophy,
  Medal,
  Target,
  Zap,
  Users,
  Timer,
  ChevronUp,
  ChevronDown,
  Swords,
  Gift,
  Star,
  TrendingUp,
  Crown,
  Shield,
  Flame} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { useDesignSystem } from '../../design-system/theme-context';
import { useSound } from '../../design-system/sound';
import { ParticleSystem } from '../../design-system/components/ParticleSystem';

  interface LeaderboardEntry { rank: number;
  previousRank: number;
  userId: string;
  name: string;
  avatar?: string;
  score: number;
  streak: number;
  isCurrentUser: boolean;trend: 'up' | 'down' | 'same'
}

  interface Challenge { id: string;
  title: string;
  description: string;type: 'daily' | 'weekly' | 'special';
  icon: any;
  progress: number;
  total: number;
  reward: string;
  timeLeft?: string;
  multiplier?: number
}

  interface StudyBuddy { id: string;
  name: string;
  avatar?: string;status: 'online' | 'studying' | 'offline';
  subject?: string;
  matchScore: number
}

  interface GamificationHubProps { leaderboard: LeaderboardEntry[];
  challenges: Challenge[];
  studyBuddies: StudyBuddy[];
  onChallengeSelect: (challengeId: string) => void;
  onBuddyConnect: (buddyId: string) => void;
  onVersusChallenge: (opponentId: string) => void
}

  const GamificationHub: React.FC<GamificationHubProps> = memo(({
  leaderboard,
  challenges,
  studyBuddies,
  onChallengeSelect,
  onBuddyConnect,
  onVersusChallenge
    }) => {
  const { playSound } = useSound();const [selectedTab, setSelectedTab] = useState<'leaderboard' | 'challenges' | 'social'>('leaderboard'

  );
  const [showWheel, setShowWheel] = useState(false
  );
  const [wheelResult, setWheelResult] = useState<Challenge | null>(null

  );
    // Leaderboard animations
    const LeaderboardCard = memo(({ entry, index }: { entry: LeaderboardEntry;
    index: number }) => {
    const [isHovered, setIsHovered] = useState(false
    );
      const getRankIcon = (rank: number) => {
      if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;if (rank === 3) return <Medal className="h-5 w-5 text-orange-600" />;return <span className="text-sm font-bold">#{rank}
      </span>
}
const getTrendIcon = (trend: string, change: number) => {if (trend === 'up') return <ChevronUp className="h-4 w-4 text-green-500" />;if (trend === 'down') return <ChevronDown className="h-4 w-4 text-red-500" />;return <span className="h-4 w-4">-</span>
}

    return (<motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className={`relative p-4 rounded-lg border transition-all duration-300 ${ entry.isCurrentUser ? 'bg-primary/10 border-primary shadow-lg shadow-primary/20' : '' }`} ><div className="flex items-center justify-between"><div className="flex items-center gap-4">
      {
    /* Rank */
    }
      <motion.div animate={{
      rotate: entry.rank <= 3 && isHovered ? [0,
      -10,
      10,
      0] : 0,
      scale: entry.rank <= 3 && isHovered ? [1,
      1.2,
      1] : 1}} className="w-12 flex justify-center" >
      {getRankIcon(entry.rank)}
    </motion.div>
      {
    /* User info */
    }<div className="flex items-center gap-3"><div className="relative"><Avatar className={`${entry.rank <= 3 ? 'h-12 w-12' : 'h-10 w-10'} ${ entry.isCurrentUser ? 'ring-2 ring-primary ring-offset-2' : '' }`}>
  <AvatarImage src={entry.avatar} />
  <AvatarFallback>
      {entry.name[0]}
    </AvatarFallback>
  </Avatar>{entry.streak > 7 && ( <motion.div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-1" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} ><Flame className="h-3 w-3 text-white" />
  </motion.div> )}
    </div>
  <div><p className="font-medium">
      {entry.name}
    </p><div className="flex items-center gap-2 text-sm text-muted-foreground">
  <span>
      {entry.score.toLocaleString()} XP</span>
      {entry.streak > 0 && ( <>
    <span>•</span><span className="flex items-center gap-1"><Flame className="h-3 w-3" />
      {entry.streak} days </span>
  </> )}
    </div>
  </div>
  </div>
  </div>
      {
    /* Trend and actions */
    }<div className="flex items-center gap-3"><div className="flex items-center gap-1">
      {
    getTrendIcon(entry.trend,Math.abs(entry.rank - entry.previousRank))} {entry.trend !== 'same' && ( <span className="text-sm text-muted-foreground">
      {Math.abs(entry.rank - entry.previousRank)}
    </span> )}
    </div>{!entry.isCurrentUser && ( <Button size="sm" variant="outline" onClick={() => onVersusChallenge(entry.userId)} className="gap-1" ><Swords className="h-3 w-3" /> VS </Button> )}
    </div>
  </div>
      {
    /* Celebration particles for top 3 */} {entry.rank <= 3 && entry.isCurrentUser && ( <div className="absolute inset-0 pointer-events-none"><ParticleSystem type="ambient" particleCount={20} colors={['#FFD700', '#FFA500']} emojis={['✨', '🎆', '⭐']} />
  </div> )}
    </motion.div>
  )
});
    LeaderboardCard.displayName = 'LeaderboardCard';
    
    // Challenge wheel
    const ChallengeWheel = () => {
      const [rotation, setRotation] = useState(0);
      const [isSpinning, setIsSpinning] = useState(false);
    const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true

    );playSound('spin'

    );
    const randomRotation = 1440 + Math.random() * 1440;
    // 4-8 full rotations 
    const finalRotation = rotation + randomRotation;
    setRotation(finalRotation);
      setTimeout(() => {
      const selectedIndex = Math.floor(Math.random() * challenges.length

      );
      setWheelResult(challenges[selectedIndex]

      );
      setIsSpinning(false

      );playSound('success'

      )
}, 3000

    )
}

  return (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative w-64 h-64 mx-auto" ><motion.div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary p-2" animate={{ rotate: rotation }} transition={{ duration: 3, ease:"easeOut" }} ><div className="relative w-full h-full rounded-full bg-background overflow-hidden">
      {challenges.slice(0, 8).map((challenge, index) => {
      const angle = (360 / 8) * index;

      const Icon = challenge.icon;return (<div key={challenge.id} className="absolute w-1/2 h-1/2 origin-bottom-right" style={{ transform: `rotate(${angle}deg)`, bottom: '50%', right: '50%' }} ><div className="absolute inset-2 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-tl-full flex items-center justify-center"><Icon className="h-6 w-6" style={{ transform: `rotate(-${angle}deg)` }} />
      </div>
      </div>
      )
}
    )
    }
    </div>
  </motion.div>
      {
    /* Center button */
    }<motion.button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary text-white font-bold shadow-lg" whileTap={{ scale: 0.95 }} onClick={spinWheel} disabled={isSpinning} >{isSpinning ? ( <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease:"linear" }} ><Zap className="h-8 w-8 mx-auto" /></motion.div> ) : ( 'SPIN' )}
    </motion.button>
      {
  /* Pointer */
}<div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-primary" />
      </motion.div>
      )
    }

    // Challenge card
    const ChallengeCard = memo(({ challenge }: { challenge: Challenge }) => {
      const Icon = challenge.icon;
      const progress = (challenge.progress / challenge.total) * 100;
      return (<motion.div className="relative" ><Card className="overflow-hidden"><CardContent className="p-4"><div className="flex items-start justify-between mb-3"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${ challenge.type === 'daily' ? 'bg-blue-500/10' : challenge.type === 'weekly' ? 'bg-purple-500/10' : 'bg-yellow-500/10' }`}><Icon className={`h-5 w-5 ${ challenge.type === 'daily' ? 'text-blue-500' : challenge.type === 'weekly' ? 'text-purple-500' : 'text-yellow-500' }`} />
</div>
<div><h4 className="font-medium">
      {challenge.title}
    </h4><p className="text-sm text-muted-foreground">
      {challenge.description}
    </p>
</div>
</div>{challenge.multiplier && challenge.multiplier > 1 && ( <Badge variant="secondary" className="text-xs">
      {challenge.multiplier}x </Badge> )}
    </div><div className="space-y-2"><Progress value={progress} className="h-2" /><div className="flex items-center justify-between text-sm">
<span>
      {challenge.progress}/{challenge.total}
    </span><span className="text-muted-foreground">
      {challenge.reward}
    </span>
</div>
</div>{challenge.timeLeft && ( <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground"><Timer className="h-3 w-3" />
<span>
      {challenge.timeLeft}
    </span>
</div> )}<Button size="sm" variant="outline" className="w-full mt-3" onClick={() => onChallengeSelect(challenge.id)} > Start Challenge </Button>
</CardContent>
</Card>
      {
/* Special effect for nearly complete challenges */} {progress > 80 && ( <motion.div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg opacity-20" animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 2, repeat: Infinity }} /> )}
    </motion.div>
  )
});
    ChallengeCard.displayName = 'ChallengeCard';
    
    // Study buddy card
    const StudyBuddyCard = memo(({ buddy }: { buddy: StudyBuddy }) => {
      const statusColors = {online: 'bg-green-500',studying: 'bg-blue-500',offline: 'bg-gray-400' 
}

      const statusAnimations = { online: { scale: [1, 1.2, 1] }, studying: { opacity: [1, 0.5, 1] }, offline: {} };

      return (<motion.div className="relative p-4 rounded-lg border transition-all" ><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="relative">
<Avatar>
<AvatarImage src={buddy.avatar} />
<AvatarFallback>
      {buddy.name[0]}
    </AvatarFallback>
</Avatar>
<motion.div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${statusColors[buddy.status]}`} animate={statusAnimations[buddy.status]} transition={{ duration: 2, repeat: Infinity }} />
</div>
<div><p className="font-medium">
      {buddy.name}
    </p><p className="text-sm text-muted-foreground">{buddy.subject || 'Available to study'}
    </p>
</div>
</div><div className="flex items-center gap-2"><div className="text-right"><p className="text-sm font-medium">
      {buddy.matchScore}% match</p><div className="flex gap-1 justify-end">{[...Array(5)].map((_, i) => ( <Star key={i} className={`h-3 w-3 ${ i < Math.floor(buddy.matchScore / 20) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300' }`} /> ))}
    </div></div><Button size="sm" variant="outline" onClick={() => onBuddyConnect(buddy.id)} disabled={buddy.status === 'offline'} >{buddy.status === 'studying' ? 'Join' : 'Connect'}
    </Button>
</div>
</div>
      {/* Animated handshake on hover */} {buddy.status === 'online' && ( <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl pointer-events-none" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 180 }} > 🤝 </motion.div> )}
    </motion.div>
  )
});
    StudyBuddyCard.displayName = 'StudyBuddyCard';
    
    return (<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {
/* Tab navigation */}<div className="xl:col-span-3 flex gap-2 p-1 bg-muted rounded-lg relative" style={{ zIndex: 10, position: 'relative' }}>
      {[ {id: 'leaderboard',label: 'Leaderboard',
icon: Trophy 
}, {id: 'challenges',label: 'Challenges',
icon: Target }, { id: 'social', label: 'Study Buddies', icon: Users } ].map((tab) => {
const Icon = tab.icon;return (<Button key={tab.id} variant={selectedTab === tab.id ? 'default' : 'ghost'} className="flex-1 relative" style={{ zIndex: 10, position: 'relative' }} onClick={() => {console.log('Tab clicked:',
  tab.id

  );
  setSelectedTab(tab.id as any

  );playSound('click'

  )
}} ><Icon className="h-4 w-4 mr-2" />
      {tab.label}
    </Button>
  )
}
  )
}
    </div>
      {/* Leaderboard */} {selectedTab === 'leaderboard' && ( <Card className="xl:col-span-3">
<CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-yellow-500" /> Live Leaderboard </CardTitle>
</CardHeader><CardContent className="space-y-2">
      {leaderboard.map((entry, index) => ( <LeaderboardCard key={entry.userId} entry={entry} index={index} /> ))}
    </CardContent>
</Card> )} {/* Challenges */} {selectedTab === 'challenges' && ( <div className="xl:col-span-3 space-y-6">
      {
/* Daily challenge wheel */
}
    <Card>
<CardHeader><CardTitle className="flex items-center gap-2"><Gift className="h-5 w-5 text-purple-500" /> Daily Challenge Wheel </CardTitle>
</CardHeader>
<CardContent>
<ChallengeWheel />{wheelResult && ( <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-primary/10 rounded-lg text-center" ><h4 className="font-bold text-lg">You got: {wheelResult.title}!</h4><p className="text-sm text-muted-foreground mt-1">
      {wheelResult.description}
    </p><Button className="mt-3" onClick={() => onChallengeSelect(wheelResult.id)}> Start Challenge </Button>
</motion.div> )}
    </CardContent>
</Card>
      {
/* Active challenges */
}<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {challenges.map((challenge) => ( <ChallengeCard key={challenge.id} challenge={challenge} /> ))}
    </div>
</div> )} {/* Study Buddies */} {selectedTab === 'social' && ( <Card className="xl:col-span-3">
<CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-blue-500" /> Study Buddy Matching </CardTitle>
</CardHeader><CardContent className="space-y-3"><div className="p-4 bg-muted rounded-lg text-center"><p className="text-sm text-muted-foreground mb-2"> Find study partners based on your subjects and schedule </p><div className="flex justify-center gap-2">
<Badge>Physics</Badge>
<Badge>Chemistry</Badge>
<Badge>Mathematics</Badge>
</div>
</div>
      {studyBuddies.map((buddy) => ( <StudyBuddyCard key={buddy.id} buddy={buddy} /> ))}
    </CardContent>
</Card> )}
    </div>
  )
});GamificationHub.displayName = 'GamificationHub';

export default GamificationHub;
