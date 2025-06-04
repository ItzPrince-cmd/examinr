import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserPlus,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Database,
  Award,
  Bell,
  Shield,
  FileText,
  Activity,
  Monitor,
  DollarSign,
} from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../ui/badge';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigation = [
    {
      title: 'Main',
      items: [
        {
          name: 'Dashboard',
          href: '/admin/dashboard',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          name: 'Question Bank',
          href: '/admin/questions',
          icon: Database,
          badge: null,
        },
        { name: 'Users', href: '/admin/users', icon: Users, badge: null },
        {
          name: 'Financial Management',
          href: '/admin/financial',
          icon: DollarSign,
          badge: null,
        },
        {
          name: 'Batches',
          href: '/admin/batches',
          icon: UserPlus,
          badge: null,
        },
        {
          name: 'Analytics',
          href: '/admin/analytics',
          icon: BarChart3,
          badge: null,
        },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          name: 'Courses',
          href: '/admin/courses',
          icon: BookOpen,
          badge: null,
        },
        {
          name: 'Achievements',
          href: '/admin/achievements',
          icon: Award,
          badge: null,
        },
        {
          name: 'Reports',
          href: '/admin/reports',
          icon: FileText,
          badge: null,
        },
        {
          name: 'Activity Log',
          href: '/admin/activity',
          icon: Activity,
          badge: null,
        },
      ],
    },
    {
      title: 'System',
      items: [
        {
          name: 'System Vitals',
          href: '/admin/system-vitals',
          icon: Monitor,
          badge: null,
        },
        {
          name: 'Settings',
          href: '/admin/settings',
          icon: Settings,
          badge: null,
        },
        {
          name: 'Security',
          href: '/admin/security',
          icon: Shield,
          badge: null,
        },
        {
          name: 'Notifications',
          href: '/admin/notifications',
          icon: Bell,
          badge: '3',
        },
        { name: 'Help', href: '/admin/help', icon: HelpCircle, badge: null },
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
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Admin Panel</span>
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
                <span className="text-sm font-medium">{user?.name?.charAt(0) || 'A'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
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

export default AdminSidebar;
