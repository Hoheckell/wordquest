/*
# [Function] Create get_or_create_player

This migration creates a new PostgreSQL function `get_or_create_player` to handle the creation and retrieval of player profiles. This function is called from the welcome screen to either find an existing named player or create a new player (either named or anonymous).

## Query Description:
This operation adds a new function to the database. It is a non-destructive operation and does not affect any existing data. It fixes a bug where the frontend was trying to call a function that did not exist. This function also sets the `search_path` explicitly to address a security warning.

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Adds function: `public.get_or_create_player(p_display_name text, p_is_anonymous boolean)`

## Security Implications:
- RLS Status: Not changed.
- Policy Changes: No.
- Auth Requirements: The function is callable by `anon` and `authenticated` roles. It runs with `SECURITY DEFINER` privileges to handle record creation safely.

## Performance Impact:
- Indexes: None.
- Triggers: None.
- Estimated Impact: Negligible. The function performs simple SELECT or INSERT operations.
*/

CREATE OR REPLACE FUNCTION public.get_or_create_player(p_display_name text, p_is_anonymous boolean)
RETURNS players AS $$
DECLARE
  v_player players;
BEGIN
  -- Secure the search path to prevent hijacking, addressing the 'Function Search Path Mutable' warning.
  SET search_path = public;

  IF p_is_anonymous THEN
    -- For anonymous players, we always create a new record as their name is randomized client-side.
    INSERT INTO players (display_name, is_anonymous)
    VALUES (p_display_name, true)
    RETURNING * INTO v_player;
  ELSE
    -- For named players, first try to find an existing non-anonymous player with the same name.
    SELECT * INTO v_player
    FROM players
    WHERE display_name = p_display_name AND is_anonymous = false
    LIMIT 1;

    -- If no existing player is found, create a new one.
    IF v_player IS NULL THEN
      INSERT INTO players (display_name, is_anonymous)
      VALUES (p_display_name, false)
      RETURNING * INTO v_player;
    END IF;
  END IF;

  RETURN v_player;
END;
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;

-- Grant execution rights to the roles that will call this function from the client.
GRANT EXECUTE ON FUNCTION public.get_or_create_player(text, boolean) TO anon;
GRANT EXECUTE ON FUNCTION public.get_or_create_player(text, boolean) TO authenticated;
