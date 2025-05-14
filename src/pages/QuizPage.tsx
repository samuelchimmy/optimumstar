import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '../components/Layout';
import QuizLevel from '../components/QuizLevel';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProgress } from '../lib/supabase';
import { Star, Trophy, Award, AlertTriangle } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

export default function QuizPage() {
  const { user, loading } = useAuth();
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [levelScores, setLevelScores] = useState<number[]>([0, 0, 0, 0, 0]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizAlreadyCompleted, setQuizAlreadyCompleted] = useState(false);
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
        // Check if the quiz has been already completed
        if (profile.quiz_completed) {
          setQuizAlreadyCompleted(true);
        }
        
        setCurrentLevel(profile.level > 5 ? 5 : profile.level);
        
        // Set correct_answers as the total score if available
        if (profile.correct_answers) {
          setTotalScore(profile.correct_answers);
        }
        
        // Recreate level scores from the database if possible
        // Note: This is an approximation since we don't store individual level scores
        if (profile.level && profile.level > 1) {
          const newLevelScores = [...levelScores];
          const averageScore = profile.correct_answers ? Math.floor(profile.correct_answers / (profile.level - 1)) : 0;
          
          // Fill completed levels with the average score as an approximation
          for (let i = 0; i < profile.level - 1; i++) {
            newLevelScores[i] = averageScore;
          }
          
          setLevelScores(newLevelScores);
          console.log('Approximated level scores:', newLevelScores);
        }
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
  
  const handleLevelComplete = (nextLevel: number, score: number) => {
    console.log(`Level ${currentLevel} completed with score: ${score}/10`);
    
    // Store the score for this level
    const updatedScores = [...levelScores];
    updatedScores[currentLevel! - 1] = score;
    setLevelScores(updatedScores);
    
    // Calculate total score so far (sum of all level scores)
    const newTotalScore = updatedScores.reduce((sum, score) => sum + score, 0);
    console.log(`Updated level scores: ${updatedScores.join(', ')}`);
    console.log(`New total score: ${newTotalScore}/50 (sum of all levels)`);
    setTotalScore(newTotalScore);
    
    // Check if we've completed all levels
    if (nextLevel > 5) {
      setQuizCompleted(true);
      
      // Update the final score in the database
      if (user) {
        console.log('Quiz completed - sending final total score to database:', newTotalScore);
        updateUserProgress(user.id, nextLevel, newTotalScore);
        
        // Show a toast confirmation
        toast({
          title: "Quiz Completed!",
          description: `Your final score of ${newTotalScore}/50 has been recorded.`,
          duration: 5000,
        });
      }
    } else {
      // Continue to next level
      setCurrentLevel(nextLevel);
      setIsStarted(true);
      
      // Also update the progressive score in the database
      if (user) {
        console.log(`Level ${currentLevel} completed - updating progressive score in database:`, newTotalScore);
        updateUserProgress(user.id, nextLevel, newTotalScore);
      }
    }
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

  // If quiz was already completed in a previous session, show completion message
  if (quizAlreadyCompleted) {
    return (
      <Layout>
        <div className="min-h-[60vh] py-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 flex items-center justify-center gap-2">
              <Trophy className="h-8 w-8 text-primary" /> Quiz Already Completed!
            </h1>
            
            <div className="bg-secondary/20 rounded-lg p-8 mb-8">
              <div className="flex items-center justify-center mb-6 text-amber-600">
                <AlertTriangle className="h-12 w-12" />
              </div>
              <p className="text-xl mb-6">
                You have already completed all levels of the quiz. Thank you for participating!
              </p>
              <p className="text-lg mb-8">
                Please check back later for the next round of quizzes. 
                In the meantime, you can view your ranking on the leaderboard.
              </p>
              
              <Button
                onClick={() => navigate('/leaderboard')}
                className="bg-primary hover:bg-primary/90 text-light"
                size="lg"
              >
                View Leaderboard
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (quizCompleted) {
    return (
      <Layout>
        <div className="min-h-[60vh] py-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 flex items-center justify-center gap-2">
              <Award className="h-8 w-8 text-primary" /> Quiz Completed! 🎉
            </h1>
            
            <div className="bg-secondary/20 rounded-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-primary mb-6">Your Final Score</h2>
              <div className="text-5xl font-bold mb-6">{totalScore} <span className="text-2xl text-muted-foreground">/50</span></div>
              
              <div className="space-y-4 mb-6">
                {levelScores.map((score, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <span>Level {index + 1}</span>
                    <span className="font-semibold">{score}/10</span>
                  </div>
                ))}
              </div>
              
              <div className="text-xl mt-4">
                {totalScore >= 45 && (
                  <p className="text-green-600">Outstanding! You're a blockchain genius! ����</p>
                )}
                {totalScore >= 30 && totalScore < 45 && (
                  <p className="text-primary">Great job! You know your Succinct stuff! 🌟</p>
                )}
                {totalScore < 30 && (
                  <p>Keep learning! You'll master Succinct soon! 📚</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => navigate('/leaderboard')}
                className="bg-primary hover:bg-primary/90 text-light"
              >
                View Leaderboard
              </Button>
            </div>
          </div>
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
              Answer all 10 questions in each level to test your knowledge.
              There are 5 levels with 10 questions each, for a total of 50 points.
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
