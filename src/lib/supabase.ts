
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { quizQuestions } from '../data/quizQuestions';

// Import the supabase client from the integrations folder
import { supabase } from '@/integrations/supabase/client';

// Define our own types that match our actual database structure
// These will be used instead of the generated types which are currently empty
export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  current_level: number | null;
  score: number | null;
  created_at: string | null;
  discord_username?: string | null;
  twitter_username?: string | null;
  quiz_completed?: boolean | null;
  last_completed_at?: string | null;
}

export interface QuizQuestion {
  id: string | number;
  question: string;
  options: string[];
  correct_answer: number;
  level: number;
}

// Improved function to fetch user profiles with better error handling
export async function getUserProfile(userId: string, retries = 2): Promise<UserProfile | null> {
  try {
    console.log('getUserProfile called for user ID:', userId);
    
    if (!userId) {
      console.error('getUserProfile: No user ID provided');
      return null;
    }
    
    // Try to get existing profile with a timeout
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), 5000); // 5 second timeout
    });
    
    const fetchPromise = supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    // Race between fetch and timeout
    const { data, error } = await Promise.race([
      fetchPromise,
      timeoutPromise.then(() => ({ data: null, error: new Error('Request timed out') }))
    ]) as any;
    
    if (error) {
      console.error('Error fetching user profile:', error);
      
      // If we have retries left, try creating a profile and then fetch again
      if (retries > 0) {
        console.log(`Retrying profile fetch (${retries} attempts left)`);
        return await createProfileAndFetch(userId, retries - 1);
      }
      
      return null;
    }
    
    console.log('getUserProfile result:', data);
    
    // If no profile was found and we have retries left, create one and try again
    if (!data && retries > 0) {
      console.log('No profile found, attempting to create one...');
      return await createProfileAndFetch(userId, retries - 1);
    }
    
    return data;
  } catch (error) {
    console.error('getUserProfile error:', error);
    
    // Last attempt to create and fetch profile
    if (retries > 0) {
      return createProfileAndFetch(userId, 0);
    }
    
    return null;
  }
}

