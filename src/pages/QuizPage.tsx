
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import QuizLevel from '../components/QuizLevel';
import QuizMenu from '../components/QuizMenu';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  fetchUserProgress, 
  updateUserProgress,
  ensureUserProfile,
  calculateLevelScore,
  calculateStandardizedScore
} from '../services/quizProgressService';

const QuizPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Quiz state
  const [isStarted, setIsStarted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completedLevels, setCompletedLevels] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // Maximum level available in the quiz
  const MAX_LEVEL = 5;
  // Maximum possible quiz score (10 points per level × 5 levels)
  const MAX_TOTAL_SCORE = 50;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Ensure user has a profile and then load progress
    const initializeUserAndLoadProgress = async () => {
      try {
        setLoading(true);
        
        // First ensure the user profile exists
        await ensureUserProfile(user.id);
        
        // Then load the progress
        const { data } = await fetchUserProgress(user.id);
        
        console.log('Loaded user progress:', data);
        
        setCurrentLevel(data.currentLevel);
        setTotalScore(data.totalScore);
        setCompletedLevels(data.completedLevels || {});
        
        // Check if the quiz is completed
        if (data.quizCompleted) {
          setQuizCompleted(true);
          toast({
            title: "Quiz Already Completed",
            description: "You've already completed all levels of the quiz. Please wait for the next round!",
            variant: "default",
            duration: 5000,
          });
          // Redirect to home after a short delay
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (error) {
        console.error('Error initializing quiz progress:', error);
        toast({
          title: 'Error',
          description: 'Could not load your quiz progress.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    initializeUserAndLoadProgress();
  }, [user, navigate]);

  // Start a level from the menu
  const handleStartLevel = (level: number) => {
    setIsStarted(true);
    setCurrentLevel(level);
  };

  // Handle quiz level completion
  const handleLevelComplete = async (levelCompleted: number, levelScore: number, isPerfectScore: boolean) => {
    // Convert raw score to standardized score (0-10 points per level)
    const standardizedLevelScore = calculateStandardizedScore(levelScore);
    
    // Create a copy of completed levels
    const updatedCompletedLevels = { ...completedLevels };

    // Check if this level was already completed
    const previousScore = updatedCompletedLevels[levelCompleted] || 0;
    
    // Only update if the new score is better
    if (standardizedLevelScore > previousScore) {
      // Calculate the score difference to add to total
      const scoreDifference = standardizedLevelScore - previousScore;
      
      // Update the completed level record
      updatedCompletedLevels[levelCompleted] = standardizedLevelScore;

      // Calculate new total score by adding the difference
      const newTotalScore = Math.min(totalScore + scoreDifference, MAX_TOTAL_SCORE);
      setTotalScore(newTotalScore);
      
      // Calculate the next level
      const nextLevel = Math.min(levelCompleted + 1, MAX_LEVEL);
      
      // Check if the entire quiz is completed
      const isQuizCompleted = levelCompleted === MAX_LEVEL;
      
      if (isQuizCompleted) {
        // Update the database to mark quiz as completed
        const success = await updateUserProgress(user.id, nextLevel, newTotalScore, true, updatedCompletedLevels);
        
        if (success) {
          setQuizCompleted(true);
          toast({
            title: "Congratulations!",
            description: "You've completed all levels of the quiz! You'll be redirected to the home page.",
            duration: 5000,
          });
          
          // Update local state
          setCompletedLevels(updatedCompletedLevels);
          
          // Redirect to home page after a short delay
          setTimeout(() => {
            navigate('/');
          }, 3000);
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
        const success = await updateUserProgress(user.id, nextLevel, newTotalScore, false, updatedCompletedLevels);
        
        if (success) {
          // Update local state
          setCompletedLevels(updatedCompletedLevels);
          setCurrentLevel(nextLevel);
          
          // Show a toast confirmation
          let toastMessage = `Level ${levelCompleted} completed with ${standardizedLevelScore}/10 points!`;
          
          if (previousScore > 0) {
            toastMessage += ` You improved by ${scoreDifference} points!`;
          }
          
          toast({
            title: "Progress Saved",
            description: toastMessage,
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
      }
    } else {
      // Score didn't improve
      toast({
        title: "Level Completed",
        description: `You scored ${standardizedLevelScore}/10, but your previous best was ${previousScore}/10. Keep practicing!`,
        duration: 5000,
      });
      
      // Return to menu without updating score
      setIsStarted(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : quizCompleted ? (
          <div className="flex flex-col items-center justify-center text-center py-12 min-h-[60vh]">
            <h2 className="text-3xl font-bold mb-4 text-primary">Quiz Completed!</h2>
            <p className="text-xl mb-8">You've already completed all levels of the quiz. Please wait for the next round!</p>
            <Button onClick={() => navigate('/')} variant="outline">
              Return to Home
            </Button>
          </div>
        ) : isStarted ? (
          <QuizLevel 
            level={currentLevel} 
            onComplete={handleLevelComplete}
          />
        ) : (
          <QuizMenu
            currentLevel={currentLevel}
            totalScore={totalScore}
            maxLevel={MAX_LEVEL}
            completedLevels={completedLevels}
            onStartLevel={handleStartLevel}
          />
        )}
      </div>
    </Layout>
  );
};

export default QuizPage;
