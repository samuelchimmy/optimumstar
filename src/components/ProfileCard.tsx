
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserProfile, UserProfile } from '../lib/supabase';

export default function ProfileCard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;
      
      const userProfile = await fetchUserProfile(user.id);
      setProfile(userProfile);
      setLoading(false);
    };
    
    loadUserProfile();
  }, [user]);

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="pb-2">
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 items-center">
            <div className="animate-pulse bg-gray-200 h-24 w-24 rounded-full" />
            <div className="animate-pulse bg-gray-200 h-6 w-40 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="pb-2">
          <CardTitle>Profile Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">
            Unable to load profile. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const levelProgress = ((profile.level - 1) / 5) * 100;

  return (
    <Card className="w-full max-w-md mx-auto border border-secondary/30 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={profile.avatar_url} alt={profile.username} />
            <AvatarFallback className="text-2xl">
              {profile.username && typeof profile.username === 'string' 
                ? profile.username.slice(0, 2) 
                : '??'}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-2xl font-bold">{profile.username}</h2>
          
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level Progress</span>
              <span>{profile.level > 5 ? "Complete!" : `${profile.level}/5`}</span>
            </div>
            <Progress value={levelProgress} className="h-2" />
          </div>
          
          <div className="flex justify-around w-full">
            <div className="text-center">
              <p className="text-sm text-gray-500">Current Level</p>
              <p className="text-2xl font-bold text-primary">{profile.level > 5 ? "Max" : profile.level}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Correct Answers</p>
              <p className="text-2xl font-bold text-primary">{profile.correct_answers}</p>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500 pt-2">
            <p>Joined {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
