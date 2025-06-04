import React from 'react';
import { motion, Variants } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

// Animated Icon Wrapper with different animation types
interface AnimatedIconProps {
  icon: LucideIcon;
  size?: number;
  color?: string;
  animationType?: 'bounce' | 'spin' | 'pulse' | 'shake' | 'rotate' | 'float';
  isActive?: boolean;
  onClick?: () => void;
}

const iconVariants: Record<string, Variants> = {
  bounce: {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 1,
      },
    },
  },
  spin: {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  },
  pulse: {
    initial: { scale: 1, opacity: 1 },
    animate: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 1,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  },
  shake: {
    initial: { x: 0 },
    animate: {
      x: [-5, 5, -5, 5, 0],
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 2,
      },
    },
  },
  rotate: {
    initial: { rotate: 0 },
    animate: {
      rotate: [0, 180, 360],
      transition: {
        duration: 1.5,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 0.5,
      },
    },
  },
  float: {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  },
};

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon: Icon,
  size = 24,
  color = 'currentColor',
  animationType = 'bounce',
  isActive = true,
  onClick,
}) => {
  return (
    <motion.div
      className="inline-flex items-center justify-center cursor-pointer"
      variants={iconVariants[animationType]}
      initial="initial"
      animate={isActive ? 'animate' : 'initial'}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <Icon size={size} color={color} />
    </motion.div>
  );
};

// Subject Mascots with personality
interface SubjectMascotProps {
  subject: 'math' | 'science' | 'english' | 'history' | 'computer';
  size?: number;
  mood?: 'happy' | 'thinking' | 'celebrating';
}

export const SubjectMascot: React.FC<SubjectMascotProps> = ({ 
  subject, 
  size = 80, 
  mood = 'happy' 
}) => {
  const mascots = {
    math: { emoji: '🔢', color: '#8B5CF6' },
    science: { emoji: '🧪', color: '#10B981' },
    english: { emoji: '📚', color: '#3B82F6' },
    history: { emoji: '🏛️', color: '#F59E0B' },
    computer: { emoji: '💻', color: '#EC4899' },
  };

  const moodVariants: Variants = {
    happy: {
      rotate: [-5, 5, -5],
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
    thinking: {
      rotate: [0, -10, 0, 10, 0],
      y: [0, -5, 0],
      transition: {
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
    celebrating: {
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      y: [0, -20, 0],
      transition: {
        duration: 1,
        ease: 'easeOut',
        repeatDelay: 1,
      },
    },
  };

  const mascot = mascots[subject];
  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      style={{ fontSize: size }}
      variants={moodVariants}
      animate={mood}
    >
      <span className="select-none">
        {mascot.emoji}
      </span>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: mascot.color,
          opacity: 0.2,
          filter: 'blur(20px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
};

// Progress Indicator with Liquid Fill
interface LiquidProgressProps {
  progress: number;
  size?: number;
  color?: string;
}

export const LiquidProgress: React.FC<LiquidProgressProps> = ({ 
  progress, 
  size = 100, 
  color = '#3B82F6', 
}) => {
  return (
    <div 
      className="relative overflow-hidden rounded-full bg-gray-200" 
      style={{ width: size, height: size }}
    >
      <motion.div 
        className="absolute bottom-0 left-0 right-0" 
        style={{ backgroundColor: color, height: '100%' }} 
        initial={{ y: size }} 
        animate={{ y: size - (size * progress) / 100 }} 
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        <svg 
          className="absolute top-0 left-0 w-full" 
          style={{ height: 20 }} 
          viewBox="0 0 100 20" 
          preserveAspectRatio="none"
        >
          <motion.path 
            d="M0,10 Q25,0 50,10 T100,10 L100,20 L0,20 Z" 
            fill={color} 
            animate={{
              d: [
                'M0,10 Q25,0 50,10 T100,10 L100,20 L0,20 Z',
                'M0,10 Q25,20 50,10 T100,10 L100,20 L0,20 Z',
                'M0,10 Q25,0 50,10 T100,10 L100,20 L0,20 Z',
              ],
            }} 
            transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }} 
          />
        </svg>
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold" style={{ color }}>
          {progress}%
        </span>
      </div>
    </div>
  );
};

// Achievement Badge with Shine Effect
interface AchievementBadgeProps {
  title: string;
  icon: string;
  unlocked?: boolean;
  size?: number;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  title, 
  icon, 
  unlocked = false, 
  size = 80 
}) => {
  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      initial={{ scale: 0, rotate: -180 }}
      animate={unlocked ? { scale: 1, rotate: 0 } : { scale: 0.8, rotate: 0 }}
      transition={{ duration: 0.5, ease: 'backOut' }}
    >
      <div
        className={`absolute inset-0 rounded-full ${
          unlocked ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-300'
        }`}
      />
      {unlocked && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.5) 50%, transparent 70%)',
            transform: 'translateX(-100%)',
          }}
          animate={{
            transform: ['translateX(-100%)', 'translateX(100%)'],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      )}
      <div className="relative z-10 flex flex-col items-center justify-center text-white">
        <span className="text-3xl mb-1">{icon}</span>
        <span className="text-xs font-medium text-center px-2">{title}</span>
      </div>
    </motion.div>
  );
};