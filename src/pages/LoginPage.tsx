
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && user) {
      // User is already logged in, redirect to home
      navigate('/');
    }
  }, [user, loading, navigate]);
  
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <LoginForm />
      </div>
    </Layout>
  );
}
