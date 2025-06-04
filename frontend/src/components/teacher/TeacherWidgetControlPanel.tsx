import React from 'react';
import { motion } from 'framer-motion';
import { AnimatePresenceWrapper } from './AnimatePresenceWrapper';

import {
  Users,
  Brain,
  Calendar,
  TrendingUp,
  Bell,
  Activity,
  Eye,
  EyeOff,
  RotateCcw,
  X,
  Maximize,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';

interface Widget {
  id: string;
  name: string;
  icon: any;
  description: string;
  category: 'monitoring' | 'analytics' | 'communication' | 'scheduling';
}
const widgets: Widget[] = [
  {
    id: 'classMonitor',
    name: 'Class Monitor',
    icon: Users,
    description: 'Real-time student activity tracking',
    category: 'monitoring',
  },
  {
    id: 'aiAssistant',
    name: 'AI Teaching Assistant',
    icon: Brain,
    description: 'Smart insights and recommendations',
    category: 'analytics',
  },
  {
    id: 'schedule',
    name: 'Schedule Tracker',
    icon: Calendar,
    description: 'Upcoming classes and events',
    category: 'scheduling',
  },
  {
    id: 'performance',
    name: 'Performance Metrics',
    icon: TrendingUp,
    description: 'Class average and trends',
    category: 'analytics',
  },
  {
    id: 'notifications',
    name: 'Urgent Notifications',
    icon: Bell,
    description: 'Important alerts and reminders',
    category: 'communication',
  },
];

interface TeacherWidgetControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  widgetStates: Record<string, { isVisible: boolean }>;
  onToggleWidget: (widgetId: string) => void;
  onResetPositions: () => void;
  onOpenAll: () => void;
  onCloseAll: () => void;
}

const TeacherWidgetControlPanel: React.FC<TeacherWidgetControlPanelProps> = ({
  isOpen,
  onClose,
  widgetStates,
  onToggleWidget,
  onResetPositions,
  onOpenAll,
  onCloseAll,
}) => {
  const categories = ['all', 'monitoring', 'analytics', 'communication', 'scheduling'];
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const filteredWidgets = widgets.filter(
    (widget) => selectedCategory === 'all' || widget.category === selectedCategory
  );
  const visibleCount = Object.values(widgetStates).filter((state) => state.isVisible).length;
  return (
    <AnimatePresenceWrapper mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            style={{ zIndex: 10000 }}
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-96 bg-background border-l shadow-2xl"
            style={{ zIndex: 10001 }}
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {' '}
                    Command Center{' '}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {visibleCount} of {widgets.length} widgets active{' '}
                  </p>
                </div>
                <Button size="icon" variant="ghost" onClick={onClose} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={onOpenAll} className="flex-1 gap-2">
                  <Eye className="h-4 w-4" /> Show All{' '}
                </Button>
                <Button size="sm" variant="outline" onClick={onCloseAll} className="flex-1 gap-2">
                  <EyeOff className="h-4 w-4" /> Hide All{' '}
                </Button>
                <Button size="sm" variant="outline" onClick={onResetPositions} className="gap-2">
                  <RotateCcw className="h-4 w-4" /> Reset{' '}
                </Button>
              </div>
            </div>
            {/* Category Filter */}
            <div className="p-4 border-b">
              <ScrollArea className="w-full">
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      className="cursor-pointer capitalize"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>
            {/* Widget List */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {filteredWidgets.map((widget) => {
                  const Icon = widget.icon;
                  const isVisible = widgetStates[widget.id]?.isVisible || false;
                  return (
                    <motion.div
                      key={widget.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card
                        className={cn(
                          'p-4 transition-all hover-lift',
                          isVisible ? 'bg-primary/5 border-primary/20 shadow-lg' : ''
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'p-2 rounded-lg transition-all',
                              isVisible ? 'bg-primary/10' : 'bg-muted',
                              widget.category === 'monitoring' &&
                                'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
                              widget.category === 'analytics' &&
                                'bg-gradient-to-br from-purple-500/10 to-pink-500/10',
                              widget.category === 'communication' &&
                                'bg-gradient-to-br from-orange-500/10 to-red-500/10',
                              widget.category === 'scheduling' &&
                                'bg-gradient-to-br from-green-500/10 to-emerald-500/10'
                            )}
                          >
                            <Icon
                              className={cn(
                                'h-5 w-5',
                                widget.category === 'monitoring' && 'text-blue-500',
                                widget.category === 'analytics' && 'text-purple-500',
                                widget.category === 'communication' && 'text-orange-500',
                                widget.category === 'scheduling' && 'text-green-500'
                              )}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={widget.id} className="font-medium cursor-pointer">
                                {widget.name}
                              </Label>
                              <Switch
                                id={widget.id}
                                checked={isVisible}
                                onCheckedChange={() => onToggleWidget(widget.id)}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {widget.description}
                            </p>
                            {isVisible && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="flex gap-2 mt-2"
                              >
                                <Badge variant="secondary" className="text-xs">
                                  {' '}
                                  Active{' '}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {widget.category}
                                </Badge>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
            {/* Footer Tips */}
            <div className="p-4 border-t bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" />
                <p>Drag widgets to reposition • Double-click to maximize</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Maximize className="h-3 w-3" />
                <p>Hover for quick controls • Click outside to close</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresenceWrapper>
  );
};

export default TeacherWidgetControlPanel;
