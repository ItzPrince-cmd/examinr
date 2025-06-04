import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { particleVariants } from '../motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji?: string;
  color?: string;
  size?: number;
}

interface ParticleSystemProps {
  type: 'celebration' | 'ambient' | 'interactive';
  particleCount?: number;
  colors?: string[];
  emojis?: string[];
  triggerAnimation?: boolean;
  followMouse?: boolean;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  type,
  particleCount = 20,
  colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'],
  emojis = ['✨', '🌟', '⭐', '💫', '🎯', '📚', '🎓', '🏆'],
  triggerAnimation = false,
  followMouse = false,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse movement for interactive particles
  useEffect(() => {
    if (!followMouse || type !== 'interactive') return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [followMouse, type]);

  // Generate particles
  useEffect(() => {
    if (type === 'ambient') {
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        size: 10 + Math.random() * 20,
      }));
      setParticles(newParticles);
    }
  }, [type, particleCount, emojis]);

  // Handle celebration animation
  useEffect(() => {
    if (type === 'celebration' && triggerAnimation) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors,
      });
    }
  }, [type, triggerAnimation, colors]);

  // Interactive particle generation
  useEffect(() => {
    if (type === 'interactive' && followMouse) {
      const interval = setInterval(() => {
        setParticles((prev) => {
          const newParticle = {
            id: Date.now(),
            x: mousePosition.x,
            y: mousePosition.y,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 5 + Math.random() * 10,
          };

          // Keep only last 20 particles
          return [...prev.slice(-19), newParticle];
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [type, followMouse, mousePosition, colors]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {type === 'ambient' &&
        particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute text-2xl select-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              fontSize: `${particle.size}px`,
            }}
            variants={particleVariants}
            initial="initial"
            animate="ambient"
          >
            {particle.emoji}
          </motion.div>
        ))}

      {type === 'interactive' &&
        particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        ))}
    </div>
  );
};