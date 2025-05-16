
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import LeaderboardTable from '../components/LeaderboardTable';
import { toast } from '@/hooks/use-toast';
import { fetchUserProgress } from '../services/quizProgressService';

export default function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  
  // Check if the user has completed all quiz levels when the component mounts
  useEffect(() => {
    const checkUserProgress = async () => {
      if (!user) return;
      
      try {
        setUserLoading(true);
        const { data, error } = await fetchUserProgress(user.id);
        
        if (error) {
          console.error('Error checking quiz completion status:', error);
          return;
        }
        
        if (data && data.quizCompleted) {
          setQuizCompleted(true);
        }
        
        console.log('User quiz completion status:', data.quizCompleted);
      } catch (error) {
        console.error('Error checking quiz completion status:', error);
      } finally {
        setUserLoading(false);
      }
    };
    
    if (user) {
      checkUserProgress();
    }
  }, [user]);
  
  const handleStartQuiz = () => {
    if (!user) {
      navigate('/login');
    } else if (quizCompleted) {
      toast({
        title: "Quiz Already Completed",
        description: "You've already completed all levels of the quiz. Please wait for the next round!",
        variant: "default",
        duration: 5000,
      });
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
          {loading || userLoading ? (
            "Loading..."
          ) : !user ? (
            "Sign In to Start"
          ) : quizCompleted ? (
            "Quiz Completed - Wait for Next Round"
          ) : (
            "Start Quiz"
          )}
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
