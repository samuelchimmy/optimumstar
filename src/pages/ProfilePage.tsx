
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

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const maxRetries = 3;
  
  useEffect(() => {
    if (!loading && !user) {
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
        // Try to get existing profile
        let userProfile = await fetchUserProfile(user.id);
        console.log('Profile data received:', userProfile);
        
        // If profile not found, create a default profile
        if (!userProfile) {
          console.log('Profile not found, creating default profile for user:', user.id);
          const defaultProfile: UserProfile = {
            id: user.id,
            username: user.email?.split('@')[0] || 'User',
            avatar_url: '',
            level: 1,
            correct_answers: 0,
            created_at: new Date().toISOString(),
          };
          
          try {
            // Try to create profile
            userProfile = await createUserProfile(defaultProfile);
            console.log('Default profile created:', userProfile);
            
            // If creation didn't return a profile but didn't throw an error,
            // try fetching again as it might have been created
            if (!userProfile) {
              console.log('Retrying profile fetch after creation attempt');
              // Small delay to allow database to update
              await new Promise(resolve => setTimeout(resolve, 800));
              userProfile = await fetchUserProfile(user.id);
              console.log('Retry fetch result:', userProfile);
            }
          } catch (createError) {
            console.error('Error creating profile:', createError);
            
            // Try updating instead - this might work if the profile exists but creation failed due to RLS
            try {
              const updateResult = await updateUserProfile(user.id, {
                username: user.email?.split('@')[0] || 'User',
                avatar_url: '',
                level: 1,
                correct_answers: 0
              });
              
              if (updateResult) {
                userProfile = updateResult;
                console.log('Profile updated instead of created:', userProfile);
              } else {
                // Try fetching one more time
                await new Promise(resolve => setTimeout(resolve, 800));
                userProfile = await fetchUserProfile(user.id);
                console.log('Final retry fetch result after update attempt:', userProfile);
              }
            } catch (updateError) {
              console.error('Error updating profile:', updateError);
            }
          }
        }
        
        if (userProfile) {
          setProfile(userProfile);
          setProfileError(false);
        } else {
          console.error('Failed to load or create profile');
          setProfileError(true);
          
          // Only show toast if we've exhausted retries
          if (retryAttempt >= maxRetries - 1) {
            toast({
              title: "Error loading profile",
              description: "Unable to load your profile. Please try again later.",
              variant: "destructive"
            });
          } else {
            // Increment retry counter
            setRetryAttempt(prev => prev + 1);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setProfileError(true);
        
        // Only show toast if we've exhausted retries
        if (retryAttempt >= maxRetries - 1) {
          toast({
            title: "Error loading profile",
            description: "An error occurred while fetching your profile data.",
            variant: "destructive"
          });
        } else {
          // Increment retry counter
          setRetryAttempt(prev => prev + 1);
        }
      } finally {
        setProfileLoading(false);
      }
    };
    
    loadProfile();
  }, [user, loading, navigate, retryAttempt]);
  
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
    setRetryAttempt(prev => prev + 1);
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
