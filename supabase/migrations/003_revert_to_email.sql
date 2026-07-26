-- Migration 003: Revert to email-based auth
-- Run this ONLY if you already ran 002_username_auth.sql

-- Re-add email column
ALTER TABLE profiles ADD COLUMN email text;

-- Copy username values into email
UPDATE profiles SET email = username;

-- Make email required
ALTER TABLE profiles ALTER COLUMN email SET NOT NULL;

-- Drop username column
ALTER TABLE profiles DROP COLUMN username;

-- Drop the unique constraint on username (it's dropped with the column)
-- Restore email field in trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  user_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE WHEN user_count = 0 THEN 'admin' ELSE 'user' END
  );
  RETURN NEW;
END;
$$;
