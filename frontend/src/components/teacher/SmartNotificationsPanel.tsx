import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresenceWrapper } from './AnimatePresenceWrapper';

import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  Users,
  Clock,
  Brain,
  Sparkles,
  MessageCircle,
  Star,
  Award,
  Target,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';

interface Notification {
  id: string;
  type: 'urgent' | 'insight' | 'achievement' | 'reminder' | 'message';
  title: string;
  description: string;
  time: Date;
  read: boolean;
  actionable: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  metadata?: {
    studentName?: string;
    studentAvatar?: string;
    className?: string;
    score?: number;
    trend?: 'up' | 'down';
  };
}

interface AIInsight {
  id: string;
  type: 'performance' | 'engagement' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  suggestedAction?: string;
}

interface SmartNotificationsPanelProps {
  notifications: Notification[];
  aiInsights: AIInsight[];
  onNotificationRead: (id: string) => void;
  onMarkAllRead: () => void;
  onAction: (id: string) => void;
}

const SmartNotificationsPanel: React.FC<SmartNotificationsPanelProps> = ({
  notifications,
  aiInsights,
  onNotificationRead,
  onMarkAllRead,
  onAction
}) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'urgent' | 'insights'>('all');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    const icons = {
      urgent: <AlertTriangle className="h-4 w-4" />,
      insight: <Brain className="h-4 w-4" />,
      achievement: <Award className="h-4 w-4" />,
      reminder: <Clock className="h-4 w-4" />,
      message: <MessageCircle className="h-4 w-4" />
    };
    return icons[type as keyof typeof icons] || <Bell className="h-4 w-4" />;
  };

  const getNotificationColor = (type: string) => {
    const colors = {
      urgent: 'text-red-500 bg-red-500/10',
      insight: 'text-purple-500 bg-purple-500/10',
      achievement: 'text-green-500 bg-green-500/10',
      reminder: 'text-blue-500 bg-blue-500/10',
      message: 'text-orange-500 bg-orange-500/10'
    };
    return colors[type as keyof typeof colors] || 'text-gray-500 bg-gray-500/10';
  };

  const filteredNotifications = notifications.filter((n) => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'urgent') return n.type === 'urgent';
    if (selectedTab === 'insights') return n.type === 'insight';
    return true;
  });

  // AI Assistant Component
  const AIAssistant = () => (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed bottom-24 right-8 z-50"
    >
      <Card className="w-80 shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="h-5 w-5 text-purple-500" />
              </motion.div>
              <CardTitle className="text-base">AI Teaching Assistant</CardTitle>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowAIAssistant(false)}
              className="h-6 w-6"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isAIThinking ? (
            <div className="flex items-center gap-2">
              <motion.div
                className="flex gap-1"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
              </motion.div>
              <span className="text-sm text-muted-foreground">Analyzing patterns...</span>
            </div>
          ) : (
            <>
              {aiInsights.slice(0, 3).map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "p-3 rounded-lg border",
                    insight.impact === 'high' && "border-purple-500/50 bg-purple-500/5"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={cn(
                        "p-1 rounded",
                        insight.type === 'performance' && "bg-blue-500/10",
                        insight.type === 'engagement' && "bg-green-500/10",
                        insight.type === 'recommendation' && "bg-purple-500/10",
                        insight.type === 'prediction' && "bg-orange-500/10"
                      )}
                    >
                      {insight.type === 'performance' && <TrendingUp className="h-3 w-3" />}
                      {insight.type === 'engagement' && <Users className="h-3 w-3" />}
                      {insight.type === 'recommendation' && <Target className="h-3 w-3" />}
                      {insight.type === 'prediction' && <Zap className="h-3 w-3" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{insight.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {insight.description}
                      </p>
                      {insight.suggestedAction && (
                        <Button size="sm" variant="link" className="h-auto p-0 mt-2 text-xs">
                          {insight.suggestedAction} →
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(insight.confidence * 100)}% confidence
                    </Badge>
                    <Badge
                      variant={insight.impact === 'high' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {insight.impact} impact
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  // Notification Item Component
  const NotificationItem = ({ notification, index }: { notification: Notification; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          delay: index * 0.05
        }}
        onClick={() => onNotificationRead(notification.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative p-4 rounded-lg border cursor-pointer transition-all",
          !notification.read && "bg-muted/50",
          isHovered && "shadow-md"
        )}
      >
        {/* Unread Indicator */}
        {!notification.read && (
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r"
            layoutId={`unread-${notification.id}`}
          />
        )}

        <div className="flex items-start gap-3 ml-2">
          {/* Icon with animation */}
          <motion.div
            className={cn("p-2 rounded-lg", getNotificationColor(notification.type))}
            animate={
              notification.type === 'urgent'
                ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, -5, 0] }
                : {}
            }
            transition={{
              duration: 0.5,
              repeat: notification.type === 'urgent' ? Infinity : 0,
              repeatDelay: 2
            }}
          >
            {getNotificationIcon(notification.type)}
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.description}
                </p>

                {/* Metadata */}
                {notification.metadata && (
                  <div className="flex items-center gap-3 mt-2">
                    {notification.metadata.studentName && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={notification.metadata.studentAvatar} />
                          <AvatarFallback>
                            {notification.metadata.studentName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{notification.metadata.studentName}</span>
                      </div>
                    )}
                    {notification.metadata.score !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        Score: {notification.metadata.score}%
                      </Badge>
                    )}
                    {notification.metadata.trend && (
                      <motion.div
                        animate={{ y: notification.metadata.trend === 'up' ? -2 : 2 }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        <TrendingUp
                          className={cn(
                            "h-4 w-4",
                            notification.metadata.trend === 'up'
                              ? 'text-green-500'
                              : 'text-red-500 rotate-180'
                          )}
                        />
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                {notification.actionable && notification.action && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="mt-3"
                  >
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        notification.action?.onClick();
                      }}
                    >
                      {notification.action.label}
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </motion.div>
                )}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(notification.time).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                  >
                    {unreadCount}
                  </motion.div>
                )}
              </div>
              <CardTitle>Smart Notifications</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAIAssistant(!showAIAssistant)}
                className="gap-2"
              >
                <Brain className="h-4 w-4" /> AI Insights
              </Button>
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onMarkAllRead}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" /> Mark all read
                </Button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {['all', 'urgent', 'insights'].map((tab) => (
              <Badge
                key={tab}
                variant={selectedTab === tab ? 'default' : 'outline'}
                className="cursor-pointer capitalize"
                onClick={() => setSelectedTab(tab as any)}
              >
                {tab}
                {tab === 'urgent' && (
                  <span className="ml-1">
                    ({notifications.filter(n => n.type === 'urgent').length})
                  </span>
                )}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <AnimatePresenceWrapper mode="popLayout">
              {filteredNotifications.length > 0 ? (
                <div className="space-y-3">
                  {filteredNotifications.map((notification, index) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-muted-foreground">All caught up!</p>
                </motion.div>
              )}
            </AnimatePresenceWrapper>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* AI Assistant */}
      <AnimatePresenceWrapper mode="wait">
        {showAIAssistant && <AIAssistant />}
      </AnimatePresenceWrapper>
    </div>
  );
};

export default SmartNotificationsPanel;