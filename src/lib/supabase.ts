import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { quizQuestions } from '../data/quizQuestions';

export { supabase } from '@/integrations/supabase/client';

// Define our own types that match our actual database structure
// These will be used instead of the generated types which are currently empty
export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  level: number | null;
  correct_answers: number | null;
  created_at: string | null;
  discord_username?: string | null;
  twitter_username?: string | null;
}

export interface QuizQuestion {
  id: string | number;
  question: string;
  options: string[];
  correct_answer: number;
  level: number;
}

// Create a typed client
const typedSupabase = createClient<Database>(
  "https://wwxmmwolrgrgcziigkil.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3eG1td29scmdyZ2N6aWlna2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxODkzNzYsImV4cCI6MjA2Mjc2NTM3Nn0.YG-ghxb1uX2IZo5kQJFMhtXMg8hTF2Z3pHU-s5LBsSE"
);

// Fetch a user profile by ID
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await typedSupabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
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
    const { data: existingProfile } = await typedSupabase
      .from('profiles')
      .select('*')
      .eq('id', profile.id)
      .single();
    
    if (existingProfile) {
      return existingProfile;
    }
    
    const { data, error } = await typedSupabase
      .from('profiles')
      .insert([{
        id: profile.id,
        username: profile.username,
        avatar_url: profile.avatar_url,
        level: profile.level,
        correct_answers: profile.correct_answers
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('createUserProfile error:', error);
    return null;
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  profileData: Partial<Omit<UserProfile, 'id' | 'created_at'>>
): Promise<UserProfile | null> {
  try {
    const { data, error } = await typedSupabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('updateUserProfile error:', error);
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
    const { error } = await typedSupabase
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
    const { data, error } = await typedSupabase
      .from('profiles')
      .select('*')
      .order('correct_answers', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
    
    return data;
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
    const { data, error } = await typedSupabase
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

// Fetch quiz questions from our local data
export async function fetchQuestions(level: number): Promise<QuizQuestion[]> {
  // Filter questions for the requested level
  const levelQuestions = quizQuestions.filter(q => q.level === level);
  return levelQuestions;
}
