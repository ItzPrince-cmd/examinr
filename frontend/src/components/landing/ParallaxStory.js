import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  BarChart2, 
  Award, 
  CheckCircle, 
  Lightbulb, 
  Brain, 
  Zap, 
  PieChart, 
  Trophy, 
  ArrowRight, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  CircleCheckBig 
} from "lucide-react";
import { Badge } from "../ui/badge";

export function ParallaxStory() {
  const containerRef = useRef(null);
  
  // Set up parallax effects based on scroll position
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  // Transform values for parallax layers with reduced movement
  const layer1Y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);
  const layer4Y = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  
  // Rotation and scale for 3D effects
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  // Sample data for better visualization
  const subjectScores = {
    "Physics": { student: 72, class: 68 },
    "Chemistry": { student: 85, class: 75 },
    "Mathematics": { student: 68, class: 70 }
  };
  
  const weaknesses = {
    "Organic Chemistry": "Needs attention",
    "Electromagnetism": "Review suggested"
  };
  
  const strengths = {
    "Coordinate Geometry": "Strong performance"
  };
  
  return (
    <div 
      ref={containerRef} 
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Background gradients and effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/30" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      {/* Floating geometric shapes */}
      <div className="absolute top-1/4 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-xl" />
      <div className="absolute bottom-1/3 right-0 w-60 h-60 bg-secondary/5 rounded-full blur-xl" />
      <div className="absolute top-0 right-1/4 w-20 h-20 bg-accent/10 rounded-full blur-lg" />
      
      {/* Center content - container with better spacing */}
      <div className="w-full px-4 py-20 relative z-10">
        {/* Section header */}
        <motion.div 
          style={{ scale, opacity }} 
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <Badge variant="outline" className="mb-4 bg-accent/10 text-accent border-accent/20 px-4 py-1.5 inline-flex items-center">
            <Brain className="mr-2 h-4 w-4" />
            Our Philosophy
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Connecting <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Students</span> and <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent">Teachers</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            We've built a platform that empowers both students and teachers, creating a seamless educational ecosystem for better learning outcomes and teaching efficiency.
          </p>
        </motion.div>
        
        {/* Main content container - improved spacing */}
        <div className="relative h-[800px] md:h-[900px] w-full max-w-[90rem] mx-auto mt-12 px-6 lg:px-8">
          {/* Central connecting element with animation */}
          <motion.div 
            style={{ rotate: rotation, scale }} 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] md:w-[180px] md:h-[180px] z-40 will-change-transform"
          >
            <motion.div 
              animate={{ 
                boxShadow: [
                  "0 0 30px rgba(79, 70, 229, 0.3)",
                  "0 0 60px rgba(79, 70, 229, 0.6)",
                  "0 0 30px rgba(79, 70, 229, 0.3)"
                ] 
              }} 
              transition={{ duration: 4, repeat: Infinity }} 
              className="w-full h-full bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center"
            >
              <div className="h-[70%] w-[70%] bg-background rounded-full flex items-center justify-center">
                <Zap size={50} className="text-accent" />
              </div>
            </motion.div>
            
            {/* Data flow animations - more visible and prominent */}
            <motion.div 
              className="absolute top-1/2 left-0 -translate-x-[calc(100%+20px)] -translate-y-1/2 w-12 h-8 flex items-center justify-center"
              animate={{ x: ["-200%", "-120%"], opacity: [0, 1, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatType: "loop" }}
            >
              <div className="h-3 w-3 bg-primary rounded-full"></div>
            </motion.div>
            <motion.div 
              className="absolute top-1/2 right-0 translate-x-[calc(100%+20px)] -translate-y-1/2 w-12 h-8 flex items-center justify-center"
              animate={{ x: ["120%", "200%"], opacity: [0, 1, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatType: "loop", delay: 1 }}
            >
              <div className="h-3 w-3 bg-secondary rounded-full"></div>
            </motion.div>
          </motion.div>
          
          {/* Connection lines - improved with thicker strokes and better visibility */}
          <svg className="absolute inset-0 w-full h-full z-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {/* Student to Center - more visible */}
            <path d="M25% 35%, L50% 50%" stroke="url(#grad-primary)" strokeWidth="3" strokeDasharray="6,4" fill="none" />
            {/* Teacher to Center - more visible */}
            <path d="M75% 35%, L50% 50%" stroke="url(#grad-secondary)" strokeWidth="3" strokeDasharray="6,4" fill="none" />
            {/* Student Data to Center - more visible */}
            <path d="M25% 55%, L50% 50%" stroke="url(#grad-primary)" strokeWidth="3" strokeDasharray="6,4" fill="none" />
            {/* Teacher Analytics to Center - more visible */}
            <path d="M75% 55%, L50% 50%" stroke="url(#grad-secondary)" strokeWidth="3" strokeDasharray="6,4" fill="none" />
            {/* Results Connection Path - improved with animation */}
            <motion.path 
              d="M25% 75%, L50% 75%, L75% 75%" 
              stroke="url(#grad-accent)" 
              strokeWidth="4" 
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
              viewport={{ once: true }}
            />
            <defs>
              <linearGradient id="grad-primary" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="grad-secondary" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="grad-accent" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="1" />
                <stop offset="50%" stopColor="var(--secondary)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* STUDENT SIDE - LEFT COLUMN - positioned with better balance */}
          {/* Student main card */}
          <motion.div 
            style={{ y: layer1Y }} 
            className="absolute top-[15%] left-[12%] w-[320px] md:w-[350px] z-20 will-change-transform"
          >
            <div className="bg-gradient-to-br from-primary/80 to-primary rounded-2xl p-1">
              <div className="bg-background rounded-xl p-6 space-y-4">
                <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-3">
                  <GraduationCap size={24} />
                </div>
                <h3 className="text-xl font-bold">For Students</h3>
                <p className="text-sm text-muted-foreground">
                  Access comprehensive study materials, practice tests, and personalized analytics to ace your exams.
                </p>
                <div className="space-y-2 pt-2">
                  {[
                    "Personalized learning path",
                    "Interactive practice sessions",
                    "Performance tracking",
                    "Mock test simulations"
                  ].map((feature, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <CheckCircle size={14} className="text-primary mr-2" />
                      <span className="text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Student analytics card - better positioning */}
          <motion.div 
            style={{ y: layer2Y }} 
            className="absolute top-[48%] left-[15%] w-[280px] md:w-[300px] z-30 will-change-transform"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-background rounded-lg shadow-lg border border-border p-4"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center">
                  <BarChart2 size={16} className="text-primary mr-2" />
                  <span className="font-medium text-sm">Student Performance</span>
                </div>
                <Badge className="bg-primary/10 text-primary border-none text-xs">Rahul S.</Badge>
              </div>
              <div className="space-y-3">
                {Object.entries(subjectScores).map(([subject, scores], index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs">{subject}</span>
                      <div className="flex items-center text-xs font-medium">
                        <span className="text-primary">{scores.student}%</span>
                        {scores.student > scores.class ? (
                          <ArrowUpRight size={12} className="text-green-500 ml-1" />
                        ) : scores.student < scores.class ? (
                          <ArrowDownRight size={12} className="text-red-500 ml-1" />
                        ) : (
                          <span className="text-yellow-500 ml-1">→</span>
                        )}
                      </div>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full">
                      <div 
                        className={`h-full rounded-full ${
                          subject === "Physics" ? "bg-blue-500" : 
                          subject === "Chemistry" ? "bg-green-500" : "bg-purple-500"
                        }`}
                        style={{ width: `${scores.student}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">Last 30 days</span>
                <div className="flex items-center text-xs font-medium text-green-500">
                  <TrendingUp size={12} className="mr-1" />
                  <span>+12% improvement</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* TEACHER SIDE - RIGHT COLUMN - better positioning */}
          {/* Teacher main card */}
          <motion.div 
            style={{ y: layer3Y }} 
            className="absolute top-[15%] right-[12%] w-[320px] md:w-[350px] z-20 will-change-transform"
          >
            <div className="bg-gradient-to-br from-secondary/80 to-secondary rounded-2xl p-1">
              <div className="bg-background rounded-xl p-6 space-y-4">
                <div className="h-10 w-10 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center mb-3">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold">For Teachers</h3>
                <p className="text-sm text-muted-foreground">
                  Create custom test papers, track student performance, and optimize your teaching with data-driven insights.
                </p>
                <div className="space-y-2 pt-2">
                  {[
                    "Automated test creation",
                    "Comprehensive analytics",
                    "Performance tracking",
                    "Targeted intervention tools"
                  ].map((feature, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <CheckCircle size={14} className="text-secondary mr-2" />
                      <span className="text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Teacher analytics card - better positioning */}
          <motion.div 
            style={{ y: layer4Y }} 
            className="absolute top-[48%] right-[15%] w-[280px] md:w-[300px] z-30 will-change-transform"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-background rounded-lg shadow-lg border border-border p-4"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center">
                  <Lightbulb size={16} className="text-secondary mr-2" />
                  <span className="font-medium text-sm">Class Insights</span>
                </div>
                <Badge className="bg-secondary/10 text-secondary border-none text-xs">24 Students</Badge>
              </div>
              <div className="space-y-3">
                {Object.entries(subjectScores).map(([subject, scores], index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs">{subject}</span>
                      <span className="text-xs font-medium">{scores.class}% avg</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full">
                      <div 
                        className={`h-full rounded-full opacity-70 ${
                          subject === "Physics" ? "bg-blue-500" : 
                          subject === "Chemistry" ? "bg-green-500" : "bg-purple-500"
                        }`}
                        style={{ width: `${scores.class}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground flex justify-between mt-3 pt-2 border-t border-border">
                <span>JEE Advanced Batch</span>
                <div className="flex items-center text-xs font-medium text-secondary">
                  <span>Last week</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* RESULTS & INSIGHTS (CENTER BOTTOM) - improved title and visibility */}
          {/* Comparative Analysis Card */}
          <motion.div 
            style={{ 
              y: useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]), 
            }} 
            className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[80%] max-w-4xl z-20 will-change-transform"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              viewport={{ once: true }}
              className="bg-background rounded-lg shadow-lg border-2 border-accent/30 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Trophy size={24} className="text-accent" />
                </div>
                <div>
                  <h4 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Connected Learning Outcomes</h4>
                  <p className="text-sm text-muted-foreground">How student and teacher insights work together</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-red-500/10 dark:bg-red-900/10 rounded-lg p-4 border border-red-500/20 dark:border-red-900/30">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center mr-2">
                      <ArrowDownRight size={16} className="text-red-500" />
                    </div>
                    <div>
                      <div className="font-medium text-red-600 dark:text-red-400">Needs Attention</div>
                      <div className="text-sm text-red-500 dark:text-red-300">Organic Chemistry</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-background/50 p-2 rounded-md">
                    <ArrowRight size={12} className="text-red-500 mt-1 shrink-0" />
                    <p className="text-xs">Teacher receives alerts and can provide targeted support with personalized resources</p>
                  </div>
                </div>
                
                <div className="bg-yellow-500/10 dark:bg-yellow-900/10 rounded-lg p-4 border border-yellow-500/20 dark:border-yellow-900/30">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center mr-2">
                      <ArrowRight size={16} className="text-yellow-500" />
                    </div>
                    <div>
                      <div className="font-medium text-yellow-600 dark:text-yellow-400">Review Suggested</div>
                      <div className="text-sm text-yellow-500 dark:text-yellow-300">Electromagnetism</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-background/50 p-2 rounded-md">
                    <ArrowRight size={12} className="text-yellow-500 mt-1 shrink-0" />
                    <p className="text-xs">Both student and teacher collaborate on reinforcement through focused practice sessions</p>
                  </div>
                </div>
                
                <div className="bg-green-500/10 dark:bg-green-900/10 rounded-lg p-4 border border-green-500/20 dark:border-green-900/30">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                      <ArrowUpRight size={16} className="text-green-500" />
                    </div>
                    <div>
                      <div className="font-medium text-green-600 dark:text-green-400">Strong Performance</div>
                      <div className="text-sm text-green-500 dark:text-green-300">Coordinate Geometry</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-background/50 p-2 rounded-md">
                    <ArrowRight size={12} className="text-green-500 mt-1 shrink-0" />
                    <p className="text-xs">Student receives advanced material while teachers can focus on other areas</p>
                  </div>
                </div>
              </div>
              
              {/* Results - improved with glow effect */}
              <motion.div 
                className="flex justify-between items-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-4 rounded-lg border border-accent/20"
                initial={{ opacity: 0.6 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                animate={{ 
                  boxShadow: [
                    "0 0 10px rgba(124, 58, 237, 0.1)",
                    "0 0 20px rgba(124, 58, 237, 0.2)",
                    "0 0 10px rgba(124, 58, 237, 0.1)"
                  ] 
                }}
                transition={{ 
                  opacity: { delay: 0.9 },
                  boxShadow: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                }}
              >
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mr-3">
                    <CircleCheckBig size={24} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Average improvement rate</div>
                    <div className="text-2xl font-bold text-accent">+28%</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Outcomes</div>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge className="bg-blue-500/10 text-blue-500 border-none">Higher Scores</Badge>
                    <Badge className="bg-purple-500/10 text-purple-500 border-none">Effective Teaching</Badge>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Bottom message */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-lg font-medium">
            Join thousands of students and teachers who are already experiencing the ExamPrep difference
          </p>
        </motion.div>
      </div>
    </div>
  );
}