import React from 'react';
import { AnimatePresence } from 'framer-motion';

interface AnimatePresenceWrapperProps {
  children: React.ReactNode;
  mode?: 'wait' | 'sync' | 'popLayout';
}

export const AnimatePresenceWrapper: React.FC<AnimatePresenceWrapperProps> = ({
  children,
  mode = 'wait',
}) => {
  // Type assertion to fix TypeScript issue with React 18 
  const AnimatePresenceAny = AnimatePresence as any;
  return <AnimatePresenceAny mode={mode}>{children}</AnimatePresenceAny>;
};
