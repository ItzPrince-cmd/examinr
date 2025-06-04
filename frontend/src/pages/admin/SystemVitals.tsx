import React, { useState, useEffect } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ScrollArea } from '../../components/ui/scroll-area';

import {
  Activity,
  Server,
  Database,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Clock,
  Zap,
  Shield,
  Globe,
  Gauge
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SystemMetric {
  label: string;
  value: number;
  max: number;
  unit: string; status: 'healthy' | 'warning' | 'critical'; trend?: 'up' | 'down' | 'stable'
}

interface ServiceStatus {
  name: string; status: 'online' | 'offline' | 'degraded';
  uptime: string;
  lastChecked: string;
  responseTime: number
}

const SystemVitals: React.FC = () => {
  const [metrics, setMetrics] = useState<Record<string, SystemMetric>>({
    cpu: {
      label: 'CPU Usage',
      value: 45,
      max: 100, unit: '%', status: 'healthy', trend: 'stable'
    }, memory: {
      label: 'Memory',
      value: 6.8,
      max: 16, unit: 'GB', status: 'healthy', trend: 'up'
    }, disk: {
      label: 'Disk Space',
      value: 234,
      max: 500, unit: 'GB', status: 'warning', trend: 'up'
    }, network: {
      label: 'Network I/O',
      value: 125,
      max: 1000, unit: 'Mbps', status: 'healthy', trend: 'stable'
    },
  });
  const [services, setServices] = useState<ServiceStatus[]>([{
    name: 'API Server', status: 'online', uptime: '99.99%', lastChecked: '2 mins ago',
    responseTime: 45
  }, {
    name: 'Database', status: 'online', uptime: '99.95%', lastChecked: '2 mins ago',
    responseTime: 12
  }, {
    name: 'Redis Cache', status: 'online', uptime: '99.98%', lastChecked: '2 mins ago',
    responseTime: 3
  }, {
    name: 'File Storage', status: 'degraded', uptime: '98.5%', lastChecked: '5 mins ago',
    responseTime: 156
  }, {
    name: 'Email Service', status: 'online', uptime: '99.9%', lastChecked: '2 mins ago',
    responseTime: 89
  }, {
    name: 'WebSocket Server', status: 'online', uptime: '99.97%', lastChecked: '2 mins ago',
    responseTime: 8
  },]

  );
  const [logs, setLogs] = useState([{
    time: '10:45:23', level: 'info', message: 'System health check completed successfully'
  }, {
    time: '10:44:15', level: 'warning', message: 'High memory usage detected on worker-3'
  }, {
    time: '10:42:08', level: 'info', message: 'Database backup completed'
  }, {
    time: '10:40:32', level: 'error', message: 'Failed to connect to storage service (retry succeeded)'
  }, {
    time: '10:38:45', level: 'info', message: 'New deployment rolled out successfully'
  },]

  );
  const [refreshing, setRefreshing] = useState(false
  );
  const refreshMetrics = () => {
    setRefreshing(true

    );
    setTimeout(() => {
      // Simulate metric updates
      setMetrics(prev => ({
        ...prev,
        cpu: {
          ...prev.cpu,
          value: Math.floor(Math.random() * 30) + 40
        },
        memory: {
          ...prev.memory,
          value: (Math.random() * 4 + 5).toFixed(1) as any
        },
        network: {
          ...prev.network,
          value: Math.floor(Math.random() * 200) + 100
        }
      }));
      setRefreshing(false);
    }, 1000);
  };

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online': case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />; case 'degraded': case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />; case 'offline': case 'critical': return <XCircle className="w-4 h-4 text-red-500" />;
    default: return null
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'text-green-500'; case 'warning': return 'text-yellow-500'; case 'critical': return 'text-red-500'; default: return 'text-gray-500'
  }
};

const getProgressColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'bg-green-500'; case 'warning': return 'bg-yellow-500'; case 'critical': return 'bg-red-500'; default: return 'bg-gray-500'
  }
};

