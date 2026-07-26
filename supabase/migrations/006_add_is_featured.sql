-- Migration 006: Add is_featured column to photos table
ALTER TABLE photos ADD COLUMN is_featured boolean NOT NULL DEFAULT false;
