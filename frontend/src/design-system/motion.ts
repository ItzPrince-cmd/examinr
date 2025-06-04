// Motion Design System
import { Variants, Transition } from 'framer-motion';

export const SPRING_CONFIG = {
  gentle: { type: 'spring', stiffness: 100, damping: 15 },
  bouncy: { type: 'spring', stiffness: 300, damping: 20 },
  smooth: { type: 'spring', stiffness: 150, damping: 25 },
  stiff: { type: 'spring', stiffness: 400, damping: 30 },
} as const;

export const EASING = {
  easeOut: [0.16, 1, 0.3, 1],
  easeIn: [0.4, 0, 1, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  anticipate: [0.4, -0.05, 0.2, 1.05],
} as const;

// Page Transition Variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.3,
      ease: EASING.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(4px)',
    transition: {
      duration: 0.2,
      ease: EASING.easeIn,
    },
  },
};

// Fade In Variants
export const fadeInVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: EASING.easeOut,
    },
  },
};

// Stagger Children Variants
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: EASING.easeOut,
    },
  },
};

// Card Hover Variants
export const cardHoverVariants: Variants = {
  initial: {
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    y: -4,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.2,
      ease: EASING.easeOut,
    },
  },
  tap: {
    y: -2,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transition: {
      duration: 0.1,
    },
  },
};

// Button Variants
export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: EASING.easeOut,
    },
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

// Loading Spinner Variants
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

// Blob Animation Variants
export const blobVariants: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 180, 360],
    borderRadius: ['40% 60% 70% 30%', '60% 40% 30% 70%', '40% 60% 70% 30%'],
    transition: {
      duration: 20,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

// Particle Animation
export const particleVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0,
  },
  animate: {
    opacity: [0, 1, 1, 0],
    scale: [0, 1, 1, 0.5],
    y: [0, -100, -200, -300],
    transition: {
      duration: 3,
      ease: EASING.easeOut,
      times: [0, 0.3, 0.7, 1],
    },
  },
};

// Success Animation
export const successVariants: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.2, 1],
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: EASING.anticipate,
    },
  },
};

// Error Shake Animation
export const shakeVariants: Variants = {
  shake: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: 'linear',
    },
  },
};

// Parallax Scroll Configuration
export const parallaxConfig = {
  slow: { speed: 0.5, offset: ['start end', 'end start'] },
  normal: { speed: 0.8, offset: ['start end', 'end start'] },
  fast: { speed: 1.2, offset: ['start end', 'end start'] },
};

// Gesture Animations
export const gestureAnimations = {
  whileTap: { scale: 0.98 },
  whileHover: { scale: 1.02 },
  whileDrag: { scale: 1.05, cursor: 'grabbing' },
};

// Custom Transitions
export const transitions: Record<string, Transition> = {
  spring: SPRING_CONFIG.smooth,
  bounce: SPRING_CONFIG.bouncy,
  smooth: { duration: 0.3, ease: EASING.easeInOut },
  quick: { duration: 0.15, ease: EASING.easeOut },
  slow: { duration: 0.5, ease: EASING.easeInOut },
};
