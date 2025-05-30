
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  X,
  Shield,
  Bell,
  Palette,
  Globe
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import UserAvatar from './UserAvatar';
import { Profile } from '@/types/profile';

const UserProfileContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    bio: '',
    location: '',
    date_of_birth: ''
  });

  // Settings state
  const [settings, setSettings] = useState({
    email_notifications: true,
    push_notifications: true,
    theme_preference: 'light',
    language_preference: 'en'
  });

  useEffect(() => {
    if (user) {
      // Mock profile data - in real implementation, fetch from Supabase
      const mockProfile: Profile = {
        id: user.id,
        email: user.email || '',
        first_name: user.user_metadata?.first_name || 'John',
        last_name: user.user_metadata?.last_name || 'Doe',
        bio: 'Product verification enthusiast',
        location: 'New York, USA',
        date_of_birth: '1990-01-01',
        profile_picture_url: '',
        role: 'consumer'
      };
      
      setProfile(mockProfile);
      setFormData({
        first_name: mockProfile.first_name || '',
        last_name: mockProfile.last_name || '',
        phone: mockProfile.phone || '',
        bio: mockProfile.bio || '',
        location: mockProfile.location || '',
        date_of_birth: mockProfile.date_of_birth || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Simulate API call - in real implementation, update in Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedProfile = {
        ...profile!,
        ...formData
      };
      
      setProfile(updatedProfile);
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        location: profile.location || '',
        date_of_birth: profile.date_of_birth || ''
      });
    }
    setIsEditing(false);
  };

  const handleImageUpdate = (imageUrl: string) => {
    if (profile) {
      setProfile({
        ...profile,
        profile_picture_url: imageUrl
      });
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <UserAvatar 
                profile={profile}
                onImageUpdate={handleImageUpdate}
                size="lg"
                showUploadButton={true}
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">
                    {profile.first_name} {profile.last_name}
                  </h3>
                  <p className="text-slate-600 flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    {profile.role}
                  </Badge>
                </div>
                
                {!isEditing && (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={3}
                    />
                  </div>
                  
                  <div className="md:col-span-2 flex gap-2">
                    <Button 
                      onClick={handleSave}
                      disabled={isLoading}
                      size="sm"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button 
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {profile.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.date_of_birth && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span>{new Date(profile.date_of_birth).toLocaleDateString()}</span>
                    </div>
                  )}
                  {profile.bio && (
                    <div className="md:col-span-2">
                      <p className="text-slate-600">{profile.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Settings */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-slate-600">Receive email updates about your verifications</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.email_notifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, email_notifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-slate-600">Receive push notifications for important updates</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.push_notifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, push_notifications: checked })}
                />
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="theme">Theme Preference</Label>
                <select
                  id="theme"
                  value={settings.theme_preference}
                  onChange={(e) => setSettings({ ...settings, theme_preference: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Language & Region
            </h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  value={settings.language_preference}
                  onChange={(e) => setSettings({ ...settings, language_preference: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileContent;
