
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Twitter, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserProfile, createUserProfile, UserProfile } from '../lib/supabase';

interface ProfileCardProps {
  onEdit?: () => void;
  editable?: boolean;
  loading?: boolean;
}

export default function ProfileCard({ onEdit, editable = false, loading = false }: ProfileCardProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(loading);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;
      
      try {
        console.log('ProfileCard: Loading profile for user ID:', user.id);
        let userProfile = await fetchUserProfile(user.id);
        console.log('ProfileCard: Profile data received:', userProfile);
        
        // If profile not found, attempt to create a default profile
        if (!userProfile && retryCount < 1) {
          console.log('ProfileCard: No profile found, creating default profile for user:', user.id);
          const defaultProfile: UserProfile = {
            id: user.id,
            username: user.email?.split('@')[0] || 'User',
            avatar_url: '',
            level: 1,
            correct_answers: 0,
            created_at: new Date().toISOString(),
          };
          
          userProfile = await createUserProfile(defaultProfile);
          console.log('ProfileCard: Default profile created:', userProfile);
          setRetryCount(retryCount + 1);
        }
        
        if (userProfile) {
          setProfile(userProfile);
          setError(false);
        } else {
          console.error('ProfileCard: Failed to load or create profile');
          setError(true);
        }
      } catch (err) {
        console.error('ProfileCard: Error fetching user profile:', err);
        setError(true);
      } finally {
        setProfileLoading(false);
      }
    };
    
    if (!loading) {
      loadUserProfile();
    }
  }, [user, loading, retryCount]);

  if (loading || profileLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="pb-2">
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 items-center">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-24 w-24 rounded-full" />
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-40 rounded" />
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-full max-w-xs rounded" />
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-full max-w-xs rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !profile) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="pb-2">
          <CardTitle>Profile Error</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            <p className="mb-4">Unable to load profile. Please try again later or contact support if the issue persists.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setProfileLoading(true);
                setRetryCount(0);
                setTimeout(() => window.location.reload(), 500);
              }}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const levelProgress = ((profile.level || 1) - 1) / 5 * 100;

  return (
    <Card className="w-full max-w-md mx-auto border border-secondary/30 shadow-lg">
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <CardTitle>Your Profile</CardTitle>
        {editable && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            Edit Profile
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage 
              src={profile.avatar_url || ''} 
              alt={profile.username || ''}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                console.log('Avatar image failed to load, falling back to user initials');
              }} 
            />
            <AvatarFallback className="text-2xl">
              {profile.username && typeof profile.username === 'string' 
                ? profile.username.slice(0, 2).toUpperCase() 
                : '??'}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-2xl font-bold">{profile.username || 'Anonymous User'}</h2>
          
          {/* Social Links */}
          <div className="flex gap-4">
            {profile.twitter_username && (
              <a 
                href={profile.twitter_username}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 transition-colors"
              >
                <Twitter size={20} />
                <span className="text-sm font-medium">
                  @{profile.twitter_username.replace('https://x.com/', '')}
                </span>
              </a>
            )}
            
            {profile.discord_username && (
              <div className="flex items-center space-x-1 text-indigo-500">
                <MessageSquare size={20} />
                <span className="text-sm font-medium">
                  {profile.discord_username}
                </span>
              </div>
            )}
          </div>
          
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level Progress</span>
              <span>{profile.level > 5 ? "Complete!" : `${profile.level || 0}/5`}</span>
            </div>
            <Progress value={levelProgress} className="h-2" />
          </div>
          
          <div className="flex justify-around w-full">
            <div className="text-center">
              <p className="text-sm text-gray-500">Current Level</p>
              <p className="text-2xl font-bold text-primary">{profile.level > 5 ? "Max" : (profile.level || 0)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Correct Answers</p>
              <p className="text-2xl font-bold text-primary">{profile.correct_answers || 0}</p>
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
