import React, { useEffect, useRef } from 'react';
import { motion, useAnimate, stagger } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  ArrowRight, 
  Laptop, 
  Tablet, 
  BarChart2, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  Award, 
  MessageSquare, 
  Bell, 
  User, 
  Search, 
  Menu, 
  PieChart, 
  TrendingUp 
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

export function HeroSection() {
  const [scope, animate] = useAnimate();
  
  useEffect(() => {
    if (!scope.current) return;
    
    // Animate the heading text word by word
    const animateText = async () => {
      try {
        const words = scope.current?.querySelectorAll(".headline .word");
        if (words && words.length > 0) {
          await animate(
            ".headline .word",
            { opacity: 1, y: 0 },
            { duration: 0.5, delay: stagger(0.1) }
          );
        }
        
        const subheadline = scope.current?.querySelector(".subheadline");
        if (subheadline) {
          await animate(
            ".subheadline",
            { opacity: 1, y: 0 },
            { duration: 0.5, delay: 0.3 }
          );
        }
        
        const ctaButtons = scope.current?.querySelector(".cta-buttons");
        if (ctaButtons) {
          await animate(
            ".cta-buttons",
            { opacity: 1, y: 0 },
            { duration: 0.5, delay: 0.2 }
          );
        }
      } catch (error) {
        console.error('Animation error:', error);
      }
    };
    
    // Animate devices
    const animateDevices = async () => {
      try {
        const teacherDevice = scope.current?.querySelector(".teacher-device");
        if (teacherDevice) {
          await animate(
            ".teacher-device",
            { opacity: 1, x: 0, rotateY: -10 },
            { duration: 0.7, delay: 0.3 }
          );
        }
        
        const studentDevice = scope.current?.querySelector(".student-device");
        if (studentDevice) {
          await animate(
            ".student-device",
            { opacity: 1, x: 0, rotateY: 10 },
            { duration: 0.7, delay: 0.5 }
          );
        }
      } catch (error) {
        console.error('Device animation error:', error);
      }
    };
    
    // Add a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      animateText();
      animateDevices();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [animate, scope]);
  
  return (
    <div 
      ref={scope} 
      className="min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden"
    >
      {/* Floating gradient orbs in background */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 rounded-full bg-secondary/20 blur-3xl animate-pulse-slow" />
      
      <div className="w-full max-w-[90rem] mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text content */}
        <div className="order-2 lg:order-1 text-center lg:text-left z-10">
          <div className="flex items-center justify-center lg:justify-start mb-6">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl">
              <GraduationCap size={28} />
            </div>
            <span className="ml-3 text-2xl font-bold">
              ExamPrep<span className="text-primary">Pro</span>
            </span>
          </div>
          
          <h1 className="headline text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {["Master", "JEE", "&", "NEET", "Prep", "with", "Ease"].map((word, index) => (
              <motion.span 
                key={index} 
                className="word inline-block mr-4"
                initial={{ opacity: 0, y: 20 }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          
          <motion.p 
            className="subheadline text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
          >
            The most comprehensive platform for students and teachers to excel in competitive exams. 
            Largest question bank with interactive tests and detailed analytics.
          </motion.p>
          
          <motion.div 
            className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
          >
            <Link to="/onboarding">
              <Button 
                className="relative overflow-hidden group bg-gradient-to-r from-primary to-secondary" 
                size="lg"
              >
                <span className="relative z-10 flex items-center">
                  Get Started as Student
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button 
                variant="outline" 
                className="relative overflow-hidden group border-primary" 
                size="lg"
              >
                <span className="relative z-10 flex items-center">
                  Get Started as Teacher
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </Button>
            </Link>
          </motion.div>
        </div>
        
        {/* Device mockups */}
        <div className="order-1 lg:order-2 relative h-[400px] z-10">
          {/* Teacher's laptop */}
          <motion.div 
            className="teacher-device absolute top-0 left-0 w-[80%] h-auto perspective-1000"
            initial={{ opacity: 0, x: -50, rotateY: 0 }}
          >
            <div className="bg-background border border-border shadow-xl rounded-lg overflow-hidden transform rotate-6">
              {/* Browser chrome */}
              <div className="p-2 bg-muted/30 border-b border-border flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <div className="text-xs ml-2 text-muted-foreground">Teacher Dashboard</div>
              </div>
              
              {/* Teacher Dashboard UI */}
              <div className="p-3">
                {/* Top nav */}
                <div className="flex justify-between items-center mb-4 px-2">
                  <div className="flex items-center">
                    <div className="mr-2 p-1 rounded-md bg-secondary/10">
                      <GraduationCap size={16} className="text-secondary" />
                    </div>
                    <div className="text-sm font-semibold">Teacher Portal</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell size={14} className="text-muted-foreground" />
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <User size={12} className="text-primary" />
                    </div>
                  </div>
                </div>
                
                {/* Stats cards */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-muted/20 p-2 rounded-md border border-border">
                    <div className="flex items-center mb-1">
                      <Users size={12} className="text-blue-500 mr-1" />
                      <span className="text-xs">Students</span>
                    </div>
                    <div className="text-lg font-bold">284</div>
                  </div>
                  <div className="bg-muted/20 p-2 rounded-md border border-border">
                    <div className="flex items-center mb-1">
                      <BookOpen size={12} className="text-purple-500 mr-1" />
                      <span className="text-xs">Tests</span>
                    </div>
                    <div className="text-lg font-bold">46</div>
                  </div>
                  <div className="bg-muted/20 p-2 rounded-md border border-border">
                    <div className="flex items-center mb-1">
                      <Award size={12} className="text-green-500 mr-1" />
                      <span className="text-xs">Avg. Score</span>
                    </div>
                    <div className="text-lg font-bold">72%</div>
                  </div>
                </div>
                
                {/* Graph */}
                <div className="bg-muted/20 p-2 rounded-md border border-border mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs font-medium">Class Performance</div>
                    <div className="text-xs text-muted-foreground">Last 7 days</div>
                  </div>
                  <div className="h-16 flex items-end justify-between">
                    {[35, 58, 45, 65, 70, 42, 60].map((value, i) => (
                      <div 
                        key={i} 
                        className="w-[8%] bg-primary/70 rounded-sm" 
                        style={{height: `${value}%`}}
                      ></div>
                    ))}
                  </div>
                </div>
                
                {/* Recent activity */}
                <div className="bg-muted/20 p-2 rounded-md border border-border">
                  <div className="text-xs font-medium mb-2">Recent Submissions</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div>Physics Mock Test</div>
                      <Badge className="text-xs h-4 px-1 bg-green-500/20 text-green-500">92%</Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div>Chemistry Module 3</div>
                      <Badge className="text-xs h-4 px-1 bg-orange-500/20 text-orange-500">68%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Student's tablet */}
          <motion.div 
            className="student-device absolute bottom-0 right-0 w-[60%] h-auto perspective-1000"
            initial={{ opacity: 0, x: 50, rotateY: 0 }}
          >
            <div className="bg-background border border-border shadow-xl rounded-lg overflow-hidden transform -rotate-6">
              {/* Browser chrome */}
              <div className="p-2 bg-muted/30 border-b border-border flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <div className="text-xs ml-2 text-muted-foreground">Student Dashboard</div>
              </div>
              
              {/* Student Dashboard UI */}
              <div className="p-3">
                {/* Top welcome */}
                <div className="mb-3">
                  <div className="text-sm font-semibold">Welcome, Rahul!</div>
                  <div className="text-xs text-muted-foreground">Continue your preparation</div>
                </div>
                
                {/* Progress */}
                <div className="bg-muted/20 p-2 rounded-md border border-border mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs font-medium">Overall Progress</div>
                    <div className="text-xs text-primary">72%</div>
                  </div>
                  <Progress value={72} className="h-1.5" />
                </div>
                
                {/* Today's tasks */}
                <div className="bg-muted/20 p-2 rounded-md border border-border mb-3">
                  <div className="text-xs font-medium mb-2">Today's Schedule</div>
                  <div className="space-y-2">
                    <div className="flex items-center text-xs">
                      <div className="h-3 w-3 rounded-full bg-primary mr-2 flex items-center justify-center">
                        <CheckCircle2 size={8} className="text-white" />
                      </div>
                      <div>Physics Mock Test #4</div>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="h-3 w-3 rounded-full bg-secondary mr-2 flex items-center justify-center">
                        <Clock size={8} className="text-white" />
                      </div>
                      <div>Chemistry Revision</div>
                    </div>
                  </div>
                </div>
                
                {/* Subject Cards */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-blue-500/10 p-2 rounded-md border border-blue-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-medium">Physics</div>
                      <TrendingUp size={10} className="text-blue-500" />
                    </div>
                    <div className="text-[10px] text-muted-foreground">78% mastery</div>
                  </div>
                  <div className="bg-green-500/10 p-2 rounded-md border border-green-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-medium">Chemistry</div>
                      <TrendingUp size={10} className="text-green-500" />
                    </div>
                    <div className="text-[10px] text-muted-foreground">65% mastery</div>
                  </div>
                  <div className="bg-purple-500/10 p-2 rounded-md border border-purple-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-medium">Mathematics</div>
                      <TrendingUp size={10} className="text-purple-500" />
                    </div>
                    <div className="text-[10px] text-muted-foreground">82% mastery</div>
                  </div>
                  <div className="bg-orange-500/10 p-2 rounded-md border border-orange-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-medium">Biology</div>
                      <TrendingUp size={10} className="text-orange-500" />
                    </div>
                    <div className="text-[10px] text-muted-foreground">70% mastery</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <span className="text-sm text-muted-foreground mb-2">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
          <motion.div 
            className="w-1.5 h-1.5 bg-primary rounded-full mt-2"
            animate={{ 
              y: [0, 15, 0], 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}