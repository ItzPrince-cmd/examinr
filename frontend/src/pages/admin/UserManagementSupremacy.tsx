import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { AnimatePresenceWrapper } from '../../components/teacher/AnimatePresenceWrapper';

  import {
  Users,
  UserPlus,
  Shield,
  Lock,
  Unlock,
  Mail,
  Search,
  Filter,
  MoreVertical,
  ChevronDown,
  Activity,
  TrendingUp,
  AlertCircle,
  Clock,
  CreditCard,
  Calendar,
  MessageSquare,
  History,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Eye,
  Edit3,
  Trash2,
  Ban,
  Settings,
  Key,
  Award,
  Star,
  Zap,
  Phone,
  MapPin,
  Globe,
  BarChart3,
  PieChart,
  LineChart,
  Database} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { ScrollArea } from '../../components/ui/scroll-area';

  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

  import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter} from '../../components/ui/dialog';
import { cn } from '../../lib/utils';

  interface User { id: string;
  name: string;
  email: string;
  avatar?: string;role: 'student' | 'teacher' | 'admin';status: 'active' | 'inactive' | 'suspended' | 'pending';subscription: { plan: 'free' | 'basic' | 'premium' | 'enterprise';status: 'active' | 'expired' | 'cancelled';
    expiresAt: Date
}

    stats: { lastActive: Date;
    totalSessions: number;
    averageScore: number;
    testsCompleted: number;
    questionsAnswered: number;
    timeSpent: number
}

    location?: { city: string;
    country: string
}

  createdAt: Date
}

  interface UserActivity { id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: Date;type: 'login' | 'test' | 'payment' | 'profile' | 'content'
}

  const UserManagementSupremacy: React.FC = () => {
    const [users, setUsers] = useState<User[]>([
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        role: 'student',
        status: 'active',
        subscription: {
          plan: 'premium',
          status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }, stats: {
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      totalSessions: 145,
      averageScore: 82,
      testsCompleted: 34,
      questionsAnswered: 892,
      timeSpent: 4567}, location: { city: 'New York', country: 'USA' }, createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }, { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane', role: 'teacher', status: 'active', subscription: {plan: 'enterprise',status: 'active',
      expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
        }, stats: {
      lastActive: new Date(Date.now() - 30 * 60 * 1000),
      totalSessions: 432,
      averageScore: 0,
      testsCompleted: 0,
      questionsAnswered: 0,
      timeSpent: 12890}, location: { city: 'London', country: 'UK' }, createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) } ]

  );
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({ role: 'all', status: 'all', subscription: 'all' });
  const [showUserDetails, setShowUserDetails] = useState<User | null>(null);
  const [showInterventionModal, setShowInterventionModal] = useState<{
    user: User;
    action: 'suspend' | 'delete' | 'reset-password' | 'change-role';
  } | null>(null);
  // Virtual scroll for handling large user lists 
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
    useEffect(() => {
      const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const { scrollTop, clientHeight } = scrollContainerRef.current;
      const itemHeight = 80;
      // Approximate height of each user row 
      const buffer = 5;
      const start = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
      const end = Math.min(
        users.length, 
        Math.ceil((scrollTop + clientHeight) / itemHeight) + buffer
      );
      setVisibleRange({ start, end });
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [users.length]);
  // User Row Component with Radial Menu 
  const UserRow = ({ user, index }: { user: User; index: number }) => {
    const [showRadialMenu, setShowRadialMenu] = useState(false);
    const isSelected = selectedUsers.has(user.id);
    const getRoleColor = () => {
      switch (user.role) {
        case 'admin': return 'from-purple-500 to-pink-500';
        case 'teacher': return 'from-blue-500 to-cyan-500';
        case 'student': return 'from-green-500 to-emerald-500';
        default: return 'from-gray-500 to-gray-600';
      }
    };

    const getStatusColor = () => {
      switch (user.status) {
        case 'active': return 'text-green-500';
        case 'inactive': return 'text-gray-500';
        case 'suspended': return 'text-red-500';
        case 'pending': return 'text-yellow-500';
        default: return 'text-gray-500';
      }
    };
    const quickActions = [
      { icon: Eye, label: 'View', angle: 0 },
      { icon: Edit3, label: 'Edit', angle: 45 },
      { icon: Mail, label: 'Message', angle: 90 },
      { icon: Key, label: 'Reset Password', angle: 135 },
      { icon: Lock, label: 'Suspend', angle: 180 },
      { icon: History, label: 'Activity', angle: 225 },
      { icon: CreditCard, label: 'Billing', angle: 270 },
      { icon: Trash2, label: 'Delete', angle: 315 }
    ];
    return (
      <motion.div 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ delay: index * 0.02 }} 
        className="relative"
      >
        <Card 
          className={cn(
            "p-4 transition-all cursor-pointer",
            isSelected && "ring-2 ring-primary"
          )}
        >
          <div className="flex items-center gap-4">
            {/* Checkbox with wave effect */}
            <motion.div whileTap={{ scale: 0.9 }} className="relative">
              <Checkbox 
                checked={isSelected} 
                onCheckedChange={(checked) => {
                  setSelectedUsers(prev => {
                    const newSet = new Set(prev);
                    if (checked) {
                      newSet.add(user.id);
                    } else {
                      newSet.delete(user.id);
                    }
                    return newSet;
                  });
                }} 
              />
              {isSelected && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0.5 }} 
                  animate={{ scale: 3, opacity: 0 }} 
                  transition={{ duration: 0.5 }} 
                  className="absolute inset-0 bg-primary rounded-full" 
                />
              )}
            </motion.div>
            {/* User Avatar with Status Indicator */}
            <div className="relative">
              <Avatar className="h-12 w-12">
    <AvatarImage src={user.avatar} />
    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}
    </AvatarFallback>
    </Avatar><motion.div className={cn("absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",user.status === 'active' ?"bg-green-500" :"bg-gray-500" )} animate={user.status === 'active' ? { scale: [1, 1.2, 1], } : {}} transition={{ duration: 2, repeat: Infinity }} />
    </div>
            {/* User Info */}
            <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><h4 className="font-semibold truncate">
      {user.name}
    </h4><Badge variant="outline" className={cn("text-xs", `bg-gradient-to-r ${getRoleColor()} text-white`)} >
      {user.role}
    </Badge>
    </div><p className="text-sm text-muted-foreground truncate">
      {user.email}
    </p>
    </div>
            {/* Stats */}
            <div className="hidden md:flex items-center gap-6"><div className="text-center"><p className="text-2xl font-bold">
      {user.stats.testsCompleted}
    </p><p className="text-xs text-muted-foreground">Tests</p>
    </div><div className="text-center"><p className="text-2xl font-bold">{user.stats.averageScore > 0 ? `${user.stats.averageScore}%` : '-'}
    </p><p className="text-xs text-muted-foreground">Avg Score</p>
    </div><div className="text-center"><p className={cn("text-sm font-medium", getStatusColor())}>
      {user.status}
    </p><p className="text-xs text-muted-foreground">
      {formatDistanceToNow(user.stats.lastActive)}
    </p>
    </div>
    </div>
            {/* Subscription Badge */}
            <div className="hidden lg:block"><Badge variant={user.subscription.status === 'active' ? 'default' : 'secondary'} className="gap-1" >{user.subscription.plan} {user.subscription.status === 'active' && ( <motion.div className="w-1.5 h-1.5 bg-green-400 rounded-full ml-1" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} /> )}
    </Badge>
    </div>
            {/* Quick Actions Button */}
            <div className="relative"><Button size="sm" variant="ghost" onClick={() => setShowRadialMenu(!showRadialMenu)} ><MoreVertical className="h-4 w-4" />
    </Button>
              {/* Radial Menu */}
              <AnimatePresenceWrapper>
      {showRadialMenu && ( <>
                {/* Backdrop */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" onClick={() => setShowRadialMenu(false)} />
                {/* Radial Menu Items */}
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute right-0 top-0 z-50" >
          {quickActions.map((action, i) => {
          const Icon = action.icon;
          const radius = 80;
          const angleRad = (action.angle * Math.PI) / 180;
                  const x = radius * Math.cos(angleRad);
                  const y = radius * Math.sin(angleRad);
          return (
                  <motion.button 
                    key={action.label} 
                    initial={{ x: 0, y: 0 }} 
                    animate={{ x, y }} 
                    exit={{ x: 0, y: 0 }} 
                    transition={{ delay: i * 0.03 }} 
                    whileTap={{ scale: 0.9 }} 
                    onClick={() => {
                      setShowRadialMenu(false);
                      if (action.label === 'View') {
                        setShowUserDetails(user);
                      }
                    }} 
                    className={cn(
                      "absolute w-10 h-10 rounded-full",
                      "bg-background border shadow-lg",
                      "flex items-center justify-center",
                      "transition-colors"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresenceWrapper>
    </div>
  </div>
</Card>
</motion.div>
    );
  };

  // User Details Panel 
  const UserDetailsPanel = ({ user }: { user: User }) => {
    const [activeTab, setActiveTab] = useState('overview');
  return (
    <Dialog open={!!user} onOpenChange={() => setShowUserDetails(null)}><DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
  <DialogHeader><div className="flex items-center gap-4"><Avatar className="h-16 w-16">
  <AvatarImage src={user.avatar} />
  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}
    </AvatarFallback>
  </Avatar>
  <div><DialogTitle className="text-2xl">
      {user.name}
    </DialogTitle><p className="text-muted-foreground">
      {user.email}
    </p></div><Badge className="ml-auto" variant={user.status === 'active' ? 'default' : 'secondary'}>
      {user.status}
    </Badge>
  </div>
  </DialogHeader><Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6"><TabsList className="grid w-full grid-cols-4"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger><TabsTrigger value="performance">Performance</TabsTrigger><TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList><ScrollArea className="h-[500px] mt-4"><TabsContent value="overview" className="space-y-6">
                {/* Profile Information */}
                <Card>
  <CardHeader><CardTitle className="text-base">Profile Information</CardTitle>
  </CardHeader><CardContent className="grid grid-cols-2 gap-4">
  <div><Label className="text-muted-foreground">Role</Label><p className="font-medium capitalize">
      {user.role}
    </p>
  </div>
  <div><Label className="text-muted-foreground">Member Since</Label><p className="font-medium">
      {user.createdAt.toLocaleDateString()}
    </p>
  </div>
  <div><Label className="text-muted-foreground">Location</Label><p className="font-medium flex items-center gap-1"><MapPin className="h-3 w-3" />
      {user.location?.city}, {user.location?.country}
    </p>
  </div>
  <div><Label className="text-muted-foreground">Last Active</Label><p className="font-medium">
      {formatDistanceToNow(user.stats.lastActive)}
    </p>
  </div>
  </CardContent>
  </Card>
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4"><Card className="p-4"><div className="flex items-center justify-between">
  <div><p className="text-2xl font-bold">
      {user.stats.totalSessions}
    </p><p className="text-xs text-muted-foreground">Total Sessions</p>
  </div><Activity className="h-8 w-8 text-muted-foreground" />
  </div>
  </Card><Card className="p-4"><div className="flex items-center justify-between">
  <div><p className="text-2xl font-bold">
      {user.stats.testsCompleted}
    </p><p className="text-xs text-muted-foreground">Tests Completed</p>
  </div><Award className="h-8 w-8 text-muted-foreground" />
  </div>
  </Card><Card className="p-4"><div className="flex items-center justify-between">
  <div><p className="text-2xl font-bold">
      {Math.floor(user.stats.timeSpent / 60)}h</p><p className="text-xs text-muted-foreground">Time Spent</p>
  </div><Clock className="h-8 w-8 text-muted-foreground" />
  </div>
  </Card>
  </div>
                {/* Intervention Tools */}
                <Card>
  <CardHeader><CardTitle className="text-base">Account Actions</CardTitle>
  </CardHeader><CardContent className="grid grid-cols-2 gap-3"><Button variant="outline" className="justify-start" onClick={() => setShowInterventionModal({ user, action: 'reset-password' }
    )
    } ><Key className="h-4 w-4 mr-2" /> Reset Password </Button><Button variant="outline" className="justify-start" onClick={() => setShowInterventionModal({ user, action: 'change-role' }
    )
    } ><Shield className="h-4 w-4 mr-2" /> Change Role </Button><Button variant="outline" className="justify-start text-yellow-600" onClick={() => setShowInterventionModal({ user, action: 'suspend' }
    )
    } ><Lock className="h-4 w-4 mr-2" /> Suspend Account </Button><Button variant="outline" className="justify-start text-red-600" onClick={() => setShowInterventionModal({ user, action: 'delete' }
    )
    } ><Trash2 className="h-4 w-4 mr-2" /> Delete Account </Button>
  </CardContent>
  </Card>
  </TabsContent><TabsContent value="activity" className="space-y-4">
                {/* Activity Timeline */}
                <Card>
  <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle>
  </CardHeader>
  <CardContent><div className="space-y-4">
      {[ {action: 'Completed test',details: 'Physics Mock Test #5',time: '2 hours ago',type: 'test'
        }, {action: 'Logged in',details: 'From Chrome on Windows',time: '5 hours ago',type: 'login'
        }, {action: 'Updated profile',details: 'Changed profile picture',time: '1 day ago',type: 'profile'
        }, {action: 'Made payment',details: 'Premium subscription renewed',time: '3 days ago',type: 'payment'} ].map((activity, i) => ( <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-3" ><div className={cn("w-8 h-8 rounded-full flex items-center justify-center",activity.type === 'test' &&"bg-blue-100 text-blue-600",activity.type === 'login' &&"bg-green-100 text-green-600",activity.type === 'profile' &&"bg-purple-100 text-purple-600",activity.type === 'payment' &&"bg-yellow-100 text-yellow-600" )}>{activity.type === 'test' && <Award className="h-4 w-4" />} {activity.type === 'login' && <Activity className="h-4 w-4" />} {activity.type === 'profile' && <Users className="h-4 w-4" />} {activity.type === 'payment' && <CreditCard className="h-4 w-4" />}
    </div><div className="flex-1"><p className="font-medium">
      {activity.action}
    </p><p className="text-sm text-muted-foreground">
      {activity.details}
    </p><p className="text-xs text-muted-foreground mt-1">
      {activity.time}
    </p>
    </div>
  </motion.div> ))}
    </div>
  </CardContent>
  </Card>
  </TabsContent><TabsContent value="performance" className="space-y-4">
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4">
  <Card>
  <CardHeader><CardTitle className="text-base">Test Performance</CardTitle>
  </CardHeader>
  <CardContent><div className="space-y-4">
  <div><div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground">Average Score</span><span className="font-bold">
      {user.stats.averageScore}%</span>
  </div>
  <Progress value={user.stats.averageScore} />
  </div>
  <div><div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground">Completion Rate</span><span className="font-bold">87%</span>
  </div>
  <Progress value={87} />
  </div>
  </div>
  </CardContent>
  </Card>
  <Card>
  <CardHeader><CardTitle className="text-base">Learning Progress</CardTitle>
  </CardHeader>
  <CardContent><div className="flex items-center justify-center h-32"><div className="relative w-24 h-24"><svg className="w-full h-full transform -rotate-90"><circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" /><circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray={`${2 * Math.PI * 36}`} strokeDashoffset={`${2 * Math.PI * 36 * (1 - 0.73)}`} className="text-primary transition-all duration-1000" />
  </svg><div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl font-bold">73%</span>
  </div>
  </div>
  </div>
  </CardContent>
  </Card>
  </div>
  </TabsContent><TabsContent value="billing" className="space-y-4">
                {/* Subscription Details */}
                <Card>
  <CardHeader><CardTitle className="text-base">Subscription Details</CardTitle>
  </CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between p-4 bg-muted rounded-lg"><div className="flex items-center gap-3"><div className={cn("w-12 h-12 rounded-lg flex items-center justify-center","bg-gradient-to-br from-yellow-500 to-orange-500 text-white")}><Star className="h-6 w-6" />
  </div>
  <div><p className="font-semibold capitalize">
      {user.subscription.plan} Plan</p><p className="text-sm text-muted-foreground">{user.subscription.status === 'active' ? 'Active' : 'Inactive'}
    </p>
  </div>
  </div><div className="text-right"><p className="font-bold">$99/month</p><p className="text-xs text-muted-foreground"> Renews {user.subscription.expiresAt.toLocaleDateString()}
    </p>
  </div>
  </div><div className="space-y-2"><h4 className="font-medium">Payment History</h4>{[ { date: '2024-01-01', amount: 99, status: 'success' }, { date: '2023-12-01', amount: 99, status: 'success' }, { date: '2023-11-01', amount: 99, status: 'failed' } ].map((payment, i) => ( <div key={i} className="flex items-center justify-between p-3 border rounded-lg"><div className="flex items-center gap-3"><CreditCard className="h-4 w-4 text-muted-foreground" /><span className="text-sm">
      {payment.date}
    </span>
    </div><div className="flex items-center gap-3"><span className="font-medium">${payment.amount}</span><Badge variant={payment.status === 'success' ? 'default' : 'destructive'} className="text-xs" >
      {payment.status}
    </Badge>
    </div>
  </div> ))}
    </div>
  </CardContent>
  </Card>
  </TabsContent>
  </ScrollArea>
  </Tabs>
  </DialogContent>
    </Dialog>
  );
  };

  // Helper function 
  const formatDistanceToNow = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {
  /* Header */
}<div className="flex items-center justify-between">
<div><h2 className="text-3xl font-bold">User Management</h2><p className="text-muted-foreground"> Manage {users.length.toLocaleString()} users across your platform </p>
</div>
<Button><UserPlus className="h-4 w-4 mr-2" /> Add User </Button>
</div>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4"><Card className="p-4"><div className="flex items-center justify-between">
<div><p className="text-2xl font-bold">3,847</p><p className="text-xs text-muted-foreground">Total Users</p>
</div><Users className="h-8 w-8 text-muted-foreground" />
</div><div className="mt-2 flex items-center gap-1 text-sm text-green-500"><TrendingUp className="h-3 w-3" />
<span>12% from last month</span>
</div>
</Card><Card className="p-4"><div className="flex items-center justify-between">
<div><p className="text-2xl font-bold">2,456</p><p className="text-xs text-muted-foreground">Active Today</p>
</div><Activity className="h-8 w-8 text-muted-foreground" />
</div><Progress value={64} className="mt-2 h-2" />
</Card><Card className="p-4"><div className="flex items-center justify-between">
<div><p className="text-2xl font-bold">892</p><p className="text-xs text-muted-foreground">Premium Users</p>
</div><Star className="h-8 w-8 text-yellow-500" />
</div><Progress value={23} className="mt-2 h-2" />
</Card><Card className="p-4"><div className="flex items-center justify-between">
<div><p className="text-2xl font-bold">45</p><p className="text-xs text-muted-foreground">Need Attention</p>
</div><AlertCircle className="h-8 w-8 text-red-500" />
</div><div className="mt-2 flex items-center gap-1 text-sm text-red-500">
<span>Inactive or suspended</span>
</div>
</Card>
</div>
      {/* Filters and Search */}
      <Card><CardContent className="p-4"><div className="flex flex-col lg:flex-row gap-4"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by name, email, or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
</div><div className="flex items-center gap-2">
  <Select value={filters.role} onValueChange={(v) => setFilters({...filters, role: v}
  )
}><SelectTrigger className="w-32"><SelectValue placeholder="Role" />
</SelectTrigger>
<SelectContent><SelectItem value="all">All Roles</SelectItem><SelectItem value="student">Students</SelectItem><SelectItem value="teacher">Teachers</SelectItem><SelectItem value="admin">Admins</SelectItem>
</SelectContent>
</Select>
  <Select value={filters.status} onValueChange={(v) => setFilters({...filters, status: v}
  )
}><SelectTrigger className="w-32"><SelectValue placeholder="Status" />
</SelectTrigger>
<SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="suspended">Suspended</SelectItem><SelectItem value="pending">Pending</SelectItem>
</SelectContent>
</Select>
  <Select value={filters.subscription} onValueChange={(v) => setFilters({...filters, subscription: v}
  )
}><SelectTrigger className="w-32"><SelectValue placeholder="Plan" />
</SelectTrigger>
<SelectContent><SelectItem value="all">All Plans</SelectItem><SelectItem value="free">Free</SelectItem><SelectItem value="basic">Basic</SelectItem><SelectItem value="premium">Premium</SelectItem><SelectItem value="enterprise">Enterprise</SelectItem>
</SelectContent>
</Select><Button variant="outline" size="icon"><Filter className="h-4 w-4" />
</Button><Button variant="outline" size="icon"><Download className="h-4 w-4" />
</Button>
</div>
</div>
      {/* Bulk Actions */}
      <AnimatePresenceWrapper>{selectedUsers.size > 0 && ( <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 flex items-center gap-3" ><span className="text-sm font-medium">
      {selectedUsers.size} users selected </span><div className="flex items-center gap-2"><Button size="sm" variant="outline"><Mail className="h-4 w-4 mr-2" /> Send Email </Button><Button size="sm" variant="outline"><Shield className="h-4 w-4 mr-2" /> Change Role </Button><Button size="sm" variant="outline" className="text-yellow-600"><Lock className="h-4 w-4 mr-2" /> Suspend </Button><Button size="sm" variant="outline" className="text-red-600"><Trash2 className="h-4 w-4 mr-2" /> Delete </Button>
  </div><Button size="sm" variant="ghost" onClick={() => setSelectedUsers(new Set())} className="ml-auto" > Clear selection </Button>
</motion.div> )}
    </AnimatePresenceWrapper>
</CardContent>
</Card>
      {/* User List with Virtual Scrolling */}
      <Card><CardContent className="p-0"><div ref={scrollContainerRef} className="h-[600px] overflow-y-auto" ><div style={{ height: users.length * 80 }} className="relative" >
      {users.slice(visibleRange.start, visibleRange.end).map((user, index) => ( <div key={user.id} style={{position: 'absolute',
      top: (visibleRange.start + index) * 80,
      left: 0,
      right: 0,
      height: 80,padding: '8px'
    }} >
  <UserRow user={user} index={index} />
</div> ))}
    </div>
</div>
</CardContent>
</Card>
      {/* User Details Modal */}
      {showUserDetails && <UserDetailsPanel user={showUserDetails} />}
      {/* Intervention Modal */}
      <AnimatePresenceWrapper>
      {showInterventionModal && ( <Dialog open={true} onOpenChange={() => setShowInterventionModal(null)}>
  <DialogContent>
  <DialogHeader>
  <DialogTitle>{showInterventionModal.action === 'suspend' && 'Suspend User Account'} {showInterventionModal.action === 'delete' && 'Delete User Account'} {showInterventionModal.action === 'reset-password' && 'Reset User Password'} {showInterventionModal.action === 'change-role' && 'Change User Role'}
    </DialogTitle>
  </DialogHeader><div className="space-y-4"><div className="flex items-center gap-3">
  <Avatar>
  <AvatarImage src={showInterventionModal.user.avatar} />
  <AvatarFallback>{showInterventionModal.user.name.split(' ').map(n => n[0]).join('')}
    </AvatarFallback>
  </Avatar>
  <div><p className="font-medium">
      {showInterventionModal.user.name}
    </p><p className="text-sm text-muted-foreground">
      {showInterventionModal.user.email}
    </p>
  </div></div>{showInterventionModal.action === 'suspend' && ( <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"><p className="text-sm"> This will temporarily suspend the user's access to the platform. They will not be able to log in until the account is reactivated. </p></div> )} {showInterventionModal.action === 'delete' && ( <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"><p className="text-sm font-medium text-red-600 mb-2">Warning: This action cannot be undone!</p><p className="text-sm"> This will permanently delete the user account and all associated data. </p></div> )} {showInterventionModal.action === 'reset-password' && ( <div className="space-y-3"><p className="text-sm text-muted-foreground"> A password reset link will be sent to the user's email address. </p><div className="flex items-center gap-2"><Checkbox id="notify" /><Label htmlFor="notify" className="text-sm"> Send notification email to user </Label>
    </div></div> )} {showInterventionModal.action === 'change-role' && ( <div className="space-y-3">
    <Label>Select New Role</Label>
    <Select defaultValue={showInterventionModal.user.role}>
    <SelectTrigger>
    <SelectValue />
    </SelectTrigger>
    <SelectContent><SelectItem value="student">Student</SelectItem><SelectItem value="teacher">Teacher</SelectItem><SelectItem value="admin">Admin</SelectItem>
    </SelectContent>
    </Select>
  </div> )}
    </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInterventionModal(null)}>
              Cancel
            </Button>
            <Button 
              variant={showInterventionModal.action === 'delete' ? 'destructive' : 'default'} 
              onClick={() => {
                // Handle action 
                setShowInterventionModal(null);
              }}
            >
              {showInterventionModal.action === 'suspend' && 'Suspend Account'}
              {showInterventionModal.action === 'delete' && 'Delete Account'}
              {showInterventionModal.action === 'reset-password' && 'Send Reset Link'}
              {showInterventionModal.action === 'change-role' && 'Change Role'}
            </Button>
          </DialogFooter>
  </DialogContent>
</Dialog> )}
    </AnimatePresenceWrapper>
    </div>
  );
};

export default UserManagementSupremacy;
