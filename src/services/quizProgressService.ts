
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const fetchUserProgress = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('current_level, total_score')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user progress:', error);
      return { currentLevel: 1, totalScore: 0 };
    }
    
    return {
      currentLevel: data?.current_level || 1,
      totalScore: data?.total_score || 0
    };
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return { currentLevel: 1, totalScore: 0 };
  }
};

export const updateUserProgress = async (
  userId: string, 
  newLevel: number, 
  newScore: number,
  isComplete: boolean
) => {
  try {
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        current_level: newLevel,
        total_score: newScore,
        completed: isComplete
      });
    
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
