import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useToast } from '../components/ui/use-toast';
import { User, Mail, Shield, Calendar, Edit2, Save, X } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || '', email: user?.email || '' });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {' '}
            Profile Settings{' '}
          </h1>
          <p className="text-muted-foreground mt-2">
            {' '}
            Manage your account information and preferences{' '}
          </p>
        </div>
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-2xl bg-gradient-to-r from-primary to-secondary text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user?.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {user?.email}
                  </CardDescription>
                </div>
              </div>
              <Button
                variant={isEditing ? 'ghost' : 'outline'}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                disabled={loading}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4 mr-2" /> Cancel{' '}
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4 mr-2" /> Edit Profile{' '}
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{user?.name}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
              {/* Account Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Account Role</span>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {user?.role || 'student'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Member Since</span>
                    </div>
                    <span className="text-sm text-muted-foreground"> January 2024 </span>
                  </div>
                </div>
              </div>
              {/* Action Buttons */}{' '}
              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={loading} className="flex-1">
                    <Save className="h-4 w-4 mr-2" /> Save Changes{' '}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1"
                  >
                    {' '}
                    Cancel{' '}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Additional Settings */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription> Manage your account security preferences </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" /> Change Password{' '}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" /> Email Notifications{' '}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
