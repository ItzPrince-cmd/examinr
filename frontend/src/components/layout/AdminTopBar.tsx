import React from 'react';

import {
  Bell,
  Search,
  MessageSquare,
  RefreshCw,
  Activity,
  Users,
  BookOpen,
  TrendingUp,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { useTheme } from '../theme/theme-provider';

const AdminTopBar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const stats = [
    {
      label: 'Total Users',
      value: '12,345',
      change: '+12%',
      icon: Users
    },
    {
      label: 'Active Batches',
      value: '234',
      change: '+5%',
      icon: BookOpen
    },
    {
      label: 'Questions',
      value: '45,678',
      change: '+23%',
      icon: Activity
    },
    {
      label: 'Success Rate',
      value: '87%',
      change: '+3%',
      icon: TrendingUp
    },
  ];
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search users, questions, batches..." className="pl-8 h-9" />
          </div>
        </div>
        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? ( <Sun className="h-4 w-4" /> ) : ( <Moon className="h-4 w-4" /> )}
          </Button>
          {/* Refresh */}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <RefreshCw className="h-4 w-4" />
          </Button>
          {/* Messages */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <MessageSquare className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  5
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Messages</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Support Request</p>
                  <p className="text-xs text-muted-foreground">User facing login issues...</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Question Review</p>
                  <p className="text-xs text-muted-foreground">New physics questions pending...</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center">
                <span className="text-sm text-primary">View all messages</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                  12
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">New Batch Created</p>
                  <p className="text-xs text-muted-foreground">JEE Advanced 2024 batch started</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">High Server Load</p>
                  <p className="text-xs text-muted-foreground">CPU usage above 80%</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center">
                <span className="text-sm text-primary">View all notifications</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Quick Stats Bar */}
      <div className="border-t px-6 py-3 bg-muted/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-semibold">
                      {stat.value}
                    </p>
                    <span className="text-xs text-green-600">
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;