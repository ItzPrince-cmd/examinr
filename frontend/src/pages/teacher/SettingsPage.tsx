import React, { useState } from 'react';

  import {
  Settings,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Palette,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  Volume2,
  Wifi,
  Save,
  ChevronRight,
  Smartphone,
  Monitor,
  Eye,
  EyeOff,
  Key,
  LogOut,
  GraduationCap} from 'lucide-react';

  import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';

  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { toast } from '../../components/ui/use-toast';
import { Badge } from '../../components/ui/badge';

  type SettingsState = { emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  testReminders: boolean;
  attendanceAlerts: boolean;
  performanceUpdates: boolean;
  batchAnnouncements: boolean;
  systemUpdates: boolean;
  theme: string;
  fontSize: string;
  compactMode: boolean;
  showAnimations: boolean;
  profileVisibility: string;
  showEmail: boolean;
  showPhone: boolean;
  sharePerformanceData: boolean;
  defaultTestDuration: string;
  autoGrading: boolean;
  showCorrectAnswers: boolean;
  allowRetake: boolean;
  defaultBatchSize: string;
  allowStudentMessages: boolean;
  messageNotifications: boolean;
  parentCommunication: boolean;
  weeklyReports: boolean
}

  const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<SettingsState>({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    testReminders: true,
    attendanceAlerts: true,
    performanceUpdates: true,
    batchAnnouncements: true,
    systemUpdates: false,
    // Display
    theme: 'light',
    fontSize: 'medium',
    compactMode: false,
    showAnimations: true,
    // Privacy
    profileVisibility: 'students',
    showEmail: false,
    showPhone: false,
    sharePerformanceData: true,
    // Teaching
    defaultTestDuration: '120',
    autoGrading: true,
    showCorrectAnswers: true,
    allowRetake: false,
    defaultBatchSize: '30',
    // Communication
    allowStudentMessages: true,
    messageNotifications: true,
    parentCommunication: true,
    weeklyReports: true
  });
    const handleSaveSettings = () => {
      toast({
      title:"Settings Saved",description:"Your preferences have been updated successfully.",

      }

    )
}

  const handleToggle = (key: keyof SettingsState) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const handleChange = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  return (<div className="container py-6 space-y-6">
      {
    /* Header */
    }<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <div><h1 className="text-3xl font-bold tracking-tight">Settings</h1><p className="text-muted-foreground">Manage your account preferences and settings</p>
  </div>
  <Button onClick={handleSaveSettings}><Save className="h-4 w-4 mr-2" /> Save Changes </Button>
  </div>
      {
    /* Settings Tabs */
    }<Tabs defaultValue="notifications" className="space-y-4"><TabsList className="grid w-full grid-cols-5"><TabsTrigger value="notifications">Notifications</TabsTrigger><TabsTrigger value="display">Display</TabsTrigger><TabsTrigger value="privacy">Privacy</TabsTrigger><TabsTrigger value="teaching">Teaching</TabsTrigger><TabsTrigger value="account">Account</TabsTrigger>
  </TabsList>
      {
    /* Notifications Tab */
    }<TabsContent value="notifications" className="space-y-4">
  <Card>
  <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Notification Preferences </CardTitle>
  <CardDescription> Choose how you want to receive notifications </CardDescription>
  </CardHeader><CardContent className="space-y-6">
      {
    /* Notification Channels */
    }<div className="space-y-4"><h3 className="text-sm font-medium">Notification Channels</h3><div className="space-y-3"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" />
  <div><Label htmlFor="email-notifications">Email Notifications</Label><p className="text-sm text-muted-foreground">Receive updates via email</p>
  </div></div><Switch id="email-notifications" checked={settings.emailNotifications} onCheckedChange={() => handleToggle('emailNotifications')} />
  </div><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Smartphone className="h-4 w-4 text-muted-foreground" />
  <div><Label htmlFor="push-notifications">Push Notifications</Label><p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
  </div></div><Switch id="push-notifications" checked={settings.pushNotifications} onCheckedChange={() => handleToggle('pushNotifications')} />
  </div><div className="flex items-center justify-between"><div className="flex items-center gap-3"><MessageSquare className="h-4 w-4 text-muted-foreground" />
  <div><Label htmlFor="sms-notifications">SMS Notifications</Label><p className="text-sm text-muted-foreground">Receive important alerts via SMS</p>
  </div></div><Switch id="sms-notifications" checked={settings.smsNotifications} onCheckedChange={() => handleToggle('smsNotifications')} />
  </div>
  </div>
  </div>
  <Separator />
      {
    /* Notification Types */
    }<div className="space-y-4"><h3 className="text-sm font-medium">Notification Types</h3><div className="space-y-3"><div className="flex items-center justify-between"><Label htmlFor="test-reminders">Test Reminders</Label><Switch id="test-reminders" checked={settings.testReminders} onCheckedChange={() => handleToggle('testReminders')} />
  </div><div className="flex items-center justify-between"><Label htmlFor="attendance-alerts">Attendance Alerts</Label><Switch id="attendance-alerts" checked={settings.attendanceAlerts} onCheckedChange={() => handleToggle('attendanceAlerts')} />
  </div><div className="flex items-center justify-between"><Label htmlFor="performance-updates">Student Performance Updates</Label><Switch id="performance-updates" checked={settings.performanceUpdates} onCheckedChange={() => handleToggle('performanceUpdates')} />
  </div><div className="flex items-center justify-between"><Label htmlFor="batch-announcements">Batch Announcements</Label><Switch id="batch-announcements" checked={settings.batchAnnouncements} onCheckedChange={() => handleToggle('batchAnnouncements')} />
  </div>
  </div>
  </div>
  </CardContent>
  </Card>
  </TabsContent>
      {
    /* Display Tab */
    }<TabsContent value="display" className="space-y-4">
  <Card>
  <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" /> Display Settings </CardTitle>
  <CardDescription> Customize your interface appearance </CardDescription>
  </CardHeader><CardContent className="space-y-6">
      {
    /* Theme Selection */
    }<div className="space-y-3">
  <Label>Theme</Label><RadioGroup value={settings.theme} onValueChange={(value) => handleChange('theme', value)}><div className="flex items-center space-x-2"><RadioGroupItem value="light" id="light" /><Label htmlFor="light" className="flex items-center gap-2 cursor-pointer"><Sun className="h-4 w-4" /> Light </Label>
  </div><div className="flex items-center space-x-2"><RadioGroupItem value="dark" id="dark" /><Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer"><Moon className="h-4 w-4" /> Dark </Label>
  </div><div className="flex items-center space-x-2"><RadioGroupItem value="system" id="system" /><Label htmlFor="system" className="flex items-center gap-2 cursor-pointer"><Monitor className="h-4 w-4" /> System </Label>
  </div>
  </RadioGroup>
  </div>
  <Separator />
      {
    /* Font Size */
    }<div className="space-y-3"><Label htmlFor="font-size">Font Size</Label><Select value={settings.fontSize} onValueChange={(value) => handleChange('fontSize', value)}><SelectTrigger id="font-size">
  <SelectValue />
  </SelectTrigger>
  <SelectContent><SelectItem value="small">Small</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="large">Large</SelectItem>
  </SelectContent>
  </Select>
  </div>
      {
    /* Display Options */
    }<div className="space-y-3"><div className="flex items-center justify-between"><Label htmlFor="compact-mode">Compact Mode</Label><Switch id="compact-mode" checked={settings.compactMode} onCheckedChange={() => handleToggle('compactMode')} />
  </div><div className="flex items-center justify-between"><Label htmlFor="animations">Show Animations</Label><Switch id="animations" checked={settings.showAnimations} onCheckedChange={() => handleToggle('showAnimations')} />
  </div>
  </div>
  </CardContent>
  </Card>
  </TabsContent>
      {
    /* Privacy Tab */
    }<TabsContent value="privacy" className="space-y-4">
  <Card>
  <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Privacy Settings </CardTitle>
  <CardDescription> Control your information visibility and sharing </CardDescription>
  </CardHeader><CardContent className="space-y-6">
      {
    /* Profile Visibility */
    }<div className="space-y-3">
  <Label>Profile Visibility</Label>
    <RadioGroup value={settings.profileVisibility} onValueChange={(value) => handleChange('profileVisibility',
    value)
    } ><div className="flex items-center space-x-2"><RadioGroupItem value="public" id="public" /><Label htmlFor="public">Public (All users)</Label>
  </div><div className="flex items-center space-x-2"><RadioGroupItem value="students" id="students" /><Label htmlFor="students">My Students Only</Label>
  </div><div className="flex items-center space-x-2"><RadioGroupItem value="private" id="private" /><Label htmlFor="private">Private</Label>
  </div>
  </RadioGroup>
  </div>
  <Separator />
      {
    /* Contact Information */
    }<div className="space-y-3"><h3 className="text-sm font-medium">Contact Information</h3><div className="space-y-3"><div className="flex items-center justify-between"><Label htmlFor="show-email">Show Email to Students</Label><Switch id="show-email" checked={settings.showEmail} onCheckedChange={() => handleToggle('showEmail')} />
  </div><div className="flex items-center justify-between"><Label htmlFor="show-phone">Show Phone to Students</Label><Switch id="show-phone" checked={settings.showPhone} onCheckedChange={() => handleToggle('showPhone')} />
  </div>
  </div>
  </div>
  <Separator />
      {
    /* Data Sharing */
    }<div className="space-y-3"><div className="flex items-center justify-between">
  <div><Label htmlFor="share-performance">Share Performance Analytics</Label><p className="text-sm text-muted-foreground">Help improve teaching methods</p></div><Switch id="share-performance" checked={settings.sharePerformanceData} onCheckedChange={() => handleToggle('sharePerformanceData')} />
  </div>
  </div>
  </CardContent>
  </Card>
  </TabsContent>
      {
    /* Teaching Tab */
    }<TabsContent value="teaching" className="space-y-4">
  <Card>
  <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Teaching Preferences </CardTitle>
  <CardDescription> Configure default settings for tests and batches </CardDescription>
  </CardHeader><CardContent className="space-y-6">
      {
    /* Test Settings */
    }<div className="space-y-4"><h3 className="text-sm font-medium">Test Settings</h3><div className="space-y-3"><div className="space-y-2"><Label htmlFor="test-duration">Default Test Duration (minutes)</Label>
    <Select value={settings.defaultTestDuration} onValueChange={(value) => handleChange('defaultTestDuration',
    value)
    } ><SelectTrigger id="test-duration">
  <SelectValue />
  </SelectTrigger>
  <SelectContent><SelectItem value="60">60 minutes</SelectItem><SelectItem value="90">90 minutes</SelectItem><SelectItem value="120">120 minutes</SelectItem><SelectItem value="180">180 minutes</SelectItem>
  </SelectContent>
  </Select>
  </div><div className="flex items-center justify-between"><Label htmlFor="auto-grading">Enable Auto-grading</Label><Switch id="auto-grading" checked={settings.autoGrading} onCheckedChange={() => handleToggle('autoGrading')} />
  </div><div className="flex items-center justify-between"><Label htmlFor="show-answers">Show Correct Answers After Test</Label><Switch id="show-answers" checked={settings.showCorrectAnswers} onCheckedChange={() => handleToggle('showCorrectAnswers')} />
  </div><div className="flex items-center justify-between"><Label htmlFor="allow-retake">Allow Test Retake</Label><Switch id="allow-retake" checked={settings.allowRetake} onCheckedChange={() => handleToggle('allowRetake')} />
  </div>
  </div>
  </div>
  <Separator />
      {
    /* Batch Settings */
    }<div className="space-y-3"><Label htmlFor="batch-size">Default Batch Size</Label><Select value={settings.defaultBatchSize} onValueChange={(value) => handleChange('defaultBatchSize', value)} ><SelectTrigger id="batch-size">
  <SelectValue />
  </SelectTrigger>
  <SelectContent><SelectItem value="20">20 students</SelectItem><SelectItem value="30">30 students</SelectItem><SelectItem value="40">40 students</SelectItem><SelectItem value="50">50 students</SelectItem>
  </SelectContent>
  </Select>
  </div>
  </CardContent>
  </Card>
      {
    /* Communication Settings */
    }
    <Card>
  <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5" /> Communication Settings </CardTitle>
  </CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between"><Label htmlFor="student-messages">Allow Student Messages</Label><Switch id="student-messages" checked={settings.allowStudentMessages} onCheckedChange={() => handleToggle('allowStudentMessages')} />
  </div><div className="flex items-center justify-between"><Label htmlFor="parent-communication">Enable Parent Communication</Label><Switch id="parent-communication" checked={settings.parentCommunication} onCheckedChange={() => handleToggle('parentCommunication')} />
  </div><div className="flex items-center justify-between"><Label htmlFor="weekly-reports">Send Weekly Progress Reports</Label><Switch id="weekly-reports" checked={settings.weeklyReports} onCheckedChange={() => handleToggle('weeklyReports')} />
  </div>
  </CardContent>
  </Card>
  </TabsContent>
      {
    /* Account Tab */
    }<TabsContent value="account" className="space-y-4">
  <Card>
  <CardHeader><CardTitle className="flex items-center gap-2"><Key className="h-5 w-5" /> Account Security </CardTitle>
  </CardHeader><CardContent className="space-y-4"><Button variant="outline" className="w-full justify-start"><Key className="h-4 w-4 mr-2" /> Change Password </Button><Button variant="outline" className="w-full justify-start"><Shield className="h-4 w-4 mr-2" /> Two-Factor Authentication <Badge variant="secondary" className="ml-auto">Disabled</Badge>
  </Button><Button variant="outline" className="w-full justify-start"><Smartphone className="h-4 w-4 mr-2" /> Manage Devices </Button>
  </CardContent>
  </Card>
  <Card>
  <CardHeader>
  <CardTitle>Danger Zone</CardTitle>
  <CardDescription> Actions that can affect your account permanently </CardDescription>
  </CardHeader><CardContent className="space-y-4"><Button variant="destructive" className="w-full"><LogOut className="h-4 w-4 mr-2" /> Sign Out from All Devices </Button>
  </CardContent>
  </Card>
  </TabsContent>
  </Tabs>
  </div>
  )
}

export default SettingsPage;
