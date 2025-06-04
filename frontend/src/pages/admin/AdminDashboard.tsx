import React from 'react';

import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Activity,
  DollarSign,
  UserCheck,
  Clock,
  BarChart3,
  PieChart,
  Calendar,
  Download
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';

const AdminDashboard: React.FC = () => {
  // Mock data for demonstration
  const overviewStats = [
    {
      title: 'Total Users',
      value: '12,345',
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Batches',
      value: '234',
      change: '+5.2%',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Questions',
      value: '45,678',
      change: '+23.1%',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Revenue',
      value: '₹12.3L',
      change: '+18.7%',
      icon: DollarSign, color: 'text-yellow-600', bgColor: 'bg-yellow-100',

    },];
  const recentActivities = [{
    id: 1, user: 'John Doe', action: 'Created new batch', time: '2 minutes ago', type: 'batch'
  }, {
    id: 2, user: 'Jane Smith', action: 'Uploaded 50 questions', time: '15 minutes ago', type: 'question'
  }, {
    id: 3, user: 'Mike Johnson', action: 'Completed test', time: '1 hour ago', type: 'test'
  }, {
    id: 4, user: 'Sarah Williams', action: 'Joined Premium', time: '2 hours ago', type: 'subscription'
  }, {
    id: 5, user: 'David Brown', action: 'Started live class', time: '3 hours ago', type: 'class'
  },];
  const topTeachers = [{
    id: 1, name: 'Dr. Amit Kumar', subject: 'Physics',
    students: 1234,
    rating: 4.9
  }, {
    id: 2, name: 'Prof. Priya Sharma', subject: 'Mathematics',
    students: 987,
    rating: 4.8
  }, {
    id: 3, name: 'Mr. Rajesh Patel', subject: 'Chemistry',
    students: 856,
    rating: 4.7
  }, {
    id: 4, name: 'Ms. Neha Gupta', subject: 'Biology',
    students: 745,
    rating: 4.9
  },];
  return (
    <div className="space-y-6">
      {
        /* Page Header */
      }<div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1><p className="text-muted-foreground"> Welcome back! Here's what's happening with your platform today. </p>
        </div><div className="flex gap-2"><Button variant="outline" size="sm"><Calendar className="mr-2 h-4 w-4" /> Last 30 days </Button><Button size="sm"><Download className="mr-2 h-4 w-4" /> Export Report </Button>
        </div>
      </div>
      {
        /* Overview Stats */
      }<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
              <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
              <CardContent><div className="text-2xl font-bold">
                {stat.value}
              </div><p className="text-xs text-muted-foreground"><span className="text-green-600">
                {stat.change}
              </span> from last month </p>
              </CardContent>
            </Card>
          )
        }
        )
        }
      </div>
      {
        /* Charts and Analytics */
      }<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"><Card className="col-span-4">
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>Monthly user registration trends</CardDescription>
        </CardHeader>
        <CardContent><div className="h-[300px] flex items-center justify-center text-muted-foreground"><BarChart3 className="h-16 w-16" /><span className="ml-4">Chart Component Here</span>
        </div>
        </CardContent>
      </Card><Card className="col-span-3">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>By subscription type</CardDescription>
          </CardHeader>
          <CardContent><div className="space-y-4">
            <div><div className="flex items-center justify-between mb-1"><span className="text-sm font-medium">Free Users</span><span className="text-sm text-muted-foreground">45%</span>
            </div><Progress value={45} className="h-2" />
            </div>
            <div><div className="flex items-center justify-between mb-1"><span className="text-sm font-medium">Basic Plan</span><span className="text-sm text-muted-foreground">30%</span>
            </div><Progress value={30} className="h-2" />
            </div>
            <div><div className="flex items-center justify-between mb-1"><span className="text-sm font-medium">Premium Plan</span><span className="text-sm text-muted-foreground">25%</span>
            </div><Progress value={25} className="h-2" />
            </div>
          </div>
          </CardContent>
        </Card>
      </div>
      {
        /* Tabs for Different Data Views */
      }<Tabs defaultValue="activities" className="space-y-4">
        <TabsList><TabsTrigger value="activities">Recent Activities</TabsTrigger><TabsTrigger value="teachers">Top Teachers</TabsTrigger><TabsTrigger value="performance">Platform Performance</TabsTrigger>
        </TabsList><TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest actions across the platform</CardDescription>
            </CardHeader>
            <CardContent><div className="space-y-4">{recentActivities.map((activity) => (<div key={activity.id} className="flex items-center space-x-4"><Avatar className="h-9 w-9">
              <AvatarFallback>
                {activity.user.charAt(0)}
              </AvatarFallback>
            </Avatar><div className="flex-1 space-y-1"><p className="text-sm font-medium leading-none">
              {activity.user}
            </p><p className="text-sm text-muted-foreground">
                  {activity.action}
                </p>
              </div><div className="flex items-center gap-2"><Badge variant="outline">
                {activity.type}
              </Badge><span className="text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            </div>))}
            </div>
            </CardContent>
          </Card>
        </TabsContent><TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Teachers</CardTitle>
              <CardDescription>Based on student count and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topTeachers.map((teacher) => (<TableRow key={teacher.id}><TableCell className="font-medium">
                    {teacher.name}
                  </TableCell>
                    <TableCell>
                      {teacher.subject}
                    </TableCell>
                    <TableCell>
                      {teacher.students}
                    </TableCell>
                    <TableCell><div className="flex items-center"><span className="mr-1">⭐</span>
                      {teacher.rating}
                    </div>
                    </TableCell>
                    <TableCell><Button variant="outline" size="sm">View Profile</Button>
                    </TableCell>
                  </TableRow>))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent><TabsContent value="performance" className="space-y-4"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Server Uptime</CardTitle><Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
            <CardContent><div className="text-2xl font-bold">99.9%</div><Progress value={99.9} className="mt-2" />
            </CardContent>
          </Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Response Time</CardTitle><Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
            <CardContent><div className="text-2xl font-bold">142ms</div><p className="text-xs text-muted-foreground">Average API response</p>
            </CardContent>
          </Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Success Rate</CardTitle><UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
            <CardContent><div className="text-2xl font-bold">87%</div><p className="text-xs text-muted-foreground">Test completion rate</p>
            </CardContent>
          </Card>
        </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboard;
