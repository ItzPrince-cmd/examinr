import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  Home,
  Users,
  FileText,
  BarChart3,
  BookOpen,
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
  Calendar,
  ChevronDown,
  ClipboardCheck,
  Plus,
  FolderOpen,
  MessageSquare,
  Award,
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

const TeacherNavbar: React.FC = () => {
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
      navigate(`/teacher/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const batchMenuItems = [
    {
      label: 'All Batches',
      href: '/teacher/batches',
      icon: Users,
      description: 'Manage your batches',
    },
    {
      label: 'Create Batch',
      href: '/teacher/batches/create',
      icon: Plus,
      description: 'Start a new batch',
    },
    {
      label: 'Schedule',
      href: '/teacher/schedule',
      icon: Calendar,
      description: 'View class schedule',
    },
    {
      label: 'Batch Analytics',
      href: '/teacher/batches/analytics',
      icon: BarChart3,
      description: 'Performance insights',
    },
  ];
  const assessmentMenuItems = [
    {
      label: 'Create Test/DPP',
      href: '/teacher/test/create',
      icon: Plus,
      description: 'Design new assessment',
    },
    {
      label: 'Test Library',
      href: '/teacher/tests',
      icon: FileText,
      description: 'Manage all tests',
    },
    {
      label: 'Review Submissions',
      href: '/teacher/reviews',
      icon: ClipboardCheck,
      description: 'Grade submissions',
    },
    {
      label: 'Question Bank',
      href: '/teacher/questions',
      icon: BookOpen,
      description: 'Browse questions',
    },
  ];
  const studentMenuItems = [
    {
      label: 'Student Overview',
      href: '/teacher/students',
      icon: Users,
      description: 'All students',
    },
    {
      label: 'Performance Tracking',
      href: '/teacher/students/performance',
      icon: BarChart3,
      description: 'Track progress',
    },
    {
      label: 'Attendance',
      href: '/teacher/attendance',
      icon: Calendar,
      description: 'Manage attendance',
    },
    {
      label: 'Reports',
      href: '/teacher/reports',
      icon: FileText,
      description: 'Generate reports',
    },
  ];
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link to="/teacher/dashboard" className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="hidden font-bold sm:inline-block text-xl">
                {' '}
                Examinr <span className="text-sm text-muted-foreground">Teacher</span>
              </span>
            </Link>
            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/teacher/dashboard">
                    <NavigationMenuLink
                      className={cn(
                        'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
                        location.pathname === '/teacher/dashboard' && 'bg-accent/50'
                      )}
                    >
                      <Home className="mr-2 h-4 w-4" /> Dashboard{' '}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10">
                    <Users className="mr-2 h-4 w-4" /> Batches{' '}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {batchMenuItems.map((item) => (
                        <li key={item.href}>
                          <Link to={item.href}>
                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors focus:bg-accent focus:text-accent-foreground">
                              <div className="flex items-center gap-2">
                                <item.icon className="h-4 w-4" />
                                <div className="text-sm font-medium leading-none">{item.label}</div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10">
                    <FileText className="mr-2 h-4 w-4" /> Assessments{' '}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {assessmentMenuItems.map((item) => (
                        <li key={item.href}>
                          <Link to={item.href}>
                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors focus:bg-accent focus:text-accent-foreground">
                              <div className="flex items-center gap-2">
                                <item.icon className="h-4 w-4" />
                                <div className="text-sm font-medium leading-none">{item.label}</div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10">
                    <BarChart3 className="mr-2 h-4 w-4" /> Students{' '}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {studentMenuItems.map((item) => (
                        <li key={item.href}>
                          <Link to={item.href}>
                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors focus:bg-accent focus:text-accent-foreground">
                              <div className="flex items-center gap-2">
                                <item.icon className="h-4 w-4" />
                                <div className="text-sm font-medium leading-none">{item.label}</div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/teacher/content">
                    <NavigationMenuLink
                      className={cn(
                        'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
                        location.pathname === '/teacher/content' && 'bg-accent/50'
                      )}
                    >
                      <FolderOpen className="mr-2 h-4 w-4" /> Content{' '}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          {/* Search, Notifications, and Profile */}
          <div className="flex items-center gap-4">
            {/* Quick Create Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Plus className="mr-2 h-4 w-4" /> Create <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/teacher/test/create')}>
                  <FileText className="mr-2 h-4 w-4" /> New Test/DPP{' '}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/teacher/batches/create')}>
                  <Users className="mr-2 h-4 w-4" /> New Batch{' '}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/teacher/content/upload')}>
                  <FolderOpen className="mr-2 h-4 w-4" /> Upload Content{' '}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/teacher/announcements/create')}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Announcement{' '}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search students, tests..."
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
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <HelpCircle className="h-5 w-5" />
            </Button>
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                    {' '}
                    5{' '}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px]">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">23 New Submissions</p>
                    <p className="text-xs text-muted-foreground">
                      Physics Chapter Test needs review
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Class Reminder</p>
                    <p className="text-xs text-muted-foreground">
                      JEE Advanced Batch A in 30 minutes
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Student Query</p>
                    <p className="text-xs text-muted-foreground">
                      Rahul Kumar asked about Thermodynamics
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center">
                  <Link to="/teacher/notifications" className="text-sm text-primary">
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
                    <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || 'T'}</AvatarFallback>
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
                  <DropdownMenuItem onClick={() => navigate('/teacher/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/teacher/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/teacher/achievements')}>
                    <Award className="mr-2 h-4 w-4" />
                    <span>Achievements</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/teacher/schedule')}>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>My Schedule</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/teacher/help')}>
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
            {/* Mobile Quick Create */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  navigate('/teacher/test/create');
                  setIsMobileMenuOpen(false);
                }}
              >
                <FileText className="mr-2 h-4 w-4" /> New Test{' '}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  navigate('/teacher/batches/create');
                  setIsMobileMenuOpen(false);
                }}
              >
                <Users className="mr-2 h-4 w-4" /> New Batch{' '}
              </Button>
            </div>
            {/* Mobile Navigation Links */}
            <nav className="space-y-2">
              <Link
                to="/teacher/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md"
              >
                <Home className="h-4 w-4" /> Dashboard{' '}
              </Link>
              <div className="space-y-1">
                <p className="px-3 py-2 text-sm font-medium text-muted-foreground">Batches</p>
                {batchMenuItems.map((item) => (
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
                <p className="px-3 py-2 text-sm font-medium text-muted-foreground">Assessments</p>
                {assessmentMenuItems.map((item) => (
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
                <p className="px-3 py-2 text-sm font-medium text-muted-foreground">Students</p>
                {studentMenuItems.map((item) => (
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
              <Link
                to="/teacher/content"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md"
              >
                <FolderOpen className="h-4 w-4" /> Content Management{' '}
              </Link>
              <Separator className="my-2" />
              <Link
                to="/teacher/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md"
              >
                <User className="h-4 w-4" /> Profile{' '}
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

export default TeacherNavbar;
