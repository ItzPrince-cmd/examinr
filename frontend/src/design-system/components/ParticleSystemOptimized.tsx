import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface ParticleSystemProps {
  type: 'celebration' | 'ambient' | 'interactive';
  particleCount?: number;
  colors?: string[];
  emojis?: string[];
  triggerAnimation?: boolean;
  followMouse?: boolean;
}

// Memoized particle component for better performance
const Particle = React.memo(({ particle, type }: any) => {
  if (type === 'ambient') {
    return (
      <div
        className="absolute select-none opacity-20"
        style={{
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          fontSize: `${particle.size * 16}px`,
          transform: `translateY(${particle.offset}px)`,
        }}
      >
        {particle.emoji}
      </div>
    );
  }
  return null;
});

Particle.displayName = 'Particle';

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  type,
  particleCount = 10,
  colors = ['#8B5CF6', '#3B82F6'],
  emojis = ['✨', '🌟', '⭐'],
  triggerAnimation = false,
  followMouse = false,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Check device performance
  const isLowEndDevice = useMemo(() => {
    return navigator.hardwareConcurrency <= 4 || window.innerWidth <= 768;
  }, []);

  // Optimize particle count based on device
  const optimizedParticleCount = useMemo(() => {
    if (prefersReducedMotion) return 0;
    if (isLowEndDevice) return Math.min(5, particleCount);
    return Math.min(10, particleCount);
  }, [particleCount, prefersReducedMotion, isLowEndDevice]);

  // Generate static particles for ambient type
  const particles = useMemo(() => {
    if (type !== 'ambient' || optimizedParticleCount === 0) return [];
    return Array.from({ length: optimizedParticleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      size: 0.5 + Math.random() * 0.5,
      offset: Math.random() * 100,
    }));
  }, [type, optimizedParticleCount, emojis]);

  // Use Intersection Observer to pause when not visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Simple CSS animation for ambient particles
  useEffect(() => {
    if (type !== 'ambient' || !isVisible || optimizedParticleCount === 0) return;

    let offset = 0;
    const animate = () => {
      offset += 0.5;
      if (containerRef.current) {
        const particleElements = containerRef.current.querySelectorAll('.particle');
        particleElements.forEach((el, i) => {
          const htmlEl = el as HTMLElement;
          const baseOffset = particles[i]?.offset || 0;
          htmlEl.style.transform = `translateY(${Math.sin(offset * 0.01 + baseOffset) * 20}px)`;
        });
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation with a delay to improve initial load
    const timeoutId = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [type, isVisible, particles, optimizedParticleCount]);

  // Don't render anything for celebration type (remove confetti for performance)
  if (type === 'celebration' || prefersReducedMotion || optimizedParticleCount === 0) {
    return null;
  }

  // Don't render interactive particles (too performance heavy)
  if (type === 'interactive') {
    return null;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div key={particle.id} className="particle">
          <Particle particle={particle} type={type} />
        </div>
      ))}
    </div>
  );
};