return (<div className="p-6 space-y-6"><div className="flex justify-between items-center">
  <div><h1 className="text-3xl font-bold">System Vitals</h1><p className="text-muted-foreground">Monitor server performance and system health</p>
  </div><div className="flex gap-2"><Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export Report </Button><Button onClick={refreshMetrics} disabled={refreshing} size="sm" ><RefreshCw className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")} /> Refresh </Button>
  </div>
</div>
  {
    /* Key Metrics */
  }<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-sm text-muted-foreground">CPU Usage</p><div className="flex items-baseline gap-2"><p className="text-2xl font-bold">{metrics.cpu.value}%</p><Badge variant={metrics.cpu.status === 'healthy' ? 'default' : 'destructive'} className="text-xs">{metrics.cpu.trend === 'up' ? '↑' : metrics.cpu.trend === 'down' ? '↓' : '→'}
    </Badge>
    </div>
    </div><div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg"><Cpu className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
    </div><Progress value={metrics.cpu.value} className={cn("mt-3 h-2",
      getProgressColor(metrics.cpu.status))
    } />
    </CardContent>
    </Card>
    <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-sm text-muted-foreground">Memory Usage</p><div className="flex items-baseline gap-2"><p className="text-2xl font-bold">{metrics.memory.value}/{metrics.memory.max}GB</p><Badge variant={metrics.memory.status === 'healthy' ? 'default' : 'destructive'} className="text-xs">
      {((metrics.memory.value / metrics.memory.max) * 100).toFixed(0)}% </Badge>
    </div>
    </div><div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg"><MemoryStick className="w-6 h-6 text-purple-600 dark:text-purple-400" />
      </div>
    </div><Progress value={(metrics.memory.value / metrics.memory.max) * 100} className={cn("mt-3 h-2",
      getProgressColor(metrics.memory.status))
    } />
    </CardContent>
    </Card>
    <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-sm text-muted-foreground">Disk Space</p><div className="flex items-baseline gap-2"><p className="text-2xl font-bold">
      {metrics.disk.value}GB</p><Badge variant="secondary" className="text-xs">
        {metrics.disk.max - metrics.disk.value}GB free </Badge>
    </div>
    </div><div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg"><HardDrive className="w-6 h-6 text-orange-600 dark:text-orange-400" />
      </div>
    </div><Progress value={(metrics.disk.value / metrics.disk.max) * 100} className={cn("mt-3 h-2",
      getProgressColor(metrics.disk.status))
    } />
    </CardContent>
    </Card>
    <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-sm text-muted-foreground">Network I/O</p><div className="flex items-baseline gap-2"><p className="text-2xl font-bold">
      {metrics.network.value}
    </p><span className="text-sm text-muted-foreground">Mbps</span>
    </div>
    </div><div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg"><Network className="w-6 h-6 text-green-600 dark:text-green-400" />
      </div>
    </div><Progress value={(metrics.network.value / metrics.network.max) * 100} className={cn("mt-3 h-2",
      getProgressColor(metrics.network.status))
    } />
    </CardContent>
    </Card>
  </div><Tabs defaultValue="services" className="space-y-4">
    <TabsList><TabsTrigger value="services">Services</TabsTrigger><TabsTrigger value="performance">Performance</TabsTrigger><TabsTrigger value="security">Security</TabsTrigger><TabsTrigger value="logs">System Logs</TabsTrigger>
    </TabsList><TabsContent value="services" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
          <CardDescription>Real-time monitoring of all system services</CardDescription>
        </CardHeader>
        <CardContent><div className="space-y-4">{services.map((service, index) => (<div key={index} className="flex items-center justify-between p-4 border rounded-lg"><div className="flex items-center gap-3">
          {getStatusIcon(service.status)}
          <div><p className="font-medium">
            {service.name}
          </p><p className="text-sm text-muted-foreground"> Uptime: {service.uptime} • Last checked: {service.lastChecked}
            </p>
          </div>
        </div><div className="flex items-center gap-4"><div className="text-right"><p className="text-sm font-medium">
          {service.responseTime}ms</p><p className="text-xs text-muted-foreground">Response time</p>
        </div><Badge variant={service.status === 'online' ? 'default' : service.status === 'degraded' ? 'secondary' : 'destructive'}>
              {service.status}
            </Badge>
          </div>
        </div>))}
        </div>
        </CardContent>
      </Card>
    </TabsContent><TabsContent value="performance" className="space-y-4"><div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Response Times</CardTitle>
          <CardDescription>Average API response times over the last hour</CardDescription>
        </CardHeader>
        <CardContent><div className="space-y-3"><div className="flex justify-between items-center"><span className="text-sm">API Endpoints</span><span className="text-sm font-medium">45ms avg</span>
        </div><Progress value={45} className="h-2" /><div className="flex justify-between items-center"><span className="text-sm">Database Queries</span><span className="text-sm font-medium">12ms avg</span>
          </div><Progress value={12} className="h-2" /><div className="flex justify-between items-center"><span className="text-sm">Cache Hit Rate</span><span className="text-sm font-medium">94%</span>
          </div><Progress value={94} className="h-2 bg-green-500" />
        </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Request Volume</CardTitle>
          <CardDescription>Requests per minute over the last hour</CardDescription>
        </CardHeader>
        <CardContent><div className="h-48 flex items-end justify-between gap-2">{Array.from({ length: 10 }).map((_, i) => (<div key={i} className="flex-1 bg-primary/20 rounded-t" style={{ height: `${Math.random() * 100}%` }} />))}
        </div><div className="mt-4 flex justify-between text-xs text-muted-foreground">
            <span>60m ago</span>
            <span>Now</span>
          </div>
        </CardContent>
      </Card>
    </div>
    </TabsContent><TabsContent value="security" className="space-y-4"><div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card><CardContent className="p-6"><div className="flex items-center gap-3"><Shield className="w-8 h-8 text-green-500" />
        <div><p className="text-2xl font-bold">Secure</p><p className="text-sm text-muted-foreground">All security checks passed</p>
        </div>
      </div>
      </CardContent>
      </Card>
      <Card><CardContent className="p-6"><div className="flex items-center gap-3"><Globe className="w-8 h-8 text-blue-500" />
        <div><p className="text-2xl font-bold">2,847</p><p className="text-sm text-muted-foreground">Blocked threats today</p>
        </div>
      </div>
      </CardContent>
      </Card>
      <Card><CardContent className="p-6"><div className="flex items-center gap-3"><Zap className="w-8 h-8 text-yellow-500" />
        <div><p className="text-2xl font-bold">99.9%</p><p className="text-sm text-muted-foreground">SSL certificate uptime</p>
        </div>
      </div>
      </CardContent>
      </Card>
    </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent><div className="space-y-3"><div className="flex items-center justify-between p-3 border rounded"><div className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-green-500" />
          <div><p className="text-sm font-medium">SSL Certificate Renewed</p><p className="text-xs text-muted-foreground">2 hours ago</p>
          </div>
        </div>
        </div><div className="flex items-center justify-between p-3 border rounded"><div className="flex items-center gap-3"><AlertTriangle className="w-4 h-4 text-yellow-500" />
          <div><p className="text-sm font-medium">Suspicious login attempt blocked</p><p className="text-xs text-muted-foreground">5 hours ago</p>
          </div>
        </div>
          </div><div className="flex items-center justify-between p-3 border rounded"><div className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-green-500" />
            <div><p className="text-sm font-medium">Security patch applied</p><p className="text-xs text-muted-foreground">1 day ago</p>
            </div>
          </div>
          </div>
        </div>
        </CardContent>
      </Card>
    </TabsContent><TabsContent value="logs" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>System Logs</CardTitle>
          <CardDescription>Real-time system event logs</CardDescription>
        </CardHeader>
        <CardContent><ScrollArea className="h-96 w-full"><div className="space-y-2 font-mono text-sm">{logs.map((log, index) => (<div key={index} className={cn("flex items-start gap-3 p-2 rounded", log.level === 'error' && "bg-red-50 dark:bg-red-900/10", log.level === 'warning' && "bg-yellow-50 dark:bg-yellow-900/10", log.level === 'info' && "bg-blue-50 dark:bg-blue-900/10")
        } ><span className="text-muted-foreground">
            {log.time}</span><Badge variant={log.level === 'error' ? 'destructive' : log.level === 'warning' ? 'secondary' : 'default'} className="text-xs" >
            {log.level}
          </Badge><span className="flex-1">
            {log.message}
          </span>
        </div>))}
        </div>
        </ScrollArea>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</div>
)
}

export default SystemVitals;
