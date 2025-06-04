import React, { useState } from 'react';
import { motion } from 'framer-motion';

  import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  Edit2,
  Save,
  Camera,
  Shield,
  Clock,
  GraduationCap,
  Users,
  Target,
  Star,
  TrendingUp} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from '../../components/ui/use-toast';

  const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+91 98765 43210',
    designation: 'Senior Faculty - Physics',
    experience: '8 years',
    qualification: 'Ph.D. in Physics, IIT Delhi',
    specialization: 'Quantum Mechanics, Thermodynamics',
    location: 'New Delhi, India',
    joinDate: '15 Jan 2016',
    bio: 'Passionate educator with expertise in making complex physics concepts accessible to students. Committed to fostering critical thinking and problem-solving skills.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  });
    const achievements = [ {
    id: 1,title: 'Excellence in Teaching',year: '2023',
    icon: Award
      }, {
    id: 2,title: '100% Result Achievement',year: '2022',
    icon: Target
      }, {
    id: 3,title: 'Best Faculty Award',year: '2021',
    icon: Star
      }, {
    id: 4,title: 'Research Publication',year: '2020',
    icon: BookOpen
    } ];
    const stats = [ {label: 'Total Students',value: '320',
    icon: Users,color: 'text-blue-500'
      }, {label: 'Batches',value: '6',
    icon: GraduationCap,color: 'text-purple-500'
      }, {label: 'Success Rate',value: '94%',
    icon: TrendingUp,color: 'text-green-500'
      }, {label: 'Teaching Hours',value: '2,450',
    icon: Clock,color: 'text-orange-500'
    } ];
    const currentBatches = [ {name: 'JEE Advanced 2024',
    students: 45,
    progress: 75
      }, {name: 'JEE Mains 2024',
    students: 60,
    progress: 82
      }, {name: 'NEET Physics 2024',
    students: 35,
    progress: 68
    } ];
    const handleSave = () => {
    setIsEditing(false

    );
      toast({
      title:"Profile Updated",description:"Your profile has been updated successfully.",

      }

    )
}

    const handleImageUpload = () => {
      toast({title:"Upload Photo",description:"Photo upload functionality would be implemented here.",

      }

    )
}

  return (<div className="container py-6 space-y-6">
      {
    /* Header */
    }<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <div><h1 className="text-3xl font-bold tracking-tight">My Profile</h1><p className="text-muted-foreground">Manage your personal information and preferences</p>
  </div><div className="flex gap-3">
      {isEditing ? ( <><Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
    <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" /> Save Changes </Button>
    </> ) : ( <Button onClick={() => setIsEditing(true)}><Edit2 className="h-4 w-4 mr-2" /> Edit Profile </Button> )}
    </div>
  </div><div className="grid gap-6 md:grid-cols-3">
      {
    /* Profile Card */
    }<Card className="md:col-span-1"><CardContent className="pt-6"><div className="flex flex-col items-center space-y-4"><div className="relative"><Avatar className="h-32 w-32">
  <AvatarImage src={profile.avatar} />
  <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}
    </AvatarFallback>
  </Avatar>{isEditing && ( <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full" onClick={handleImageUpload} ><Camera className="h-4 w-4" />
  </Button> )}
    </div><div className="text-center"><h2 className="text-2xl font-bold">
      {profile.name}
    </h2><p className="text-muted-foreground">
      {profile.designation}
    </p>
  </div><div className="w-full space-y-2"><div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" />
  <span>
      {profile.email}
    </span>
  </div><div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" />
  <span>
      {profile.phone}
    </span>
  </div><div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" />
  <span>
      {profile.location}
    </span>
  </div><div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" />
  <span>Joined {profile.joinDate}
    </span>
  </div>
  </div>
  </div>
  </CardContent>
  </Card>
      {
    /* Details Tabs */
    }<Card className="md:col-span-2"><CardContent className="pt-6"><Tabs defaultValue="personal" className="space-y-4"><TabsList className="grid w-full grid-cols-3"><TabsTrigger value="personal">Personal Info</TabsTrigger><TabsTrigger value="professional">Professional</TabsTrigger><TabsTrigger value="achievements">Achievements</TabsTrigger>
  </TabsList><TabsContent value="personal" className="space-y-4"><div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value }
    )
    } disabled={!isEditing} />
  </div><div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value }
    )
    } disabled={!isEditing} />
  </div><div className="space-y-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value }
    )
    } disabled={!isEditing} />
  </div><div className="space-y-2"><Label htmlFor="location">Location</Label><Input id="location" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value }
    )
    } disabled={!isEditing} />
  </div>
  </div><div className="space-y-2"><Label htmlFor="bio">Bio</Label><Textarea id="bio" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value }
    )
    } disabled={!isEditing} rows={4} />
  </div>
  </TabsContent><TabsContent value="professional" className="space-y-4"><div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label htmlFor="designation">Designation</Label><Input id="designation" value={profile.designation} onChange={(e) => setProfile({ ...profile, designation: e.target.value }
    )
    } disabled={!isEditing} />
  </div><div className="space-y-2"><Label htmlFor="experience">Experience</Label><Input id="experience" value={profile.experience} onChange={(e) => setProfile({ ...profile, experience: e.target.value }
    )
    } disabled={!isEditing} />
  </div>
  </div><div className="space-y-2"><Label htmlFor="qualification">Qualification</Label><Input id="qualification" value={profile.qualification} onChange={(e) => setProfile({ ...profile, qualification: e.target.value }
    )
    } disabled={!isEditing} />
  </div><div className="space-y-2"><Label htmlFor="specialization">Specialization</Label><Input id="specialization" value={profile.specialization} onChange={(e) => setProfile({ ...profile, specialization: e.target.value }
    )
    } disabled={!isEditing} />
  </div><div className="space-y-2">
  <Label>Current Batches</Label><div className="space-y-3">{currentBatches.map((batch, index) => ( <div key={index} className="p-3 rounded-lg bg-muted/50"><div className="flex items-center justify-between mb-2"><span className="font-medium">
      {batch.name}
    </span><Badge variant="secondary">
      {batch.students} students</Badge>
    </div><Progress value={batch.progress} className="h-2" /><p className="text-xs text-muted-foreground mt-1">
      {batch.progress}% syllabus completed </p>
  </div> ))}
    </div>
  </div>
  </TabsContent><TabsContent value="achievements" className="space-y-4"><div className="grid gap-4 md:grid-cols-2">{achievements.map((achievement) => ( <motion.div key={achievement.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50" ><div className="p-3 rounded-full bg-primary/10"><achievement.icon className="h-6 w-6 text-primary" />
    </div>
    <div><p className="font-medium">
      {achievement.title}
    </p><p className="text-sm text-muted-foreground">
      {achievement.year}
    </p>
    </div>
  </motion.div> ))}
    </div>
  </TabsContent>
  </Tabs>
  </CardContent>
  </Card>
  </div>
      {
    /* Stats */
    }<div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat, index) => ( <Card key={index}><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">
      {stat.label}
    </CardTitle>
    <stat.icon className={`h-4 w-4 ${stat.color}`} />
    </CardHeader>
    <CardContent><div className="text-2xl font-bold">
      {stat.value}
    </div>
    </CardContent>
  </Card> ))}
    </div>
      {
    /* Security Settings */
    }
    <Card>
  <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Security Settings </CardTitle>
  </CardHeader>
  <CardContent><div className="space-y-4"><div className="flex items-center justify-between">
  <div><p className="font-medium">Two-Factor Authentication</p><p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
  </div><Button variant="outline">Enable</Button>
  </div><div className="flex items-center justify-between">
  <div><p className="font-medium">Change Password</p><p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
  </div><Button variant="outline">Update</Button>
  </div>
  </div>
  </CardContent>
  </Card>
  </div>
  )
}

export default ProfilePage;
