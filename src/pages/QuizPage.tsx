import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '../components/Layout';
import QuizLevel from '../components/QuizLevel';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../lib/supabase';

export default function QuizPage() {
  const { user, loading } = useAuth();
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      // Not logged in, redirect to login
      navigate('/login');
    }
  }, [user, loading, navigate]);
  
  useEffect(() => {
    const loadUserLevel = async () => {
      if (!user) return;
      
      const profile = await getUserProfile(user.id);
      if (profile) {
        setCurrentLevel(profile.level > 5 ? 5 : profile.level);
      } else {
        // Default to level 1 if profile not found
        setCurrentLevel(1);
      }
      setLoadingProfile(false);
    };
    
    if (user) {
      loadUserLevel();
    }
  }, [user]);
  
  const handleStartQuiz = () => {
    setIsStarted(true);
  };
  
  const handleLevelComplete = (nextLevel: number) => {
    setCurrentLevel(nextLevel);
    setIsStarted(true);
  };
  
  if (loading || loadingProfile) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse text-primary text-xl">Loading quiz...</div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="min-h-[60vh] py-8">
        {!isStarted ? (
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">
              Ready to Test Your Succinct Knowledge?
            </h1>
            
            {currentLevel && currentLevel > 1 && (
              <p className="text-lg mb-6">
                You're currently on <span className="text-primary font-semibold">Level {currentLevel}</span>. 
                Continue your progress!
              </p>
            )}
            
            <p className="text-lg mb-8">
              Answer all 10 questions correctly to advance to the next level. 
              There are 5 levels in total with increasing difficulty.
            </p>
            
            <Button 
              onClick={handleStartQuiz}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-light text-lg px-8 py-6"
            >
              Start Quiz
            </Button>
          </div>
        ) : (
          currentLevel && (
            <QuizLevel 
              level={currentLevel} 
              onComplete={handleLevelComplete} 
            />
          )
        )}
      </div>
    </Layout>
  );
}
