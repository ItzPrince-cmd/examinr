import React, { useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { GraduationCap, User, Users, ChevronRight, Sparkles, Star, Check } from "lucide-react";

export function CTASection() {
  // Mouse position for the glow effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Handle mouse move for the glow effect
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Create the gradient template for the glow effect
  const studentGlow = useMotionTemplate`
    radial-gradient(
      320px circle at ${mouseX}px ${mouseY}px,
      var(--primary-50) 0%,
      transparent 80%
    )
  `;

  const teacherGlow = useMotionTemplate`
    radial-gradient(
      320px circle at ${mouseX}px ${mouseY}px,
      var(--secondary-50) 0%,
      transparent 80%
    )
  `;

  // Particle explosion effect state
  const [showParticles, setShowParticles] = useState({ student: false, teacher: false });

  // Generate random particles for the explosion effect
  const generateParticles = (count) => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 100 + 50;
      return {
        id: i,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size: Math.random() * 6 + 2,
        opacity: Math.random() * 0.6 + 0.2,
        duration: Math.random() * 0.8 + 0.6,
      };
    });
  };

  const studentParticles = generateParticles(15);
  const teacherParticles = generateParticles(15);

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background" />
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-1/4 left-1/5 w-32 h-32 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-secondary rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/5 w-24 h-24 bg-accent rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="w-full max-w-[90rem] mx-auto px-6 lg:px-8 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <Star className="text-accent w-6 h-6" />
            <span className="text-accent font-medium">Join over 50,000 students and teachers</span>
            <Star className="text-accent w-6 h-6" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ready to <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">Transform</span> the Way You <br />Study or Teach?
          </h2>

          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true }}
          >
            Start your journey with ExamPrep Pro today and experience the difference our intelligent platform makes for your exam preparation.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Student CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setShowParticles({ ...showParticles, student: false })}
            className="relative bg-background rounded-xl border border-primary/20 p-8 overflow-hidden"
          >
            {/* Glow effect */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-0"
              style={{ background: studentGlow }}
            />

            <motion.div className="h-14 w-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <GraduationCap size={30} />
            </motion.div>

            <h3 className="text-2xl font-bold mb-3">For Students</h3>
            <p className="text-muted-foreground mb-6">
              Unlock your full potential with adaptive learning, personalized assessments, and comprehensive analytics.
            </p>

            <div className="space-y-3 mb-6">
              {[
                "15,000+ Practice Questions",
                "Interactive Mock Tests",
                "Personalized Study Plans",
                "Performance Analytics"
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="h-5 w-5 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3">
                    <Check size={12} />
                  </div>
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="relative z-10">
              <Link to="/onboarding">
                <motion.div
                  onMouseEnter={() => setShowParticles({ ...showParticles, student: true })}
                  onMouseLeave={() => setShowParticles({ ...showParticles, student: false })}
                  className="relative"
                >
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-primary-600 text-white group"
                    size="lg"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Sign Up as a Student</span>
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>

                  {/* Particle explosion effect */}
                  {showParticles.student && (
                    <div className="absolute top-1/2 left-1/2">
                      {studentParticles.map((particle) => (
                        <motion.div
                          key={particle.id}
                          className="absolute rounded-full bg-primary"
                          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                          animate={{
                            x: particle.x,
                            y: particle.y,
                            opacity: [0, particle.opacity, 0],
                            scale: [0, 1, 0.5]
                          }}
                          transition={{
                            duration: particle.duration,
                            ease: "easeOut",
                            repeat: Infinity,
                            repeatType: "loop"
                          }}
                          style={{
                            width: particle.size,
                            height: particle.size
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </Link>
            </div>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-xl" />
          </motion.div>

          {/* Teacher CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setShowParticles({ ...showParticles, teacher: false })}
            className="relative bg-background rounded-xl border border-secondary/20 p-8 overflow-hidden"
          >
            {/* Glow effect */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-0"
              style={{ background: teacherGlow }}
            />

            <motion.div className="h-14 w-14 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-6">
              <Users size={30} />
            </motion.div>

            <h3 className="text-2xl font-bold mb-3">For Teachers</h3>
            <p className="text-muted-foreground mb-6">
              Streamline your workflow with advanced test creation tools, comprehensive analytics, and student performance tracking.
            </p>

            <div className="space-y-3 mb-6">
              {[
                "Automated Test Generation",
                "Student Performance Tracking",
                "Detailed Analytics Dashboard",
                "Time-Saving Automation Tools"
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center"
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="h-5 w-5 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mr-3">
                    <Check size={12} />
                  </div>
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="relative z-10">
              <Link to="/onboarding">
                <motion.div
                  onMouseEnter={() => setShowParticles({ ...showParticles, teacher: true })}
                  onMouseLeave={() => setShowParticles({ ...showParticles, teacher: false })}
                  className="relative"
                >
                  <Button
                    className="w-full bg-gradient-to-r from-secondary to-accent text-white group"
                    size="lg"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <span>Join as a Teacher</span>
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>

                  {/* Particle explosion effect */}
                  {showParticles.teacher && (
                    <div className="absolute top-1/2 left-1/2">
                      {teacherParticles.map((particle) => (
                        <motion.div
                          key={particle.id}
                          className="absolute rounded-full bg-secondary"
                          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                          animate={{
                            x: particle.x,
                            y: particle.y,
                            opacity: [0, particle.opacity, 0],
                            scale: [0, 1, 0.5]
                          }}
                          transition={{
                            duration: particle.duration,
                            ease: "easeOut",
                            repeat: Infinity,
                            repeatType: "loop"
                          }}
                          style={{
                            width: particle.size,
                            height: particle.size
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </Link>
            </div>

            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/5 rounded-full blur-xl" />
          </motion.div>
        </div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-xs ring-2 ring-background"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="ml-2 text-sm">
                <span className="font-medium">Trusted by 500+</span> schools and institutions
              </div>
            </div>
            <div className="h-8 border-l border-border"></div>
            <div className="flex items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Sparkles key={star} size={16} className="text-accent" />
                ))}
              </div>
              <div className="ml-2 text-sm">
                <span className="font-medium">4.9/5</span> average rating
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}