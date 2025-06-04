import React, { useState } from 'react';
import { motion } from 'framer-motion';

  import {
  User,
  Mail,
  Phone,
  Calendar,
  School,
  MapPin,
  Camera,
  Edit2,
  Save,
  X,
  Shield,
  Key,
  Bell,
  Moon,
  Sun,
  Globe,
  Smartphone,
  Clock,
  CreditCard,
  Crown,
  CheckCircle2,
  BarChart3} from 'lucide-react';

  import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';

  import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { toast } from '../../components/ui/use-toast';

  import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../components/theme/theme-provider';

// Types
interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  education: string;
  institution: string;
  location: string;
  bio: string;
  avatar: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  testReminders: boolean;
  resultAlerts: boolean;
  weeklyReports: boolean;
  promotionalEmails: boolean;
}

interface StudyPreferences {
  preferredTime: string;
  dailyGoal: number;
  reminderTime: string;
  weeklyTarget: number;
  focusSubjects: string[];
}

interface SubscriptionInfo {
  plan: 'free' | 'basic' | 'premium';
  status: 'active' | 'expired' | 'cancelled';
  validUntil: string;
  features: string[];
}

const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false
  );
  const [showPasswordDialog, setShowPasswordDialog] = useState(false
  );
  const [isSaving, setIsSaving] = useState(false
  );
  // Profile data
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: user?.name?.split(' ')[0] || 'John',
    lastName: user?.name?.split(' ')[1] || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 234 567 8900',
    dateOfBirth: '2000-01-15',
    education: 'Undergraduate',
    institution: 'ABC University',
    location: 'New York, USA',
    bio: 'Passionate learner preparing for competitive exams',
    avatar: user?.avatar || ''
  });
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    testReminders: true,
    resultAlerts: true,
    weeklyReports: false,
    promotionalEmails: false
  });
  
  const [studyPreferences, setStudyPreferences] = useState<StudyPreferences>({
    preferredTime: 'evening',
    dailyGoal: 50,
    reminderTime: '18:00',
    weeklyTarget: 300,
    focusSubjects: ['Physics', 'Mathematics']
  });
  const subscriptionInfo: SubscriptionInfo = {
    plan: 'basic',
    status: 'active',
    validUntil: '2024-12-31',
    features: [
      'Unlimited practice questions',
      'Basic analytics',
      'Monthly mock tests',
      'Email support'
    ]
  };

  // Handlers
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // API call to save profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate API call
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully"
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      // API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate API call
      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully"
      });
      setShowPasswordDialog(false);
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: "Failed to change password. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
    // Save to backend
    toast({
      title: "Settings Updated",
      description: "Notification preferences updated"
    });
  };

  // Get initials for avatar
  const getInitials = () => {
    return `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase();
  };

  return (<div className="min-h-screen bg-background p-6"><div className="max-w-4xl mx-auto space-y-6">
      {
    /* Header */
    }
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} ><h1 className="text-3xl font-bold">Profile & Settings</h1><p className="text-muted-foreground mt-1"> Manage your account settings and preferences </p>
  </motion.div><Tabs defaultValue="profile" className="space-y-4">
  <TabsList><TabsTrigger value="profile">Profile</TabsTrigger><TabsTrigger value="security">Security</TabsTrigger><TabsTrigger value="notifications">Notifications</TabsTrigger><TabsTrigger value="preferences">Study Preferences</TabsTrigger><TabsTrigger value="subscription">Subscription</TabsTrigger>
  </TabsList>
      {
    /* Profile Tab */
    }<TabsContent value="profile">
  <Card>
  <CardHeader><div className="flex items-center justify-between">
  <div>
  <CardTitle>Personal Information</CardTitle>
  <CardDescription>Update your personal details</CardDescription>
  </div>
      {!isEditing ? ( <Button onClick={() => setIsEditing(true)}><Edit2 className="mr-2 h-4 w-4" /> Edit Profile </Button> ) : ( <div className="flex gap-2"><Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving} ><X className="mr-2 h-4 w-4" /> Cancel </Button>
    <Button onClick={handleSaveProfile} disabled={isSaving}><Save className="mr-2 h-4 w-4" /> Save Changes </Button>
  </div> )}
    </div>
  </CardHeader><CardContent className="space-y-6">
      {
    /* Avatar Section */
    }<div className="flex items-center gap-6"><div className="relative"><Avatar className="h-24 w-24">
  <AvatarImage src={profileData.avatar} />
  <AvatarFallback>
      {getInitials()}
    </AvatarFallback>
  </Avatar>{isEditing && ( <Button size="sm" variant="outline" className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0" onClick={() => {
          toast({title:"Upload Avatar",description:"Avatar upload feature coming soon!"
          }

        )
}} ><Camera className="h-4 w-4" />
  </Button> )}
    </div>
  <div><h3 className="text-lg font-semibold">
      {profileData.firstName} {profileData.lastName}
    </h3><p className="text-sm text-muted-foreground">
      {profileData.email}
    </p><Badge className="mt-2">Student</Badge>
  </div>
  </div>
  <Separator />
      {
    /* Profile Form */
    }<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div><Label htmlFor="firstName">First Name</Label><Input id="firstName" value={profileData.firstName} onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value }
    )
    } disabled={!isEditing} />
  </div>
  <div><Label htmlFor="lastName">Last Name</Label><Input id="lastName" value={profileData.lastName} onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value }
    )
    } disabled={!isEditing} />
  </div>
  <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={profileData.email} disabled className="cursor-not-allowed" />
  </div>
  <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value }
    )
    } disabled={!isEditing} />
  </div>
  <div><Label htmlFor="dob">Date of Birth</Label><Input id="dob" type="date" value={profileData.dateOfBirth} onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value }
    )
    } disabled={!isEditing} />
  </div>
  <div><Label htmlFor="education">Education Level</Label>
    <Select value={profileData.education} onValueChange={(value) => setProfileData({ ...profileData, education: value }
    )
    } disabled={!isEditing} ><SelectTrigger id="education">
  <SelectValue />
  </SelectTrigger>
  <SelectContent><SelectItem value="High School">High School</SelectItem><SelectItem value="Undergraduate">Undergraduate</SelectItem><SelectItem value="Graduate">Graduate</SelectItem><SelectItem value="Professional">Professional</SelectItem>
  </SelectContent>
  </Select>
  </div>
  <div><Label htmlFor="institution">Institution</Label><Input id="institution" value={profileData.institution} onChange={(e) => setProfileData({ ...profileData, institution: e.target.value }
    )
    } disabled={!isEditing} />
  </div>
  <div><Label htmlFor="location">Location</Label><Input id="location" value={profileData.location} onChange={(e) => setProfileData({ ...profileData, location: e.target.value }
    )
    } disabled={!isEditing} />
  </div>
  </div>
  <div><Label htmlFor="bio">Bio</Label><textarea id="bio" className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background disabled:cursor-not-allowed disabled:opacity-50" value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value }
    )} disabled={!isEditing} placeholder="Tell us about yourself..." />
  </div>
  </CardContent>
  </Card>
  </TabsContent>
      {
    /* Security Tab */
    }<TabsContent value="security"><div className="space-y-6">
  <Card>
  <CardHeader>
  <CardTitle>Password & Authentication</CardTitle>
  <CardDescription>Manage your security settings</CardDescription>
  </CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between">
  <div><p className="font-medium">Password</p><p className="text-sm text-muted-foreground"> Last changed 3 months ago </p>
  </div>
  <Button onClick={() => setShowPasswordDialog(true)}> Change Password </Button>
  </div>
  <Separator /><div className="flex items-center justify-between">
  <div><p className="font-medium">Two-Factor Authentication</p><p className="text-sm text-muted-foreground"> Add an extra layer of security to your account </p>
  </div>
  <Switch />
  </div>
  <Separator /><div className="flex items-center justify-between">
  <div><p className="font-medium">Login History</p><p className="text-sm text-muted-foreground"> View your recent login activity </p>
  </div><Button variant="outline" onClick={() => {
        toast({title:"Login History",description:"Login history feature coming soon!"
        }

      )
}}>View History</Button>
  </div>
  </CardContent>
  </Card>
  <Card>
  <CardHeader>
  <CardTitle>Active Sessions</CardTitle>
  <CardDescription>Manage your active sessions</CardDescription>
  </CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex items-center gap-3"><Smartphone className="h-5 w-5 text-muted-foreground" />
  <div><p className="font-medium">Windows PC - Chrome</p><p className="text-sm text-muted-foreground"> 192.168.1.1 • Current session </p>
  </div>
  </div><Badge variant="secondary">Current</Badge>
  </div>
  </CardContent>
  </Card>
  </div>
  </TabsContent>
      {
    /* Notifications Tab */
    }<TabsContent value="notifications">
  <Card>
  <CardHeader>
  <CardTitle>Notification Preferences</CardTitle>
  <CardDescription>Choose what notifications you want to receive</CardDescription>
  </CardHeader><CardContent className="space-y-6"><div className="space-y-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Mail className="h-5 w-5 text-muted-foreground" />
  <div><p className="font-medium">Email Notifications</p><p className="text-sm text-muted-foreground"> Receive notifications via email </p>
  </div>
  </div><Switch checked={notificationSettings.emailNotifications} onCheckedChange={() => handleNotificationChange('emailNotifications')} />
  </div><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Bell className="h-5 w-5 text-muted-foreground" />
  <div><p className="font-medium">Push Notifications</p><p className="text-sm text-muted-foreground"> Receive push notifications on your device </p>
  </div>
  </div><Switch checked={notificationSettings.pushNotifications} onCheckedChange={() => handleNotificationChange('pushNotifications')} />
  </div>
  <Separator /><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Clock className="h-5 w-5 text-muted-foreground" />
  <div><p className="font-medium">Test Reminders</p><p className="text-sm text-muted-foreground"> Get reminded about upcoming tests </p>
  </div>
  </div><Switch checked={notificationSettings.testReminders} onCheckedChange={() => handleNotificationChange('testReminders')} />
  </div><div className="flex items-center justify-between"><div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-muted-foreground" />
  <div><p className="font-medium">Result Alerts</p><p className="text-sm text-muted-foreground"> Get notified when test results are available </p>
  </div>
  </div><Switch checked={notificationSettings.resultAlerts} onCheckedChange={() => handleNotificationChange('resultAlerts')} />
  </div><div className="flex items-center justify-between"><div className="flex items-center gap-3"><BarChart3 className="h-5 w-5 text-muted-foreground" />
  <div><p className="font-medium">Weekly Progress Reports</p><p className="text-sm text-muted-foreground"> Receive weekly summary of your progress </p>
  </div>
  </div><Switch checked={notificationSettings.weeklyReports} onCheckedChange={() => handleNotificationChange('weeklyReports')} />
  </div><div className="flex items-center justify-between"><div className="flex items-center gap-3"><CreditCard className="h-5 w-5 text-muted-foreground" />
  <div><p className="font-medium">Promotional Emails</p><p className="text-sm text-muted-foreground"> Receive updates about new features and offers </p>
  </div>
  </div><Switch checked={notificationSettings.promotionalEmails} onCheckedChange={() => handleNotificationChange('promotionalEmails')} />
  </div>
  </div>
  </CardContent>
  </Card>
  </TabsContent>
      {
    /* Study Preferences Tab */
    }<TabsContent value="preferences">
  <Card>
  <CardHeader>
  <CardTitle>Study Preferences</CardTitle>
  <CardDescription>Customize your learning experience</CardDescription>
  </CardHeader><CardContent className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
  <Label>Preferred Study Time</Label>
    <Select value={studyPreferences.preferredTime} onValueChange={(value) => setStudyPreferences({ ...studyPreferences, preferredTime: value }
    )
    } >
  <SelectTrigger>
  <SelectValue />
  </SelectTrigger>
  <SelectContent><SelectItem value="morning">Morning (6 AM - 12 PM)</SelectItem><SelectItem value="afternoon">Afternoon (12 PM - 6 PM)</SelectItem><SelectItem value="evening">Evening (6 PM - 12 AM)</SelectItem><SelectItem value="night">Night (12 AM - 6 AM)</SelectItem>
  </SelectContent>
  </Select>
  </div>
  <div>
  <Label>Daily Study Goal (Questions)</Label><Input type="number" value={studyPreferences.dailyGoal} onChange={(e) => setStudyPreferences({
      ...studyPreferences,
      dailyGoal: parseInt(e.target.value)
      }
    )
    } />
  </div>
  <div>
  <Label>Study Reminder Time</Label><Input type="time" value={studyPreferences.reminderTime} onChange={(e) => setStudyPreferences({ ...studyPreferences, reminderTime: e.target.value }
    )
    } />
  </div>
  <div>
  <Label>Weekly Target (Questions)</Label><Input type="number" value={studyPreferences.weeklyTarget} onChange={(e) => setStudyPreferences({
      ...studyPreferences,
      weeklyTarget: parseInt(e.target.value)
      }
    )
    } />
  </div>
  </div>
  <div>
  <Label>Focus Subjects</Label><p className="text-sm text-muted-foreground mb-3"> Select subjects you want to focus on </p><div className="grid grid-cols-2 md:grid-cols-4 gap-2">{['Physics', 'Chemistry', 'Mathematics', 'Biology'].map((subject) => ( <Button key={subject} variant={studyPreferences.focusSubjects.includes(subject) ? 'default' : 'outline'} size="sm" onClick={() => {
        const newSubjects = studyPreferences.focusSubjects.includes(subject) ? studyPreferences.focusSubjects.filter(s => s !== subject) : [...studyPreferences.focusSubjects, subject];
        setStudyPreferences({ ...studyPreferences, focusSubjects: newSubjects }

        )
}} >
      {subject}
    </Button> ))}
    </div>
  </div>
  <Separator /><div className="space-y-4"><h4 className="font-medium">App Preferences</h4><div className="flex items-center justify-between"><div className="flex items-center gap-3">{theme === 'dark' ? ( <Moon className="h-5 w-5 text-muted-foreground" /> ) : ( <Sun className="h-5 w-5 text-muted-foreground" /> )}
    <div><p className="font-medium">Theme</p><p className="text-sm text-muted-foreground"> Choose your preferred theme </p>
  </div>
  </div>
  <Select value={theme} onValueChange={setTheme}><SelectTrigger className="w-[120px]">
  <SelectValue />
  </SelectTrigger>
  <SelectContent><SelectItem value="light">Light</SelectItem><SelectItem value="dark">Dark</SelectItem><SelectItem value="system">System</SelectItem>
  </SelectContent>
  </Select>
  </div><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Globe className="h-5 w-5 text-muted-foreground" />
  <div><p className="font-medium">Language</p><p className="text-sm text-muted-foreground"> Choose your preferred language </p>
  </div>
  </div><Select defaultValue="en"><SelectTrigger className="w-[120px]">
  <SelectValue />
  </SelectTrigger>
  <SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="hi">Hindi</SelectItem><SelectItem value="es">Spanish</SelectItem>
  </SelectContent>
  </Select>
  </div>
  </div><div className="flex justify-end">
      <Button onClick={() => {
        toast({title:"Preferences Saved",description:"Your study preferences have been updated successfully"
        }

      )
}}>Save Preferences</Button>
  </div>
  </CardContent>
  </Card>
  </TabsContent>
      {
    /* Subscription Tab */
    }<TabsContent value="subscription"><div className="space-y-6">
  <Card>
  <CardHeader><div className="flex items-center justify-between">
  <div>
  <CardTitle>Current Plan</CardTitle>
  <CardDescription>Manage your subscription</CardDescription>
  </div><Badge className="bg-blue-500 text-white">
      {subscriptionInfo.plan.charAt(0).toUpperCase() + subscriptionInfo.plan.slice(1)}
    </Badge>
  </div>
  </CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between p-4 bg-muted rounded-lg">
  <div><p className="font-medium">Plan Status</p><p className="text-sm text-muted-foreground"> Valid until {new Date(subscriptionInfo.validUntil).toLocaleDateString()}
    </p>
  </div><Badge variant="secondary" className="bg-green-500/10 text-green-500">
      {subscriptionInfo.status}
    </Badge>
  </div>
  <div><p className="font-medium mb-3">Plan Features</p><div className="space-y-2">{subscriptionInfo.features.map((feature, index) => ( <div key={index} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /><span className="text-sm">
      {feature}
    </span>
  </div> ))}
    </div>
  </div><div className="flex gap-3"><Button className="flex-1" onClick={() => {
        toast({title:"Upgrade to Premium",description:"Premium upgrade feature coming soon!"
        }

      )
}}><Crown className="mr-2 h-4 w-4" /> Upgrade to Premium </Button><Button variant="outline" onClick={() => {
        toast({title:"Manage Billing",description:"Billing management feature coming soon!"
        }

      )
}}> Manage Billing </Button>
  </div>
  </CardContent>
  </Card>
  <Card>
  <CardHeader>
  <CardTitle>Available Plans</CardTitle>
  <CardDescription>Choose a plan that suits your needs</CardDescription>
  </CardHeader>
  <CardContent><div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {
    /* Free Plan */
    }<div className="border rounded-lg p-4 space-y-3">
  <div><h4 className="font-semibold">Free</h4><p className="text-2xl font-bold">$0<span className="text-sm font-normal">/month</span>
  </p>
  </div><ul className="space-y-2 text-sm"><li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> 100 questions/day </li><li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Basic analytics </li><li className="flex items-center gap-2"><X className="h-4 w-4 text-gray-400" /> Mock tests </li>
  </ul>
  </div>
      {
    /* Basic Plan */
    }<div className="border-2 border-primary rounded-lg p-4 space-y-3 relative"><Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Current</Badge>
  <div><h4 className="font-semibold">Basic</h4><p className="text-2xl font-bold">$9.99<span className="text-sm font-normal">/month</span>
  </p>
  </div><ul className="space-y-2 text-sm"><li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Unlimited questions </li><li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Basic analytics </li><li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Monthly mock tests </li>
  </ul>
  </div>
      {
    /* Premium Plan */
    }<div className="border rounded-lg p-4 space-y-3">
  <div><h4 className="font-semibold">Premium</h4><p className="text-2xl font-bold">$19.99<span className="text-sm font-normal">/month</span>
  </p>
  </div><ul className="space-y-2 text-sm"><li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Everything in Basic </li><li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Advanced analytics </li><li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Unlimited mock tests </li><li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> 1-on-1 mentoring </li>
  </ul><Button className="w-full" onClick={() => {
        toast({title:"Upgrade Plan",description:"Plan upgrade feature coming soon!"
        }

      )
}}>Upgrade</Button>
  </div>
  </div>
  </CardContent>
  </Card>
  </div>
  </TabsContent>
  </Tabs>
  </div>
      {
    /* Change Password Dialog */
    }
    <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
  <DialogContent>
  <DialogHeader>
  <DialogTitle>Change Password</DialogTitle>
  <DialogDescription> Enter your current password and choose a new one </DialogDescription>
  </DialogHeader><div className="space-y-4">
  <div><Label htmlFor="currentPassword">Current Password</Label><Input id="currentPassword" type="password" />
  </div>
  <div><Label htmlFor="newPassword">New Password</Label><Input id="newPassword" type="password" />
  </div>
  <div><Label htmlFor="confirmPassword">Confirm New Password</Label><Input id="confirmPassword" type="password" />
  </div>
  </div>
  <DialogFooter><Button variant="outline" onClick={() => setShowPasswordDialog(false)}> Cancel </Button><Button onClick={() => handlePasswordChange('', '')}> Change Password </Button>
  </DialogFooter>
  </DialogContent>
  </Dialog>
  </div>
  )
}

export default StudentProfile;
