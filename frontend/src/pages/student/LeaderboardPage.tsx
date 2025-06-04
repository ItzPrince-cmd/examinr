import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  TrendingDown,
  Filter,
  Calendar,
  Users,
  Award,
  Zap,
  Target,
  Clock,
  ChevronUp,
  ChevronDown,
  Star,
  Flame,
  User,
  Search,
  MoreVertical,
  UserPlus,
  Swords,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { ScrollArea } from '../../components/ui/scroll-area';
import { toast } from '../../components/ui/use-toast';

interface LeaderboardEntry {
  rank: number;
  previousRank: number;
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  level: number;
  streak: number;
  accuracy: number;
  testsCompleted: number;
  isFriend?: boolean;
  isCurrentUser?: boolean
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType; category: 'speed' | 'accuracy' | 'consistency' | 'master';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  points: number; rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

const LeaderboardPage: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('week'
  ); const [subjectFilter, setSubjectFilter] = useState('all'
  ); const [searchQuery, setSearchQuery] = useState(''
  ); const [selectedTab, setSelectedTab] = useState('global'
  );
  const [showOnlyFriends, setShowOnlyFriends] = useState(false
  );
  // Mock leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      previousRank: 2,
      userId: '1',
      name: 'Arjun Patel',
      avatar: '/avatars/user1.jpg',
      points: 12450,
      level: 42,
      streak: 45,
      accuracy: 94.5,
      testsCompleted: 156,
      isFriend: true
    },
    {
      rank: 2,
      previousRank: 1,
      userId: '2',
      name: 'Priya Sharma',
      avatar: '/avatars/user2.jpg',
      points: 12380,
      level: 41,
      streak: 38,
      accuracy: 92.8,
      testsCompleted: 148
    },
    {
      rank: 3,
      previousRank: 5,
      userId: '3',
      name: 'You',
      points: 11890,
      level: 39,
      streak: 21,
      accuracy: 89.2,
      testsCompleted: 134,
      isCurrentUser: true
    }
    // Add more entries...
  ];
  // Mock achievements data
  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'Speed Demon',
      description: 'Complete 50 questions in under 30 seconds each',
      icon: Zap,
      category: 'speed',
      progress: 42,
      maxProgress: 50,
      unlocked: false,
      points: 500,
      rarity: 'rare'
    },
    {
      id: '2',
      name: 'Accuracy Master',
      description: 'Maintain 90%+ accuracy for 30 days',
      icon: Target,
      category: 'accuracy',
      progress: 30,
      maxProgress: 30,
      unlocked: true,
      unlockedAt: '2024-01-10',
      points: 1000,
      rarity: 'epic'
    },
    {
      id: '3',
      name: 'Unstoppable',
      description: 'Maintain a 100-day practice streak',
      icon: Flame,
      category: 'consistency',
      progress: 21,
      maxProgress: 100,
      unlocked: false,
      points: 2000,
      rarity: 'legendary'
    }
    // Add more achievements...
  ];
const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Crown className="h-6 w-6 text-yellow-500" />; case 2: return <Medal className="h-6 w-6 text-gray-400" />; case 3: return <Medal className="h-6 w-6 text-orange-600" />;
    default: return null
  }
};

const getRankChange = (current: number, previous: number) => {
  const change = previous - current;
  if (change > 0) {
    return (<div className="flex items-center text-green-600"><ArrowUp className="h-3 w-3" /><span className="text-xs">
      {change}
    </span>
    </div>
    )
  } else if (change < 0) {
    return (<div className="flex items-center text-red-600"><ArrowDown className="h-3 w-3" /><span className="text-xs">
      {Math.abs(change)}
    </span>
    </div>
    )
  } return <Minus className="h-3 w-3 text-muted-foreground" />
}

const handleAddFriend = (userId: string) => {
  toast({
    title: "Friend request sent!", description: "You'll be notified when they accept.",

  }

  )
}

const handleChallenge = (userId: string) => {
  toast({
    title: "Challenge sent!", description: "Get ready for a 1v1 battle!",

  }

  )
}

