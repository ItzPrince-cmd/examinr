import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  BarChart2, 
  LineChart, 
  PieChart, 
  Users, 
  BookOpen, 
  Clock, 
  BarChart, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles, 
  ChevronRight, 
  CircleDashed, 
  CircleCheck, 
  CircleX, 
  GraduationCap, 
  Layers, 
  FileText 
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

export function DashboardPreview({ scrollProgress }) {
  const containerRef = useRef(null);
  const [activeView, setActiveView] = useState("student");
  
  // Create local scrolling effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  // Transform values for animations
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0, 0.3], [40, 0]);
  
  // Dashboard animations
  const dashboardScale = useTransform(scrollYProgress, [0.3, 0.6, 1], [0.9, 1, 0.95]);
  const dashboardOpacity = useTransform(scrollYProgress, [0.3, 0.6, 0.9], [0.6, 1, 0.8]);
  
  // Ensure the state update function handles the view toggle correctly
  const handleViewChange = (view) => {
    setActiveView(view);
  };
  
  // Data for visualizations
  const studentPerformanceData = [65, 40, 75, 55, 90, 60, 80];
  const subjectScores = { Physics: 75, Chemistry: 82, Mathematics: 68 };
  
  // Teacher dashboard data
  const classPerformanceData = [45, 55, 70, 60, 65, 75, 80];
  const submissionRate = 92;
  const averageScore = 72;
  
  return (
    <div 
      ref={containerRef} 
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/30" />
      <div className="absolute -top-20 left-1/3 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />
      
      <div className="w-full max-w-[90rem] mx-auto px-6 lg:px-8">
        {/* Section header */}
        <motion.div 
          style={{ opacity: titleOpacity, y: titleY }} 
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 bg-accent/10 text-accent border-accent/20 px-4 py-1.5 inline-flex items-center">
            <Sparkles className="mr-2 h-4 w-4" />
            Interactive Dashboards
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Powerful <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">Analytics</span> For Everyone
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Intuitive dashboards provide real-time insights for both students and teachers. 
            Track progress, identify strengths and weaknesses, and make data-driven decisions.
          </p>
          
          {/* Dashboard selector tabs */}
          <div className="flex justify-center gap-4 mb-8">
            <motion.button 
              className={`px-6 py-2.5 rounded-full text-sm font-medium flex items-center ${
                activeView === "student" 
                  ? "bg-primary text-white shadow-md" 
                  : "bg-muted text-muted-foreground"
              }`}
              onClick={() => handleViewChange("student")}
              whileTap={{ scale: 0.97 }}
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Student View
            </motion.button>
            <motion.button 
              className={`px-6 py-2.5 rounded-full text-sm font-medium flex items-center ${
                activeView === "teacher" 
                  ? "bg-secondary text-white shadow-md" 
                  : "bg-muted text-muted-foreground"
              }`}
              onClick={() => handleViewChange("teacher")}
              whileTap={{ scale: 0.97 }}
            >
              <Users className="mr-2 h-4 w-4" />
              Teacher View
            </motion.button>
          </div>
        </motion.div>
        
        {/* Dashboard Preview */}
        <motion.div 
          style={{ scale: dashboardScale, opacity: dashboardOpacity }} 
          className="relative mx-auto will-change-transform"
        >
          <AnimatePresence mode="wait">
            {activeView === "student" ? (
              <motion.div 
                key="student-dashboard" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }} 
                transition={{ duration: 0.5 }} 
                className="bg-background border border-border rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-3 bg-muted/30 border-b border-border flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  </div>
                  <div className="text-sm font-medium">Student Dashboard</div>
                  <div></div>
                </div>
                <div className="p-6">
                  {/* Student Dashboard Content */}
                  <div className="grid grid-cols-12 gap-6">
                    {/* Left column - Stats and progress */}
                    <div className="col-span-12 md:col-span-8">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h3 className="text-xl font-bold">Welcome back, Aryan!</h3>
                          <p className="text-sm text-muted-foreground">Track your progress and improve your scores</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-500/10 text-blue-500 border-none">
                            <Award size={14} className="mr-1" />
                            Rank: 42
                          </Badge>
                          <Badge className="bg-green-500/10 text-green-500 border-none">
                            <CheckCircle2 size={14} className="mr-1" />
                            2 Tests Completed Today
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Performance trend */}
                      <div className="bg-muted/30 p-4 rounded-lg border border-border mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Your Performance Trend</h4>
                          <Badge variant="outline" className="text-xs">Last 7 Tests</Badge>
                        </div>
                        <div className="h-[180px] flex items-end justify-between gap-2 pt-4 pb-2 px-2">
                          {studentPerformanceData.map((value, index) => (
                            <motion.div 
                              key={index} 
                              className="relative group"
                              initial={{ height: 0 }}
                              animate={{ height: `${value}%` }}
                              transition={{ 
                                delay: index * 0.1, 
                                duration: 0.5, 
                                type: "spring", 
                                stiffness: 100 
                              }}
                            >
                              <div 
                                className={`w-10 rounded-t-sm ${
                                  value >= 75 ? "bg-green-500" : 
                                  value >= 50 ? "bg-orange-500" : "bg-red-500"
                                }`}
                                style={{ height: "100%" }}
                              />
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {value}%
                              </div>
                              <div className="text-xs text-muted-foreground mt-2">
                                Test {index + 1}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Subject scores */}
                      <div className="bg-muted/30 p-4 rounded-lg border border-border">
                        <h4 className="font-medium mb-4">Subject Performance</h4>
                        <div className="space-y-4">
                          {Object.entries(subjectScores).map(([subject, score], index) => (
                            <div key={subject}>
                              <div className="flex justify-between items-center mb-2">
                                <div className="text-sm font-medium">{subject}</div>
                                <div className="text-sm">{score}%</div>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div 
                                  className={`h-full rounded-full ${
                                    score >= 75 ? "bg-green-500" : 
                                    score >= 60 ? "bg-orange-500" : "bg-red-500"
                                  }`}
                                  initial={{ width: "0%" }}
                                  animate={{ width: `${score}%` }}
                                  transition={{ 
                                    delay: index * 0.2 + 0.5, 
                                    duration: 0.8, 
                                    type: "spring" 
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right column - Recent tests and recommended practice */}
                    <div className="col-span-12 md:col-span-4 space-y-6">
                      {/* Recent tests */}
                      <div className="bg-muted/30 p-4 rounded-lg border border-border">
                        <h4 className="font-medium mb-3">Recent Tests</h4>
                        <div className="space-y-3 max-h-[180px] overflow-y-auto custom-scrollbar">
                          {[
                            { name: "JEE Mock Test 3", score: 85, date: "Today" },
                            { name: "Physics Unit Test", score: 72, date: "Yesterday" },
                            { name: "Chemistry Quiz", score: 65, date: "3 days ago" }
                          ].map((test, index) => (
                            <motion.div 
                              key={index} 
                              className="bg-background p-3 rounded-md border border-border"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 + 0.5 }}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium text-sm">{test.name}</div>
                                  <div className="text-xs text-muted-foreground">{test.date}</div>
                                </div>
                                <Badge 
                                  className={`
                                    ${test.score >= 80 ? "bg-green-500/10 text-green-500" : ""}
                                    ${test.score >= 60 && test.score < 80 ? "bg-orange-500/10 text-orange-500" : ""}
                                    ${test.score < 60 ? "bg-red-500/10 text-red-500" : ""}
                                  `}
                                >
                                  {test.score}%
                                </Badge>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        <Button variant="ghost" size="sm" className="w-full mt-3 text-xs">
                          View All Tests <ChevronRight size={14} />
                        </Button>
                      </div>
                      
                      {/* Practice recommendations */}
                      <div className="bg-muted/30 p-4 rounded-lg border border-border">
                        <h4 className="font-medium mb-3">Recommended Practice</h4>
                        <div className="space-y-3">
                          {[
                            { topic: "Organic Chemistry", reason: "Needs improvement", difficulty: "Medium" },
                            { topic: "Calculus", reason: "Strengthen concept", difficulty: "Hard" }
                          ].map((rec, index) => (
                            <motion.div 
                              key={index} 
                              className="bg-primary/5 p-3 rounded-md border border-primary/20"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.15 + 0.8 }}
                            >
                              <div className="font-medium text-sm">{rec.topic}</div>
                              <div className="text-xs text-muted-foreground mb-2">{rec.reason}</div>
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className="text-xs">{rec.difficulty}</Badge>
                                <div className="text-primary text-xs font-medium cursor-pointer">Practice Now</div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Study streak */}
                      <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-4 rounded-lg border border-primary/20">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">Your Study Streak</h4>
                          <Badge className="bg-accent text-white border-none">5 Days</Badge>
                        </div>
                        <div className="flex justify-between mb-1">
                          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div className="text-xs text-muted-foreground mb-1">{day}</div>
                              <div 
                                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                  index < 5 ? "bg-accent text-white" : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {index < 5 ? <CheckCircle2 size={14} /> : <CircleDashed size={14} />}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-center mt-2">Keep it up! 2 more days to beat your record.</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Interactive question preview */}
                  <div className="mt-6 bg-muted/30 p-4 rounded-lg border border-border">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Try a Question</h4>
                      <Badge variant="outline">Physics: Kinematics</Badge>
                    </div>
                    <div className="p-4 bg-background rounded-md border border-border">
                      <p className="mb-4">A ball is thrown vertically upward with an initial velocity of 20 m/s. If g = 10 m/s², what is the maximum height reached by the ball?</p>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {[
                          { option: "10 m", correct: false },
                          { option: "20 m", correct: true },
                          { option: "30 m", correct: false },
                          { option: "40 m", correct: false }
                        ].map((answer, index) => (
                          <motion.div 
                            key={index} 
                            className={`p-3 border rounded-md cursor-pointer flex items-center justify-between ${
                              answer.correct ? "border-green-500 bg-green-500/5" : "border-border"
                            }`}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span>{answer.option}</span>
                            {answer.correct && <CheckCircle2 size={16} className="text-green-500" />}
                          </motion.div>
                        ))}
                      </div>
                      <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white">
                        Start Practice Session
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="teacher-dashboard" 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }} 
                transition={{ duration: 0.5 }} 
                className="bg-background border border-border rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-3 bg-muted/30 border-b border-border flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  </div>
                  <div className="text-sm font-medium">Teacher Dashboard</div>
                  <div></div>
                </div>
                <div className="p-6">
                  {/* Teacher Dashboard Content */}
                  <div className="grid grid-cols-12 gap-6">
                    {/* Top stats row */}
                    <div className="col-span-12 grid grid-cols-3 gap-4 mb-2">
                      <motion.div 
                        className="bg-muted/30 p-4 rounded-lg border border-border"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-muted-foreground text-sm mb-1">Active Students</div>
                            <div className="text-2xl font-bold">284</div>
                          </div>
                          <div className="h-10 w-10 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center">
                            <Users size={20} />
                          </div>
                        </div>
                        <div className="text-xs text-green-500 flex items-center mt-2">
                          <span className="mr-1">↑ 12%</span>
                          <span className="text-muted-foreground">from last month</span>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-muted/30 p-4 rounded-lg border border-border"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-muted-foreground text-sm mb-1">Tests Published</div>
                            <div className="text-2xl font-bold">46</div>
                          </div>
                          <div className="h-10 w-10 bg-purple-500/10 text-purple-500 rounded-lg flex items-center justify-center">
                            <FileText size={20} />
                          </div>
                        </div>
                        <div className="text-xs text-green-500 flex items-center mt-2">
                          <span className="mr-1">↑ 8%</span>
                          <span className="text-muted-foreground">from last month</span>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        className="bg-muted/30 p-4 rounded-lg border border-border"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-muted-foreground text-sm mb-1">Avg. Completion Time</div>
                            <div className="text-2xl font-bold">68 min</div>
                          </div>
                          <div className="h-10 w-10 bg-orange-500/10 text-orange-500 rounded-lg flex items-center justify-center">
                            <Clock size={20} />
                          </div>
                        </div>
                        <div className="text-xs text-red-500 flex items-center mt-2">
                          <span className="mr-1">↓ 5%</span>
                          <span className="text-muted-foreground">from last test</span>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Middle section */}
                    <div className="col-span-12 md:col-span-8">
                      {/* Class performance chart */}
                      <div className="bg-muted/30 p-4 rounded-lg border border-border mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Class Performance</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">Last 7 Tests</Badge>
                            <Badge variant="outline" className="text-xs">JEE Advanced Batch</Badge>
                          </div>
                        </div>
                        <div className="h-[180px] flex items-end justify-between gap-2 pt-4 pb-2 px-2">
                          {classPerformanceData.map((value, index) => (
                            <motion.div 
                              key={index} 
                              className="relative group"
                              initial={{ height: 0 }}
                              animate={{ height: `${value}%` }}
                              transition={{ 
                                delay: index * 0.1, 
                                duration: 0.5, 
                                type: "spring", 
                                stiffness: 100 
                              }}
                            >
                              <div 
                                className={`w-10 rounded-t-sm ${
                                  value >= 75 ? "bg-green-500" : 
                                  value >= 50 ? "bg-orange-500" : "bg-red-500"
                                }`}
                                style={{ height: "100%" }}
                              />
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {value}%
                              </div>
                              <div className="text-xs text-muted-foreground mt-2">
                                Test {index + 1}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Subject breakdown */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-muted/30 p-4 rounded-lg border border-border">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium text-sm">Physics</h5>
                            <Badge className="bg-blue-500/10 text-blue-500 border-none">{68}%</Badge>
                          </div>
                          <div className="space-y-2">
                            {[
                              { topic: "Mechanics", score: 72 },
                              { topic: "Electromagnetism", score: 64 },
                              { topic: "Thermodynamics", score: 58 }
                            ].map((item, index) => (
                              <div key={index}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>{item.topic}</span>
                                  <span>{item.score}%</span>
                                </div>
                                <Progress value={item.score} className="h-1.5" />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-muted/30 p-4 rounded-lg border border-border">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium text-sm">Chemistry</h5>
                            <Badge className="bg-green-500/10 text-green-500 border-none">{75}%</Badge>
                          </div>
                          <div className="space-y-2">
                            {[
                              { topic: "Organic", score: 80 },
                              { topic: "Inorganic", score: 65 },
                              { topic: "Physical", score: 76 }
                            ].map((item, index) => (
                              <div key={index}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>{item.topic}</span>
                                  <span>{item.score}%</span>
                                </div>
                                <Progress value={item.score} className="h-1.5" />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-muted/30 p-4 rounded-lg border border-border">
                          <div className="flex justify-between items-center mb-3">
                            <h5 className="font-medium text-sm">Mathematics</h5>
                            <Badge className="bg-purple-500/10 text-purple-500 border-none">{70}%</Badge>
                          </div>
                          <div className="space-y-2">
                            {[
                              { topic: "Calculus", score: 68 },
                              { topic: "Algebra", score: 74 },
                              { topic: "Geometry", score: 67 }
                            ].map((item, index) => (
                              <div key={index}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>{item.topic}</span>
                                  <span>{item.score}%</span>
                                </div>
                                <Progress value={item.score} className="h-1.5" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right sidebar */}
                    <div className="col-span-12 md:col-span-4 space-y-6">
                      {/* Test submission stats */}
                      <motion.div 
                        className="bg-muted/30 p-4 rounded-lg border border-border"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <h4 className="font-medium mb-3">Latest Test Stats</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Submission Rate</span>
                              <span className="text-sm font-medium">{submissionRate}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-green-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${submissionRate}%` }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>92 of 100 students</span>
                              <span>Due: 2 days ago</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Average Score</span>
                              <span className="text-sm font-medium">{averageScore}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-orange-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${averageScore}%` }}
                                transition={{ delay: 0.9, duration: 0.8 }}
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 pt-2">
                            <div className="rounded-md p-2 bg-green-500/10 text-center">
                              <div className="text-xs text-muted-foreground">High</div>
                              <div className="font-medium">35%</div>
                            </div>
                            <div className="rounded-md p-2 bg-orange-500/10 text-center">
                              <div className="text-xs text-muted-foreground">Average</div>
                              <div className="font-medium">52%</div>
                            </div>
                            <div className="rounded-md p-2 bg-red-500/10 text-center">
                              <div className="text-xs text-muted-foreground">Low</div>
                              <div className="font-medium">13%</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Pending action items */}
                      <motion.div 
                        className="bg-muted/30 p-4 rounded-lg border border-border"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <h4 className="font-medium mb-3">Action Items</h4>
                        <div className="space-y-2">
                          {[
                            { text: "Grade 8 pending submissions", urgent: true },
                            { text: "Update Physics Unit 3 questions", urgent: false },
                            { text: "Schedule revision test for Math", urgent: false }
                          ].map((item, index) => (
                            <motion.div 
                              key={index} 
                              className={`p-2.5 border rounded-md flex items-center gap-2 ${
                                item.urgent 
                                  ? "border-red-200 bg-red-50/50 dark:bg-red-900/10 dark:border-red-900/30" 
                                  : "border-border"
                              }`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.8 + index * 0.1 }}
                            >
                              <div 
                                className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                  item.urgent ? "text-red-500" : "text-muted-foreground"
                                }`}
                              >
                                {item.urgent ? <XCircle size={16} /> : <CircleDashed size={16} />}
                              </div>
                              <span className="text-sm">{item.text}</span>
                            </motion.div>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
                          View All Tasks <ChevronRight size={14} />
                        </Button>
                      </motion.div>
                      
                      {/* Quick actions */}
                      <motion.div 
                        className="bg-gradient-to-br from-secondary/20 to-primary/20 p-4 rounded-lg border border-secondary/20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <h4 className="font-medium mb-3">Quick Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="bg-white/80 dark:bg-background/80 dark:hover:bg-background text-secondary"
                          >
                            <Layers size={14} className="mr-1" />
                            New Test
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="bg-white/80 dark:bg-background/80 dark:hover:bg-background text-primary"
                          >
                            <BarChart size={14} className="mr-1" />
                            Reports
                          </Button>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}