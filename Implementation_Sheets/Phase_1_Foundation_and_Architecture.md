# Phase 1: Foundation and Enterprise Architecture

## 1.1 Project Initialization & Tech Stack
**Goal:** Establish a robust, scalable foundation using Next.js and Supabase.
- **Framework:** Initialize Next.js 15 (App Router) with TypeScript.
  - `npx create-next-app@latest portfolio-2026 --typescript --tailwind --eslint`
- **Linting & Formatting:** Enforce enterprise standards.
  - Configure `eslint` with strict rules (no `any`, exhaustive deps).
  - Configure `prettier` for consistent formatting.
  - Setup `husky` and `lint-staged` for pre-commit hooks to ensure code quality before pushing.
- **State Management & Data Fetching:**
  - Use React Server Components (RSC) by default for performance and SEO.
  - Use Server Actions for mutations (form submissions, CMS updates).

## 1.2 Supabase Database Setup & Schema
**Goal:** Setup relational data structure with strict ownership.
- **Initialization:** Create a Supabase project. Configure local development with Supabase CLI.
- **Schema Definitions:**
  ```sql
  -- Core Tables
  CREATE TABLE profiles (id UUID PRIMARY KEY, name TEXT, title TEXT, bio TEXT);
  CREATE TABLE projects (id UUID PRIMARY KEY, title TEXT, slug TEXT UNIQUE, category TEXT, date DATE, is_published BOOLEAN);
  CREATE TABLE project_images (id UUID PRIMARY KEY, project_id UUID REFERENCES projects(id), url TEXT, is_hero BOOLEAN);
  CREATE TABLE github_cache (repo_name TEXT PRIMARY KEY, data JSONB, last_synced TIMESTAMP);
  ```
- **Migrations:** Use Supabase CLI to track schema changes in `supabase/migrations`.
- **Row Level Security (RLS):**
  - Enable RLS on all tables.
  - `projects`: Public read access where `is_published = true`. Admin full access.
  - `profiles`: Public read access. Admin full access.

## 1.3 Security & Environment Configuration
**Goal:** Protect secrets and establish a secure baseline.
- **Environment Variables:**
  - Define `.env.local` for local dev, configure Vercel/Supabase for prod.
  - Never commit `.env` files. Validate env vars at startup using Zod.
- **Security Headers:**
  - Configure `next.config.js` with headers: `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.

## 1.4 CI/CD Pipeline Setup
**Goal:** Automate testing and deployment gates.
- **GitHub Actions Workflow:**
  - **Lint & Typecheck:** Run `npm run lint` and `tsc --noEmit`.
  - **Tests:** Run unit tests (Jest/Vitest).
  - **Security Scan:** Run `npm audit` or Dependabot to catch vulnerable dependencies.
  - **Vercel Preview:** Automatically deploy PRs to a preview URL.
  - **Merge Gate:** Require all checks to pass before merging to `main`.
