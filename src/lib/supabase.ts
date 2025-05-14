
import { supabase } from '@/integrations/supabase/client';

export { supabase };

export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
  level: number;
  correct_answers: number;
  created_at: string;
}

export interface QuizQuestion {
  id: number;
  level: number;
  question: string;
  options: string[];
  correct_answer: number;
}

export async function fetchUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data as UserProfile;
}

export async function createUserProfile(userId: string, username: string, avatarUrl: string) {
  const { error } = await supabase
    .from('profiles')
    .insert([
      { 
        id: userId,
        username,
        avatar_url: avatarUrl,
        level: 1,
        correct_answers: 0
      }
    ]);

  if (error) {
    console.error('Error creating user profile:', error);
    return false;
  }
  
  return true;
}

export async function updateUserProgress(userId: string, level: number, correctAnswers: number) {
  const { error } = await supabase
    .from('profiles')
    .update({
      level,
      correct_answers: correctAnswers
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user progress:', error);
    return false;
  }
  
  return true;
}

export async function fetchQuestions(level: number) {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('level', level)
    .order('id');

  if (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
  
  return data as QuizQuestion[];
}

export async function fetchLeaderboard() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('correct_answers', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
  
  return data as UserProfile[];
}
