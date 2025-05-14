
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export { supabase };

export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
  level: number;
  correct_answers: number;
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
      .insert([profile])
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
      .update({ level, correct_answers: correctAnswers })
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
    
    const userIndex = data.findIndex(user => user.id === userId);
    return userIndex !== -1 ? userIndex + 1 : 0;
  } catch (error) {
    console.error('getUserRanking error:', error);
    return 0;
  }
}
