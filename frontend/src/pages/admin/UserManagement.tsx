import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { AnimatePresenceWrapper } from '../../components/teacher/AnimatePresenceWrapper';

  import {
  Users,
  Shield,
  Ban,
  Edit3,
  Mail,
  Phone,
  Download,
  Search,
  Filter,
  UserPlus,
  AlertTriangle,
  TrendingUp,
  Clock,
  Calendar,
  Activity,
  Award,
  XCircle,
  CheckCircle,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Star,
  Zap,
  GraduationCap,
  BookOpen,
  Target,
  Brain,
  Heart,
  MessageSquare,
  Eye,
  Settings,
  RefreshCw,
  Plus} from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Switch } from '../../components/ui/switch';
import { cn } from '../../lib/utils';
import { FixedSizeList as List } from 'react-window';

  interface User { id: string;
  name: string;
  email: string;role: 'student' | 'teacher' | 'admin';
  avatar?: string;status: 'active' | 'inactive' | 'suspended';
  lastActive: Date;
  joinedDate: Date;plan: 'free' | 'basic' | 'premium' | 'enterprise';
    metrics: { testsCompleted?: number;
    averageScore?: number;
    studentsManaged?: number;
    coursesCreated?: number;
    activeTime: number;
    loginStreak: number
}

  tags: string[]
}

  interface UserAction { id: string;
  label: string;
  icon: React.ElementType;
  action: (user: User) => void;variant?: 'default' | 'destructive' | 'secondary'
}

