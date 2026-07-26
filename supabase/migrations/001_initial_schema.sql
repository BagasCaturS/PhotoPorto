-- ============================================================
-- Migration 001: Initial Schema for Photography Portfolio
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. PROFILES TABLE
CREATE TABLE profiles (
  id       uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email    text,
  role     text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user'))
);

-- 2. JOURNALS TABLE
CREATE TABLE journals (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      text NOT NULL,
  slug       text NOT NULL UNIQUE,
  excerpt    text DEFAULT '',
  content    jsonb DEFAULT '[]',
  cover_src  text DEFAULT '',
  tags       jsonb DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_journals_slug ON journals (slug);
CREATE INDEX idx_journals_created_at ON journals (created_at DESC);

-- 3. PHOTOS TABLE
CREATE TABLE photos (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path   text NOT NULL,
  url            text NOT NULL,
  filename       text,
  selected       boolean NOT NULL DEFAULT false,
  display_order  integer NOT NULL
);

CREATE INDEX idx_photos_display_order ON photos (display_order ASC);

-- 4. ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journals  ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos    ENABLE ROW LEVEL SECURITY;

-- 5. RLS: PROFILES
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 6. RLS: JOURNALS (public read, admin write)
CREATE POLICY "Public can read journals"
  ON journals FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert journals"
  ON journals FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can update journals"
  ON journals FOR UPDATE
  USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can delete journals"
  ON journals FOR DELETE
  USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 7. RLS: PHOTOS (public read, admin write)
CREATE POLICY "Public can read photos"
  ON photos FOR SELECT
  USING (true);

CREATE POLICY "Admin can insert photos"
  ON photos FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can update photos"
  ON photos FOR UPDATE
  USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can delete photos"
  ON photos FOR DELETE
  USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 8. TRIGGER: Auto-create profile on sign-up
-- First user gets 'admin', all subsequent get 'user'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE
      WHEN (SELECT COUNT(*) FROM public.profiles) = 0 THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 9. STORAGE BUCKET: photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view photos bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'photos');

CREATE POLICY "Admin can upload to photos bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'photos'
    AND auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can delete from photos bucket"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'photos'
    AND auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
