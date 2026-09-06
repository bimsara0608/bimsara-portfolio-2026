-- Initial Schema for Portfolio System 2026

CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  name TEXT,
  title TEXT,
  bio TEXT
);

CREATE TABLE projects (
  id UUID PRIMARY KEY,
  title TEXT,
  slug TEXT UNIQUE,
  category TEXT,
  date DATE,
  is_published BOOLEAN DEFAULT false
);

CREATE TABLE project_images (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT,
  is_hero BOOLEAN DEFAULT false
);

CREATE TABLE github_cache (
  repo_name TEXT PRIMARY KEY,
  data JSONB,
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_cache ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Only admins can modify profiles" ON profiles FOR ALL USING (auth.role() = 'authenticated');

-- Projects Policies
CREATE POLICY "Published projects are viewable by everyone" ON projects FOR SELECT USING (is_published = true);
CREATE POLICY "Only admins can modify projects" ON projects FOR ALL USING (auth.role() = 'authenticated');

-- Project Images Policies
CREATE POLICY "Images of published projects are viewable by everyone" ON project_images FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = project_images.project_id AND projects.is_published = true)
);
CREATE POLICY "Only admins can modify project images" ON project_images FOR ALL USING (auth.role() = 'authenticated');

-- GitHub Cache Policies
CREATE POLICY "GitHub cache is viewable by everyone" ON github_cache FOR SELECT USING (true);
CREATE POLICY "Only admins can modify GitHub cache" ON github_cache FOR ALL USING (auth.role() = 'authenticated');
