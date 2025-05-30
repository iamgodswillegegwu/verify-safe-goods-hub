
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Profile } from '@/types/profile';

interface UserAvatarProps {
  profile: Profile | null;
  onImageUpdate?: (imageUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
  showUploadButton?: boolean;
}

const UserAvatar = ({ 
  profile, 
  onImageUpdate, 
  size = 'md', 
  showUploadButton = false 
}: UserAvatarProps) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8';
      case 'lg': return 'h-24 w-24';
      default: return 'h-12 w-12';
    }
  };

  const getInitials = () => {
    const firstName = profile?.first_name || '';
    const lastName = profile?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      // Simulate upload - in real implementation, upload to Supabase Storage
      const imageUrl = URL.createObjectURL(file);
      onImageUpdate?.(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (showUploadButton && size === 'lg') {
    return (
      <Card className="w-fit">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm">Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className={getSizeClasses()}>
              <AvatarImage 
                src={profile?.profile_picture_url || ''} 
                alt={`${profile?.first_name || 'User'}'s avatar`} 
              />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col items-center space-y-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isUploading}
                onClick={() => document.getElementById('avatar-upload')?.click()}
                className="text-xs"
              >
                <Camera className="h-3 w-3 mr-1" />
                {isUploading ? 'Uploading...' : 'Change Photo'}
              </Button>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Avatar className={getSizeClasses()}>
      <AvatarImage 
        src={profile?.profile_picture_url || ''} 
        alt={`${profile?.first_name || 'User'}'s avatar`} 
      />
      <AvatarFallback>{getInitials()}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
