
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile, UserProfile } from '../lib/supabase';
import { toast } from '@/hooks/use-toast';

interface ProfileFormData {
  username: string;
  avatar_url: string;
  discord_username: string;
  twitter_username: string;
}

interface EditProfileFormProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: UserProfile) => void;
  onCancel: () => void;
}

export default function EditProfileForm({ profile, onUpdate, onCancel }: EditProfileFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      username: profile.username || '',
      avatar_url: profile.avatar_url || '',
      discord_username: profile.discord_username || '',
      twitter_username: profile.twitter_username ? profile.twitter_username.replace('https://x.com/', '') : '',
    }
  });
  
  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    // Format Twitter username with prefix if provided and not already prefixed
    let twitterUsername = data.twitter_username;
    if (twitterUsername && !twitterUsername.startsWith('https://x.com/')) {
      twitterUsername = `https://x.com/${twitterUsername.replace('@', '')}`;
    }
    
    const updatedProfile = await updateUserProfile(user.id, {
      username: data.username,
      avatar_url: data.avatar_url,
      discord_username: data.discord_username,
      twitter_username: twitterUsername,
    });
    
    setIsSubmitting(false);
    
    if (updatedProfile) {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated!",
        variant: "default",
      });
      onUpdate(updatedProfile);
    } else {
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Edit Your Profile</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Display Name</Label>
            <Input 
              id="username" 
              {...register('username', { required: 'Name is required' })}
              aria-invalid={errors.username ? 'true' : 'false'} 
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="avatar_url">Profile Photo URL</Label>
            <Input 
              id="avatar_url" 
              {...register('avatar_url')}
              placeholder="https://example.com/avatar.jpg" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="discord_username">Discord Username</Label>
            <Input 
              id="discord_username" 
              {...register('discord_username')}
              placeholder="YourName#1234" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="twitter_username">Twitter Username</Label>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">@</span>
              <Input 
                id="twitter_username" 
                {...register('twitter_username')}
                placeholder="username" 
              />
            </div>
            <p className="text-xs text-muted-foreground">Enter without @ or full URL - we'll format it for you</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
