
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuizQuestion as QuizQuestionType } from '../lib/supabase';
import { toast } from '@/hooks/use-toast';
import { CircleCheck, CircleX, ArrowRight } from 'lucide-react';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswerSubmit: (isCorrect: boolean) => void;
  questionIndex: number; // Added to track current question index
  questionCount: number; // Added to show total questions
}

export default function QuizQuestion({ question, onAnswerSubmit, questionIndex, questionCount }: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [rippleEffect, setRippleEffect] = useState<{ x: number, y: number, active: boolean }>({ x: 0, y: 0, active: false });

  const handleRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRippleEffect({ x, y, active: true });
    
    setTimeout(() => {
      setRippleEffect(prev => ({ ...prev, active: false }));
    }, 600);
  };

  const handleOptionSelect = (index: number) => {
    if (!hasSubmitted) {
      setSelectedOption(index);
    }
  };

  const checkAnswer = () => {
    if (selectedOption === null) {
      toast({
        title: "Select an Answer",
        description: "Please select an answer before submitting",
      });
      return;
    }

    const correct = selectedOption === question.correct_answer;
    setIsCorrect(correct);
    setHasSubmitted(true);
    
    // Log the answer result for debugging
    console.log(`Question answered: ${correct ? 'CORRECT' : 'INCORRECT'} (selected=${selectedOption}, correct=${question.correct_answer})`);
    
    if (correct) {
      // Play a small success sound or effect
      const audio = new Audio("/success.mp3");
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play error:", e));

      toast({
        title: "Nailed it! 🎉",
        description: "Your blockchain memory is working great!",
        variant: "default"
      });
    } else {
      toast({
        title: "Memory buffer overflow! 🥶",
        description: "Moving to next question...",
        variant: "destructive"
      });
    }
    
    // Set timer for next question (for both correct and incorrect answers)
    setTimeLeft(3);
  };

  useEffect(() => {
    let timer: number | undefined;
    
    if (timeLeft !== null && timeLeft > 0) {
      timer = window.setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Pass the correct flag to the parent component
      onAnswerSubmit(isCorrect);
      setSelectedOption(null);
      setHasSubmitted(false);
      setTimeLeft(null);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, isCorrect, onAnswerSubmit]);

  return (
    <Card className="w-full max-w-2xl bg-light animate-fade-in shadow-lg relative overflow-hidden">
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="text-sm bg-primary/10 rounded-full px-3 py-1 dark:bg-primary/20 mb-2">
            Question {questionIndex + 1} of {questionCount}
          </div>
          <h3 className="text-xl font-semibold mb-2">{question.question}</h3>
        </div>
        
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`quiz-option ${
                hasSubmitted
                  ? index === question.correct_answer
                    ? "correct"
                    : selectedOption === index && selectedOption !== question.correct_answer
                    ? "incorrect"
                    : ""
                  : selectedOption === index
                  ? "selected"
                  : ""
              }`}
              onClick={(e) => {
                handleRipple(e);
                handleOptionSelect(index);
              }}
            >
              <p>{option}</p>
              {rippleEffect.active && (
                <span 
                  className="ripple-effect" 
                  style={{ 
                    left: rippleEffect.x + 'px', 
                    top: rippleEffect.y + 'px' 
                  }}
                ></span>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          {hasSubmitted ? (
            <div className="w-full text-center">
              {isCorrect ? (
                <div className="text-secondary font-medium">
                  <p className="text-lg flex items-center justify-center gap-2 animate-bubble">
                    <CircleCheck className="h-5 w-5" /> Correct! 🎉
                  </p>
                  {timeLeft !== null && (
                    <p className="text-sm mt-1">
                      Next question in {timeLeft}...
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-red-600 font-medium">
                  <p className="text-lg flex items-center justify-center gap-2">
                    <CircleX className="h-5 w-5" /> Incorrect!
                  </p>
                  <Button 
                    onClick={() => {
                      setTimeLeft(0);
                    }}
                    variant="outline"
                    className="mt-2 flex gap-2 items-center liquid-button"
                  >
                    Next Question <ArrowRight className="h-4 w-4" />
                  </Button>
                  {timeLeft !== null && (
                    <p className="text-sm mt-1">
                      Next question in {timeLeft}...
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Button 
              onClick={checkAnswer}
              className="bg-primary hover:bg-primary/90 text-light liquid-button"
              disabled={selectedOption === null}
            >
              Submit Answer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
