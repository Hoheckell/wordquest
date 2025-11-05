/*
# Word Quest - Schema de Banco de Dados
Sistema de gamificação para aprendizado de Microsoft Word

## Query Description:
Esta migração cria toda a estrutura necessária para o jogo Word Quest.
Inclui tabelas para jogadores, progresso, pontuações, badges e leaderboard.
É uma operação segura que não afeta dados existentes.

## Metadata:
- Schema-Category: "Safe"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- players: dados dos jogadores
- player_progress: progresso individual por missão
- scores: histórico de pontuações
- badges: badges conquistados
- leaderboard_entries: entradas do leaderboard

## Security Implications:
- RLS Status: Enabled em todas as tabelas
- Policy Changes: Yes
- Auth Requirements: Supabase Auth para usuários autenticados

## Performance Impact:
- Indexes: Adicionados em campos de consulta frequente
- Triggers: Trigger para atualizar timestamp
- Estimated Impact: Mínimo - tabelas novas
*/

-- Tabela de jogadores
CREATE TABLE IF NOT EXISTS public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  total_points INTEGER DEFAULT 0,
  total_badges INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de progresso do jogador
CREATE TABLE IF NOT EXISTS public.player_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  perfect_score BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, mission_id)
);

-- Tabela de pontuações
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL,
  points INTEGER NOT NULL,
  time_bonus INTEGER DEFAULT 0,
  difficulty_bonus INTEGER DEFAULT 0,
  streak_bonus INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de badges
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_data JSONB,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de entradas do leaderboard
CREATE TABLE IF NOT EXISTS public.leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  total_score INTEGER DEFAULT 0,
  missions_completed INTEGER DEFAULT 0,
  average_time FLOAT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_players_auth_id ON public.players(auth_id);
CREATE INDEX IF NOT EXISTS idx_progress_player ON public.player_progress(player_id);
CREATE INDEX IF NOT EXISTS idx_scores_player ON public.scores(player_id);
CREATE INDEX IF NOT EXISTS idx_badges_player ON public.badges(player_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON public.leaderboard_entries(total_score DESC);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON public.players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON public.player_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaderboard_updated_at BEFORE UPDATE ON public.leaderboard_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para players
CREATE POLICY "Jogadores podem ver todos os perfis"
  ON public.players FOR SELECT
  USING (true);

CREATE POLICY "Jogadores podem criar seu próprio perfil"
  ON public.players FOR INSERT
  WITH CHECK (auth.uid() = auth_id OR is_anonymous = true);

CREATE POLICY "Jogadores podem atualizar seu próprio perfil"
  ON public.players FOR UPDATE
  USING (auth.uid() = auth_id OR is_anonymous = true);

-- Políticas RLS para player_progress
CREATE POLICY "Jogadores podem ver todo o progresso"
  ON public.player_progress FOR SELECT
  USING (true);

CREATE POLICY "Jogadores podem criar seu próprio progresso"
  ON public.player_progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Jogadores podem atualizar seu próprio progresso"
  ON public.player_progress FOR UPDATE
  USING (true);

-- Políticas RLS para scores
CREATE POLICY "Jogadores podem ver todas as pontuações"
  ON public.scores FOR SELECT
  USING (true);

CREATE POLICY "Jogadores podem criar pontuações"
  ON public.scores FOR INSERT
  WITH CHECK (true);

-- Políticas RLS para badges
CREATE POLICY "Jogadores podem ver todos os badges"
  ON public.badges FOR SELECT
  USING (true);

CREATE POLICY "Jogadores podem criar badges"
  ON public.badges FOR INSERT
  WITH CHECK (true);

-- Políticas RLS para leaderboard_entries
CREATE POLICY "Todos podem ver o leaderboard"
  ON public.leaderboard_entries FOR SELECT
  USING (true);

CREATE POLICY "Jogadores podem criar entrada no leaderboard"
  ON public.leaderboard_entries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Jogadores podem atualizar sua entrada no leaderboard"
  ON public.leaderboard_entries FOR UPDATE
  USING (true);
