
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Twitter, MessageSquare, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserProfile, createUserProfile, UserProfile } from '../lib/supabase';
import { toast } from '@/hooks/use-toast';

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
  const maxRetries = 3;

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;
      
      try {
        console.log('ProfileCard: Loading profile for user ID:', user.id);
        setProfileLoading(true);
        setError(false);
        
        // Try to fetch the user profile with automatic retries
        let userProfile = await fetchUserProfile(user.id, 1);
        console.log('ProfileCard: Profile data received:', userProfile);
        
        // If profile still not found, attempt to create a default profile
        if (!userProfile && retryCount < maxRetries) {
          console.log('ProfileCard: No profile found, creating default profile for user:', user.id);
          const defaultProfile: UserProfile = {
            id: user.id,
            username: user.email?.split('@')[0] || 'User',
            avatar_url: '',
            level: 1,
            correct_answers: 0,
            created_at: new Date().toISOString(),
          };
          
          try {
            userProfile = await createUserProfile(defaultProfile);
            console.log('ProfileCard: Default profile created:', userProfile);
            
            // If creation didn't return a profile, try fetching it again after a short delay
            if (!userProfile) {
              console.log('ProfileCard: Trying to fetch profile after creation attempt');
              await new Promise(resolve => setTimeout(resolve, 500));
              userProfile = await fetchUserProfile(user.id);
            }
          } catch (createError) {
            console.error('ProfileCard: Error creating profile:', createError);
            // Try fetching one more time after a short delay
            await new Promise(resolve => setTimeout(resolve, 500));
            userProfile = await fetchUserProfile(user.id);
          }
        }
        
        if (userProfile) {
          setProfile(userProfile);
          setError(false);
          console.log('ProfileCard: Successfully loaded profile:', userProfile);
        } else {
          console.error('ProfileCard: Failed to load or create profile after attempts');
          setError(true);
          
          if (retryCount >= maxRetries - 1) {
            toast({
              title: "Profile Error",
              description: "Could not load your profile after multiple attempts. Please try logging out and back in.",
              variant: "destructive"
            });
          } else {
            // Increment retry count and try again
            setRetryCount(retryCount + 1);
          }
        }
      } catch (err) {
        console.error('ProfileCard: Error fetching user profile:', err);
        setError(true);
        
        if (retryCount < maxRetries - 1) {
          // Increment retry count and try again
          setRetryCount(retryCount + 1);
        }
      } finally {
        setProfileLoading(false);
      }
    };
    
    if (!loading && user) {
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
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your profile...</p>
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
            <p className="mb-4">Unable to load profile. Please try again or contact support if the issue persists.</p>
            <Button 
              variant="default" 
              onClick={() => {
                setProfileLoading(true);
                setRetryCount(0);
                setError(false);
              }}
              className="mr-2"
            >
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setTimeout(() => window.location.reload(), 100);
              }}
            >
              Refresh Page
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
