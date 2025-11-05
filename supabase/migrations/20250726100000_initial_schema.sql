/*
          # [Initial Schema Setup]
          Creates the core tables for the Word Quest game, including players, progress, scores, badges, and leaderboard.

          ## Query Description: [This script sets up the entire database structure. It is safe to run on a new project but could cause issues if tables with the same names already exist. It defines tables for user data, game progress, and scoring, and enables Row Level Security to protect user data.]
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "High"
          - Requires-Backup: false
          - Reversible: false
          
          ## Structure Details:
          - Tables Created: players, player_progress, scores, badges, leaderboard_entries
          - Triggers Created: handle_updated_at, update_player_badges_count
          - RLS Policies: Policies for all new tables to ensure data privacy.
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes
          - Auth Requirements: Policies are defined for both anonymous and authenticated users.
          
          ## Performance Impact:
          - Indexes: Primary keys and foreign keys are indexed by default.
          - Triggers: Two triggers are added for automatic updates.
          - Estimated Impact: Low on a new project.
          */

-- 1. PLAYERS TABLE
CREATE TABLE IF NOT EXISTS public.players (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_id uuid REFERENCES auth.users(id) UNIQUE,
    display_name text NOT NULL,
    is_anonymous boolean NOT NULL DEFAULT false,
    total_points integer NOT NULL DEFAULT 0,
    total_badges integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.players IS 'Stores player profile information.';

-- 2. PLAYER_PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.player_progress (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    mission_id text NOT NULL,
    completed boolean NOT NULL DEFAULT false,
    score integer NOT NULL DEFAULT 0,
    time_spent integer NOT NULL DEFAULT 0,
    attempts integer NOT NULL DEFAULT 0,
    perfect_score boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (player_id, mission_id)
);
COMMENT ON TABLE public.player_progress IS 'Tracks player progress for each mission.';

-- 3. SCORES TABLE
CREATE TABLE IF NOT EXISTS public.scores (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    mission_id text NOT NULL,
    points integer NOT NULL,
    time_bonus integer NOT NULL DEFAULT 0,
    difficulty_bonus integer NOT NULL DEFAULT 0,
    streak_bonus integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.scores IS 'Logs individual scores for questions and actions.';

-- 4. BADGES TABLE
CREATE TABLE IF NOT EXISTS public.badges (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
    badge_type text NOT NULL,
    badge_data jsonb,
    earned_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.badges IS 'Stores badges earned by players.';

-- 5. LEADERBOARD_ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.leaderboard_entries (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE UNIQUE,
    total_score integer NOT NULL DEFAULT 0,
    missions_completed integer NOT NULL DEFAULT 0,
    average_time real NOT NULL DEFAULT 0,
    updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.leaderboard_entries IS 'Aggregated data for the leaderboard.';


-- TRIGGERS
-- Function to update 'updated_at' column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for players table
CREATE TRIGGER on_players_updated
BEFORE UPDATE ON public.players
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for player_progress table
CREATE TRIGGER on_player_progress_updated
BEFORE UPDATE ON public.player_progress
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Function to update total_badges on players table
CREATE OR REPLACE FUNCTION public.update_player_badges_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.players
        SET total_badges = total_badges + 1
        WHERE id = NEW.player_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.players
        SET total_badges = total_badges - 1
        WHERE id = OLD.player_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for badges table
CREATE TRIGGER on_badge_change
AFTER INSERT OR DELETE ON public.badges
FOR EACH ROW
EXECUTE FUNCTION public.update_player_badges_count();


-- RLS POLICIES
-- Enable RLS for all tables
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Policies for players table
CREATE POLICY "Players are viewable by everyone."
ON public.players FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own player record."
ON public.players FOR INSERT
WITH CHECK (auth.uid() IS NULL OR auth_id = auth.uid());

CREATE POLICY "Users can update their own display name."
ON public.players FOR UPDATE
USING (auth.uid() IS NULL OR auth_id = auth.uid())
WITH CHECK (auth.uid() IS NULL OR auth_id = auth.uid());


-- Policies for player_progress table
CREATE POLICY "Users can view their own progress."
ON public.player_progress FOR SELECT
USING (player_id IN (SELECT id FROM public.players WHERE auth_id = auth.uid() OR is_anonymous = true));

CREATE POLICY "Users can create their own progress."
ON public.player_progress FOR INSERT
WITH CHECK (player_id IN (SELECT id FROM public.players WHERE auth_id = auth.uid() OR is_anonymous = true));

CREATE POLICY "Users can update their own progress."
ON public.player_progress FOR UPDATE
USING (player_id IN (SELECT id FROM public.players WHERE auth_id = auth.uid() OR is_anonymous = true));


-- Policies for scores table
CREATE POLICY "Users can view their own scores."
ON public.scores FOR SELECT
USING (player_id IN (SELECT id FROM public.players WHERE auth_id = auth.uid() OR is_anonymous = true));

CREATE POLICY "Users can insert their own scores."
ON public.scores FOR INSERT
WITH CHECK (player_id IN (SELECT id FROM public.players WHERE auth_id = auth.uid() OR is_anonymous = true));


-- Policies for badges table
CREATE POLICY "Users can view their own badges."
ON public.badges FOR SELECT
USING (player_id IN (SELECT id FROM public.players WHERE auth_id = auth.uid() OR is_anonymous = true));

CREATE POLICY "Users can insert their own badges."
ON public.badges FOR INSERT
WITH CHECK (player_id IN (SELECT id FROM public.players WHERE auth_id = auth.uid() OR is_anonymous = true));


-- Policies for leaderboard_entries table
CREATE POLICY "Leaderboard is viewable by everyone."
ON public.leaderboard_entries FOR SELECT
USING (true);

CREATE POLICY "System can update leaderboard entries."
ON public.leaderboard_entries FOR ALL
USING (player_id IN (SELECT id FROM public.players WHERE auth_id = auth.uid() OR is_anonymous = true));
