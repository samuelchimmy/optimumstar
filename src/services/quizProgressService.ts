import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Fetches the user's quiz progress from the database
 * @param userId The ID of the user
 */
export const fetchUserProgress = async (userId: string) => {
  try {
    console.log('[fetchUserProgress] Fetching progress for user:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('current_level, score, completed_levels, quiz_completed')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('[fetchUserProgress] Error:', error);
      return { 
        data: { currentLevel: 1, totalScore: 0, completedLevels: {}, quizCompleted: false },
        error
      };
    }
    
    // Parse the completed_levels JSON from the database, or use empty object if null
    const completedLevels = data?.completed_levels ? data.completed_levels : {};
    
    const result = {
      data: {
        currentLevel: data?.current_level || 1,
        totalScore: data?.score || 0,
        completedLevels,
        quizCompleted: data?.quiz_completed || false
      },
      error: null
    };
    
    console.log('[fetchUserProgress] Result:', result);
    return result;
  } catch (error) {
    console.error('[fetchUserProgress] Unexpected error:', error);
    return { 
      data: { currentLevel: 1, totalScore: 0, completedLevels: {}, quizCompleted: false },
      error 
    };
  }
};

/**
 * Saves the current question progress for a level
 * @param userId The user ID
 * @param level The current level
 * @param questionIndex The current question index
 * @param levelScore The current level score
 * @param isLevelComplete Whether the level is completed
 */
export const saveQuestionProgress = async (
  userId: string,
  level: number,
  questionIndex: number,
  levelScore: number,
  isLevelComplete: boolean
) => {
  try {
    console.log('[saveQuestionProgress]', {
      userId, level, questionIndex, levelScore, isLevelComplete
    });

    // Use the database function to update the completed_levels structure
    const { data, error } = await supabase.rpc(
      'update_completed_level_progress',
      {
        user_id: userId,
        level_number: level,
        question_index: questionIndex,
        level_score: levelScore,
        is_level_completed: isLevelComplete
      }
    );

    if (error) {
      console.error('[saveQuestionProgress] Error:', error);
      return false;
    }

    console.log('[saveQuestionProgress] Updated progress:', data);
    return true;
  } catch (error) {
    console.error('[saveQuestionProgress] Unexpected error:', error);
    return false;
  }
};

/**
 * Updates the user's quiz progress in the database
 * @param userId The ID of the user
 * @param newLevel The new level to update to (only if higher than current)
 * @param newScore The new total score
 * @param isComplete Whether the quiz is completed
 * @param completedLevels Record of completed levels and their scores
 */
export const updateUserProgress = async (
  userId: string, 
  newLevel: number, 
  newScore: number,
  isComplete: boolean,
  completedLevels: Record<string, any> = {}
) => {
  try {
    console.log('[updateUserProgress] Updating user progress:');
    console.log('- User ID:', userId);
    console.log('- New Level:', newLevel);
    console.log('- New Score:', newScore);
    console.log('- Is Complete:', isComplete);
    console.log('- Completed Levels:', completedLevels);
    
    // First, check if the user exists and get their current progress
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('current_level, score, quiz_completed, completed_levels')
      .eq('id', userId)
      .maybeSingle();
    
    if (fetchError) {
      console.error('[updateUserProgress] Error fetching profile:', fetchError);
      toast({
        title: 'Error',
        description: 'Could not fetch your current progress.',
        variant: 'destructive'
      });
      return false;
    }
    
    // If profile doesn't exist, create it with default values
    if (!existingProfile) {
      console.log('[updateUserProgress] Profile not found, creating new profile');
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: 'User',
          avatar_url: '',
          current_level: newLevel,
          score: newScore,
          completed_levels: completedLevels,
          quiz_completed: isComplete,
          last_completed_at: new Date().toISOString()
        });
      
      if (createError) {
        console.error('[updateUserProgress] Error creating profile:', createError);
        toast({
          title: 'Error',
          description: 'Could not create your profile.',
          variant: 'destructive'
        });
        return false;
      }
      return true;
    }
    
    console.log('[updateUserProgress] Existing profile found:', existingProfile);
    
    // If quiz is already completed, don't update anything
    if (existingProfile.quiz_completed) {
      console.log('[updateUserProgress] Quiz already completed, no updates needed');
      return true;
    }
    
    // Ensure total score doesn't exceed 50 (max possible score)
    const cappedScore = Math.min(newScore, 50);
    
    // Only update level if new level is higher than current
    const updatedLevel = Math.max(existingProfile.current_level || 1, newLevel);
    
    // Update completed levels if provided
    let updatedCompletedLevels = existingProfile.completed_levels;
    if (Object.keys(completedLevels).length > 0) {
      // Handle case where existing completed_levels might be null
      const existingCompletedLevels = existingProfile.completed_levels || {};
      
      // Fix the spread typing issue by ensuring existingCompletedLevels is an object
      // Use a temporary variable with explicit Record type
      const safeExistingLevels: Record<string, any> = 
        typeof existingCompletedLevels === 'object' && existingCompletedLevels !== null 
          ? existingCompletedLevels as Record<string, any>
          : {};
      
      updatedCompletedLevels = { ...safeExistingLevels, ...completedLevels };
    }
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        current_level: updatedLevel,
        score: cappedScore,
        quiz_completed: isComplete,
        completed_levels: updatedCompletedLevels,
        last_completed_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error('[updateUserProgress] Error updating profile:', updateError);
      toast({
        title: 'Error',
        description: 'Could not update your progress.',
        variant: 'destructive'
      });
      return false;
    }
    
    console.log('[updateUserProgress] Update successful');
    return true;
  } catch (error) {
    console.error('[updateUserProgress] Unexpected error:', error);
    toast({
      title: 'Error',
      description: 'An unexpected error occurred while saving your progress.',
      variant: 'destructive'
    });
    return false;
  }
};

/**
 * Calculates the raw score for a level
 */
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

/**
 * Calculate a standardized score that maps to a 0-10 range per level
 * Updated to be directly proportional to correct answers (1 correct = 1 point)
 */
export const calculateStandardizedScore = (score: number, totalQuestions: number = 10) => {
  // Calculate how many correct answers the user got
  // Raw score formula: correctAnswers * 100 + perfectBonus + timeBonus
  // First, extract just the base score component (ignoring bonuses)
  const baseScoreComponent = Math.min(score, totalQuestions * 100);
  const correctAnswers = Math.round(baseScoreComponent / 100);
  
  // Direct mapping: Each correct answer is worth 1 point on the standardized scale
  return correctAnswers;
};

/**
 * Creates a new profile for a user if it doesn't exist
 */
export const ensureUserProfile = async (userId: string) => {
  try {
    console.log('[ensureUserProfile] Checking profile for user:', userId);
    
    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    
    if (fetchError) {
      console.error('[ensureUserProfile] Error checking profile:', fetchError);
      return false;
    }
    
    // If profile exists, no need to create a new one
    if (existingProfile) {
      console.log('[ensureUserProfile] Profile already exists');
      return true;
    }
    
    // Create new profile with default values
    console.log('[ensureUserProfile] Creating new profile');
    const { error: createError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        username: 'User',
        avatar_url: '',
        current_level: 1,
        score: 0,
        completed_levels: {},
        quiz_completed: false,
        last_completed_at: new Date().toISOString()
      });
    
    if (createError) {
      console.error('[ensureUserProfile] Error creating profile:', createError);
      return false;
    }
    
    console.log('[ensureUserProfile] Profile created successfully');
    return true;
  } catch (error) {
    console.error('[ensureUserProfile] Unexpected error:', error);
    return false;
  }
};
