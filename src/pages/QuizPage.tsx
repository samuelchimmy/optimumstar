
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import QuizLevel from '../components/QuizLevel';
import QuizMenu from '../components/QuizMenu';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { 
  fetchUserProgress, 
  updateUserProgress,
  calculateLevelScore
} from '../services/quizProgressService';

const QuizPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Quiz state
  const [isStarted, setIsStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Maximum level available in the quiz
  const MAX_LEVEL = 5;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Load user progress from database
    const loadProgress = async () => {
      try {
        setLoading(true);
        const { currentLevel, totalScore } = await fetchUserProgress(user.id);
        
        setCurrentLevel(currentLevel);
        setTotalScore(totalScore);
      } catch (error) {
        console.error('Error loading quiz progress:', error);
        toast({
          title: 'Error',
          description: 'Could not load your quiz progress.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProgress();
  }, [user, navigate]);

  // Start a level from the menu
  const handleStartLevel = (level: number) => {
    setIsStarted(true);
    setCurrentLevel(level);
  };

  // Handle quiz level completion
  const handleLevelComplete = async (levelCompleted: number, levelScore: number, isPerfectScore: boolean) => {
    // Calculate the new total score
    const newTotalScore = totalScore + levelScore;
    setTotalScore(newTotalScore);
    
    // Calculate the next level
    const nextLevel = Math.min(levelCompleted + 1, MAX_LEVEL);
    
    // Check if the entire quiz is completed
    if (levelCompleted === MAX_LEVEL) {
      // Update the database to mark quiz as completed
      const success = await updateUserProgress(user.id, nextLevel, newTotalScore, true);
      
      if (success) {
        toast({
          title: "Congratulations!",
          description: "You've completed all levels of the quiz!",
          duration: 5000,
        });
      } else {
        toast({
          title: "Warning",
          description: "Could not save your final score. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      // Update next level in the database without advancing automatically
      console.log(`Level ${levelCompleted} completed - updating next level (${nextLevel}) and score in database`);
      const success = await updateUserProgress(user.id, nextLevel, newTotalScore, false);
      
      if (success) {
        // Show a toast confirmation
        toast({
          title: "Progress Saved",
          description: `Level ${levelCompleted} completed! You can now continue to Level ${nextLevel} from the menu.`,
          duration: 5000,
        });
      } else {
        toast({
          title: "Warning",
          description: "Could not save your progress. Your current level may not be remembered.",
          variant: "destructive"
        });
      }
      
      // Don't automatically start the next level - user will need to start from menu
      setIsStarted(false);
      setCurrentLevel(nextLevel);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : isStarted ? (
          <QuizLevel 
            level={currentLevel} 
            onComplete={handleLevelComplete}
            navigate={navigate}
          />
        ) : (
          <QuizMenu
            currentLevel={currentLevel}
            totalScore={totalScore}
            maxLevel={MAX_LEVEL}
            onStartLevel={handleStartLevel}
          />
        )}
      </div>
    </Layout>
  );
};

export default QuizPage;
