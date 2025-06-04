import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Sparkles,
  Brain,
  Coffee,
  Heart,
  Trophy,
  Activity,
  Clock,
  Calendar,
  RotateCcw,
  Eye,
  EyeOff,
  Maximize,
  X,
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
  category: 'productivity' | 'motivation' | 'social' | 'analytics';
}
const widgets: Widget[] = [
  {
    id: 'quickStats',
    name: 'Quick Stats',
    icon: Sparkles,
    description: 'View your daily progress at a glance',
    category: 'analytics',
  },
  {
    id: 'motivationalQuote',
    name: 'Motivational Quotes',
    icon: Heart,
    description: 'Get inspired with rotating quotes',
    category: 'motivation',
  },
  {
    id: 'energyLevel',
    name: 'Energy Tracker',
    icon: Coffee,
    description: 'Monitor and manage your energy levels',
    category: 'productivity',
  },
  {
    id: 'studyBuddy',
    name: 'Study Buddy',
    icon: Brain,
    description: 'Your AI companion for learning',
    category: 'motivation',
  },
  {
    id: 'achievement',
    name: 'Achievement Alerts',
    icon: Trophy,
    description: 'Celebrate your accomplishments',
    category: 'motivation',
  },
  {
    id: 'activityFeed',
    name: 'Activity Feed',
    icon: Activity,
    description: 'See what others are learning',
    category: 'social',
  },
  {
    id: 'studyTimer',
    name: 'Study Timer',
    icon: Clock,
    description: 'Track your study sessions',
    category: 'productivity',
  },
  {
    id: 'upcomingEvents',
    name: 'Upcoming Events',
    icon: Calendar,
    description: 'Never miss important dates',
    category: 'productivity',
  },
];

interface WidgetControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
  widgetStates: Record<string, { isVisible: boolean }>;
  onToggleWidget: (widgetId: string) => void;
  onResetPositions: () => void;
  onOpenAll: () => void;
  onCloseAll: () => void;
}

export const WidgetControlPanel: React.FC<WidgetControlPanelProps> = ({
  isOpen,
  onClose,
  widgetStates,
  onToggleWidget,
  onResetPositions,
  onOpenAll,
  onCloseAll,
}) => {
  const categories = ['all', 'productivity', 'motivation', 'social', 'analytics'];
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const filteredWidgets = widgets.filter(
    (widget) => selectedCategory === 'all' || widget.category === selectedCategory
  );
  const visibleCount = Object.values(widgetStates).filter((state) => state.isVisible).length;
  return isOpen ? (
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
              <h2 className="text-2xl font-bold">Widget Manager</h2>
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
            <Button size="sm" variant="outline" onClick={onOpenAll} className="flex-1">
              <Eye className="h-4 w-4 mr-2" /> Show All{' '}
            </Button>
            <Button size="sm" variant="outline" onClick={onCloseAll} className="flex-1">
              <EyeOff className="h-4 w-4 mr-2" /> Hide All{' '}
            </Button>
            <Button size="sm" variant="outline" onClick={onResetPositions}>
              <RotateCcw className="h-4 w-4" />
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
                      'p-4 transition-all',
                      isVisible ? 'bg-primary/5 border-primary/20' : ''
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn('p-2 rounded-lg', isVisible ? 'bg-primary/10' : 'bg-muted')}
                      >
                        <Icon className="h-5 w-5" />
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
                        <p className="text-xs text-muted-foreground mt-1">{widget.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
        {/* Footer */}
        <div className="p-4 border-t bg-muted/50">
          <p className="text-xs text-center text-muted-foreground">
            {' '}
            Drag widgets to reposition • Hover to see controls{' '}
          </p>
        </div>
      </motion.div>
    </>
  ) : null;
};
