-- Migration 004: Add title, description, category columns to photos table
ALTER TABLE photos
  ADD COLUMN title       text DEFAULT '',
  ADD COLUMN description text DEFAULT '',
  ADD COLUMN category    text DEFAULT '';