// Helper function to create a profile and fetch it
async function createProfileAndFetch(userId: string, retriesLeft: number): Promise<UserProfile | null> {
  try {
    // Get user details to set username properly
    const { data: userData } = await supabase.auth.getUser();
    const email = userData?.user?.email || '';
    const username = email.split('@')[0] || 'User';
    
    const defaultProfile: UserProfile = {
      id: userId,
      username: username,
      avatar_url: '',
      current_level: 1,
      score: 0,
      created_at: new Date().toISOString(),
      quiz_completed: false,
      last_completed_at: new Date().toISOString(),
    };
    
    console.log('Creating default profile:', defaultProfile);
    
    // Use upsert to avoid conflicts if profile was created in parallel
    const { data, error } = await supabase
      .from('profiles')
      .upsert([defaultProfile], {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error creating profile:', error);
      
      // Brief delay to allow database to update in case it was created elsewhere
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Try fetching one more time
      const { data: retryData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      return retryData;
    }
    
    if (data) {
      console.log('Profile created or updated successfully:', data);
      return data;
    }
    
    // If still no data, try one last fetch if we have retries left
    if (retriesLeft > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return getUserProfile(userId, 0);
    }
    
    return null;
  } catch (error) {
    console.error('createProfileAndFetch error:', error);
    return null;
  }
}

// Alias for getUserProfile to maintain compatibility
export const fetchUserProfile = getUserProfile;

// Create a new user profile with improved error handling
export async function createUserProfile(profile: UserProfile): Promise<UserProfile | null> {
  try {
    console.log('createUserProfile called with:', profile);
    
    if (!profile.id) {
      console.error('createUserProfile: No user ID provided');
      return null;
    }
    
    // Check if profile already exists to avoid duplicate creation attempts
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profile.id)
      .maybeSingle();
    
    if (existingProfile) {
      console.log('Profile already exists, returning existing:', existingProfile);
      return existingProfile;
    }
    
    // Create new profile using upsert for better reliability
    const { data, error } = await supabase
      .from('profiles')
      .upsert([{
        id: profile.id,
        username: profile.username || 'User',
        avatar_url: profile.avatar_url || '',
        current_level: profile.current_level || 1,
        score: profile.score || 0,
        created_at: profile.created_at || new Date().toISOString(),
        quiz_completed: profile.quiz_completed || false,
        last_completed_at: profile.last_completed_at || new Date().toISOString(),
      }], {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error creating user profile:', error);
      
      // If error happens, try to fetch one more time in case it was created in parallel
      await new Promise(resolve => setTimeout(resolve, 800));
      const { data: retryProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profile.id)
        .maybeSingle();
      
      if (retryProfile) {
        console.log('Found profile after creation error:', retryProfile);
        return retryProfile;
      }
      
      return null;
    }
    
    console.log('Profile created successfully:', data);
    return data || null;
  } catch (error) {
    console.error('createUserProfile error:', error);
    
    // Even for unexpected errors, check if profile exists
    try {
      const { data: fallbackProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profile.id)
        .maybeSingle();
      
      if (fallbackProfile) {
        console.log('Found profile in error fallback:', fallbackProfile);
        return fallbackProfile;
      }
    } catch (fallbackError) {
      console.error('Error in fallback profile check:', fallbackError);
    }
    
    return null;
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  profileData: Partial<Omit<UserProfile, 'id' | 'created_at'>>
): Promise<UserProfile | null> {
  try {
    console.log('updateUserProfile called for user:', userId, 'with data:', profileData);
    
    if (!userId) {
      console.error('updateUserProfile: No user ID provided');
      return null;
    }
    
    // Check if profile exists first
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (!existingProfile) {
      console.log('Profile does not exist, creating new profile');
      // Create a new profile with the provided data
      const defaultProfile: UserProfile = {
        id: userId,
        username: profileData.username || 'User',
        avatar_url: profileData.avatar_url || '',
        current_level: profileData.current_level || 1,
        score: profileData.score || 0,
        created_at: new Date().toISOString(),
        discord_username: profileData.discord_username,
        twitter_username: profileData.twitter_username,
        quiz_completed: profileData.quiz_completed || false,
        last_completed_at: profileData.last_completed_at || new Date().toISOString(),
      };
      
      return createUserProfile(defaultProfile);
    }
    
    // Update existing profile
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
    
    console.log('Profile updated successfully:', data);
    return data;
  } catch (error) {
    console.error('updateUserProfile error:', error);
    return null;
  }
}

// Update user progress with accumulated scores and completion timestamp
export async function updateUserProgress(
  userId: string, 
  level: number, 
  correctAnswers: number,
  isCompleted: boolean
): Promise<boolean> {
  try {
    if (!userId) {
      console.error('updateUserProgress: No user ID provided');
      return false;
    }
    
    console.log(`--------- UPDATING USER PROGRESS ---------`);
    console.log(`User ID: ${userId}`);
    console.log(`New Level: ${level}`);
    console.log(`Total Accumulated Score: ${correctAnswers}/50`);
    console.log(`Quiz Completed: ${isCompleted}`);
    
    // Get current profile to correctly update total score
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('current_level, score, quiz_completed')
      .eq('id', userId)
      .maybeSingle();
    
    if (!existingProfile) {
      console.error('Profile not found for user:', userId);
      return false;
    }
    
    console.log('Current profile state:', {
      currentLevel: existingProfile.current_level,
      currentScore: existingProfile.score,
      completed: existingProfile.quiz_completed
    });
    
    // If quiz is already completed, don't update anything
    if (existingProfile.quiz_completed) {
      console.log('Quiz already completed for user:', userId);
      return true;
    }
    
    const updates: any = { 
      current_level: level,
      score: correctAnswers,
      last_completed_at: new Date().toISOString() 
    };
    
    // For final level completion (level > 5), mark quiz as completed
    if (isCompleted || level > 5) {
      // This is the total accumulated score from all levels (out of 50)
      console.log(`QUIZ COMPLETED - Setting final total score: ${correctAnswers}/50`);
      updates.quiz_completed = true;
    } else {
      // For level progress (not completing the entire quiz),
      console.log(`Level progress - Setting accumulated score to: ${correctAnswers}/50`);
    }
    
    console.log('Applying database updates:', updates);
    
    const { error, data } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();
    
    if (error) {
      console.error('Error updating user progress:', error);
      return false;
    }
    
    console.log('User progress updated successfully. New profile state:', data);
    return true;
  } catch (error) {
    console.error('updateUserProgress error:', error);
    return false;
  }
}

// Fetch leaderboard data with improved error handling and ordering by score and completion time
export async function getLeaderboard(): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('score', { ascending: false })
      .order('last_completed_at', { ascending: true }) // For tie-breaking - earliest completion time wins
      .limit(10);
    
    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
    
    console.log("Leaderboard data:", data);
    return data || [];
  } catch (error) {
    console.error('getLeaderboard error:', error);
    return [];
  }
}

// Alias for getLeaderboard to maintain compatibility
export const fetchLeaderboard = getLeaderboard;

// Get user ranking on leaderboard with improved error handling
export async function getUserRanking(userId: string): Promise<number> {
  try {
    if (!userId) {
      console.error('getUserRanking called with empty userId');
      return 0;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .order('score', { ascending: false })
      .order('last_completed_at', { ascending: true }); // For tie-breaking - earliest completion time wins
    
    if (error || !data) {
      console.error('Error fetching user ranking:', error);
      return 0;
    }
    
    const userIndex = data.findIndex(user => user.id === userId);
    return userIndex !== -1 ? userIndex + 1 : 0;
  } catch (error) {
    console.error('getUserRanking error:', error);
    return 0;
  }
}

// Fetch quiz questions from our local data
export async function fetchQuestions(level: number): Promise<QuizQuestion[]> {
  // Filter questions for the requested level
  const levelQuestions = quizQuestions.filter(q => q.level === level);
  return levelQuestions;
}
