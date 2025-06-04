import React, { useState, useEffect } from 'react';

  import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from '../../components/ui/select';
import { ScrollArea } from '../../components/ui/scroll-area';

  import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertTriangle,
  FileText,
  Download,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Package,
  MoreVertical,
  Filter,
  Receipt,
  Wallet,
  Coins} from 'lucide-react';
import { cn } from '../../lib/utils';

  interface RevenueMetric { id: string;
  label: string;
  value: number;
  change: number;changeType: 'increase' | 'decrease';
  icon: any;
  color: string
}

  interface Transaction { id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;type: 'subscription' | 'one-time' | 'refund';status: 'completed' | 'pending' | 'failed' | 'refunded';
  plan?: string;
  paymentMethod: string;
  timestamp: Date
}

  interface SubscriptionPlan { id: string;
  name: string;
  price: number;interval: 'monthly' | 'yearly';
  activeUsers: number;
  revenue: number;
  churnRate: number;
  color: string
}

  const FinancialManagement: React.FC = () => {
    const [revenueMetrics] = useState<RevenueMetric[]>([ {id: 'total-revenue',label: 'Total Revenue',
    value: 125840,
    change: 12.5,changeType: 'increase',
    icon: DollarSign,color: 'text-green-600 bg-green-100 dark:bg-green-900/20'
      }, {id: 'monthly-revenue',label: 'Monthly Revenue',
    value: 45230,
    change: 8.3,changeType: 'increase',
    icon: TrendingUp,color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
      }, {id: 'active-subscriptions',label: 'Active Subscriptions',
    value: 892,
    change: 5.2,changeType: 'increase',
    icon: Users,color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
      }, {id: 'failed-payments',label: 'Failed Payments',
    value: 23,
    change: 2.1,changeType: 'decrease',
    icon: XCircle,color: 'text-red-600 bg-red-100 dark:bg-red-900/20'
    } ]

  );
    const [transactions] = useState<Transaction[]>([ {id: '1',userId: 'usr_1',userName: 'John Doe',userEmail: 'john.doe@example.com',
    amount: 99,currency: 'USD',type: 'subscription',status: 'completed',plan: 'Premium Monthly',paymentMethod: 'Visa •••• 4242',
    timestamp: new Date(Date.now() - 60000)
      }, {id: '2',userId: 'usr_2',userName: 'Jane Smith',userEmail: 'jane.smith@example.com',
    amount: 299,currency: 'USD',type: 'subscription',status: 'pending',plan: 'Enterprise Yearly',paymentMethod: 'MasterCard •••• 5555',
    timestamp: new Date(Date.now() - 300000)
      }, {id: '3',userId: 'usr_3',userName: 'Bob Johnson',userEmail: 'bob.johnson@example.com',
    amount: 49,currency: 'USD',type: 'subscription',status: 'failed',plan: 'Basic Monthly',paymentMethod: 'Visa •••• 1234',
    timestamp: new Date(Date.now() - 600000)
    } ]

  );
    const [subscriptionPlans] = useState<SubscriptionPlan[]>([ {id: 'free',name: 'Free',
    price: 0,interval: 'monthly',
    activeUsers: 2100,
    revenue: 0,
    churnRate: 15,color: 'from-gray-500 to-gray-600'
      }, {id: 'basic',name: 'Basic',
    price: 49,interval: 'monthly',
    activeUsers: 450,
    revenue: 22050,
    churnRate: 8,color: 'from-blue-500 to-indigo-500'
      }, {id: 'premium',name: 'Premium',
    price: 99,interval: 'monthly',
    activeUsers: 380,
    revenue: 37620,
    churnRate: 5,color: 'from-purple-500 to-pink-500'
      }, {id: 'enterprise',name: 'Enterprise',
    price: 299,interval: 'monthly',
    activeUsers: 62,
    revenue: 18538,
    churnRate: 2,color: 'from-yellow-500 to-orange-500'
    } ]

  );
  const [refreshing, setRefreshing] = useState(false
  );
    const refreshMetrics = () => {
    setRefreshing(true

    );
      setTimeout(() => {
      setRefreshing(false

      )
}, 1000

    )
}

    const getStatusColor = (status: string) => {switch (status) { case 'completed': return 'text-green-500 bg-green-500/10';case 'pending': return 'text-yellow-500 bg-yellow-500/10';case 'failed': return 'text-red-500 bg-red-500/10';case 'refunded': return 'text-purple-500 bg-purple-500/10';default: return 'text-gray-500 bg-gray-500/10'
} };

    const getStatusIcon = (status: string) => {switch (status) { case 'completed': return <CheckCircle className="h-5 w-5" />;case 'pending': return <Clock className="h-5 w-5" />;case 'failed': return <XCircle className="h-5 w-5" />;case 'refunded': return <RefreshCw className="h-5 w-5" />;
      default: return null
} };

  return (<div className="p-6 space-y-6">
      {
    /* Header */
    }<div className="flex items-center justify-between">
  <div><h1 className="text-3xl font-bold">Financial Management</h1><p className="text-muted-foreground"> Track revenue, subscriptions, and financial health </p>
  </div><div className="flex items-center gap-3"><Select defaultValue="30d"><SelectTrigger className="w-32">
  <SelectValue />
  </SelectTrigger>
  <SelectContent><SelectItem value="24h">Last 24h</SelectItem><SelectItem value="7d">Last 7 days</SelectItem><SelectItem value="30d">Last 30 days</SelectItem><SelectItem value="90d">Last 90 days</SelectItem><SelectItem value="1y">Last year</SelectItem>
  </SelectContent>
  </Select><Button variant="outline" onClick={refreshMetrics} disabled={refreshing} ><RefreshCw className={cn("h-4 w-4 mr-2", refreshing &&"animate-spin")} /> Refresh </Button><Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export </Button>
  </div>
  </div>
      {
    /* Revenue Overview */
    }
    <Card><CardContent className="p-8"><div className="flex items-center justify-between">
  <div><p className="text-sm text-muted-foreground mb-2">Total Revenue (All Time)</p><div className="flex items-baseline gap-3"><h2 className="text-5xl font-bold">$125,840</h2><Badge variant="default" className="gap-1"><TrendingUp className="h-3 w-3" /> 12.5% </Badge>
  </div><p className="text-sm text-muted-foreground mt-2"> vs. previous period: $111,840 </p>
  </div><div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg"><Coins className="h-12 w-12 text-green-600 dark:text-green-400" />
  </div>
  </div>
  </CardContent>
  </Card>
      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {revenueMetrics.map((metric) => {
      const Icon = metric.icon;
      return (
      <Card key={metric.id}><CardContent className="p-6"><div className="flex items-center justify-between">
      <div><p className="text-sm text-muted-foreground">
      {metric.label}
      </p><div className="flex items-baseline gap-2 mt-2"><p className="text-2xl font-bold">{metric.label.includes('Revenue') ? '$' : ''} {metric.value.toLocaleString()}</p><Badge variant={metric.changeType === 'increase' ? 'default' : 'destructive'} className="text-xs" >{metric.changeType === 'increase' ? ( <ArrowUpRight className="h-3 w-3 mr-1" /> ) : ( <ArrowDownRight className="h-3 w-3 mr-1" /> )} {metric.change}% </Badge>
      </div>
      </div><div className={cn("p-3 rounded-lg", metric.color)}><Icon className="h-6 w-6" />
      </div>
      </div>
      </CardContent>
      </Card>
      )
}
    )
    }
    </div>
      {
    /* Main Content Tabs */
    }<Tabs defaultValue="transactions" className="space-y-4"><TabsList className="grid w-full grid-cols-4"><TabsTrigger value="transactions">Transactions</TabsTrigger><TabsTrigger value="subscriptions">Subscriptions</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger><TabsTrigger value="invoices">Invoices</TabsTrigger>
  </TabsList>
      {
    /* Transactions Tab */
    }<TabsContent value="transactions" className="space-y-4">
  <Card>
  <CardHeader><div className="flex items-center justify-between">
  <CardTitle>Recent Transactions</CardTitle><div className="flex items-center gap-2"><Badge variant="outline" className="gap-1"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live </Badge><Button size="sm" variant="outline"><Filter className="h-4 w-4" />
  </Button>
  </div>
  </div>
  </CardHeader>
  <CardContent><ScrollArea className="h-[400px]"><div className="space-y-2">{transactions.map(transaction => ( <div key={transaction.id} className="flex items-center gap-4 p-4 rounded-lg transition-colors" ><div className={cn("w-10 h-10 rounded-full flex items-center justify-center",
      getStatusColor(transaction.status) )
      }>
      {getStatusIcon(transaction.status)}
    </div><div className="flex-1 min-w-0"><p className="font-medium">
      {transaction.userName}
    </p><p className="text-sm text-muted-foreground truncate">
      {transaction.userEmail}
    </p>
    </div><div className="hidden md:block text-center"><p className="text-sm font-medium">{transaction.plan || 'One-time'}
    </p><p className="text-xs text-muted-foreground">
      {transaction.paymentMethod}
    </p>
    </div><div className="text-right"><p className={cn("text-lg font-bold",transaction.type === 'refund' ?"text-red-500" :"text-green-500" )
      }>{transaction.type === 'refund' ? '-' : '+'}${transaction.amount}
    </p><p className="text-xs text-muted-foreground">
      {transaction.timestamp.toLocaleTimeString()}
    </p>
    </div><Button size="sm" variant="ghost"><MoreVertical className="h-4 w-4" />
    </Button>
  </div> ))}
    </div>
  </ScrollArea>
      {
    /* Failed Payment Alert */
    }<div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"><div className="flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-red-500" /><div className="flex-1"><p className="font-medium">3 Failed Payments Need Attention</p><p className="text-sm text-muted-foreground"> Click to retry or contact customers </p>
  </div><Button size="sm" variant="outline"> View Details </Button>
  </div>
  </div>
  </CardContent>
  </Card>
  </TabsContent>
      {
    /* Subscriptions Tab */
    }<TabsContent value="subscriptions" className="space-y-4"><div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {
    /* Subscription Stats */
    }
    <Card>
  <CardHeader>
  <CardTitle>Subscription Overview</CardTitle>
  </CardHeader>
  <CardContent><div className="space-y-4"><div className="flex items-center justify-between"><span className="text-sm font-medium">Total Active Subscriptions</span><span className="text-2xl font-bold">2,992</span>
  </div><Progress value={75} className="h-2" /><div className="grid grid-cols-2 gap-4 pt-4">
  <div><p className="text-sm text-muted-foreground">New this month</p><p className="text-xl font-bold text-green-500">+142</p>
  </div>
  <div><p className="text-sm text-muted-foreground">Cancelled</p><p className="text-xl font-bold text-red-500">-23</p>
  </div>
  </div>
  </div>
  </CardContent>
  </Card>
      {
    /* Plan Breakdown */
    }
    <Card>
  <CardHeader>
  <CardTitle>Plan Distribution</CardTitle>
  </CardHeader>
  <CardContent><div className="space-y-4">{subscriptionPlans.map(plan => ( <div key={plan.id} className="space-y-2"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className={cn("w-3 h-3 rounded-full bg-gradient-to-r",
      plan.color )
      } /><span className="font-medium">
      {plan.name}
    </span>
    </div><div className="text-right"><p className="font-bold">${plan.revenue.toLocaleString()}
    </p><p className="text-xs text-muted-foreground">
      {plan.activeUsers} users </p>
    </div>
    </div><div className="flex items-center gap-4"><Progress value={(plan.revenue / 80000) * 100} className="flex-1 h-2" /><Badge variant={plan.churnRate < 5 ? 'default' : 'secondary'}>
      {plan.churnRate}% churn </Badge>
    </div>
  </div> ))}
    </div>
  </CardContent>
  </Card>
  </div>
  </TabsContent>
      {
    /* Analytics Tab */
    }<TabsContent value="analytics" className="space-y-4">
  <Card>
  <CardHeader>
  <CardTitle>Revenue Analytics</CardTitle>
  </CardHeader>
  <CardContent>
      {
    /* Simple Chart Placeholder */
    }<div className="h-64 bg-muted rounded-lg flex items-center justify-center"><p className="text-muted-foreground">Revenue chart visualization</p>
  </div>
      {
    /* Growth Indicators */
    }<div className="grid grid-cols-3 gap-4 mt-6"><div className="text-center p-4 bg-muted rounded-lg"><div className="flex items-center justify-center gap-1 mb-2"><TrendingUp className="h-4 w-4 text-green-500" /><span className="text-2xl font-bold">+23%</span>
  </div><p className="text-xs text-muted-foreground">Monthly Growth</p>
  </div><div className="text-center p-4 bg-muted rounded-lg"><div className="flex items-center justify-center gap-1 mb-2"><Users className="h-4 w-4 text-blue-500" /><span className="text-2xl font-bold">892</span>
  </div><p className="text-xs text-muted-foreground">New Customers</p>
  </div><div className="text-center p-4 bg-muted rounded-lg"><div className="flex items-center justify-center gap-1 mb-2"><DollarSign className="h-4 w-4 text-purple-500" /><span className="text-2xl font-bold">$142</span>
  </div><p className="text-xs text-muted-foreground">Avg. Revenue/User</p>
  </div>
  </div>
  </CardContent>
  </Card>
  </TabsContent>
      {
    /* Invoices Tab */
    }<TabsContent value="invoices" className="space-y-4">
  <Card>
  <CardHeader><div className="flex items-center justify-between">
  <CardTitle>Invoice Management</CardTitle>
  <Button><FileText className="h-4 w-4 mr-2" /> Generate Invoice </Button>
  </div>
  </CardHeader>
  <CardContent><div className="space-y-3">
      {[ {id: 'INV-001',user: 'John Doe',
      amount: 99,status: 'sent',date: '2024-01-15'
        }, {id: 'INV-002',user: 'Jane Smith',
      amount: 299,status: 'paid',date: '2024-01-14'
        }, {id: 'INV-003',user: 'Bob Johnson',
      amount: 49,status: 'overdue',date: '2024-01-10'} ].map(invoice => ( <div key={invoice.id} className="flex items-center gap-4 p-4 border rounded-lg transition-colors" ><FileText className="h-8 w-8 text-muted-foreground" /><div className="flex-1"><p className="font-medium">
      {invoice.id}
    </p><p className="text-sm text-muted-foreground">
      {invoice.user}
    </p>
    </div><div className="text-center"><p className="font-bold">${invoice.amount}
    </p><p className="text-xs text-muted-foreground">
      {invoice.date}
    </p>
    </div><Badge variant={ invoice.status === 'paid' ? 'default' : invoice.status === 'overdue' ? 'destructive' : 'secondary' } >
      {invoice.status}
    </Badge><Button size="sm" variant="ghost"><Download className="h-4 w-4" />
    </Button>
  </div> ))}
    </div>
  </CardContent>
  </Card>
  </TabsContent>
  </Tabs>
  </div>
  )
}

export default FinancialManagement;
