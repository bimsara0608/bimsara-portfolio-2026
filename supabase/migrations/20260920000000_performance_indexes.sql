-- Performance Optimization: B-Tree Indexes
-- Migration: 20260920000000_performance_indexes.sql

-- Projects Table Indexes
CREATE INDEX IF NOT EXISTS idx_projects_is_published ON projects (is_published);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects (featured);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects (sort_order ASC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects (slug);

-- Project Images Indexes (Foreign Key and filtering)
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images (project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_hero ON project_images (project_id, is_hero);
CREATE INDEX IF NOT EXISTS idx_project_images_sort_order ON project_images (sort_order ASC);

-- Testimonials Indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials (is_published, sort_order ASC);

-- Contact Messages Indexes (Admin queries)
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages (is_read);

-- CV Sections Indexes
CREATE INDEX IF NOT EXISTS idx_education_sort_order ON education (sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_experiences_sort_order ON experiences (sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_certifications_sort_order ON certifications (sort_order ASC);
