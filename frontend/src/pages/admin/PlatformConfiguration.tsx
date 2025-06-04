import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresenceWrapper } from '../../components/teacher/AnimatePresenceWrapper';

import {
  Settings,
  ToggleLeft,
  ToggleRight,
  Mail,
  Code,
  Globe,
  Shield,
  Database,
  Zap,
  Rocket,
  Loader2,
  Check,
  X,
  AlertCircle,
  Info,
  Eye,
  Save,
  RefreshCw,
  Trash2,
  Clock,
  Send,
  TestTube,
  Beaker,
  FlaskConical,
  Activity,
  Percent,
  BarChart3,
  Users,
  FileText,
  Image as ImageIcon,
  Type,
  Palette,
  Layout,
  Smartphone,
  Monitor,
  HardDrive,
  Wifi,
  Cloud,
  Server,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Slider } from '../../components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';
import { Progress } from '../../components/ui/progress';
import { ScrollArea } from '../../components/ui/scroll-area';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../../components/ui/dialog';
import { cn } from '../../lib/utils';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  category: 'core' | 'experimental' | 'premium' | 'beta';
  dependencies?: string[];
  lastModified: Date;
  modifiedBy: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: 'transactional' | 'marketing' | 'notification';
  lastTested?: Date;
  openRate?: number;
  clickRate?: number;
}

interface SystemSetting {
  id: string;
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  description: string;
  editable: boolean;
}

