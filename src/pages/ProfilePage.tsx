
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProfileCard from '../components/ProfileCard';
import EditProfileForm from '../components/EditProfileForm';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile, fetchUserProfile, createUserProfile, updateUserProfile } from '../lib/supabase';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      // Not logged in, redirect to login
      navigate('/login');
      return;
    } 
    
    if (!user) return; // Exit if no user (still loading)
    
    // Load user profile
    const loadProfile = async () => {
      try {
        setProfileLoading(true);
        setProfileError(false);
        
        console.log('Fetching profile for user ID:', user.id);
        
        // Check if profile exists
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') {
          // Error other than "no rows returned"
          console.error('Error fetching profile:', fetchError);
          throw fetchError;
        }
        
        if (existingProfile) {
          console.log('Profile found:', existingProfile);
          setProfile(existingProfile);
          return;
        }
        
        console.log('No profile found, creating default profile');
        
        // Create default profile if not found
        const defaultProfile: UserProfile = {
          id: user.id,
          username: user.email?.split('@')[0] || 'User',
          avatar_url: '',
          level: 1,
          correct_answers: 0,
          created_at: new Date().toISOString(),
        };
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([defaultProfile])
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating profile:', createError);
          toast({
            title: "Error creating profile",
            description: "We couldn't create your profile. Please try again later.",
            variant: "destructive"
          });
          throw createError;
        }
        
        console.log('Profile created successfully:', newProfile);
        setProfile(newProfile);
        
      } catch (error) {
        console.error('Profile loading error:', error);
        setProfileError(true);
        toast({
          title: "Error loading profile",
          description: "An error occurred while fetching your profile data.",
          variant: "destructive"
        });
      } finally {
        setProfileLoading(false);
      }
    };
    
    loadProfile();
  }, [user, authLoading, navigate]);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully."
    });
  };
  
  const handleRetry = () => {
    setProfileLoading(true);
    setProfileError(false);
  };
  
  return (
    <Layout>
      <div className="min-h-[60vh] py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Profile</h1>
        
        {profileLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        ) : profileError ? (
          <div className="max-w-md mx-auto text-center p-6 border border-red-300 rounded-md bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200">
            <h3 className="font-semibold text-lg mb-2">Profile Error</h3>
            <p className="mb-4">Unable to load your profile data. This could be due to a temporary connection issue.</p>
            <button 
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
              onClick={handleRetry}
            >
              Retry Loading Profile
            </button>
          </div>
        ) : (
          isEditing ? (
            <EditProfileForm 
              profile={profile!} 
              onUpdate={handleProfileUpdate} 
              onCancel={handleCancelEdit}
            />
          ) : (
            profile && <ProfileCard onEdit={handleEdit} editable={true} />
          )
        )}
      </div>
      <Toaster />
    </Layout>
  );
}
