-- Migration: 20260913010000_experiences.sql
-- Description: Create experiences table with RLS policies and seed data for portfolio

CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  "desc" TEXT NOT NULL,
  active BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public experiences are viewable by everyone"
  ON public.experiences FOR SELECT
  USING (true);

-- Allow authenticated admin full access
CREATE POLICY "Only authenticated users can modify experiences"
  ON public.experiences FOR ALL
  USING (auth.role() = 'authenticated');

-- Auto-update timestamp trigger
CREATE OR REPLACE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed current experiences
INSERT INTO public.experiences (id, title, company, period, "desc", active, sort_order, is_published)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Design Engineer',
    'Freelance',
    '2023 – Present',
    'Specializing in end-to-end product design, parametric SolidWorks CAD, mechanical assemblies, and photorealistic 3D visualization for international clients.',
    true,
    0,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Autonomation Engineering Intern',
    'MAS Bodyline / MAS Holdings',
    'Process Innovation',
    'Engineering projects spanning Zig-Zag auto feeder development, PLC programming, HMI interface design, AGV troubleshooting, yarn break detection, PCB design, CAD modeling, and rapid physical prototyping.',
    false,
    1,
    true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Concept & 3D Designer',
    'Lautus Robotics',
    'Robotics & Automation',
    'Developed concept designs and 3D CAD models and participated in manufacturing and assembly of an AGV for the Civil Aviation Authority of Sri Lanka.',
    false,
    2,
    true
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Co-Founder & Lead 3D Designer',
    'VirtualPensar Pvt Ltd',
    'Design & Visualization',
    'Led 3D design and prototyping, delivering 60+ engineering projects including functional prototypes and 3D-printable components.',
    false,
    3,
    true
  )
ON CONFLICT (id) DO NOTHING;
