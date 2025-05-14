
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProfileCard from '../components/ProfileCard';
import EditProfileForm from '../components/EditProfileForm';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile, fetchUserProfile } from '../lib/supabase';
import { Toaster } from '@/components/ui/toaster';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  useEffect(() => {
    if (!loading && !user) {
      // Not logged in, redirect to login
      navigate('/login');
    } else if (user) {
      // Load user profile
      fetchUserProfile(user.id).then(userProfile => {
        setProfile(userProfile);
        setProfileLoading(false);
      });
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
  };
  
  return (
    <Layout>
      <div className="min-h-[60vh] py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Profile</h1>
        {!profileLoading && profile ? (
          isEditing ? (
            <EditProfileForm 
              profile={profile} 
              onUpdate={handleProfileUpdate} 
              onCancel={handleCancelEdit}
            />
          ) : (
            <ProfileCard onEdit={handleEdit} editable={true} />
          )
        ) : (
          <ProfileCard />
        )}
      </div>
      <Toaster />
    </Layout>
  );
}
