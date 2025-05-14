
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import LeaderboardTable from '../components/LeaderboardTable';

export default function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const handleStartQuiz = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/quiz');
    }
  };
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h1 className="text-5xl font-bold mb-6 animate-fade-in">
          <span className="text-primary">Yo SuccinctStar</span>, <br />
          <span className="text-dark">Think You Know Succinct?</span>
        </h1>
        
        <p className="text-xl mb-8 max-w-2xl animate-fade-in">
          Test your knowledge of the Succinct protocol with our fun quiz! Advance through 5 increasingly challenging levels and compete with others on the leaderboard.
        </p>
        
        <Button 
          onClick={handleStartQuiz}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-light text-lg px-8 py-6 animate-fade-in"
        >
          {!loading && user ? "Start Quiz" : "Sign In to Start"}
        </Button>
        
        <div className="mt-16 w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center justify-center">
            <span className="text-primary mr-2">🏆</span>
            <span>Top Players</span>
          </h2>
          
          <LeaderboardTable currentUserId={user?.id || null} />
        </div>
      </div>
    </Layout>
  );
}
