import React from 'react';
import { motion } from 'framer-motion';
import { cardHoverVariants } from '../motion';
import { cn } from '../../lib/utils';

interface DelightfulCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export const DelightfulCard: React.FC<DelightfulCardProps> = ({
  children,
  className,
  hover = true,
  glow = false,
  gradient = false,
  onClick,
}) => {
  return (
    <motion.div
      className={cn(
        'rounded-xl p-6 backdrop-blur-sm transition-all',
        gradient
          ? 'bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60'
          : 'bg-white/80 dark:bg-gray-800/80',
        glow && 'ring-2 ring-purple-500/20 ring-offset-2 ring-offset-transparent',
        onClick && 'cursor-pointer',
        className
      )}
      variants={hover ? cardHoverVariants : undefined}
      initial="initial"
      whileTap={hover && onClick ? 'tap' : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
