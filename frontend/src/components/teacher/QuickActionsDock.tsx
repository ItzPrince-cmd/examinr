import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { AnimatePresenceWrapper } from './AnimatePresenceWrapper';

import {
  Plus,
  FileText,
  Users,
  Calendar,
  BarChart,
  Video,
  MessageSquare,
  Settings,
  Upload,
  Share2,
  Timer,
  Target,
  Sparkles,
  Zap,
  BookOpen,
  GraduationCap,
  PenTool,
  ClipboardList
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  color: string;
  description: string;
  shortcuts?: string[];
  subActions?: {
    id: string;
    label: string;
    icon: any;
    onClick: () => void;
  }[];
}

interface ScheduleSlot {
  id: string;
  time: string;
  duration: number;
  available: boolean;
  type?: 'class' | 'meeting' | 'office-hours';
}

interface QuickActionsDockProps {
  onCreateTest: () => void;
  onCreateAssignment: () => void;
  onScheduleClass: () => void;
  onStartLiveClass: () => void;
  onBatchOperation: (operation: string) => void;
  scheduleSlots: ScheduleSlot[];
}

const QuickActionsDock: React.FC<QuickActionsDockProps> = ({
  onCreateTest,
  onCreateAssignment,
  onScheduleClass,
  onStartLiveClass,
  onBatchOperation,
  scheduleSlots
}) => {
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const [isDockExpanded, setIsDockExpanded] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showScheduleVisualizer, setShowScheduleVisualizer] = useState(false);
  const [magneticHover, setMagneticHover] = useState<string | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const quickActions: QuickAction[] = [
    {
      id: 'create',
      label: 'Create',
      icon: Plus,
      color: 'from-purple-500 to-pink-500',
      description: 'Create tests, assignments, or content',
      subActions: [
        {
          id: 'test',
          label: 'New Test',
          icon: FileText,
          onClick: onCreateTest
        },
        {
          id: 'assignment',
          label: 'New Assignment',
          icon: ClipboardList,
          onClick: onCreateAssignment
        },
        {
          id: 'quiz',
          label: 'Quick Quiz',
          icon: Target,
          onClick: () => {}
        },
        {
          id: 'material',
          label: 'Study Material',
          icon: BookOpen,
          onClick: () => {}
        }
      ]
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      description: 'Manage your teaching schedule',
      shortcuts: ['Ctrl+S', 'Cmd+S']
    },
    {
      id: 'live',
      label: 'Go Live',
      icon: Video,
      color: 'from-red-500 to-orange-500',
      description: 'Start a live class session'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart,
      color: 'from-green-500 to-emerald-500',
      description: 'View performance insights'
    },
    {
      id: 'communicate',
      label: 'Message',
      icon: MessageSquare,
      color: 'from-indigo-500 to-purple-500',
      description: 'Send announcements or messages'
    }
  ];

  // Magnetic hover effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dockRef.current) {
        const rect = dockRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Floating Action Button
  const FloatingActionButton = ({ action, index }: { action: QuickAction; index: number }) => {
    const Icon = action.icon;
    const buttonRef = useRef<HTMLDivElement>(null);

    const x = useTransform(mouseX, (value) => {
      if (!buttonRef.current || magneticHover !== action.id) return 0;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 - (dockRef.current?.getBoundingClientRect().left || 0);
      return (value - centerX) * 0.1;
    });

    const y = useTransform(mouseY, (value) => {
      if (!buttonRef.current || magneticHover !== action.id) return 0;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2 - (dockRef.current?.getBoundingClientRect().top || 0);
      return (value - centerY) * 0.1;
    });

    return (
      <motion.div
        ref={buttonRef}
        className="relative"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.1 }}
        style={{ x, y }}
        onMouseEnter={() => setMagneticHover(action.id)}
        onMouseLeave={() => setMagneticHover(null)}
      >
        <motion.button
          className={cn(
            "relative p-4 rounded-2xl shadow-lg overflow-hidden group",
            "bg-gradient-to-br text-white",
            action.color
          )}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (action.subActions) {
              setExpandedAction(expandedAction === action.id ? null : action.id);
            } else {
              // Handle direct action
              if (action.id === 'schedule') onScheduleClass();
              if (action.id === 'live') onStartLiveClass();
            }
          }}
        >
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Icon */}
          <Icon className="h-6 w-6 relative z-10" />
          
          {/* Sparkle Effect on Hover */}
          {magneticHover === action.id && (
            <motion.div
              className="absolute top-0 right-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <Sparkles className="h-4 w-4 text-yellow-300" />
            </motion.div>
          )}
        </motion.button>

        {/* Label */}
        <motion.div
          className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: magneticHover === action.id ? 1 : 0,
            y: 0
          }}
        >
          <div className="bg-background/95 backdrop-blur-sm rounded-lg px-3 py-1 shadow-lg border">
            <p className="text-sm font-medium">{action.label}</p>
            {action.shortcuts && (
              <p className="text-xs text-muted-foreground">
                {action.shortcuts.join(' or ')}
              </p>
            )}
          </div>
        </motion.div>

        {/* Expanded Sub-actions */}
        <AnimatePresenceWrapper mode="wait">
          {expandedAction === action.id && action.subActions && (
            <motion.div
              className="absolute top-full mt-4 left-1/2 -translate-x-1/2 z-20"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <Card className="p-2 shadow-xl">
                {action.subActions.map((subAction, subIndex) => {
                  const SubIcon = subAction.icon;
                  return (
                    <motion.button
                      key={subAction.id}
                      className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: subIndex * 0.05 }}
                      onClick={subAction.onClick}
                    >
                      <SubIcon className="h-4 w-4" />
                      <span className="text-sm">{subAction.label}</span>
                    </motion.button>
                  );
                })}
              </Card>
            </motion.div>
          )}
        </AnimatePresenceWrapper>
      </motion.div>
    );
  };

  // Schedule Visualizer
  const ScheduleVisualizer = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2"
    >
      <Card className="p-4 shadow-2xl">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4" /> Today's Schedule
        </h3>
        <div className="grid grid-cols-8 gap-2 w-96">
          {scheduleSlots.map((slot, index) => (
            <motion.div
              key={slot.id}
              className={cn(
                "relative h-16 rounded-lg overflow-hidden cursor-pointer",
                slot.available ? "bg-green-500/20" : "bg-muted"
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => slot.available && onScheduleClass()}
            >
              {/* Filling Animation */}
              {!slot.available && (
                <motion.div
                  className={cn(
                    "absolute inset-0",
                    slot.type === 'class' && "bg-blue-500",
                    slot.type === 'meeting' && "bg-purple-500",
                    slot.type === 'office-hours' && "bg-orange-500"
                  )}
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium">{slot.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500/20 rounded" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span>Class</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded" />
            <span>Meeting</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  // Batch Operations Toolbar
  const BatchOperationsToolbar = () => (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
    >
      <Card className="p-3 shadow-2xl">
        <div className="flex items-center gap-3">
          <Badge variant="secondary">
            {selectedItems.length} selected
          </Badge>
          <div className="h-6 w-px bg-border" />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onBatchOperation('grade')}
            className="gap-2"
          >
            <PenTool className="h-4 w-4" /> Grade All
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onBatchOperation('feedback')}
            className="gap-2"
          >
            <MessageSquare className="h-4 w-4" /> Add Feedback
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onBatchOperation('export')}
            className="gap-2"
          >
            <Upload className="h-4 w-4" /> Export
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedItems([])}
            className="text-red-500"
          >
            Clear
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <>
      {/* Main Dock */}
      <motion.div
        ref={dockRef}
        className={cn(
          "fixed bottom-8 left-1/2 -translate-x-1/2 z-40",
          "bg-background/80 backdrop-blur-xl rounded-2xl shadow-2xl border p-4",
          "transition-all duration-300"
        )}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
      >
        <div className="flex items-center gap-4">
          {/* Expand/Collapse Button */}
          <motion.button
            className="p-2 rounded-lg hover:bg-muted/50"
            onClick={() => setIsDockExpanded(!isDockExpanded)}
          >
            <Settings className="h-5 w-5" />
          </motion.button>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {quickActions.map((action, index) => (
              <FloatingActionButton key={action.id} action={action} index={index} />
            ))}
          </div>

          {/* Additional Controls */}
          <AnimatePresenceWrapper mode="wait">
            {isDockExpanded && (
              <motion.div
                className="flex items-center gap-3"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
              >
                <div className="w-px h-12 bg-border" />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowScheduleVisualizer(!showScheduleVisualizer)}
                  className="gap-2"
                >
                  <Timer className="h-4 w-4" /> Schedule
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedItems(['1', '2', '3'])}
                  className="gap-2"
                >
                  <Target className="h-4 w-4" /> Batch Mode
                </Button>
              </motion.div>
            )}
          </AnimatePresenceWrapper>
        </div>
      </motion.div>

      {/* Schedule Visualizer */}
      <AnimatePresenceWrapper mode="wait">
        {showScheduleVisualizer && <ScheduleVisualizer />}
      </AnimatePresenceWrapper>

      {/* Batch Operations Toolbar */}
      <AnimatePresenceWrapper mode="wait">
        {selectedItems.length > 0 && <BatchOperationsToolbar />}
      </AnimatePresenceWrapper>
    </>
  );
};

export default QuickActionsDock;