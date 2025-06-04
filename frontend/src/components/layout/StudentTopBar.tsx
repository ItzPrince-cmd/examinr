import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useTheme } from '../theme/theme-provider';
import { toast } from '../ui/use-toast';

const StudentTopBar: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      toast({
        title: 'Search',
        description: `Searching for"${searchQuery}"...`,
      });
    }
  };

  return (
    <header className="h-16 border-b bg-background px-6 flex items-center justify-between">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search questions, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-10"
          />
        </div>
      </form>
      {/* Right Side Actions */}
      <div className="flex items-center gap-2 ml-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        {/* Help */}
        <Button variant="ghost" size="icon" onClick={() => navigate('/help')}>
          <HelpCircle className="h-5 w-5" />
        </Button>
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                {' '}
                3{' '}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px]">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/tests')}>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">New Mock Test Available</p>
                <p className="text-xs text-muted-foreground">JEE Main Full Test #13 is now live</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/analytics')}>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Weekly Report Ready</p>
                <p className="text-xs text-muted-foreground">
                  Check your performance for this week
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/achievements')}>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Achievement Unlocked!</p>
                <p className="text-xs text-muted-foreground">You've maintained a 7-day streak 🔥</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center">
              <span className="text-sm text-primary">View all notifications</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default StudentTopBar;
