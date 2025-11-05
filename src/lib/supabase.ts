import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env file")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Interfaces based on the database schema
export interface Player {
  id: string; // UUID
  auth_id?: string; // UUID, nullable
  display_name: string;
  is_anonymous: boolean;
  total_points: number;
  total_badges: number;
  created_at: string;
  updated_at: string;
}

export interface PlayerProgress {
  id: string; // UUID
  player_id: string; // UUID
  mission_id: string;
  completed: boolean;
  score: number;
  time_spent: number; // in milliseconds
  attempts: number;
  perfect_score: boolean;
  created_at: string;
  updated_at: string;
}

export interface Score {
  id: string; // UUID
  player_id: string; // UUID
  mission_id: string;
  points: number;
  time_bonus: number;
  difficulty_bonus: number;
  streak_bonus: number;
  created_at: string;
}

export interface Badge {
  id: string; // UUID
  player_id: string; // UUID
  badge_type: 'streak_3' | 'perfect_mission' | 'genius_idea' | 'flawless_theme' | 'speed_master' | 'first_mission';
  badge_data: { mission_id?: string };
  earned_at: string;
}

export interface LeaderboardEntry {
  player_id: string;
  total_score: number;
  missions_completed: number;
  average_time: number;
  updated_at: string;
  players: Pick<Player, 'display_name' | 'is_anonymous'>; // Nested player info
}
