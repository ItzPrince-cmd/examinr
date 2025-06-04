import React, { useState } from 'react';
import { AnimatePresenceWrapper } from './AnimatePresenceWrapper';

import {
  Plus,
  FileText,
  Users,
  Calendar,
  BarChart,
  Video,
  MessageSquare,
  Upload,
  Target,
  BookOpen,
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

  // Simple Action Button without animations
  const ActionButton = ({ action, index }: { action: QuickAction; index: number }) => {
    const Icon = action.icon;
    return (
      <div className="relative">
        <button
          className={cn(
            "relative p-4 rounded-2xl shadow-lg text-white",
            "bg-gradient-to-br",
            action.color
          )}
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
          <Icon className="h-6 w-6" />
        </button>

        {/* Label - Always visible */}
        <div className="text-center mt-2">
          <p className="text-sm font-medium">{action.label}</p>
        </div>

        {/* Expanded Sub-actions */}
        <AnimatePresenceWrapper mode="wait">
          {expandedAction === action.id && action.subActions && (
            <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 z-20">
              <Card className="p-2 shadow-xl">
                {action.subActions.map((subAction) => {
                  const SubIcon = subAction.icon;
                  return (
                    <button
                      key={subAction.id}
                      className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted/50 text-sm"
                      onClick={subAction.onClick}
                    >
                      <SubIcon className="h-4 w-4" />
                      <span>{subAction.label}</span>
                    </button>
                  );
                })}
              </Card>
            </div>
          )}
        </AnimatePresenceWrapper>
      </div>
    );
  };

  return (
    <>
      {/* Floating Dock */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div
          className={cn(
            "flex items-center gap-4 p-4 rounded-2xl",
            "bg-background/95 backdrop-blur-md border shadow-2xl",
            "transition-all duration-300"
          )}
        >
          {/* Main Actions */}
          {quickActions.map((action, index) => (
            <ActionButton key={action.id} action={action} index={index} />
          ))}

          {/* Dock Toggle */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsDockExpanded(!isDockExpanded)}
            className="ml-2"
          >
            <Plus
              className={cn(
                "h-5 w-5 transition-transform",
                isDockExpanded ? "rotate-45" : ""
              )}
            />
          </Button>
        </div>
      </div>

      {/* Batch Operations (when items selected) */}
      <AnimatePresenceWrapper mode="wait">
        {isDockExpanded && (
          <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-20">
            <Card className="p-4 shadow-xl">
              <h3 className="font-semibold mb-3">Batch Operations</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBatchOperation('grade')}
                >
                  Grade All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBatchOperation('export')}
                >
                  Export
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBatchOperation('archive')}
                >
                  Archive
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onBatchOperation('delete')}
                >
                  Delete
                </Button>
              </div>
            </Card>
          </div>
        )}
      </AnimatePresenceWrapper>
    </>
  );
};

export default QuickActionsDock;