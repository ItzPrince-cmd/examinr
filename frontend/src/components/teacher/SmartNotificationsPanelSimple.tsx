import React, { useState } from 'react';
import { AnimatePresenceWrapper } from './AnimatePresenceWrapper';

  import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  User,
  Clock,
  Brain,
  Sparkles,
  MessageCircle,
  Star,
  Award,
  Target,
  Zap,
  ChevronRight} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';

  interface Notification { id: string;type: 'urgent' | 'insight' | 'achievement' | 'reminder' | 'message';
  title: string;
  description: string;
  time: Date;
  read: boolean;
  actionable: boolean;
    action?: { label: string;
    onClick: () => void
}

    metadata?: { studentName?: string;
    studentAvatar?: string;
    className?: string;
    score?: number;trend?: 'up' | 'down'
}
}

  interface AIInsight { id: string;type: 'performance' | 'engagement' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  confidence: number;impact: 'high' | 'medium' | 'low';
  suggestedAction?: string
}

  interface SmartNotificationsPanelProps { notifications: Notification[];
  aiInsights: AIInsight[];
  onNotificationRead: (id: string) => void;
  onMarkAllRead: () => void;
  onAction: (id: string) => void
}

  const SmartNotificationsPanel: React.FC<SmartNotificationsPanelProps> = ({
  notifications,
  aiInsights,
  onNotificationRead,
  onMarkAllRead,
  onAction
    }) => {const [selectedTab, setSelectedTab] = useState<'all' | 'urgent' | 'insights'>('all'

  );
  const [showAIAssistant, setShowAIAssistant] = useState(false
  );
  const unreadCount = notifications.filter(n => !n.read).length;
    const getNotificationIcon = (type: string) => {
      const icons = {
      urgent: <AlertTriangle className="h-4 w-4" />,insight: <Brain className="h-4 w-4" />,achievement: <Award className="h-4 w-4" />,reminder: <Clock className="h-4 w-4" />,message: <MessageCircle className="h-4 w-4" />
      }
return icons[type as keyof typeof icons] || <Bell className="h-4 w-4" />
}

    const getNotificationColor = (type: string) => {
      const colors = {urgent: 'text-red-500 bg-red-500/10',insight: 'text-purple-500 bg-purple-500/10',achievement: 'text-green-500 bg-green-500/10',reminder: 'text-blue-500 bg-blue-500/10',message: 'text-orange-500 bg-orange-500/10'
      }
return colors[type as keyof typeof colors] || 'text-gray-500 bg-gray-500/10'
}

    const filteredNotifications = notifications.filter((n) => {
        if (selectedTab === 'all') return true;
        if (selectedTab === 'urgent') return n.type === 'urgent';
        if (selectedTab === 'insights') return n.type === 'insight';
        return true;
    });
    
    // AI Assistant Component 
    const AIAssistant = () => ( 
      <Card className="mt-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4" /> AI Teaching Assistant 
            </CardTitle>
            <Button size="sm" variant="ghost" onClick={() => setShowAIAssistant(false)} > 
              × 
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <h4 className="font-medium text-sm">Top Insights</h4>
          {aiInsights.slice(0, 3).map((insight) => ( 
            <div key={insight.id} className="space-y-2 p-3 rounded-lg bg-muted/50">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {insight.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {insight.description}
                  </p>
                  {insight.suggestedAction && ( 
                    <Button size="sm" variant="link" className="h-auto p-0 mt-2 text-xs" >
                      {insight.suggestedAction} → 
                    </Button> 
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="secondary" className="text-xs">
                  {Math.round(insight.confidence * 100)}% confidence 
                </Badge>
                <Badge variant={insight.impact === 'high' ? 'default' : 'outline'} className="text-xs" >
                  {insight.impact} impact 
                </Badge>
              </div>
            </div> 
          ))}
        </CardContent>
      </Card>
    );
    
    // Notification Item Component 
    const NotificationItem = ({ notification }: { notification: Notification }) => {
      return (
        <div 
          onClick={() => onNotificationRead(notification.id)} 
          className={cn(
            "relative p-4 rounded-lg border cursor-pointer",
            !notification.read && "bg-muted/50"
          )}
        >
      {
      /* Unread Indicator */} {!notification.read && ( <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r" /> )}<div className="flex items-start gap-3 ml-2">
      {
      /* Icon */
      }<div className={cn("p-2 rounded-lg",
      getNotificationColor(notification.type))
      }>
      {getNotificationIcon(notification.type)}
    </div>
      {
      /* Content */
      }<div className="flex-1 space-y-1"><div className="flex items-start justify-between"><h4 className="text-sm font-medium">
      {notification.title}
    </h4><span className="text-xs text-muted-foreground">{new Date(notification.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }
      )
      }
    </span>
    </div><p className="text-xs text-muted-foreground">
      {notification.description}
    </p>
      {
      /* Metadata */} {notification.metadata && ( <div className="flex items-center gap-2 mt-2">{notification.metadata.studentAvatar && ( <Avatar className="h-6 w-6">
        <AvatarImage src={notification.metadata.studentAvatar} />
        <AvatarFallback>
        {notification.metadata.studentName?.charAt(0)}
        </AvatarFallback></Avatar> )} {notification.metadata.className && ( <Badge variant="outline" className="text-xs">
        {notification.metadata.className}</Badge> )} {notification.metadata.score !== undefined && ( <Badge variant="secondary" className="text-xs"> Score: {notification.metadata.score}% </Badge> )}
      </div> )} {
      /* Action Button */} {notification.actionable && notification.action && ( <Button size="sm" variant="secondary" className="mt-2" onClick={(e) => {
          e.stopPropagation();
          notification.action?.onClick()
}} >
      {notification.action.label}
    </Button> )}
    </div>
    </div>
    </div>
    )
}

  return (<div className="space-y-4">
      {
    /* Header */
    }<div className="flex items-center justify-between">
  <div><h2 className="text-2xl font-bold flex items-center gap-2"><Bell className="h-6 w-6" /> Smart Notifications {unreadCount > 0 && ( <Badge variant="destructive" className="ml-2">
      {unreadCount}
    </Badge> )}
    </h2><p className="text-sm text-muted-foreground mt-1"> Stay updated with real-time alerts and insights </p>
  </div>{unreadCount > 0 && ( <Button variant="outline" size="sm" onClick={onMarkAllRead}> Mark all read </Button> )}
    </div>
      {
    /* Tab Navigation */
    }<div className="flex gap-2">{(['all', 'urgent', 'insights'] as const).map((tab) => ( <Button key={tab} variant={selectedTab === tab ? 'default' : 'secondary'} size="sm" onClick={() => setSelectedTab(tab)} className="capitalize" >{tab === 'all' && 'All'} {tab === 'urgent' && ( <><AlertTriangle className="h-3 w-3 mr-1" /> Urgent </> )} {tab === 'insights' && ( <><Brain className="h-3 w-3 mr-1" /> Insights </> )}
    </Button> ))}
    </div>
      {
    /* AI Assistant Toggle */} {!showAIAssistant && ( <Button variant="outline" size="sm" onClick={() => setShowAIAssistant(true)} className="w-full" ><Brain className="h-4 w-4 mr-2" /> Show AI Assistant Insights </Button> )} {
    /* AI Assistant */
      } {showAIAssistant && <AIAssistant />} {
    /* Notifications List */
    }<ScrollArea className="h-[400px]"><div className="space-y-3">{filteredNotifications.map((notification) => ( <NotificationItem key={notification.id} notification={notification} /> ))} {filteredNotifications.length === 0 && ( <div className="text-center py-8 text-muted-foreground"><Bell className="h-12 w-12 mx-auto mb-3 opacity-20" /><p>No {selectedTab !== 'all' ? selectedTab : ''} notifications</p>
  </div> )}
    </div>
  </ScrollArea>
  </div>
  )
}

export default SmartNotificationsPanel;