return (<div className="container mx-auto p-6 space-y-6">
  {
    /* Header */
  }<div className="flex items-center justify-between">
    <div><h1 className="text-3xl font-bold flex items-center gap-2"><Trophy className="h-8 w-8 text-primary" /> Leaderboard </h1><p className="text-muted-foreground">Compete with students worldwide</p>
    </div><div className="flex items-center gap-4"><div className="relative"><Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 w-[200px]" />
    </div>
      <Select value={timeFilter} onValueChange={setTimeFilter}><SelectTrigger className="w-[120px]">
        <SelectValue />
      </SelectTrigger>
        <SelectContent><SelectItem value="today">Today</SelectItem><SelectItem value="week">This Week</SelectItem><SelectItem value="month">This Month</SelectItem><SelectItem value="all">All Time</SelectItem>
        </SelectContent>
      </Select>
      <Select value={subjectFilter} onValueChange={setSubjectFilter}><SelectTrigger className="w-[120px]">
        <SelectValue />
      </SelectTrigger>
        <SelectContent><SelectItem value="all">All Subjects</SelectItem><SelectItem value="physics">Physics</SelectItem><SelectItem value="chemistry">Chemistry</SelectItem><SelectItem value="mathematics">Mathematics</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
  {
    /* Your Stats */
  }<Card className="border-primary">
    <CardHeader>
      <CardTitle>Your Position</CardTitle>
      <CardDescription>Keep pushing to reach the top!</CardDescription>
    </CardHeader>
    <CardContent><div className="grid grid-cols-1 md:grid-cols-5 gap-4"><div className="text-center"><div className="text-4xl font-bold flex items-center justify-center gap-2"> #3 {getRankChange(3, 5)}
    </div><p className="text-sm text-muted-foreground">Global Rank</p>
    </div><div className="text-center"><div className="text-2xl font-bold">11,890</div><p className="text-sm text-muted-foreground">Points</p>
      </div><div className="text-center"><div className="text-2xl font-bold flex items-center justify-center gap-1"><Flame className="h-5 w-5 text-orange-500" /> 21 </div><p className="text-sm text-muted-foreground">Day Streak</p>
      </div><div className="text-center"><div className="text-2xl font-bold">89.2%</div><p className="text-sm text-muted-foreground">Accuracy</p>
      </div><div className="text-center"><div className="text-2xl font-bold">Level 39</div><Progress value={75} className="mt-1 h-2" />
      </div>
    </div>
    </CardContent>
  </Card>
  {
    /* Main Content */
  }
  <Tabs value={selectedTab} onValueChange={setSelectedTab}><TabsList className="grid w-full grid-cols-4"><TabsTrigger value="global">Global</TabsTrigger><TabsTrigger value="batch">My Batch</TabsTrigger><TabsTrigger value="friends">Friends</TabsTrigger><TabsTrigger value="achievements">Achievements</TabsTrigger>
  </TabsList><TabsContent value="global" className="space-y-4">
      {
        /* Top 3 Special Cards */
      }<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {leaderboardData.slice(0, 3).map((entry) => (<motion.div key={entry.userId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: entry.rank * 0.1 }} >
          <Card className={`relative overflow-hidden ${entry.rank === 1 ? 'border-yellow-500 bg-gradient-to-br from-yellow-500/10 to-transparent' : entry.rank === 2 ? 'border-gray-400 bg-gradient-to-br from-gray-400/10 to-transparent' : 'border-orange-600 bg-gradient-to-br from-orange-600/10 to-transparent'}`}><CardContent className="pt-6"><div className="flex flex-col items-center text-center space-y-3"><div className="relative"><Avatar className="h-20 w-20">
            <AvatarImage src={entry.avatar} />
            <AvatarFallback>
              {entry.name.charAt(0)}
            </AvatarFallback>
          </Avatar><div className="absolute -bottom-2 -right-2">
              {getRankIcon(entry.rank)}
            </div>
          </div>
            <div><h3 className="font-semibold text-lg">
              {entry.name}
            </h3><p className="text-sm text-muted-foreground">Level {entry.level}
              </p>
            </div><div className="text-2xl font-bold">
              {entry.points.toLocaleString()}
            </div><div className="flex items-center gap-4 text-sm"><div className="flex items-center gap-1"><Target className="h-3 w-3" />
              {entry.accuracy}% </div><div className="flex items-center gap-1"><Flame className="h-3 w-3" />
                {entry.streak}
              </div>
            </div>{!entry.isCurrentUser && (<div className="flex gap-2 w-full">{!entry.isFriend && (<Button variant="outline" size="sm" className="flex-1" onClick={() => handleAddFriend(entry.userId)} ><UserPlus className="h-3 w-3 mr-1" /> Add </Button>)}<Button variant="outline" size="sm" className="flex-1" onClick={() => handleChallenge(entry.userId)} ><Swords className="h-3 w-3 mr-1" /> Challenge </Button>
            </div>)}
          </div>
          </CardContent>
          </Card>
        </motion.div>))}
      </div>
      {
        /* Rest of Leaderboard */
      }
      <Card>
        <CardHeader><div className="flex items-center justify-between">
          <CardTitle>Rankings</CardTitle><Button variant="outline" size="sm" onClick={() => setShowOnlyFriends(!showOnlyFriends)} ><Users className="h-4 w-4 mr-2" />{showOnlyFriends ? 'Show All' : 'Show Friends'}
          </Button>
        </div>
        </CardHeader>
        <CardContent><ScrollArea className="h-[400px]"><div className="space-y-2">{leaderboardData.slice(3).map((entry, index) => (<motion.div key={entry.userId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${entry.isCurrentUser ? 'bg-primary/10' : ''}`} ><div className="flex items-center gap-4"><div className="flex items-center gap-2 w-16"><span className="font-bold text-lg">#{entry.rank}
        </span>
          {getRankChange(entry.rank, entry.previousRank)}
        </div><Avatar className="h-10 w-10">
            <AvatarImage src={entry.avatar} />
            <AvatarFallback>
              {entry.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div><div className="flex items-center gap-2"><span className="font-medium">
            {entry.name}
          </span>{entry.isFriend && (<Badge variant="secondary" className="text-xs">Friend</Badge>)}
          </div><div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Level {entry.level}
              </span><span className="flex items-center gap-1"><Flame className="h-3 w-3" />
                {entry.streak} day streak </span>
            </div>
          </div>
        </div><div className="flex items-center gap-4"><div className="text-right"><div className="font-semibold">
          {entry.points.toLocaleString()}
        </div><div className="text-xs text-muted-foreground">
            {entry.accuracy}% accuracy</div>
        </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" />
              </Button>
              </DropdownMenuTrigger><DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                {!entry.isCurrentUser && (<>
                  {!entry.isFriend && (<DropdownMenuItem onClick={() => handleAddFriend(entry.userId)}> Add Friend </DropdownMenuItem>)}
                  <DropdownMenuItem onClick={() => handleChallenge(entry.userId)}> Challenge </DropdownMenuItem>
                </>)}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>))}
        </div>
        </ScrollArea>
        </CardContent>
      </Card>
    </TabsContent><TabsContent value="achievements" className="space-y-6">
      {
        /* Achievement Stats */
      }<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-center"><Award className="h-8 w-8 mx-auto text-primary mb-2" /><div className="text-2xl font-bold">28</div><p className="text-sm text-muted-foreground">Total Achievements</p>
        </div>
        </CardContent>
        </Card>
        <Card><CardContent className="pt-6"><div className="text-center"><Star className="h-8 w-8 mx-auto text-yellow-500 mb-2" /><div className="text-2xl font-bold">12,500</div><p className="text-sm text-muted-foreground">Achievement Points</p>
        </div>
        </CardContent>
        </Card>
        <Card><CardContent className="pt-6"><div className="text-center"><Trophy className="h-8 w-8 mx-auto text-purple-500 mb-2" /><div className="text-2xl font-bold">3</div><p className="text-sm text-muted-foreground">Legendary Unlocked</p>
        </div>
        </CardContent>
        </Card>
        <Card><CardContent className="pt-6"><div className="text-center"><Target className="h-8 w-8 mx-auto text-green-500 mb-2" /><div className="text-2xl font-bold">75%</div><p className="text-sm text-muted-foreground">Completion Rate</p>
        </div>
        </CardContent>
        </Card>
      </div>
      {
        /* Achievement Categories */
      }<Tabs defaultValue="all" className="w-full">
        <TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="speed">Speed</TabsTrigger><TabsTrigger value="accuracy">Accuracy</TabsTrigger><TabsTrigger value="consistency">Consistency</TabsTrigger><TabsTrigger value="master">Master</TabsTrigger>
        </TabsList><TabsContent value="all" className="mt-6"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            const rarityColors = {
              common: 'border-gray-400', rare: 'border-blue-500', epic: 'border-purple-500', legendary: 'border-orange-500'
            }

            return (
              <motion.div key={achievement.id} whileTap={{ scale: 0.98 }}><Card className={`relative overflow-hidden ${achievement.unlocked ? rarityColors[achievement.rarity] : 'opacity-75'}`}>{achievement.unlocked && (<div className="absolute top-2 right-2"><CheckCircle className="h-5 w-5 text-green-500" />
              </div>)}<CardContent className="pt-6"><div className="flex flex-col items-center text-center space-y-3"><div className={`p-4 rounded-full ${achievement.unlocked ? 'bg-primary/10' : 'bg-muted'}`}><Icon className={`h-8 w-8 ${achievement.unlocked ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
                <div><h3 className="font-semibold">
                  {achievement.name}
                </h3><p className="text-sm text-muted-foreground mt-1">
                    {achievement.description}
                  </p>
                </div><div className="w-full"><div className="flex items-center justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                </div><Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                </div><div className="flex items-center justify-between w-full"><Badge variant={achievement.unlocked ? 'default' : 'secondary'}>{achievement.points} pts </Badge><Badge variant="outline" className={achievement.rarity === 'legendary' ? 'text-orange-500' : achievement.rarity === 'epic' ? 'text-purple-500' : achievement.rarity === 'rare' ? 'text-blue-500' : ''}>
                  {achievement.rarity}
                </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
          )
}
          )
}
        </div>
    </TabsContent>
  </Tabs>
</TabsContent>
</Tabs >
</div >
  )
}

export default LeaderboardPage;
