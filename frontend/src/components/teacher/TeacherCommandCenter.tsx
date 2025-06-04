import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresenceWrapper } from './AnimatePresenceWrapper';

import {
  Users,
  BookOpen,
  Clock,
  TrendingUp,
  Award,
  Activity,
  AlertCircle,
  CheckCircle,
  Star,
  Zap,
  Target,
  Brain,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { cn } from '../../lib/utils';

interface Student {
  id: string;
  name: string;
  avatar?: string;
  performance: 'excellent' | 'good' | 'average' | 'struggling';
  lastActive: Date;
  activityLevel: number;
  recentScore?: number;
}

interface ClassEcosystem {
  id: string;
  name: string;
  subject: string;
  grade: string;
  students: Student[];
  nextClass: Date;
  averagePerformance: number;
  activeNow: number;
  recentActivity: {
    type: 'test' | 'assignment' | 'discussion';
    title: string;
    time: Date;
  }[];
}

interface TeacherCommandCenterProps {
  classes: ClassEcosystem[];
  onClassSelect: (classId: string) => void;
  onStudentSelect: (studentId: string, classId: string) => void;
}

const TeacherCommandCenter: React.FC<TeacherCommandCenterProps> = ({
  classes,
  onClassSelect,
  onStudentSelect
}) => {
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');

  // Performance-based positioning for student avatars
  const getStudentPosition = (index: number, total: number, performance: string) => {
    const angle = (index / total) * 2 * Math.PI;
    const performanceRadius = {
      excellent: 120,
      good: 90,
      average: 60,
      struggling: 30
    };

    const radius = performanceRadius[performance as keyof typeof performanceRadius] || 60;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  };

  const getPerformanceColor = (performance: string) => {
    const colors = {
      excellent: 'from-green-500 to-emerald-500',
      good: 'from-blue-500 to-indigo-500',
      average: 'from-yellow-500 to-orange-500',
      struggling: 'from-red-500 to-pink-500'
    };
    return colors[performance as keyof typeof colors] || colors.average;
  };

  const ClassEcosystemCard = ({ classData }: { classData: ClassEcosystem }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isHovered = hoveredClass === classData.id;

    return (
      <motion.div
        layout
        onClick={() => onClassSelect(classData.id)}
        onMouseEnter={() => setHoveredClass(classData.id)}
        onMouseLeave={() => setHoveredClass(null)}
        className="relative cursor-pointer"
      >
        <Card
          className={cn(
            "overflow-hidden transition-all duration-300",
            isHovered && "shadow-2xl scale-[1.02]",
            isExpanded && "col-span-2 row-span-2"
          )}
        >
          <CardHeader className="relative pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{classData.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {classData.subject} • {classData.grade}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant={classData.activeNow > 0 ? "default" : "secondary"}>
                  <Activity className="h-3 w-3 mr-1" />
                  {classData.activeNow} active
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">
                    {classData.averagePerformance}%
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative">
            {/* Student Ecosystem Visualization */}
            <div className="relative h-64 flex items-center justify-center">
              {/* Performance Rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                {['excellent', 'good', 'average', 'struggling'].map((level, index) => (
                  <motion.div
                    key={level}
                    className={cn(
                      "absolute rounded-full border-2 border-dashed",
                      level === 'excellent' && "w-64 h-64 border-green-200",
                      level === 'good' && "w-48 h-48 border-blue-200",
                      level === 'average' && "w-32 h-32 border-yellow-200",
                      level === 'struggling' && "w-16 h-16 border-red-200"
                    )}
                    animate={{ 
                      rotate: 360,
                      transition: {
                        duration: 20 + index * 10,
                        repeat: Infinity,
                        ease: "linear"
                      }
                    }}
                  />
                ))}
              </div>

              {/* Student Avatars */}
              <AnimatePresenceWrapper mode="wait">
                {classData.students.slice(0, 12).map((student, index) => {
                  const position = getStudentPosition(
                    index,
                    Math.min(classData.students.length, 12),
                    student.performance
                  );

                  return (
                    <motion.div
                      key={student.id}
                      className="absolute"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        x: position.x,
                        y: position.y,
                        scale: 1,
                        opacity: 1
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 300,
                        delay: index * 0.05
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onStudentSelect(student.id, classData.id);
                      }}
                    >
                      <div className="relative group">
                        {/* Activity Pulse */}
                        {student.activityLevel > 0.7 && (
                          <motion.div
                            className={cn(
                              "absolute -inset-2 rounded-full",
                              `bg-gradient-to-r ${getPerformanceColor(student.performance)}`
                            )}
                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />
                        )}

                        <Avatar
                          className={cn(
                            "h-10 w-10 ring-2 transition-all",
                            `ring-${
                              student.performance === 'excellent'
                                ? 'green'
                                : student.performance === 'good'
                                ? 'blue'
                                : student.performance === 'average'
                                ? 'yellow'
                                : 'red'
                            }-500`
                          )}
                        >
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback>{student.name[0]}</AvatarFallback>
                        </Avatar>

                        {/* Hover Details */}
                        <motion.div
                          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 0, y: -10 }}
                          whileHover={{ opacity: 1, y: 0 }}
                        >
                          <div className="bg-background/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border whitespace-nowrap">
                            <p className="text-xs font-medium">{student.name}</p>
                            {student.recentScore && (
                              <p className="text-xs text-muted-foreground">
                                Recent: {student.recentScore}%
                              </p>
                            )}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresenceWrapper>

              {/* Center Metrics */}
              <div className="text-center z-20">
                <p className="text-3xl font-bold">{classData.students.length}</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Recent Activity</p>
              {classData.recentActivity.slice(0, 2).map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      activity.type === 'test' && "bg-purple-500",
                      activity.type === 'assignment' && "bg-blue-500",
                      activity.type === 'discussion' && "bg-green-500"
                    )}
                  />
                  <span className="truncate">{activity.title}</span>
                  <span className="text-xs ml-auto">
                    {new Date(activity.time).toLocaleTimeString()}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Next Class */}
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Next Class</span>
                </div>
                <span className="text-sm font-medium">
                  {new Date(classData.nextClass).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>

          {/* Hover Effects */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="absolute top-4 right-4">
                <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            Command Center
          </h2>
          <p className="text-muted-foreground mt-1">
            Monitor and manage your classes in real-time
          </p>
        </div>
        <div className="flex gap-2">
          <Badge
            variant={selectedView === 'grid' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedView('grid')}
          >
            Grid View
          </Badge>
          <Badge
            variant={selectedView === 'list' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedView('list')}
          >
            List View
          </Badge>
        </div>
      </div>

      {/* Class Grid */}
      <div
        className={cn(
          "grid gap-6",
          selectedView === 'grid'
            ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1"
        )}
      >
        {classes.map((classData) => (
          <ClassEcosystemCard key={classData.id} classData={classData} />
        ))}
      </div>
    </div>
  );
};

export default TeacherCommandCenter;