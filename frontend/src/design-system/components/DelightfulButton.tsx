import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { buttonVariants } from '../motion';
import { useSound } from '../sound';
import { useDesignSystem } from '../theme-context';
import { cn } from '../../lib/utils';

type MotionButtonProps = HTMLMotionProps<'button'>;

interface DelightfulButtonProps extends Omit<MotionButtonProps, 'ref' | 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  ripple?: boolean;
  glow?: boolean;
  haptic?: boolean;
}

export const DelightfulButton: React.FC<DelightfulButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  loading = false,
  ripple = true,
  glow = false,
  haptic = true,
  className,
  onClick,
  disabled,
  ...props
}) => {
  const { playSound } = useSound();
  const { palette } = useDesignSystem();
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Play sound
    playSound('click');

    // Create ripple effect
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { x, y, id: Date.now() };

      setRipples((prev) => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }

    // Haptic feedback
    if (haptic && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }

    // Call original onClick
    if (onClick) {
      onClick(e);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: `bg-primary text-primary-foreground hover:bg-primary/90`,
    secondary: `bg-secondary text-secondary-foreground hover:bg-secondary/80`,
    ghost: `hover:bg-accent hover:text-accent-foreground`,
    danger: `bg-destructive text-destructive-foreground hover:bg-destructive/90`,
    success: `bg-success text-success-foreground hover:bg-success/90`,
  };

  return (
    <motion.button
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden',
        sizeClasses[size],
        variantClasses[variant],
        glow && 'shadow-lg shadow-primary/25',
        className
      )}
      variants={buttonVariants}
      whileTap={!disabled && !loading ? 'tap' : undefined}
      whileHover={!disabled && !loading ? 'hover' : undefined}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute inset-0 rounded-full bg-white/30"
          style={{
            left: ripple.x,
            top: ripple.y,
            transformOrigin: 'center',
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}

      {/* Loading spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-background/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </motion.div>
      )}

      {/* Icon */}
      {icon && <span className="flex-shrink-0">{icon}</span>}

      {/* Children */}
      <span>{children}</span>
    </motion.button>
  );
};