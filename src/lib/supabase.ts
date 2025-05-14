
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export { supabase };

export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
  level: number;
  correct_answers: number;
  created_at?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  level: number;
}

// Fetch a user profile by ID
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data as unknown as UserProfile;
  } catch (error) {
    console.error('getUserProfile error:', error);
    return null;
  }
}

// Alias for getUserProfile to maintain compatibility
export const fetchUserProfile = getUserProfile;

// Create a new user profile
export async function createUserProfile(profile: UserProfile): Promise<UserProfile | null> {
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profile.id)
      .single();
    
    if (existingProfile) {
      return existingProfile as unknown as UserProfile;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile as any])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
    
    return data as unknown as UserProfile;
  } catch (error) {
    console.error('createUserProfile error:', error);
    return null;
  }
}

// Update user progress
export async function updateUserProgress(
  userId: string, 
  level: number, 
  correctAnswers: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ level, correct_answers: correctAnswers } as any)
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user progress:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('updateUserProgress error:', error);
    return false;
  }
}

// Fetch leaderboard data (top 10 users by correct answers)
export async function getLeaderboard(): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('correct_answers', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
    
    return data as unknown as UserProfile[];
  } catch (error) {
    console.error('getLeaderboard error:', error);
    return [];
  }
}

// Alias for getLeaderboard to maintain compatibility
export const fetchLeaderboard = getLeaderboard;

// Get user ranking on leaderboard
export async function getUserRanking(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .order('correct_answers', { ascending: false });
    
    if (error || !data) {
      console.error('Error fetching user ranking:', error);
      return 0;
    }
    
    const userIndex = data.findIndex(user => (user as any).id === userId);
    return userIndex !== -1 ? userIndex + 1 : 0;
  } catch (error) {
    console.error('getUserRanking error:', error);
    return 0;
  }
}

// Mock function for fetching quiz questions since we're missing this implementation
export async function fetchQuestions(level: number): Promise<QuizQuestion[]> {
  console.log(`Fetching questions for level ${level}`);
  // This would normally fetch questions from a database
  // Mock implementation for now
  return [
    {
      id: '1',
      question: `Level ${level} Question - Sample question text?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct_answer: 0,
      level: level
    },
    // Additional mock questions would go here
  ];
}