const PlatformConfiguration: React.FC = () => {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([
    {
      id: 'ai-grading',
      name: 'AI-Powered Grading',
      description: 'Enable automatic grading using AI for subjective questions',
      enabled: true,
      rolloutPercentage: 100,
      category: 'core',
      lastModified: new Date(),
      modifiedBy: 'admin@examinr.com'
    },
    {
      id: 'live-proctoring',
      name: 'Live Proctoring',
      description: 'Real-time exam monitoring with AI-based cheating detection',
      enabled: false,
      rolloutPercentage: 25,
      category: 'experimental',
      dependencies: ['webcam-access', 'ml-models'],
      lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000),
      modifiedBy: 'tech@examinr.com'
    },
    {
      id: 'adaptive-testing',
      name: 'Adaptive Testing',
      description: 'Questions adapt based on student performance',
      enabled: true,
      rolloutPercentage: 50,
      category: 'beta',
      lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      modifiedBy: 'product@examinr.com'
    }
  ]);

  const [emailTemplates] = useState<EmailTemplate[]>([
    {
      id: 'welcome',
      name: 'Welcome Email',
      subject: 'Welcome to Examinr, {{name}}!',
      content: `Hi {{name}},\n\nWelcome to Examinr! We're excited to have you on board.\n\nGet started by exploring our features:\n- Create your first test\n- Join a class\n- Track your progress\n\nBest regards,\nThe Examinr Team`,
      variables: ['name', 'email'],
      category: 'transactional',
      lastTested: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      openRate: 78,
      clickRate: 32
    },
    {
      id: 'test-reminder',
      name: 'Test Reminder',
      subject: 'Reminder: {{testName}} starts in {{timeLeft}}',
      content: `Hi {{name}},\n\nThis is a reminder that your test "{{testName}}" is scheduled to start in {{timeLeft}}.\n\nTest Details:\n- Duration: {{duration}}\n- Questions: {{questionCount}}\n- Total Points: {{totalPoints}}\n\nBest of luck!\nThe Examinr Team`,
      variables: ['name', 'testName', 'timeLeft', 'duration', 'questionCount', 'totalPoints'],
      category: 'notification',
      lastTested: new Date(Date.now() - 24 * 60 * 60 * 1000),
      openRate: 92,
      clickRate: 45
    }
  ]);

  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceCountdown, setMaintenanceCountdown] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'failed'>('idle');

  // Feature Flag Toggle with Rollout Animation
  const FeatureFlagCard = ({ flag }: { flag: FeatureFlag }) => {
    const [isToggling, setIsToggling] = useState(false);

    const handleToggle = async () => {
      setIsToggling(true);
      // Simulate API call
      setTimeout(() => {
        setFeatureFlags(prev => prev.map(f => f.id === flag.id ? { ...f, enabled: !f.enabled } : f));
        setIsToggling(false);
      }, 1000);
    };

    const getCategoryColor = () => {
      switch (flag.category) {
        case 'core':
          return 'from-blue-500 to-cyan-500';
        case 'experimental':
          return 'from-purple-500 to-pink-500';
        case 'premium':
          return 'from-yellow-500 to-orange-500';
        case 'beta':
          return 'from-green-500 to-emerald-500';
        default:
          return 'from-gray-500 to-gray-600';
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={cn("relative overflow-hidden", flag.enabled && "border-primary")}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg bg-gradient-to-br", getCategoryColor())}>
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">{flag.name}</h4>
                  <Badge variant="outline" className="text-xs mt-1">
                    {flag.category}
                  </Badge>
                </div>
              </div>
              {/* Toggle Switch with Animation */}
              <motion.button
                className={cn(
                  "relative w-14 h-7 rounded-full transition-colors",
                  flag.enabled ? "bg-primary" : "bg-muted"
                )}
                onClick={handleToggle}
                disabled={isToggling}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                  animate={{ left: flag.enabled ? '32px' : '4px' }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {isToggling && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <Loader2 className="h-3 w-3 text-primary" />
                    </motion.div>
                  )}
                </motion.div>
              </motion.button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {flag.description}
            </p>
            {/* Rollout Percentage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Rollout Percentage</span>
                <span className="font-medium">{flag.rolloutPercentage}%</span>
              </div>
              <Slider
                value={[flag.rolloutPercentage]}
                onValueChange={([value]) => {
                  setFeatureFlags(prev => prev.map(f => f.id === flag.id ? { ...f, rolloutPercentage: value } : f));
                }}
                max={100}
                step={5}
                className="w-full"
                disabled={!flag.enabled}
              />
              {/* Visual Rollout Indicator */}
              <div className="flex gap-1">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      "flex-1 h-2 rounded-full",
                      i < Math.floor(flag.rolloutPercentage / 5) ? "bg-primary" : "bg-muted"
                    )}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                  />
                ))}
              </div>
            </div>
            {/* Dependencies */}
            {flag.dependencies && flag.dependencies.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-3 w-3" />
                <span>Depends on: {flag.dependencies.join(', ')}</span>
              </div>
            )}
            {/* Last Modified */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <span>Modified by {flag.modifiedBy}</span>
              <span>{flag.lastModified.toLocaleDateString()}</span>
            </div>
          </CardContent>
          {/* A/B Test Results (if enabled) */}
          {flag.enabled && flag.rolloutPercentage < 100 && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs gap-1">
                <Beaker className="h-3 w-3" /> A/B Testing
              </Badge>
            </div>
          )}
        </Card>
      </motion.div>
    );
  };

  // Email Template Editor
  const EmailTemplateEditor = ({ template }: { template: EmailTemplate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(template.content);
    const [isSending, setIsSending] = useState(false);

    const handleSendTest = async () => {
      setIsSending(true);
      // Simulate sending
      setTimeout(() => {
        setIsSending(false);
        // Show success notification
      }, 2000);
    };

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <Badge variant="outline" className="mt-1">
                {template.category}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {template.openRate && (
                <div className="text-center">
                  <p className="text-2xl font-bold">{template.openRate}%</p>
                  <p className="text-xs text-muted-foreground">Open Rate</p>
                </div>
              )}
              {template.clickRate && (
                <div className="text-center">
                  <p className="text-2xl font-bold">{template.clickRate}%</p>
                  <p className="text-xs text-muted-foreground">Click Rate</p>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subject Line */}
          <div>
            <Label>Subject Line</Label>
            <Input value={template.subject} readOnly className="mt-1" />
          </div>
          {/* Template Variables */}
          <div>
            <Label>Variables</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {template.variables.map(variable => (
                <motion.div
                  key={variable}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-muted rounded-full text-sm font-mono cursor-pointer"
                  onClick={() => {
                    // Insert variable at cursor position
                    setContent(prev => prev + ` {{${variable}}}`);
                  }}
                >
                  {`{{${variable}}}`}
                </motion.div>
              ))}
            </div>
          </div>
          {/* Content Editor */}
          <div>
            <Label>Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 font-mono text-sm"
              rows={8}
              readOnly={!isEditing}
            />
          </div>
          {/* Device Preview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <Monitor className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Desktop</span>
              </div>
              <div className="border rounded-lg p-4 pt-8 bg-muted/30 h-32 overflow-hidden">
                <div className="text-xs space-y-1">
                  <p className="font-semibold">{template.subject}</p>
                  <p className="text-muted-foreground line-clamp-3">{content}</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Mobile</span>
              </div>
              <div className="border rounded-lg p-3 pt-8 bg-muted/30 h-32 overflow-hidden mx-auto w-3/4">
                <div className="text-xs space-y-1">
                  <p className="font-semibold truncate">{template.subject}</p>
                  <p className="text-muted-foreground line-clamp-2 text-xs">{content}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Check className="h-4 w-4 mr-2" /> Save Changes
                </>
              ) : (
                <>
                  <Code className="h-4 w-4 mr-2" /> Edit Template
                </>
              )}
            </Button>
            <div className="flex items-center gap-2 ml-auto">
              <Input
                placeholder="test@example.com"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                className="w-48"
              />
              <Button
                onClick={handleSendTest}
                disabled={!testEmailAddress || isSending}
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" /> Send Test
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // System Maintenance Mode
  const MaintenanceMode = () => {
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

    const handleMaintenanceToggle = () => {
      if (!isMaintenanceMode) {
        setShowMaintenanceModal(true);
      } else {
        setIsMaintenanceMode(false);
        setMaintenanceCountdown(0);
      }
    };

    const startMaintenance = (duration: number) => {
      setIsMaintenanceMode(true);
      setMaintenanceCountdown(duration * 60);
      setShowMaintenanceModal(false);
      
      // Start countdown
      const interval = setInterval(() => {
        setMaintenanceCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsMaintenanceMode(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    return (
      <>
        <Card className={cn("relative overflow-hidden", isMaintenanceMode && "border-yellow-500")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Maintenance Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">System Maintenance</p>
                <p className="text-sm text-muted-foreground">
                  {isMaintenanceMode
                    ? `Active - ${Math.floor(maintenanceCountdown / 60)}:${String(maintenanceCountdown % 60).padStart(2, '0')} remaining`
                    : 'System is operational'}
                </p>
              </div>
              <Switch
                checked={isMaintenanceMode}
                onCheckedChange={handleMaintenanceToggle}
              />
            </div>
            {isMaintenanceMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <Progress value={(maintenanceCountdown / 3600) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  All users will see a maintenance page during this period
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showMaintenanceModal} onOpenChange={setShowMaintenanceModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Maintenance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                How long should the maintenance window be?
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" onClick={() => startMaintenance(30)}>
                  30 mins
                </Button>
                <Button variant="outline" onClick={() => startMaintenance(60)}>
                  1 hour
                </Button>
                <Button variant="outline" onClick={() => startMaintenance(120)}>
                  2 hours
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };

  // Update Deployment
  const UpdateDeployment = () => {
    const handleDeploy = () => {
      setDeploymentStatus('deploying');
      // Simulate deployment stages
      setTimeout(() => {
        setDeploymentStatus('success');
        setTimeout(() => {
          setDeploymentStatus('idle');
        }, 3000);
      }, 5000);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Update Deployment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Version Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Current Version</Label>
              <p className="font-mono">v2.3.1</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Available Update</Label>
              <p className="font-mono text-green-600">v2.4.0</p>
            </div>
          </div>
          {/* Changelog */}
          <div>
            <Label>What's New</Label>
            <div className="mt-2 space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Improved question bank performance</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>New analytics dashboard</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <span>Bug fixes and security updates</span>
              </div>
            </div>
          </div>
          {/* Deployment Button */}
          <Button
            className="w-full"
            onClick={handleDeploy}
            disabled={deploymentStatus !== 'idle'}
          >
            {deploymentStatus === 'idle' && (
              <>
                <Rocket className="h-4 w-4 mr-2" /> Deploy Update
              </>
            )}
            {deploymentStatus === 'deploying' && (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deploying...
              </>
            )}
            {deploymentStatus === 'success' && (
              <>
                <Check className="h-4 w-4 mr-2" /> Deployed Successfully!
              </>
            )}
          </Button>
          {/* Deployment Animation */}
          <AnimatePresenceWrapper>
            {deploymentStatus === 'deploying' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                {[
                  { stage: 'Building', progress: 30 },
                  { stage: 'Testing', progress: 60 },
                  { stage: 'Deploying', progress: 90 }
                ].map((stage, i) => (
                  <motion.div
                    key={stage.stage}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 1.5 }}
                  >
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{stage.stage}</span>
                      <span>{stage.progress}%</span>
                    </div>
                    <Progress value={stage.progress} className="h-2" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresenceWrapper>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Platform Configuration</h2>
          <p className="text-muted-foreground">
            Manage system settings, features, and configurations
          </p>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" /> Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="features" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">Feature Flags</TabsTrigger>
          <TabsTrigger value="emails">Email Templates</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* Feature Flags Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Feature Management</CardTitle>
                <Badge variant="outline">
                  {featureFlags.filter(f => f.enabled).length} / {featureFlags.length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {featureFlags.map(flag => (
                  <FeatureFlagCard key={flag.id} flag={flag} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Templates Tab */}
        <TabsContent value="emails" className="space-y-4">
          <div className="space-y-4">
            {emailTemplates.map(template => (
              <EmailTemplateEditor key={template.id} template={template} />
            ))}
          </div>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Cache TTL (seconds)</Label>
                  <Input type="number" defaultValue="3600" className="mt-1" />
                </div>
                <div>
                  <Label>Max Concurrent Users</Label>
                  <Input type="number" defaultValue="10000" className="mt-1" />
                </div>
                <div>
                  <Label>API Rate Limit (per minute)</Label>
                  <Input type="number" defaultValue="100" className="mt-1" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Two-Factor Authentication</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>IP Whitelisting</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Session Timeout (minutes)</Label>
                  <Input type="number" defaultValue="30" className="w-20" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MaintenanceMode />
            <UpdateDeployment />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlatformConfiguration;