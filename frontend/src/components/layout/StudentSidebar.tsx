import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  Home,
  Brain,
  FileText,
  BarChart3,
  Users,
  Target,
  Award,
  Calendar,
  HelpCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Zap,
  Trophy,
  GraduationCap,
} from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../ui/badge';

interface StudentSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigation = [
    {
      title: 'Main',
      items: [
        {
          name: 'Dashboard',
          href: '/student/dashboard',
          icon: Home,
          badge: null,
        },
        { name: 'Practice', href: '/practice', icon: Brain, badge: null },
        { name: 'Tests', href: '/tests', icon: FileText, badge: null },
        { name: 'Analytics', href: '/analytics', icon: BarChart3, badge: null },
      ],
    },
    {
      title: 'Learning',
      items: [
        { name: 'My Batches', href: '/batches', icon: Users, badge: null },
        {
          name: 'Study Plan',
          href: '/study-plan',
          icon: Calendar,
          badge: null,
        },
        {
          name: 'Weak Areas',
          href: '/practice/weak',
          icon: Target,
          badge: null,
        },
        {
          name: 'Bookmarks',
          href: '/practice/bookmarks',
          icon: BookOpen,
          badge: null,
        },
      ],
    },
    {
      title: 'Progress',
      items: [
        {
          name: 'Achievements',
          href: '/achievements',
          icon: Trophy,
          badge: '3',
        },
        { name: 'Leaderboard', href: '/leaderboard', icon: Award, badge: null },
        {
          name: 'Test History',
          href: '/tests/history',
          icon: Clock,
          badge: null,
        },
        {
          name: 'Quick Practice',
          href: '/practice/quick',
          icon: Zap,
          badge: null,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        { name: 'Profile', href: '/profile', icon: GraduationCap, badge: null },
        {
          name: 'Settings',
          href: '/profile?tab=preferences',
          icon: Settings,
          badge: null,
        },
        { name: 'Help', href: '/help', icon: HelpCircle, badge: null },
      ],
    },
  ];
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside
      className={cn(
        'relative flex h-full flex-col border-r bg-background transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Student Portal</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn('ml-auto', isCollapsed && 'mx-auto')}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-4 py-4">
          {navigation.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                        isActive(item.href)
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground',
                        isCollapsed && 'justify-center'
                      )}
                    >
                      <Icon className={cn('h-4 w-4', isCollapsed && 'h-5 w-5')} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          {item.badge && (
                            <Badge
                              variant={item.badge === 'NEW' ? 'default' : 'secondary'}
                              className="ml-auto"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      {/* Footer */}
      <div className="border-t p-4">
        {!isCollapsed ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium">{user?.name?.charAt(0) || 'S'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || 'Student'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout{' '}
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="icon" className="mx-auto" onClick={logout}>
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </aside>
  );
};

export default StudentSidebar;
