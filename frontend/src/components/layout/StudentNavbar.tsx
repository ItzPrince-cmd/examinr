import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  Home,
  Brain,
  FileText,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Sun,
  Moon,
  GraduationCap,
  Settings,
  HelpCircle,
  BookOpen,
  Award,
  Clock,
  Calendar,
  ChevronDown,
  Zap,
  Target,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../theme/theme-provider';
import { toast } from '../ui/use-toast';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../ui/navigation-menu';
import { cn } from '../../lib/utils';

const StudentNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    } catch (error) {
      toast({
        title: 'Logout failed',
        description: 'Failed to logout. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const practiceMenuItems = [
    {
      label: 'Subject Practice',
      href: '/practice',
      icon: BookOpen,
      description: 'Practice by subject and topic',
    },
    {
      label: 'Quick Practice',
      href: '/practice/quick',
      icon: Zap,
      description: 'Random 10-minute practice',
    },
    {
      label: 'Weak Areas',
      href: '/practice/weak',
      icon: Target,
      description: 'Focus on your weak topics',
    },
    {
      label: 'Bookmarked Questions',
      href: '/practice/bookmarks',
      icon: Award,
      description: 'Review saved questions',
    },
  ];
  const testMenuItems = [
    {
      label: 'All Tests',
      href: '/tests',
      icon: FileText,
      description: 'Browse available tests',
    },
    {
      label: 'Mock Tests',
      href: '/tests/mock',
      icon: Target,
      description: 'Full-length mock exams',
    },
    {
      label: 'Chapter Tests',
      href: '/tests/chapter',
      icon: BookOpen,
      description: 'Topic-wise assessments',
    },
    {
      label: 'Test History',
      href: '/tests/history',
      icon: Clock,
      description: 'View past attempts',
    },
  ];
  const analyticsMenuItems = [
    {
      label: 'Performance Overview',
      href: '/analytics',
      icon: BarChart3,
      description: 'Overall performance metrics',
    },
    {
      label: 'Subject Analysis',
      href: '/analytics/subjects',
      icon: BookOpen,
      description: 'Subject-wise breakdown',
    },
    {
      label: 'Progress Tracker',
      href: '/analytics/progress',
      icon: Target,
      description: 'Track your improvement',
    },
    {
      label: 'Weak Areas',
      href: '/analytics/weak-areas',
      icon: AlertCircle,
      description: 'Identify areas to improve',
    },
  ];
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="hidden font-bold sm:inline-block text-xl"> Examinr </span>
            </Link>
            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/dashboard">
                    <NavigationMenuLink
                      className={cn(
                        'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
                        location.pathname === '/dashboard' && 'bg-accent/50'
                      )}
                    >
                      <Home className="mr-2 h-4 w-4" /> Dashboard{' '}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10">
                    <Brain className="mr-2 h-4 w-4" /> Practice{' '}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {practiceMenuItems.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center gap-2">
                                <item.icon className="h-4 w-4" />
                                <div className="text-sm font-medium leading-none">{item.label}</div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10">
                    <FileText className="mr-2 h-4 w-4" /> Tests{' '}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {testMenuItems.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center gap-2">
                                <item.icon className="h-4 w-4" />
                                <div className="text-sm font-medium leading-none">{item.label}</div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10">
                    <BarChart3 className="mr-2 h-4 w-4" /> Analytics{' '}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {analyticsMenuItems.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center gap-2">
                                <item.icon className="h-4 w-4" />
                                <div className="text-sm font-medium leading-none">{item.label}</div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          {/* Search, Notifications, and Profile */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search questions, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-4 h-9 w-[200px] lg:w-[300px]"
                />
              </div>
            </form>
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hidden md:flex"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            {/* Help */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={() => navigate('/help')}
            >
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
                    <p className="text-xs text-muted-foreground">
                      JEE Main Full Test #13 is now live
                    </p>
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
                    <p className="text-xs text-muted-foreground">
                      You've maintained a 7-day streak 🔥
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center">
                  <Link to="/notifications" className="text-sm text-primary">
                    {' '}
                    View all notifications{' '}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile?tab=preferences')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/achievements')}>
                    <Award className="mr-2 h-4 w-4" />
                    <span>Achievements</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/study-plan')}>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Study Plan</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/help')}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}{' '}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-4 h-9 w-full"
                />
              </div>
            </form>
            {/* Mobile Navigation Links */}
            <nav className="space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md"
              >
                <Home className="h-4 w-4" /> Dashboard{' '}
              </Link>
              <div className="space-y-1">
                <p className="px-3 py-2 text-sm font-medium text-muted-foreground">Practice</p>
                {practiceMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-6 py-2 rounded-md text-sm"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="space-y-1">
                <p className="px-3 py-2 text-sm font-medium text-muted-foreground">Tests</p>
                {testMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-6 py-2 rounded-md text-sm"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="space-y-1">
                <p className="px-3 py-2 text-sm font-medium text-muted-foreground">Analytics</p>
                {analyticsMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-6 py-2 rounded-md text-sm"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
              <Separator className="my-2" />
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md"
              >
                <User className="h-4 w-4" /> Profile{' '}
              </Link>
              <Link
                to="/achievements"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md"
              >
                <Award className="h-4 w-4" /> Achievements{' '}
              </Link>
              <Button
                variant="ghost"
                onClick={() => {
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full justify-start"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" /> Light Mode{' '}
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" /> Dark Mode{' '}
                  </>
                )}
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default StudentNavbar;
