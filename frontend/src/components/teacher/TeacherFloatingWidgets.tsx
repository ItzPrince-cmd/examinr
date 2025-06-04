import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import {
  Users,
  Brain,
  Calendar,
  TrendingUp,
  Bell,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  UserCheck,
  UserX,
  Sparkles
} from 'lucide-react';
import { DraggableWidget } from '../student/DraggableWidget';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface WidgetState {
  id: string;
  isVisible: boolean;
  position: {
    x: number;
    y: number;
  };
}

// Class Monitor Widget - Shows real-time class activity
export const ClassMonitorWidget: React.FC<{
  widgetState: WidgetState;
  onClose: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  activeStudents: number;
  totalStudents: number;
  currentClass: string;
}> = ({
  widgetState,
  onClose,
  onPositionChange,
  activeStudents,
  totalStudents,
  currentClass
}) => {
  const [pulseAnimation, setPulseAnimation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <DraggableWidget
      id="classMonitor"
      title="Class Monitor"
      isVisible={widgetState.isVisible}
      position={widgetState.position}
      onClose={onClose}
      onPositionChange={onPositionChange}
      className="w-80"
    >
      <Card className="glass-gradient border-purple-500/20 shadow-xl">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              {currentClass}
            </h3>
            <motion.div animate={pulseAnimation ? { scale: [1, 1.2, 1] } : {}} className="relative">
              <div className="h-3 w-3 bg-green-500 rounded-full" />
              {pulseAnimation && (
                <motion.div
                  className="absolute inset-0 h-3 w-3 bg-green-500 rounded-full"
                  animate={{ scale: [1, 2, 2.5], opacity: [1, 0.5, 0] }}
                  transition={{ duration: 1 }}
                />
              )}
            </motion.div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">
                {activeStudents}/{totalStudents}
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {Math.round((activeStudents / totalStudents) * 100)}% Active
            </Badge>
          </div>

          <Progress value={(activeStudents / totalStudents) * 100} className="h-2" />

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-green-500/10 rounded">
              <UserCheck className="h-4 w-4 mx-auto mb-1 text-green-500" />
              <p className="font-medium">{activeStudents}</p>
              <p className="text-muted-foreground">Online</p>
            </div>
            <div className="text-center p-2 bg-yellow-500/10 rounded">
              <Clock className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
              <p className="font-medium">{Math.floor(totalStudents * 0.2)}</p>
              <p className="text-muted-foreground">Away</p>
            </div>
            <div className="text-center p-2 bg-red-500/10 rounded">
              <UserX className="h-4 w-4 mx-auto mb-1 text-red-500" />
              <p className="font-medium">
                {totalStudents - activeStudents - Math.floor(totalStudents * 0.2)}
              </p>
              <p className="text-muted-foreground">Offline</p>
            </div>
          </div>

          <Button size="sm" className="w-full gap-2">
            <Eye className="h-3 w-3" /> View Detailed Activity
          </Button>
        </div>
      </Card>
    </DraggableWidget>
  );
};

// AI Assistant Widget - Shows teaching insights
export const AIAssistantWidget: React.FC<{
  widgetState: WidgetState;
  onClose: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  insights: Array<{
    id: string;
    type: string;
    title: string;
    impact: 'high' | 'medium' | 'low';
  }>;
}> = ({ widgetState, onClose, onPositionChange, insights }) => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [insights.length]);

  const generateNewInsight = () => {
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 1500);
  };

  return (
    <DraggableWidget
      id="aiAssistant"
      title="AI Teaching Assistant"
      isVisible={widgetState.isVisible}
      position={widgetState.position}
      onClose={onClose}
      onPositionChange={onPositionChange}
      className="w-72"
    >
      <Card className="glass-gradient border-purple-500/20 shadow-xl">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <motion.div
                animate={{ rotate: isThinking ? 360 : 0 }}
                transition={{ duration: 2, repeat: isThinking ? Infinity : 0 }}
              >
                <Brain className="h-4 w-4 text-purple-500" />
              </motion.div>
              AI Insights
            </h3>
            <Badge
              variant={insights[currentInsight]?.impact === 'high' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {insights[currentInsight]?.impact} impact
            </Badge>
          </div>

          <motion.div
            key={currentInsight}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[80px]"
          >
            {isThinking ? (
              <div className="flex items-center justify-center h-20">
                <motion.div
                  className="flex gap-1"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                </motion.div>
              </div>
            ) : (
              <div>
                <p className="font-medium text-sm">{insights[currentInsight]?.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Sparkles className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-muted-foreground">
                    Based on real-time analysis
                  </span>
                </div>
              </div>
            )}
          </motion.div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {insights.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1 w-6 rounded-full transition-all",
                    index === currentInsight ? "bg-purple-500" : "bg-muted"
                  )}
                />
              ))}
            </div>
            <Button size="sm" variant="ghost" onClick={generateNewInsight} disabled={isThinking}>
              Next Insight
            </Button>
          </div>
        </div>
      </Card>
    </DraggableWidget>
  );
};

