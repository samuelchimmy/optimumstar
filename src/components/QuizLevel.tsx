
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
  onComplete: (level: number, score: number) => void;
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
    // Track correct answers only when the answer is correct
    if (isCorrect) {
      const newCorrectAnswers = correctAnswers + 1;
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
      
      // Play celebration music
      const audio = new Audio("/celebration.mp3");
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play error:", e));
      
      // Pass the current level's score to the parent component
      // The parent (QuizPage) will handle accumulating the scores
      onComplete(level + 1, correctAnswers);
      
      // The database update will be handled in QuizPage.tsx, which has the complete
      // accumulated score for all levels
      toast({
        title: "Level Completed! 🎉",
        description: `You scored ${correctAnswers} out of 10 on this level!`,
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

  if (completed) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">
          <span className="celebration flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6" /> Level {level} Completed! 🎉
          </span>
        </h2>
        <p className="text-xl mb-3">Your Score: <span className="font-bold text-primary">{correctAnswers} / 10</span></p>
        
        {level < 5 ? (
          <Button 
            className="bg-primary hover:bg-primary/90 text-light text-lg px-8 py-6 mt-4"
            onClick={() => onComplete(level + 1, correctAnswers)}
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
              onClick={() => onComplete(level + 1, correctAnswers)}
            >
              See Your Final Score
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
