import { useCallback, useEffect, useState } from 'react';
import { useDesignSystem } from '../theme-context';
import { useSound } from '../sound';
import confetti from 'canvas-confetti';

export function useDelightfulInteraction() {
  const { palette } = useDesignSystem();
  const { playSound } = useSound();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const triggerHaptic = useCallback((duration: number | number[] = 10) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  }, []);
  const triggerConfetti = useCallback((options?: confetti.Options) => {
    const defaults: confetti.Options = {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'],
    };
    confetti({ ...defaults, ...options });
  }, []);
  const triggerSuccessAnimation = useCallback(() => {
    playSound('success');
    triggerHaptic(20);
    triggerConfetti({
      particleCount: 150,
      spread: 100,
      startVelocity: 45,
    });
  }, [playSound, triggerHaptic, triggerConfetti]);
  const triggerErrorAnimation = useCallback(() => {
    playSound('error');
    triggerHaptic([50, 30, 50]); // Pattern vibration
  }, [playSound, triggerHaptic]);
  const handleInteractionStart = useCallback(() => {
    setIsPressed(true);
    playSound('click');
    triggerHaptic();
  }, [playSound, triggerHaptic]);
  const handleInteractionEnd = useCallback(() => {
    setIsPressed(false);
  }, []);
  const handleHoverStart = useCallback(() => {
    setIsHovered(true);
    playSound('hover');
  }, [playSound]);
  const handleHoverEnd = useCallback(() => {
    setIsHovered(false);
  }, []);
  return {
    isHovered,
    isPressed,
    palette,
    triggerHaptic,
    triggerConfetti,
    triggerSuccessAnimation,
    triggerErrorAnimation,
    handleInteractionStart,
    handleInteractionEnd,
    handleHoverStart,
    handleHoverEnd,
  };
}

// Hook for time-aware greetings and messages
export function useTimeAwareGreeting(userName?: string) {
  const { timePeriod } = useDesignSystem();
  const getGreeting = useCallback(() => {
    const name = userName ? `, ${userName}` : '';
    switch (timePeriod) {
      case 'morning':
        return `Good morning${name}! ☀️`;
      case 'afternoon':
        return `Good afternoon${name}! 🌤️`;
      case 'evening':
        return `Good evening${name}! 🌅`;
      case 'night':
        return `Hello${name}! 🌙`;
      default:
        return `Hello${name}!`;
    }
  }, [timePeriod, userName]);
  const getMotivationalMessage = useCallback(() => {
    const messages = {
      morning: [
        "Start your day with a fresh mind!",
        "Today is full of possibilities!",
        "Rise and shine, learner!",
      ],
      afternoon: [
        "Keep up the great work!",
        "You're doing amazing!",
        "Stay focused, stay awesome!",
      ],
      evening: [
        "Wind down with some light practice!",
        "Great job today!",
        "Evening study sessions are productive!",
      ],
      night: [
        "Burning the midnight oil?",
        "Night owls learn best!",
        "Late night learning session!",
      ],
    };

    const periodMessages = messages[timePeriod as keyof typeof messages] || messages.morning;
    return periodMessages[Math.floor(Math.random() * periodMessages.length)];
  }, [timePeriod]);
  return {
    greeting: getGreeting(),
    motivationalMessage: getMotivationalMessage(),
    timePeriod,
  };
}
