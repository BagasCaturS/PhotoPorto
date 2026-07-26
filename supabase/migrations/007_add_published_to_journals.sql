ALTER TABLE journals ADD COLUMN published boolean NOT NULL DEFAULT true;

CREATE INDEX idx_journals_published ON journals (published);
