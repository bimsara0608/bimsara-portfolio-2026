-- Schema V2: Portfolio System 2026 Enhancements
-- Run this AFTER the initial schema (20260906000000_initial_schema.sql)

-- =============================================================
-- 1. EXPAND PROJECTS TABLE
-- =============================================================
ALTER TABLE projects ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenge TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tools TEXT[];
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS year TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS timeline TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS external_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS model_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Allow admins to view ALL projects (not just published ones) for the admin panel
DROP POLICY IF EXISTS "Published projects are viewable by everyone" ON projects;
CREATE POLICY "Published projects are viewable by everyone" ON projects
  FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can view all projects" ON projects
  FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================================
-- 2. EXPAND PROJECT_IMAGES TABLE
-- =============================================================
ALTER TABLE project_images ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE project_images ADD COLUMN IF NOT EXISTS alt_text TEXT;

-- =============================================================
-- 3. CONTACT MESSAGES TABLE (was missing from V1!)
-- =============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit messages" ON contact_messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view messages" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Only admins can update messages" ON contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Only admins can delete messages" ON contact_messages
  FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================================
-- 4. EXPAND PROFILES TABLE
-- =============================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Colombo, Sri Lanka';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_url TEXT DEFAULT 'https://github.com/bimsara0608';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS grabcad_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS resume_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stat_projects TEXT DEFAULT '60+';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stat_experience TEXT DEFAULT '3+';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stat_certification TEXT DEFAULT 'CSWP';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- =============================================================
-- 5. TESTIMONIALS TABLE
-- =============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,
  client_avatar_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published testimonials viewable by all" ON testimonials
  FOR SELECT USING (is_published = true);
CREATE POLICY "Only admins can manage testimonials" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated');

-- =============================================================
-- 6. NEWSLETTER SUBSCRIBERS
-- =============================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view subscribers" ON newsletter_subscribers
  FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================================
-- 7. SITE SETTINGS (key-value store)
-- =============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings viewable by all" ON site_settings
  FOR SELECT USING (true);
CREATE POLICY "Only admins can modify settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
  ('dark_mode_default', 'false'),
  ('maintenance_mode', 'false'),
  ('project_categories', '["Blender 3D", "SolidWorks", "3D Printing", "Drones", "Robotics", "IoT"]')
ON CONFLICT (key) DO NOTHING;

-- =============================================================
-- 8. AUTO-UPDATE timestamp trigger
-- =============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
