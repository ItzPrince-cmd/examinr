import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

  import {
  Trophy,
  Star,
  Zap,
  Target,
  Brain,
  Flame,
  Crown,
  Medal,
  Sparkles} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ParticleSystem } from '../../design-system/components/ParticleSystem';

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

  interface AchievementShowcaseProps { trophies: Trophy[];
  currentStreak: number;
  longestStreak: number;
  streakHistory: StreakDay[];
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number
}

  const AchievementShowcase: React.FC<AchievementShowcaseProps> = ({
  trophies = [],
  currentStreak,
  longestStreak,
  streakHistory = [],
  currentLevel,
  currentXP,
  nextLevelXP
    }) => {
  const [selectedTrophy, setSelectedTrophy] = useState<Trophy | null>(null

  );
  const [showLevelUp, setShowLevelUp] = useState(false
  );
  // Rarity colors and effects
  const rarityConfig = {
    common: {
      color: 'from-gray-400 to-gray-600',
      glow: 'shadow-gray-400/50',
      particles: ['#9CA3AF']
    },
    rare: {
      color: 'from-blue-400 to-blue-600',
      glow: 'shadow-blue-400/50',
      particles: ['#60A5FA','#3B82F6']
    },
    epic: {
      color: 'from-purple-400 to-purple-600',
      glow: 'shadow-purple-400/50',
      particles: ['#A78BFA','#8B5CF6']
    },
    legendary: {
      color: 'from-yellow-400 to-orange-500',
      glow: 'shadow-yellow-400/50',
      particles: ['#FCD34D','#F59E0B','#FF6347']
    }
  };

  // 3D Trophy Component
  const Trophy3D = ({ trophy, index }: {
    trophy: Trophy;
    index: number;
  }) => {
    const [isHovered, setIsHovered] = useState(false
    );

    const Icon = trophy.icon;
    const config = rarityConfig[trophy.rarity];
    return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: index * 0.1
      }}
      onClick={() => setSelectedTrophy(trophy)} 
      className="relative cursor-pointer"
    >
      {
    /* Trophy base */
    }<div className={`relative w-24 h-32 rounded-lg bg-gradient-to-br ${config.color} p-1 ${isHovered ? `shadow-2xl ${config.glow}` : 'shadow-lg'} transition-all duration-300`}><div className="w-full h-full bg-background/90 rounded-lg flex flex-col items-center justify-center p-2">
      <motion.div animate={{
      rotate: isHovered ? [0,
      -10,
      10,
      -10,
      10,
      0] : 0,
      scale: isHovered ? 1.2 : 1}} transition={{ duration: 0.5 }} ><Icon className="h-10 w-10 mb-2" style={{ filter: `drop-shadow(0 0 10px ${trophy.rarity === 'legendary' ? '#FCD34D' : '#fff'})` }} />
  </motion.div><p className="text-xs font-medium text-center line-clamp-2">
      {trophy.name}
    </p>
  </div>
  </div>
      {/* Particle effects for rare+ trophies */} {isHovered && trophy.rarity !== 'common' && ( <div className="absolute inset-0 pointer-events-none"><ParticleSystem type="celebration" particleCount={20} colors={config.particles} triggerAnimation={true} />
    </div> )} {
    /* Unlock progress */} {!trophy.unlockedAt && trophy.progress !== undefined && trophy.total !== undefined && ( <div className="absolute -bottom-2 left-0 right-0 mx-2"><Progress value={(trophy.progress / trophy.total) * 100} className="h-1" /><p className="text-[10px] text-center mt-1">
      {trophy.progress}/{trophy.total}
    </p>
  </div> )}
    </motion.div>
  )
}

  // Level Progress with RPG styling
  const LevelProgress = () => {
  const progress = (currentXP / nextLevelXP) * 100;
  const xpNeeded = nextLevelXP - currentXP;
  return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative" ><div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><Crown className="h-6 w-6 text-yellow-500" /><span className="text-2xl font-bold">Level {currentLevel}
    </span>
  </div><Badge variant="secondary" className="text-sm">
      {currentXP} / {nextLevelXP} XP </Badge>
  </div><div className="relative h-8 bg-muted rounded-full overflow-hidden"><motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 to-orange-500" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease:"easeOut" }} ><div className="absolute inset-0 bg-white/20 animate-pulse" /><motion.div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-6 bg-white/50 rounded-full" animate={{ x: [0, -5, 0] }} transition={{ duration: 1, repeat: Infinity }} />
  </motion.div><div className="absolute inset-0 flex items-center justify-center"><span className="text-sm font-medium">
      {xpNeeded} XP to next level</span>
  </div>
  </div>
      {
    /* Level up animation */} {showLevelUp && ( <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none" ><div className="text-4xl font-bold text-yellow-500">LEVEL UP! 🎉</div><ParticleSystem type="celebration" particleCount={50} colors={['#FCD34D', '#F59E0B', '#FF6347']} triggerAnimation={true} />
  </motion.div> )}
    </motion.div>
    );
  };

  // Default trophies if none provided
  const defaultTrophies: Trophy[] = [
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
      progress: currentStreak,
      total: 30
    }
  ];
  const displayTrophies = trophies.length > 0 ? trophies : defaultTrophies;
  
  return (
    <div className="space-y-6">
      {
  /* Trophy Shelf */
}<Card className="p-6"><h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Trophy className="h-6 w-6 text-yellow-500" /> Trophy Collection </h3><div className="grid grid-cols-3 md:grid-cols-6 gap-4">
      {displayTrophies.map((trophy, index) => ( <Trophy3D key={trophy.id} trophy={trophy} index={index} /> ))}
    </div>
</Card>
      {
  /* Level Progress */
}<Card className="p-6">
<LevelProgress />
</Card>
      {
  /* Trophy Detail Modal */} {selectedTrophy && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTrophy(null)} ><motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-background rounded-lg p-6 max-w-md w-full" ><div className="flex items-center gap-4 mb-4">
  <div className={`p-4 rounded-lg bg-gradient-to-br ${rarityConfig[selectedTrophy.rarity].color}`}><selectedTrophy.icon className="h-12 w-12 text-white" />
  </div>
  <div><h3 className="text-2xl font-bold">
      {selectedTrophy.name}
    </h3>
  <Badge className={`bg-gradient-to-r ${rarityConfig[selectedTrophy.rarity].color} text-white`}>
      {selectedTrophy.rarity.toUpperCase()}
    </Badge>
  </div>
  </div><p className="text-muted-foreground mb-4">
      {selectedTrophy.description}
    </p>{selectedTrophy.unlockedAt ? ( <p className="text-sm text-green-500"> ✅ Unlocked on {selectedTrophy.unlockedAt.toLocaleDateString()}
    </p> ) : ( <div><Progress value={(selectedTrophy.progress! / selectedTrophy.total!) * 100} className="mb-2" /><p className="text-sm text-muted-foreground"> Progress: {selectedTrophy.progress} / {selectedTrophy.total}
    </p>
  </div> )}
    </motion.div>
</motion.div> )}
    </div>
  )
}

export default AchievementShowcase;