// Schedule Widget - Shows next class info
export const ScheduleWidget: React.FC<{
  widgetState: WidgetState;
  onClose: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  nextClass: {
    name: string;
    time: string;
    students: number;
  };
}> = ({ widgetState, onClose, onPositionChange, nextClass }) => {
  const [timeUntilClass, setTimeUntilClass] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const classTime = new Date();
      const [hours, minutes] = nextClass.time.split(':');
      classTime.setHours(parseInt(hours), parseInt(minutes));
      const diff = classTime.getTime() - now.getTime();
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeUntilClass(`${hoursLeft}h ${minutesLeft}m`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [nextClass.time]);

  return (
    <DraggableWidget
      id="schedule"
      title="Next Class"
      isVisible={widgetState.isVisible}
      position={widgetState.position}
      onClose={onClose}
      onPositionChange={onPositionChange}
      className="w-72"
    >
      <Card className="glass-gradient border-blue-500/20 shadow-xl">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Upcoming
            </h3>
            <Badge variant="outline" className="text-xs">
              {timeUntilClass}
            </Badge>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-lg">{nextClass.name}</h4>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {nextClass.time}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {nextClass.students} students
              </span>
            </div>
          </div>

          <motion.div
            className="h-2 bg-muted rounded-full overflow-hidden"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 60, repeat: Infinity }}
          >
            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" />
          </motion.div>

          <Button size="sm" className="w-full">
            Prepare Class
          </Button>
        </div>
      </Card>
    </DraggableWidget>
  );
};

// Performance Metrics Widget
export const PerformanceMetricsWidget: React.FC<{
  widgetState: WidgetState;
  onClose: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  averageScore: number;
  trend: 'up' | 'down' | 'stable';
  improvementRate: number;
}> = ({
  widgetState,
  onClose,
  onPositionChange,
  averageScore,
  trend,
  improvementRate
}) => {
  return (
    <DraggableWidget
      id="performance"
      title="Performance Metrics"
      isVisible={widgetState.isVisible}
      position={widgetState.position}
      onClose={onClose}
      onPositionChange={onPositionChange}
      className="w-64"
    >
      <Card className="glass-gradient border-green-500/20 shadow-xl">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Class Average
            </h3>
            <motion.div
              animate={{ y: trend === 'up' ? -2 : trend === 'down' ? 2 : 0 }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <TrendingUp
                className={cn(
                  "h-4 w-4",
                  trend === 'up' ? 'text-green-500' : 
                  trend === 'down' ? 'text-red-500 rotate-180' : 
                  'text-yellow-500'
                )}
              />
            </motion.div>
          </div>

          <div className="text-center">
            <motion.p
              className="text-4xl font-bold"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {averageScore}%
            </motion.p>
            <p className="text-xs text-muted-foreground mt-1">
              {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
              {improvementRate}% this week
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1 text-center text-xs">
            <div className="p-2 bg-green-500/10 rounded">
              <CheckCircle className="h-3 w-3 mx-auto mb-1 text-green-500" />
              <p>A+</p>
              <p className="font-bold">12</p>
            </div>
            <div className="p-2 bg-yellow-500/10 rounded">
              <AlertCircle className="h-3 w-3 mx-auto mb-1 text-yellow-500" />
              <p>B-C</p>
              <p className="font-bold">15</p>
            </div>
            <div className="p-2 bg-red-500/10 rounded">
              <AlertCircle className="h-3 w-3 mx-auto mb-1 text-red-500" />
              <p>Need Help</p>
              <p className="font-bold">3</p>
            </div>
          </div>
        </div>
      </Card>
    </DraggableWidget>
  );
};

// Notification Widget
export const NotificationWidget: React.FC<{
  widgetState: WidgetState;
  onClose: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  urgentCount: number;
}> = ({
  widgetState,
  onClose,
  onPositionChange,
  urgentCount
}) => {
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (urgentCount > 0) {
      const interval = setInterval(() => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [urgentCount]);

  return (
    <DraggableWidget
      id="notifications"
      title="Urgent Notifications"
      isVisible={widgetState.isVisible}
      position={widgetState.position}
      onClose={onClose}
      onPositionChange={onPositionChange}
      className="w-56"
    >
      <motion.div
        animate={isShaking ? { x: [-2, 2, -2, 2, 0], rotate: [-1, 1, -1, 1, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <Card
          className={cn(
            "glass-gradient shadow-xl",
            urgentCount > 0 ? "border-red-500/50" : "border-green-500/20"
          )}
        >
          <div className="p-4 text-center">
            <motion.div
              className="relative inline-block"
              animate={{ scale: urgentCount > 0 ? [1, 1.1, 1] : 1 }}
              transition={{
                duration: 2,
                repeat: urgentCount > 0 ? Infinity : 0
              }}
            >
              <Bell
                className={cn(
                  "h-12 w-12",
                  urgentCount > 0 ? "text-red-500" : "text-green-500"
                )}
              />
              {urgentCount > 0 && (
                <motion.div
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  {urgentCount}
                </motion.div>
              )}
            </motion.div>

            <p className="font-semibold mt-3">
              {urgentCount > 0 ? `${urgentCount} Urgent Items` : 'All Clear!'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {urgentCount > 0 ? 'Action required' : 'No urgent notifications'}
            </p>
          </div>
        </Card>
      </motion.div>
    </DraggableWidget>
  );
};