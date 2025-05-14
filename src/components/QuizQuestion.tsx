
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuizQuestion as QuizQuestionType } from '../lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { CircleCheck, CircleX } from 'lucide-react';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswerSubmit: (isCorrect: boolean) => void;
}

export default function QuizQuestion({ question, onAnswerSubmit }: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

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
    
    if (correct) {
      // Play a small success sound or effect
      const audio = new Audio("/success.mp3");
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play error:", e));

      toast({
        title: "Nailed it! 🎉",
        description: "Your blockchain brain is on fire!",
        variant: "default"
      });

      // Set timer for next question
      setTimeLeft(3);
    } else {
      toast({
        title: "Oops, blockchain brain-freeze! 🥶",
        description: "Try again, you've got this!",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    let timer: number | undefined;
    
    if (timeLeft !== null && timeLeft > 0) {
      timer = window.setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
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
    <Card className="w-full max-w-2xl bg-light animate-fade-in shadow-lg">
      <CardContent className="pt-6">
        <div className="mb-6">
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
              onClick={() => handleOptionSelect(index)}
            >
              <p>{option}</p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          {hasSubmitted ? (
            <div className="w-full text-center">
              {isCorrect ? (
                <div className="text-green-600 font-medium">
                  <p className="text-lg flex items-center justify-center gap-2">
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
                    <CircleX className="h-5 w-5" /> Blockchain broken! Try again?
                  </p>
                  <Button 
                    onClick={() => {
                      setHasSubmitted(false);
                      setSelectedOption(null);
                    }}
                    variant="outline"
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Button 
              onClick={checkAnswer}
              className="bg-primary hover:bg-primary/90 text-light"
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