const UserManagement: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'student' | 'teacher' | 'admin'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'activity'>('activity');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRadialMenuOpen, setIsRadialMenuOpen] = useState(false
  );
  const radialMenuRef = useRef<HTMLDivElement>(null

  );
  // Mock user data with thousands of users
  const allUsers: User[] = Array.from({ length: 5000 }, (_, i) => ({
    id: `user-${i}`,
    name: `${['John','Jane','Mike','Sarah','David','Emily'][i % 6]} ${['Smith','Johnson','Williams','Brown','Jones'][i % 5]}`,
    email: `user${i}@example.com`,
    role: i % 10 === 0 ? 'teacher' : i % 100 === 0 ? 'admin' : 'student',
    status: i % 20 === 0 ? 'suspended' : i % 10 === 0 ? 'inactive' : 'active',
    lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    plan: ['free', 'basic', 'premium', 'enterprise'][Math.floor(Math.random() * 4)] as any,
    metrics: {
      testsCompleted: Math.floor(Math.random() * 100),
      averageScore: Math.floor(Math.random() * 100),
      studentsManaged: Math.floor(Math.random() * 50),
      coursesCreated: Math.floor(Math.random() * 10),
      activeTime: Math.floor(Math.random() * 1000),
      loginStreak: Math.floor(Math.random() * 30)
    },
    tags: ['High Performer', 'At Risk', 'New User', 'Premium', 'Engaged'].slice(0, Math.floor(Math.random() * 3))
  }));
  
  // Filter and sort users
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Quick actions for radial menu
  const quickActions: UserAction[] = [
    { id: '1', label: 'Message', icon: MessageSquare, action: () => {} },
    { id: '2', label: 'Edit', icon: Edit3, action: () => {} },
    { id: '3', label: 'View Details', icon: Eye, action: () => {} },
    { id: '4', label: 'Suspend', icon: Ban, action: () => {}, variant: 'destructive' },
    { id: '5', label: 'Reset Password', icon: RefreshCw, action: () => {} },
    { id: '6', label: 'Change Plan', icon: Zap, action: () => {} }
  ];
  // Virtual list row renderer
  const Row = ({ index, style }: { 
    index: number;
    style: React.CSSProperties;
  }) => {
    const user = filteredUsers[index];
    const isSelected = selectedUsers.has(user.id);
    
    return (
      <motion.div 
        style={style} 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ delay: index * 0.01, duration: 0.3 }} 
        className="px-4"
      >
        <div 
          className={cn(
            "flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer",
            "",
            isSelected && "bg-primary/5 border-primary"
          )}
          onClick={() => {
            if (showBulkActions) {
              setSelectedUsers((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(user.id)) {
                  newSet.delete(user.id);
                } else {
                  newSet.add(user.id);
                }
                return newSet;
              });
            } else {
              setSelectedUser(user);
              setIsRadialMenuOpen(true);
            }
          }}
        >
      {
      /* User Avatar with Status Indicator */
      }<div className="relative"><Avatar className="h-12 w-12">
    <AvatarImage src={user.avatar} /><AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">{user.name.split(' ').map(n => n[0]).join('')}
    </AvatarFallback>
    </Avatar><div className={cn("absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",user.status === 'active' &&"bg-green-500",user.status === 'inactive' &&"bg-yellow-500",user.status === 'suspended' &&"bg-red-500" )
      } />
    </div>
      {
      /* User Info */
      }<div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><h4 className="font-medium truncate">
      {user.name}
    </h4><Badge variant="outline" className="text-xs">
      {user.role}
    </Badge>{user.tags.map(tag => ( <Badge key={tag} variant="secondary" className="text-xs">
      {tag}
    </Badge> ))}
    </div><p className="text-sm text-muted-foreground truncate">
      {user.email}
    </p>
    </div>
      {
      /* User Metrics */
      }<div className="hidden lg:flex items-center gap-6">{user.role === 'student' && ( <><div className="text-center"><p className="text-2xl font-bold">
      {user.metrics.testsCompleted}
      </p><p className="text-xs text-muted-foreground">Tests</p>
      </div><div className="text-center"><p className="text-2xl font-bold">
      {user.metrics.averageScore}%</p><p className="text-xs text-muted-foreground">Avg Score</p>
      </div></> )} {user.role === 'teacher' && ( <><div className="text-center"><p className="text-2xl font-bold">
      {user.metrics.studentsManaged}
      </p><p className="text-xs text-muted-foreground">Students</p>
      </div><div className="text-center"><p className="text-2xl font-bold">
      {user.metrics.coursesCreated}
      </p><p className="text-xs text-muted-foreground">Courses</p>
      </div>
    </> )}
    </div>
      {
      /* Activity Indicator */
      }<div className="flex flex-col items-end gap-1"><Badge variant={user.plan === 'enterprise' ? 'default' : 'outline'} className="text-xs">
      {user.plan}
    </Badge><p className="text-xs text-muted-foreground"> Last active {new Date(user.lastActive).toLocaleDateString()}
    </p>
    </div>
      {
      /* Selection Checkbox for Bulk Actions */} {showBulkActions && ( <div className="ml-2"><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={cn("w-6 h-6 rounded-full flex items-center justify-center",isSelected ?"bg-primary text-white" :"bg-muted" )
        } >{isSelected && <CheckCircle className="h-4 w-4" />}
      </motion.div>
    </div> )}
        </div>
      </motion.div>
    );
  };

  // Radial Menu Component
  const RadialMenu = () => {
    if (!selectedUser || !isRadialMenuOpen) return null;
    return (<motion.div ref={radialMenuRef} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setIsRadialMenuOpen(false)} ><div className="relative" onClick={(e) => e.stopPropagation()}>
      {
      /* Center User Info */
      }
      <motion.div className="relative z-10 bg-background p-6 rounded-full shadow-2xl">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl">
            {selectedUser.name.split(' ').map(n => n[0]).join('')}
    </AvatarFallback>
  </Avatar>
  </motion.div>
      {
    /* Radial Action Buttons */
        } {quickActions.map((action, index) => {
      const angle = (index * 360) / quickActions.length;
      const radius = 120;
      const x = radius * Math.cos((angle - 90) * Math.PI / 180

      );
      const y = radius * Math.sin((angle - 90) * Math.PI / 180

      );

      const Icon = action.icon;
      return (<motion.div key={action.id} initial={{ opacity: 0, scale: 0, x: 0, y: 0 }} animate={{ opacity: 1, scale: 1, x, y }} exit={{ opacity: 0, scale: 0, x: 0, y: 0 }} transition={{ delay: index * 0.05 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" ><Button variant={action.variant ||"outline"} size="icon" className="h-14 w-14 rounded-full shadow-lg" onClick={() => {
          action.action(selectedUser

          );
          setIsRadialMenuOpen(false

          )
}} ><Icon className="h-5 w-5" />
      </Button><span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-xs whitespace-nowrap">
      {action.label}
      </span>
      </motion.div>
      )
}
    )
    }
    </div>
  </motion.div>
  );
  };

  // User Insights Panel
  const UserInsights = ({ user }: { user: User }) => {
    const getRiskLevel = () => {
      if (user.status === 'suspended') return 'high';
      if (user.status === 'inactive') return 'medium';
      if (user.metrics.loginStreak < 3) return 'medium';
      if (user.role === 'student' && user.metrics.averageScore! < 40) return 'high';
      return 'low';
    };

  const riskLevel = getRiskLevel();
  return (
    <Card>
  <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5" /> User Insights </CardTitle>
  </CardHeader><CardContent className="space-y-4">
      {
    /* Risk Assessment */
    }<div className={cn("p-4 rounded-lg",riskLevel === 'high' &&"bg-red-500/10 border border-red-500/20",riskLevel === 'medium' &&"bg-yellow-500/10 border border-yellow-500/20",riskLevel === 'low' &&"bg-green-500/10 border border-green-500/20" )
    }><div className="flex items-center justify-between mb-2"><span className="font-medium">Risk Level</span><Badge variant={riskLevel === 'high' ? 'destructive' : riskLevel === 'medium' ? 'secondary' : 'default'}>
      {riskLevel}
    </Badge></div>{riskLevel !== 'low' && ( <p className="text-sm text-muted-foreground">{riskLevel === 'high' &&"Immediate intervention recommended"} {riskLevel === 'medium' &&"Monitor closely for improvements"}
    </p> )}
    </div>
      {
    /* Activity Timeline */
    }
    <div><h4 className="font-medium mb-3">Activity Timeline</h4><div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => ( <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 text-sm" ><div className="w-2 h-2 rounded-full bg-primary" /><span className="text-muted-foreground">{i === 0 &&"Logged in"} {i === 1 &&"Completed test"} {i === 2 &&"Viewed course"} {i === 3 &&"Updated profile"} {i === 4 &&"Started practice session"}
    </span><span className="text-xs text-muted-foreground ml-auto">
      {i + 1}h ago </span>
  </motion.div> ))}
    </div>
  </div>
      {
    /* Intervention Tools */
    }
    <div><h4 className="font-medium mb-3">Quick Actions</h4><div className="grid grid-cols-2 gap-2"><Button size="sm" variant="outline"><MessageSquare className="h-4 w-4 mr-2" /> Send Message </Button><Button size="sm" variant="outline"><Award className="h-4 w-4 mr-2" /> Grant Badge </Button><Button size="sm" variant="outline"><Target className="h-4 w-4 mr-2" /> Set Goal </Button><Button size="sm" variant="outline"><Heart className="h-4 w-4 mr-2" /> Wellness Check </Button>
  </div>
  </div>
  </CardContent>
    </Card>
    );
  };

  return (
    <div className="space-y-6">
      {
  /* Header */
}<div className="flex items-center justify-between">
<div><h2 className="text-3xl font-bold">User Management Supremacy</h2><p className="text-muted-foreground"> Control and nurture your entire user ecosystem </p>
</div><div className="flex items-center gap-3"><Button variant={showBulkActions ?"default" :"outline"} onClick={() => setShowBulkActions(!showBulkActions)} ><Users className="h-4 w-4 mr-2" /> Bulk Actions {selectedUsers.size > 0 && `(${selectedUsers.size})`}
    </Button>
<Button><UserPlus className="h-4 w-4 mr-2" /> Add User </Button>
</div>
</div>
      {
  /* Stats Overview */
}<div className="grid gap-4 md:grid-cols-4">
<Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Users</CardTitle><Users className="h-4 w-4 text-muted-foreground" />
</CardHeader>
<CardContent><div className="text-2xl font-bold">
      {allUsers.length.toLocaleString()}
    </div><Progress value={73} className="mt-2 h-1" /><p className="text-xs text-muted-foreground mt-2"><TrendingUp className="inline h-3 w-3 text-green-500" /> 12% from last month </p>
</CardContent>
</Card>
<Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active Today</CardTitle><Activity className="h-4 w-4 text-muted-foreground" />
</CardHeader>
<CardContent><div className="text-2xl font-bold">1,234</div><div className="flex items-center gap-2 mt-2"><Badge variant="secondary" className="text-xs">Students: 1,100</Badge><Badge variant="secondary" className="text-xs">Teachers: 134</Badge>
</div>
</CardContent>
</Card>
<Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">At Risk</CardTitle><AlertTriangle className="h-4 w-4 text-muted-foreground" />
</CardHeader>
<CardContent><div className="text-2xl font-bold text-orange-500">89</div><p className="text-xs text-muted-foreground mt-2"> Require immediate attention </p>
</CardContent>
</Card>
<Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Premium Users</CardTitle><Star className="h-4 w-4 text-muted-foreground" />
</CardHeader>
<CardContent><div className="text-2xl font-bold">423</div><Progress value={42} className="mt-2 h-1" /><p className="text-xs text-muted-foreground mt-2"> 8.4% of total users </p>
</CardContent>
</Card>
</div>
      {
  /* Search and Filters */
}
    <Card><CardContent className="p-4"><div className="flex flex-col lg:flex-row gap-4"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search users by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
</div><div className="flex items-center gap-2">
<Select value={filterRole} onValueChange={(v: any) => setFilterRole(v)}><SelectTrigger className="w-32">
<SelectValue />
</SelectTrigger>
<SelectContent><SelectItem value="all">All Roles</SelectItem><SelectItem value="student">Students</SelectItem><SelectItem value="teacher">Teachers</SelectItem><SelectItem value="admin">Admins</SelectItem>
</SelectContent>
</Select>
<Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}><SelectTrigger className="w-32">
<SelectValue />
</SelectTrigger>
<SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem><SelectItem value="suspended">Suspended</SelectItem>
</SelectContent>
</Select>
<Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}><SelectTrigger className="w-32">
<SelectValue />
</SelectTrigger>
<SelectContent><SelectItem value="activity">Activity</SelectItem><SelectItem value="name">Name</SelectItem><SelectItem value="date">Join Date</SelectItem>
</SelectContent>
</Select><Button variant="outline" size="icon"><Filter className="h-4 w-4" />
</Button>
</div>
</div>
</CardContent>
</Card>
      {
  /* Main Content */
}<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {
  /* User List with Virtual Scrolling */
}<div className="lg:col-span-3"><Card className="h-[800px]">
<CardHeader>
  <CardTitle> Users ({filteredUsers.length.toLocaleString()
  }
) </CardTitle>
</CardHeader><CardContent className="p-0"><List height={720} itemCount={filteredUsers.length} itemSize={100} width="100%" >
      {Row}
    </List>
