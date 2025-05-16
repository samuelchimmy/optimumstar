
import { Button } from '@/components/ui/card';
import { Card } from '@/components/ui/card';
import { ArrowRight, Trophy, CheckCircle, LockIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuizMenuProps {
  currentLevel: number;
  totalScore: number;
  maxLevel: number;
  completedLevels?: Record<string, any>;
  onStartLevel: (level: number) => void;
}

const QuizMenu = ({ 
  currentLevel, 
  totalScore, 
  maxLevel, 
  completedLevels = {},
  onStartLevel 
}: QuizMenuProps) => {
  // Create an array of available levels
  const availableLevels = Array.from({ length: maxLevel }, (_, i) => i + 1)
    .filter(level => level <= Math.max(currentLevel, 1));

  // Function to get level completion status
  const getLevelStatus = (level: number) => {
    const levelData = completedLevels[level];
    if (!levelData) return "Not attempted";
    
    // Check if level is completed
    if (levelData.completed) {
      return levelData.score === 10 ? "Perfect score!" : `${levelData.score}/10 points`;
    }
    
    // Level in progress
    return `In progress - Question ${levelData.lastQuestionIndex + 1}`;
  };

  // Function to check if a level is already completed
  const isLevelCompleted = (level: number) => {
    return !!completedLevels[level]?.completed;
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Quiz Menu</h2>
          <div className="flex items-center gap-2 animate-float">
            <Trophy className="text-primary" />
            <span className="text-xl font-semibold">
              {totalScore}/{maxLevel * 10} points
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300">
          Test your knowledge about Optimum and Web3 memory infrastructure with RLNC technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableLevels.map(level => {
          const levelData = completedLevels[level] || {};
          const isCompleted = levelData.completed;
          const levelScore = levelData.score || 0;
          const isPerfect = levelScore === 10;
          const inProgress = !isCompleted && levelData.lastQuestionIndex > 0;
          const lastQuestionIndex = levelData.lastQuestionIndex || 0;
          
          return (
            <Card 
              key={level} 
              className={`p-6 hover:shadow-lg transition-all cursor-pointer border-2 ${
                isCompleted 
                  ? isPerfect 
                    ? 'border-secondary hover:border-secondary/80' 
                    : 'border-primary hover:border-primary/80' 
                  : inProgress
                  ? 'border-amber-400 hover:border-amber-500'
                  : 'hover:border-primary'
              } relative overflow-hidden group`}
              onClick={() => {
                // Don't allow revisiting completed levels
                if (isCompleted) {
                  return;
                }
                onStartLevel(level);
              }}
            >
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">Level {level}</h3>
                  {isCompleted && isPerfect && (
                    <CheckCircle className="h-5 w-5 text-secondary animate-pulse" />
                  )}
                  {isCompleted && !isPerfect && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
                {isCompleted ? (
                  <LockIcon className={
                    isPerfect 
                      ? "text-secondary" 
                      : "text-primary"
                  } />
                ) : (
                  <ArrowRight className={
                    inProgress
                      ? "text-amber-500 group-hover:translate-x-1 transition-transform" 
                      : "text-primary group-hover:translate-x-1 transition-transform"
                  } />
                )}
              </div>
              <div className="mt-2 relative z-10">
                <p className="text-gray-600 dark:text-gray-300">
                  {isCompleted 
                    ? `Completed: ${levelScore}/10 points${levelScore === 10 ? ' (Perfect!)' : ''}`
                    : inProgress
                    ? `In Progress - Question ${lastQuestionIndex + 1} of 10`
                    : level === currentLevel 
                      ? "Start this level" 
                      : "Review this level"
                  }
                </p>
              </div>
              
              {/* Progress bar for in-progress levels */}
              {inProgress && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 mt-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(lastQuestionIndex / 10) * 100}%` }}
                  />
                </div>
              )}
              
              {/* Background bubble effect that appears on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i}
                    className={`absolute rounded-full ${
                      isCompleted
                        ? isPerfect 
                          ? 'bg-secondary/10' 
                          : 'bg-primary/10'
                        : inProgress 
                        ? 'bg-amber-400/10' 
                        : 'bg-primary/10'
                    }`}
                    style={{
                      width: `${Math.random() * 60 + 20}px`,
                      height: `${Math.random() * 60 + 20}px`,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDuration: `${Math.random() * 4 + 3}s`,
                    }}
                  ></div>
                ))}
              </div>
              
              {/* Overlay for completed levels */}
              {isCompleted && (
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-gray-900/20 to-gray-900/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-white text-center p-3 rounded-lg bg-gray-900/60">
                    <LockIcon className="h-6 w-6 mx-auto mb-2" />
                    <p>Level completed</p>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
        
        {currentLevel < maxLevel && (
          <Card className="p-6 border-dashed border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-400">Level {currentLevel + 1}</h3>
              <ArrowRight className="text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Complete Level {currentLevel} to unlock
            </p>
          </Card>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <Link to="/leaderboard">
          <Button variant="outline" className="gap-2 liquid-button">
            <Trophy className="h-4 w-4" />
            View Leaderboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default QuizMenu;
