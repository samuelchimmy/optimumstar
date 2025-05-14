
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Twitter, MessageSquare } from 'lucide-react';
import { fetchUserProfile, UserProfile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      // Redirect to login if not logged in
      navigate('/login');
      return;
    }
    
    const loadUserProfile = async () => {
      if (!userId) return;
      
      const userProfile = await fetchUserProfile(userId);
      setProfile(userProfile);
      setLoading(false);
    };
    
    loadUserProfile();
  }, [userId, navigate, user]);

  if (loading) {
    return (
      <Layout>
        <div className="py-8">
          <div className="max-w-md mx-auto">
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
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="py-8">
          <div className="max-w-md mx-auto">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="pb-2">
                <CardTitle>Profile Not Found</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500">
                  The requested profile could not be found.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  const levelProgress = ((profile.level || 1) - 1) / 5 * 100;

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">User Profile</h1>
        
        <Card className="w-full max-w-md mx-auto border border-secondary/30 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle>{profile.username}'s Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={profile.avatar_url || ''} alt={profile.username || ''} />
                <AvatarFallback className="text-2xl">
                  {profile.username && typeof profile.username === 'string' 
                    ? profile.username.slice(0, 2) 
                    : '??'}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-2xl font-bold">{profile.username}</h2>
              
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
                  <span>{(profile.level || 0) > 5 ? "Complete!" : `${profile.level || 0}/5`}</span>
                </div>
                <Progress value={levelProgress} className="h-2" />
              </div>
              
              <div className="flex justify-around w-full">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Current Level</p>
                  <p className="text-2xl font-bold text-primary">{(profile.level || 0) > 5 ? "Max" : profile.level}</p>
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
      </div>
    </Layout>
  );
}