</CardContent>
</Card>
</div>
      {
  /* User Insights Sidebar */
}
    <div>
      {selectedUser ? ( <UserInsights user={selectedUser} /> ) : ( <Card><CardContent className="p-6 text-center"><Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground"> Select a user to view insights </p>
  </CardContent>
</Card> )}
    </div>
</div>
      {
  /* Bulk Actions Bar */
}
    <AnimatePresenceWrapper>{showBulkActions && selectedUsers.size > 0 && ( <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50" ><Card className="p-4 shadow-xl"><div className="flex items-center gap-4"><span className="text-sm font-medium">
      {selectedUsers.size} users selected </span><div className="flex items-center gap-2"><Button size="sm" variant="outline"><Mail className="h-4 w-4 mr-2" /> Send Email </Button><Button size="sm" variant="outline"><Shield className="h-4 w-4 mr-2" /> Change Role </Button><Button size="sm" variant="outline"><Zap className="h-4 w-4 mr-2" /> Update Plan </Button><Button size="sm" variant="outline" className="text-orange-500"><Ban className="h-4 w-4 mr-2" /> Suspend </Button><Button size="sm" variant="outline" className="text-red-500"><XCircle className="h-4 w-4 mr-2" /> Delete </Button>
  </div><Button size="sm" variant="ghost" onClick={() => {
      setSelectedUsers(new Set());
      setShowBulkActions(false);
}} > Cancel </Button>
  </div>
  </Card>
</motion.div> )}
    </AnimatePresenceWrapper>
      {
  /* Radial Action Menu */
      }
    <AnimatePresenceWrapper>
<RadialMenu />
</AnimatePresenceWrapper>
</div>
  );
};

export default UserManagement;
