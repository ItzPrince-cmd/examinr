import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// Performance optimized version
export function BackgroundAnimations({ currentSection }) {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const particlesRef = useRef([]);
  const [isVisible, setIsVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);
    
    const handleChange = (e) => setReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Use Intersection Observer to pause animations when not visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );
    
    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }
    
    return () => {
      if (canvasRef.current) {
        observer.unobserve(canvasRef.current);
      }
    };
  }, []);
  
  // Simplified color schemes
  const colorSchemes = [
    ['rgba(79, 70, 229, 0.2)', 'rgba(147, 51, 234, 0.2)'],
    ['rgba(59, 130, 246, 0.2)', 'rgba(99, 102, 241, 0.2)'],
    ['rgba(147, 51, 234, 0.2)', 'rgba(236, 72, 153, 0.2)'],
    ['rgba(245, 158, 11, 0.2)', 'rgba(249, 115, 22, 0.2)'],
    ['rgba(16, 185, 129, 0.2)', 'rgba(59, 130, 246, 0.2)'],
    ['rgba(244, 63, 94, 0.2)', 'rgba(168, 85, 247, 0.2)']
  ];
  
  // Optimize particle count based on device performance
  const getOptimalParticleCount = useCallback(() => {
    // Check device performance
    const isLowEndDevice = navigator.hardwareConcurrency <= 4;
    const isMobile = window.innerWidth <= 768;
    
    if (reduceMotion) return 0;
    if (isLowEndDevice || isMobile) return 10;
    if (window.innerWidth <= 1280) return 15;
    return 20; // Reduced from 50
  }, [reduceMotion]);
  
  // Initialize particles
  useEffect(() => {
    if (!canvasRef.current || reduceMotion) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Initialize particles
    const particleCount = getOptimalParticleCount();
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: (Math.random() - 0.5) * 0.1,
        colorIndex: Math.floor(Math.random() * 2),
        alpha: 0.2
      });
    }
    
    particlesRef.current = particles;
  }, [getOptimalParticleCount, reduceMotion]);
  
  // Optimized animation loop
  useEffect(() => {
    if (!canvasRef.current || !isVisible || reduceMotion) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    let lastTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;
    
    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      
      if (deltaTime >= frameInterval) {
        lastTime = currentTime;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        const colors = colorSchemes[currentSection] || colorSchemes[0];
        
        particlesRef.current.forEach(particle => {
          // Update position
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          
          // Wrap around edges instead of bouncing (more performant)
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;
          
          // Simple draw without gradients (more performant)
          ctx.fillStyle = colors[particle.colorIndex];
          ctx.globalAlpha = particle.alpha;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        });
        
        ctx.globalAlpha = 1;
      }
      
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animationFrameId.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [currentSection, isVisible, reduceMotion]);
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (reduceMotion) {
    return null; // Don't render animations for users who prefer reduced motion
  }
  
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full opacity-50" 
      />
      
      {/* Simple gradient overlays instead of animated blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-400/10 to-transparent rounded-full blur-3xl" />
      </div>
    </div>
  );
}