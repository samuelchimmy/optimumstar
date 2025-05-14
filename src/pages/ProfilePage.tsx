
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProfileCard from '../components/ProfileCard';
import EditProfileForm from '../components/EditProfileForm';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile, fetchUserProfile } from '../lib/supabase';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);
  
  useEffect(() => {
    if (!loading && !user) {
      // Not logged in, redirect to login
      navigate('/login');
    } else if (user) {
      // Load user profile
      const loadProfile = async () => {
        try {
          console.log('Fetching profile for user ID:', user.id);
          const userProfile = await fetchUserProfile(user.id);
          console.log('Profile data received:', userProfile);
          
          if (userProfile) {
            setProfile(userProfile);
            setProfileError(false);
          } else {
            console.error('Profile not found');
            setProfileError(true);
            toast({
              title: "Error loading profile",
              description: "Unable to load your profile. Please try again later.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Error loading profile:', error);
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
    }
  }, [user, loading, navigate]);
  
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
  
  return (
    <Layout>
      <div className="min-h-[60vh] py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Profile</h1>
        
        {profileLoading ? (
          <ProfileCard loading={true} />
        ) : profileError ? (
          <div className="max-w-md mx-auto text-center p-4 border border-red-300 rounded-md bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200">
            <h3 className="font-semibold">Profile Error</h3>
            <p>Unable to load your profile data. Please try refreshing the page or logging in again.</p>
          </div>
        ) : (
          isEditing ? (
            <EditProfileForm 
              profile={profile!} 
              onUpdate={handleProfileUpdate} 
              onCancel={handleCancelEdit}
            />
          ) : (
            <ProfileCard onEdit={handleEdit} editable={true} />
          )
        )}
      </div>
      <Toaster />
    </Layout>
  );
}
