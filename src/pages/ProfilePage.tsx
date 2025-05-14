
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      // Not logged in, redirect to login
      navigate('/login');
    }
  }, [user, loading, navigate]);
  
  return (
    <Layout>
      <div className="min-h-[60vh] py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Profile</h1>
        <ProfileCard />
      </div>
    </Layout>
  );
}
