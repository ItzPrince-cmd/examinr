import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Archive,
  Trash2,
  Target,
  BookOpen,
  PenTool,
  ClipboardList,
  CheckSquare,
  Download,
  MoreVertical} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

  interface QuickAction { id: string;
  label: string;
  icon: any;
  color: string;
  bgGradient: string;
  description: string;
  shortcuts?: string[];
    subActions?: { id: string;
    label: string;
    icon: any;
    onClick: () => void
}[]
}

  interface ScheduleSlot { id: string;
  time: string;
  duration: number;
  available: boolean;type?: 'class' | 'meeting' | 'office-hours'
}

  interface QuickActionsDockProps { onCreateTest: () => void;
  onCreateAssignment: () => void;
  onScheduleClass: () => void;
  onStartLiveClass: () => void;
  onBatchOperation: (operation: string) => void;
  scheduleSlots: ScheduleSlot[]
}

  const QuickActionsDock: React.FC<QuickActionsDockProps> = ({
  onCreateTest,
  onCreateAssignment,
  onScheduleClass,
  onStartLiveClass,
  onBatchOperation,
  scheduleSlots
    }) => {
  const [expandedAction, setExpandedAction] = useState<string | null>(null

  );
  const [isDockExpanded, setIsDockExpanded] = useState(false
  );const quickActions: QuickAction[] = [ { id: 'create', label: 'Create', icon: Plus, color: 'text-purple-600', bgGradient: 'from-purple-500 to-pink-500', description: 'Create tests, assignments, or content', subActions: [ {id: 'test',label: 'New Test',
      icon: FileText,
      onClick: onCreateTest
        }, {id: 'assignment',label: 'New Assignment',
      icon: ClipboardList,
      onClick: onCreateAssignment}, { id: 'quiz', label: 'Quick Quiz', icon: Target, onClick: () => {} }, { id: 'material', label: 'Study Material', icon: BookOpen, onClick: () => {
      } } ] }, {id: 'schedule',label: 'Schedule',
    icon: Calendar,color: 'text-blue-600',bgGradient: 'from-blue-500 to-cyan-500',description: 'Manage your teaching schedule',shortcuts: ['Ctrl+S','Cmd+S']
      }, {id: 'live',label: 'Go Live',
    icon: Video,color: 'text-red-600',bgGradient: 'from-red-500 to-orange-500',description: 'Start a live class session'
      }, {id: 'analytics',label: 'Analytics',
    icon: BarChart,color: 'text-green-600',bgGradient: 'from-green-500 to-emerald-500',description: 'View performance insights'
      }, {id: 'communicate',label: 'Message',
    icon: MessageSquare,color: 'text-indigo-600',bgGradient: 'from-indigo-500 to-purple-500',description: 'Send announcements or messages'
    } ];
    const batchOperations = [ {id: 'grade',label: 'Grade All',
    icon: CheckSquare}, { id: 'export', label: 'Export', icon: Download }, { id: 'archive', label: 'Archive', icon: Archive }, { id: 'delete', label: 'Delete', icon: Trash2 }, ];
  // Action Button Component 
  const ActionButton = ({ action, index }: { 
    action: QuickAction;
    index: number 
  }) => {
    const Icon = action.icon;
    const isExpanded = expandedAction === action.id;
    return (
      <motion.div className="relative" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{
        delay: index * 0.05,type:"spring",
        stiffness: 300
      }} >
        <motion.button 
          className={cn(
            "relative p-3 rounded-xl shadow-md text-white overflow-hidden group",
            "bg-gradient-to-br transition-all duration-200",
            action.bgGradient,
            isExpanded && "ring-2 ring-white ring-offset-2 ring-offset-background"
          )} 
          whileTap={{ scale: 0.95 }} 
          onClick={() => {
            if (action.subActions) { 
              setExpandedAction(expandedAction === action.id ? null : action.id);
            } else { 
              // Handle direct action 
              if (action.id === 'schedule') onScheduleClass();
              if (action.id === 'live') onStartLiveClass();
              if (action.id === 'analytics') {} 
              if (action.id === 'communicate') {} 
            } 
          }}
        >
          <>
            {/* Background shimmer effect */}
            <motion.div 
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10" 
              initial={false} 
              animate={{ opacity: isExpanded ? 0.2 : 0 }} 
              transition={{ duration: 0.2 }} 
            />
            <Icon className="h-5 w-5 relative z-10" />
          </>
        </motion.button>
        
        {/* Label tooltip */}
        <motion.div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none" initial={{ opacity: 0, y: 5 }} animate={{
        opacity: isExpanded ? 1 : 0,
        y: isExpanded ? 0 : 5
      }} transition={{ duration: 0.2 }} ><div className="bg-background/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg border whitespace-nowrap"><p className="text-xs font-medium">
      {action.label}
    </p>{action.shortcuts && ( <p className="text-xs text-muted-foreground mt-0.5">{action.shortcuts.join(' · ')}
    </p> )}
    </div>
    </motion.div>
      
      {/* Expanded Sub-actions */}
      <AnimatePresenceWrapper>{isExpanded && action.subActions && ( <motion.div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50" initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 10 }} transition={{ type:"spring", stiffness: 300, damping: 25 }} ><Card className="p-1 shadow-xl border-2 min-w-[180px]">
          {action.subActions.map((subAction, subIndex) => {
          const SubIcon = subAction.icon;
          return (<motion.button key={subAction.id} className="flex items-center gap-3 w-full p-2.5 rounded-lg transition-colors text-sm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: subIndex * 0.05 }} onClick={(e) => {
              e.stopPropagation();
              subAction.onClick();
              setExpandedAction(null

              )
}} ><SubIcon className="h-4 w-4 text-muted-foreground" /><span className="font-medium">
          {subAction.label}
          </span>
          </motion.button>
          )
}
        )
        }
      </Card>
    </motion.div> )}
    </AnimatePresenceWrapper>
    </motion.div>
    )
}

  return (
    <>
      {
    /* Main Floating Dock */
    }<motion.div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40" initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type:"spring", stiffness: 300, damping: 30 }} ><motion.div className={cn("flex items-center gap-2 p-2 rounded-2xl","bg-background/80 backdrop-blur-xl border-2 shadow-2xl","transition-all duration-300" )
    } layout >
      {
    /* Main Actions */
      } {quickActions.map((action, index) => ( <ActionButton key={action.id} action={action} index={index} /> ))} {
    /* Separator */
    }<div className="w-px h-8 bg-border mx-1" />
      {
    /* More Options Toggle */
    }<motion.button className={cn("p-3 rounded-xl transition-all duration-200","",isDockExpanded &&"bg-muted" )
    } whileTap={{ scale: 0.95 }} onClick={() => setIsDockExpanded(!isDockExpanded)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} ><MoreVertical className={cn("h-5 w-5 transition-transform duration-200",isDockExpanded &&"rotate-90" )
    } />
  </motion.button>
  </motion.div>
  </motion.div>
      {
    /* Expanded Batch Operations */
    }
    <AnimatePresenceWrapper>{isDockExpanded && ( <motion.div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30" initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} transition={{ type:"spring", stiffness: 300, damping: 25 }} ><Card className="p-3 shadow-2xl border-2"><div className="flex items-center gap-2 mb-3"><Badge variant="secondary" className="text-xs"> Batch Operations </Badge><span className="text-xs text-muted-foreground"> Apply to selected items </span>
    </div><div className="grid grid-cols-4 gap-2">
        {batchOperations.map((operation, index) => {
        const Icon = operation.icon;
        return (<motion.button key={operation.id} className="flex flex-col items-center gap-1.5 p-3 rounded-lg transition-colors" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileTap={{ scale: 0.95 }} onClick={() => {
            onBatchOperation(operation.id

            );
            setIsDockExpanded(false

            )
}} ><Icon className="h-5 w-5 text-muted-foreground" /><span className="text-xs font-medium">
        {operation.label}
        </span>
        </motion.button>
        )
}
      )
      }
    </div>
    </Card>
  </motion.div> )}
    </AnimatePresenceWrapper>
      {
    /* Click outside to close */} {(expandedAction || isDockExpanded) && ( <motion.div className="fixed inset-0 z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => {
        setExpandedAction(null

        );
        setIsDockExpanded(false

        )
}} /> )}
    </>
  )
}

export default QuickActionsDock;
