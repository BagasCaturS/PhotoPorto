-- Migration 005: Add is_hero column to photos table
ALTER TABLE photos ADD COLUMN is_hero boolean NOT NULL DEFAULT false;

-- Ensure only one photo can be hero at a time
CREATE UNIQUE INDEX idx_photos_single_hero ON photos (is_hero) WHERE is_hero = true;
