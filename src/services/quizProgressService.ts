
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const fetchUserProgress = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('current_level, score, completed_levels')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user progress:', error);
      return { currentLevel: 1, totalScore: 0, completedLevels: {} };
    }
    
    // Parse the completed_levels JSON from the database, or use empty object if null
    const completedLevels = data?.completed_levels ? data.completed_levels : {};
    
    return {
      currentLevel: data?.current_level || 1,
      totalScore: data?.score || 0,
      completedLevels
    };
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return { currentLevel: 1, totalScore: 0, completedLevels: {} };
  }
};

export const updateUserProgress = async (
  userId: string, 
  newLevel: number, 
  newScore: number,
  isComplete: boolean,
  completedLevels: Record<number, number> = {}
) => {
  try {
    // Ensure total score doesn't exceed 50 (max possible score)
    const cappedScore = Math.min(newScore, 50);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        id: userId,
        current_level: newLevel,
        score: cappedScore,
        quiz_completed: isComplete,
        completed_levels: completedLevels,
        last_completed_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user progress:', error);
      toast({
        title: 'Error',
        description: 'Could not update your progress.',
        variant: 'destructive'
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user progress:', error);
    return false;
  }
};

export const calculateLevelScore = (
  correctAnswers: number,
  totalQuestions: number,
  timeBonus: number = 0
) => {
  // Base score: 100 points per correct answer
  const baseScore = correctAnswers * 100;
  
  // Perfect score bonus: 500 points if all answers are correct
  const perfectScoreBonus = correctAnswers === totalQuestions ? 500 : 0;
  
  // Time bonus: Additional points for completing quickly
  const totalTimeBonus = timeBonus;
  
  return baseScore + perfectScoreBonus + totalTimeBonus;
};

// Calculate a standardized score that maps to a 0-10 range per level
export const calculateStandardizedScore = (score: number) => {
  // Assuming the maximum score per level is 1500 (10 questions × 100 points + 500 perfect bonus)
  // Map it to a 0-10 scale
  return Math.min(Math.round(score / 150), 10);
};
