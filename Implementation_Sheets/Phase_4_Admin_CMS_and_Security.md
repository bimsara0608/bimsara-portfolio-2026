# Phase 4: Admin CMS and Security

## 4.1 Admin Authentication
**Goal:** Secure the CMS area.
- **Supabase Auth:** Email/password login.
- **Middleware Protection:** Create Next.js `middleware.ts` to block access to `/admin/*` routes if no valid session exists.
- **Authorization:** Validate that the logged-in user UUID matches the hardcoded admin UUID (ensure only YOU can access it).

## 4.2 Content Management Dashboard
**Goal:** Allow easy updates without code changes.
- **Admin Layout:** Separate UI from the public site. Functional sidebar (Projects, Experience, Skills, Messages).
- **Project CRUD:**
  - Forms using `react-hook-form` and `zod` for validation.
  - Image Uploads: Upload to Supabase Storage, generate public URL, save to `project_images` table.
  - Support drag-and-drop ordering.
- **Profile/Experience CRUD:**
  - Manage bio, CV link, experience timeline entries.

## 4.3 Enterprise Security Enforcement
**Goal:** Adhere strictly to the `security-review` agent skills.
- **Input Validation:** All server actions MUST validate input using Zod before interacting with the database. (No trusting client-side validation).
- **SQL Injection Prevention:** Use Supabase ORM/client methods exclusively (parameterized under the hood).
- **XSS Prevention:** Next.js sanitizes React by default, but ensure any Markdown rendering (GitHub READMEs, blog posts) uses a sanitizer (e.g., `rehype-sanitize`).
- **Rate Limiting:** Implement rate limiting on the Contact Form submit action (e.g., 5 submissions per hour per IP) using Upstash Redis or Supabase edge functions to prevent spam.

## 4.4 Data Protection
- **Secrets Management:** Ensure API keys (GitHub, Email provider, Supabase Service Role) are strictly stored in Vercel Environment Variables.
- **File Upload Security:** Validate file types (only `.png`, `.jpg`, `.glb`, `.pdf`) and sizes (< 20MB) server-side before uploading to Supabase Storage.
