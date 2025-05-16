import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Twitter, MessageSquare, Loader2, Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCombinedAuth } from '../contexts/CivicAuthContext';
import { UserProfile } from '../lib/supabase';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfileCardProps {
  onEdit?: () => void;
  editable?: boolean;
  loading?: boolean;
}

export default function ProfileCard({ onEdit, editable = false, loading = false }: ProfileCardProps) {
  const { user } = useAuth();
  const { 
    hasWallet, 
    walletAddress, 
    walletBalance, 
    walletBalanceSymbol, 
    isWalletConnected,
    createWallet,
    connectWallet,
    isWalletCreating
  } = useCombinedAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(loading);
  const [error, setError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;
      
      try {
        console.log('ProfileCard: Loading profile for user ID:', user.id);
        setProfileLoading(true);
        setError(false);
        
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (fetchError) {
          if (fetchError.code === 'PGRST116') { // No rows returned
            // Create default profile
            console.log('ProfileCard: No profile found, creating default');
            const defaultProfile: UserProfile = {
              id: user.id,
              username: user.email?.split('@')[0] || 'User',
              avatar_url: '',
              current_level: 1,
              score: 0,
              created_at: new Date().toISOString(),
            };
            
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([defaultProfile])
              .select()
              .single();
            
            if (createError) {
              console.error('ProfileCard: Error creating profile:', createError);
              throw createError;
            }
            
            setProfile(newProfile);
            console.log('ProfileCard: Default profile created:', newProfile);
          } else {
            console.error('ProfileCard: Error fetching profile:', fetchError);
            throw fetchError;
          }
        } else {
          setProfile(data);
          console.log('ProfileCard: Profile loaded successfully:', data);
        }
      } catch (err) {
        console.error('ProfileCard: Error in profile process:', err);
        setError(true);
      } finally {
        setProfileLoading(false);
      }
    };
    
    if (!loading && user) {
      loadUserProfile();
    }
  }, [user, loading, refreshKey]);

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
                setError(false);
                setRefreshKey(prev => prev + 1);
              }}
              className="mr-2"
            >
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setRefreshKey(prev => prev + 1);
              }}
            >
              Refresh Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const levelProgress = ((profile.current_level || 1) - 1) / 5 * 100;

  // Truncate wallet address for display
  const truncatedAddress = walletAddress 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null;

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
          
          {/* Web3 Wallet Section */}
          <div className="w-full bg-muted/30 rounded-lg p-4 space-y-2">
            <h3 className="text-md font-semibold flex items-center">
              <Wallet className="mr-2 h-4 w-4" />
              Web3 Wallet
            </h3>
            
            {!hasWallet ? (
              <div className="flex flex-col items-center space-y-2">
                <p className="text-sm text-muted-foreground">No Web3 wallet connected</p>
                <Button 
                  size="sm"
                  onClick={() => createWallet()}
                  disabled={isWalletCreating}
                >
                  {isWalletCreating ? "Creating..." : "Create Wallet"}
                </Button>
              </div>
            ) : !isWalletConnected ? (
              <div className="flex flex-col items-center space-y-2">
                <p className="text-sm text-muted-foreground">Wallet not connected</p>
                <Button 
                  size="sm"
                  onClick={() => connectWallet()}
                >
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Address</span>
                  <span className="text-sm font-mono">{truncatedAddress}</span>
                </div>
                {walletBalance && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Balance</span>
                    <span className="text-sm font-medium">
                      {walletBalance} {walletBalanceSymbol}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
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
              <span>{profile.current_level > 5 ? "Complete!" : `${profile.current_level || 0}/5`}</span>
            </div>
            <Progress value={levelProgress} className="h-2" />
          </div>
          
          <div className="flex justify-around w-full">
            <div className="text-center">
              <p className="text-sm text-gray-500">Current Level</p>
              <p className="text-2xl font-bold text-primary">{profile.current_level > 5 ? "Max" : (profile.current_level || 0)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Correct Answers</p>
              <p className="text-2xl font-bold text-primary">{profile.score || 0}</p>
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
