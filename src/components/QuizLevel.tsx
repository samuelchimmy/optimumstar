
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import QuizQuestion from './QuizQuestion';
import { fetchQuestions, updateUserProgress, QuizQuestion as QuizQuestionType } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Trophy, Star, AlertTriangle } from 'lucide-react';

interface QuizLevelProps {
  level: number;
  onComplete: (level: number, score: number, isPerfectScore: boolean) => void;
}

export default function QuizLevel({ level, onComplete }: QuizLevelProps) {
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuestions = async () => {
      console.log(`Loading questions for level ${level}...`);
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
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Failed to load questions. Please try again later.');
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, [level]);

  const handleAnswerSubmit = async (isCorrect: boolean) => {
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
      
      // Play celebration music
      const audio = new Audio("/celebration.mp3");
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play error:", e));
      
      // Check if user got a perfect score (10/10)
      const isPerfectScore = finalScore === questions.length;
      
      // Pass the current level's score to the parent component
      onComplete(level, finalScore, isPerfectScore);
      
      toast({
        title: "Level Completed",
        description: `You scored ${finalScore} out of ${questions.length} on this level!`,
        variant: "default"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-primary text-xl">Loading questions...</div>
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
          className="bg-primary hover:bg-primary/90"
          onClick={() => navigate('/quiz')}
        >
          Back to Quiz Menu
        </Button>
      </div>
    );
  }

  if (completed) {
    // Calculate final score correctly
    const finalLevelScore = correctAnswers;
    const isPerfectScore = finalLevelScore === questions.length;
    
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">
          <span className="celebration flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6" /> Level {level} Completed! 🎉
          </span>
        </h2>
        <p className="text-xl mb-3">Your Score: <span className="font-bold text-primary">{finalLevelScore} / {questions.length}</span></p>
        
        {level < 5 ? (
          <Button 
            className="bg-primary hover:bg-primary/90 text-light text-lg px-8 py-6 mt-4"
            onClick={() => onComplete(level + 1, finalLevelScore, isPerfectScore)}
          >
            Continue to Level {level + 1}
          </Button>
        ) : (
          <div className="space-y-4">
            <p className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
              <Star className="h-6 w-6" /> You've completed all levels! 🎵🥳
            </p>
            <Button 
              className="bg-secondary hover:bg-secondary/90 text-dark text-lg px-8 py-6"
              onClick={() => onComplete(level + 1, finalLevelScore, isPerfectScore)}
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
          className="bg-primary hover:bg-primary/90"
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
          <h2 className="text-2xl font-bold">Level {level}</h2>
          <div className="text-sm">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          />
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
}
