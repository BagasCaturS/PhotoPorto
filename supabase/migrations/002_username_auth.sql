-- Migration 002: Replace email with username in profiles table
-- Run this AFTER 001_initial_schema.sql

-- Add username column
ALTER TABLE profiles ADD COLUMN username text;

-- Copy existing email values into username (they contain usernames since we pass username as email to Auth)
UPDATE profiles SET username = email;

-- Make username required and unique
ALTER TABLE profiles ALTER COLUMN username SET NOT NULL;
ALTER TABLE profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);

-- Drop email column (no longer needed)
ALTER TABLE profiles DROP COLUMN email;

-- Update the trigger function to set username instead of email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  user_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.profiles;
  INSERT INTO public.profiles (id, username, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    CASE WHEN user_count = 0 THEN 'admin' ELSE 'user' END
  );
  RETURN NEW;
END;
$$;
