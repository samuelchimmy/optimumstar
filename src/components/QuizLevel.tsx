
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import QuizQuestion from './QuizQuestion';
import { fetchQuestions, updateUserProgress, QuizQuestion as QuizQuestionType } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Trophy, Star } from 'lucide-react';

interface QuizLevelProps {
  level: number;
  onComplete: (level: number) => void;
}

export default function QuizLevel({ level, onComplete }: QuizLevelProps) {
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuestions = async () => {
      const levelQuestions = await fetchQuestions(level);
      setQuestions(levelQuestions);
      setLoading(false);
    };
    
    loadQuestions();
  }, [level]);

  const handleAnswerSubmit = async (isCorrect: boolean) => {
    if (isCorrect) {
      const newCorrectAnswers = correctAnswers + 1;
      setCorrectAnswers(newCorrectAnswers);
      
      // Move to next question or complete level
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Level completed!
        setCompleted(true);
        
        // Play celebration music
        const audio = new Audio("/celebration.mp3");
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio play error:", e));
        
        // Update user progress in database
        if (user) {
          await updateUserProgress(user.id, level + 1, newCorrectAnswers);
        }
        
        toast({
          title: "Level Completed! 🎉",
          description: "You're officially Succinct-certified for this level!",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-primary text-xl">Loading questions...</div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">
          <span className="celebration flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6" /> Congratulations! 🎉
          </span>
        </h2>
        <p className="text-xl mb-8">You've completed Level {level}!</p>
        
        {level < 5 ? (
          <Button 
            className="bg-primary hover:bg-primary/90 text-light text-lg px-8 py-6"
            onClick={() => onComplete(level + 1)}
          >
            Continue to Level {level + 1}
          </Button>
        ) : (
          <div className="space-y-4">
            <p className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
              <Star className="h-6 w-6" /> You're officially a Succinct Genius! 🎵🥳
            </p>
            <Button 
              className="bg-secondary hover:bg-secondary/90 text-dark text-lg px-8 py-6"
              onClick={() => navigate('/leaderboard')}
            >
              View Leaderboard
            </Button>
          </div>
        )}
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
