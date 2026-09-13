-- Migration: 20260913000000_education.sql
-- Description: Create education table with RLS policies for portfolio

CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  degree TEXT,
  field_of_study TEXT,
  start_date TEXT,
  end_date TEXT,
  period TEXT,
  grade TEXT,
  activities TEXT,
  description TEXT,
  logo_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE education ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public education entries are viewable by everyone"
  ON education FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can modify education"
  ON education FOR ALL
  USING (auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE OR REPLACE TRIGGER update_education_updated_at
  BEFORE UPDATE ON education
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
