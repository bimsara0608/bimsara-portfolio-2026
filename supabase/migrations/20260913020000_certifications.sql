-- Migration: 20260913020000_certifications.sql
-- Description: Create certifications table with RLS policies and seed data for portfolio

CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  credential_id TEXT,
  credential_url TEXT,
  badge_url TEXT,
  skills TEXT,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public certifications are viewable by everyone"
  ON public.certifications FOR SELECT
  USING (true);

-- Allow authenticated admin full access
CREATE POLICY "Only authenticated users can modify certifications"
  ON public.certifications FOR ALL
  USING (auth.role() = 'authenticated');

-- Auto-update timestamp trigger
CREATE OR REPLACE TRIGGER update_certifications_updated_at
  BEFORE UPDATE ON public.certifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed the CSWP certification
INSERT INTO public.certifications (
  id,
  title,
  issuer,
  issue_date,
  credential_id,
  credential_url,
  badge_url,
  skills,
  sort_order,
  is_published
)
VALUES (
  '55555555-5555-5555-5555-555555555555',
  'Certified SOLIDWORKS Professional (CSWP)',
  'Dassault Systèmes',
  'Issued May 2026',
  'C-29RCXDMEHU',
  'https://cv.virtualtester.com/qr/?b=SLDWRKS&i=C-29RCXDMEHU',
  '/images/certifications/cswp.png',
  '3D Modeling, Computer-Aided Design (CAD), Parametric Modeling',
  0,
  true
)
ON CONFLICT (id) DO NOTHING;
