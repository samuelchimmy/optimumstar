
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import QuizQuestion from './QuizQuestion';
import { fetchQuestions } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Trophy, Star, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Confetti from './Confetti';

interface QuizLevelProps {
  level: number;
  onComplete: (level: number, score: number, isPerfectScore: boolean) => void;
}

export default function QuizLevel({ level, onComplete }: QuizLevelProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [perfectScore, setPerfectScore] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuestions = async () => {
      console.log(`Loading questions for level ${level}...`);
      setLoading(true);
      setCurrentQuestionIndex(0); // Reset question index when level changes
      setCorrectAnswers(0); // Reset correct answers when level changes
      
      try {
        const levelQuestions = await fetchQuestions(level);
        console.log(`Received ${levelQuestions.length} questions for level ${level}`);
        
        if (levelQuestions.length === 0) {
          console.error(`No questions found for level ${level}!`);
          setError(`No questions available for Level ${level}. Please try again later.`);
        } else if (levelQuestions.length < 10) {
          console.warn(`Not enough questions for level ${level}. Found: ${levelQuestions.length}`);
          // Still set questions but with a warning
          setQuestions(levelQuestions);
          toast({
            title: "Warning",
            description: `Only ${levelQuestions.length} questions available for this level.`,
            variant: "destructive"
          });
        } else {
          setQuestions(levelQuestions);
        }
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, [level]);

  const handleAnswerSubmit = (isCorrect: boolean) => {
    // Log for debugging
    console.log(`Answer submitted for question ${currentQuestionIndex + 1}: ${isCorrect ? 'correct' : 'incorrect'}`);
    
    // Track correct answers only when the answer is correct
    if (isCorrect) {
      const newCorrectAnswers = correctAnswers + 1;
      console.log(`Incrementing score from ${correctAnswers} to ${newCorrectAnswers}`);
      setCorrectAnswers(newCorrectAnswers);
      
      // Play a small success sound
      const audio = new Audio("/success.mp3");
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play error:", e));
    }
    
    // Move to next question regardless of correct/incorrect
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Level completed - show the score for this level
      setCompleted(true);
      
      // Calculate final score including the last answer
      const finalScore = isCorrect ? correctAnswers + 1 : correctAnswers;
      console.log(`Level ${level} completed with final score: ${finalScore}/${questions.length}`);
      
      // Check if user got a perfect score
      const isPerfect = finalScore === questions.length;
      setPerfectScore(isPerfect);
      
      // Play celebration music
      const audio = new Audio("/celebration.mp3");
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play error:", e));
      
      toast({
        title: "Level Completed",
        description: `You scored ${finalScore} out of ${questions.length} on this level!`,
        variant: "default"
      });
    }
  };

  // Function to handle going back to quiz menu
  const handleReturnToMenu = (finalLevelScore: number, isPerfectScore: boolean) => {
    // Calculate raw score: 100 points per correct answer + 500 bonus for perfect score
    const rawScore = finalLevelScore * 100 + (isPerfectScore ? 500 : 0);
    
    // Call onComplete to update the database
    onComplete(level, rawScore, isPerfectScore);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-primary text-xl">
          <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center mb-8">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-amber-600 mb-2">Oops! Something went wrong</h2>
          <p className="text-lg">{error}</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 liquid-button"
          onClick={() => navigate('/quiz')}
        >
          Back to Quiz Menu
        </Button>
      </div>
    );
  }

  if (completed) {
    // Calculate final level score correctly
    const finalLevelScore = correctAnswers;
    const isPerfectScore = finalLevelScore === questions.length;
    
    return (
      <div className="text-center">
        <Confetti active={isPerfectScore} />
        
        <h2 className="text-3xl font-bold mb-6">
          <span className={`celebration flex items-center justify-center gap-2 ${isPerfectScore ? 'text-secondary' : 'text-primary'}`}>
            <Trophy className="h-6 w-6" /> Level {level} Completed! 🎉
          </span>
        </h2>
        <p className="text-xl mb-3">
          Your Score: <span className={`font-bold ${isPerfectScore ? 'text-secondary' : 'text-primary'}`}>
            {finalLevelScore} / {questions.length}
          </span>
        </p>
        
        {isPerfectScore && (
          <div className="my-6 p-4 bg-secondary/10 rounded-lg flex items-center justify-center space-x-2 animate-bubble">
            <Star className="text-secondary h-6 w-6" />
            <p className="text-lg font-medium">Perfect Score! RLNC efficiency at 100%!</p>
          </div>
        )}
        
        {level < 5 ? (
          <Button 
            className={`${isPerfectScore ? 'bg-secondary hover:bg-secondary/90 text-dark' : 'bg-primary hover:bg-primary/90 text-light'} text-lg px-8 py-6 mt-4 liquid-button`}
            onClick={() => handleReturnToMenu(finalLevelScore, isPerfectScore)}
          >
            Save Progress & Return to Menu
          </Button>
        ) : (
          <div className="space-y-4">
            <p className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
              <Star className="h-6 w-6" /> You've completed all levels! 🎵🥳
            </p>
            <Button 
              className="bg-secondary hover:bg-secondary/90 text-dark text-lg px-8 py-6 liquid-button"
              onClick={() => handleReturnToMenu(finalLevelScore, isPerfectScore)}
            >
              See Your Final Score
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Don't try to render if no questions
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center mb-8">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-amber-600 mb-2">No Questions Available</h2>
          <p className="text-lg">There are no questions available for this level.</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 liquid-button"
          onClick={() => navigate('/quiz')}
        >
          Back to Quiz Menu
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Level {level}</h2>
          <div className="text-sm bg-primary/10 rounded-full px-3 py-1 dark:bg-primary/20">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6 overflow-hidden relative">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          />
          
          {/* Add floating bubbles along the progress bar */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i}
              className="absolute top-1/2 -translate-y-1/2 rounded-full bg-primary/50 w-2 h-2 animate-float"
              style={{
                left: `${(i + 1) * (100 / 6)}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {questions.length > 0 && (
        <QuizQuestion 
          question={questions[currentQuestionIndex]} 
          onAnswerSubmit={handleAnswerSubmit} 
        />
      )}
    </div>
  );
};
