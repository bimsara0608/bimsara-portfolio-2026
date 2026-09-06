# Phase 3: Public Portfolio Features

## 3.1 Homepage
**Goal:** Implement the high-impact landing page.
- **Hero Section:** Large Poppins text, circular profile photo, "Open to Work" pill.
- **Stats Row:** Grid layout for 60+ Projects, 3+ Years, etc. Implement intersection observer for count-up animation on scroll.
- **Services ("What I Can Help With"):** List layout with bottom borders and small thumbnail images.
- **Featured Projects:** 2x2 grid fetching `is_published = true AND featured = true` from Supabase.

## 3.2 Projects & Gallery Pages
**Goal:** Browse all work seamlessly.
- **Filterable Grid:** 
  - Tabs (All, Blender 3D, SolidWorks, etc.) using URL search params (`?category=drones`) for shareable links and SSR.
  - 3-column responsive grid of project cards.
- **Project Detail Page (Case Study):**
  - Dynamic routing (`/projects/[slug]`).
  - Hero image, two-column challenge/metadata layout.
  - Masonry or grid layout for extra gallery images.
- **3D Model Viewer:**
  - Integrate `@google/model-viewer` for projects with `.glb` assets.
  - Lazy load the viewer to prevent main thread blocking.

## 3.3 GitHub Integration Page
**Goal:** Showcase live code and hardware repos.
- **API Integration:**
  - Server-side fetch from GitHub REST API (`/users/bimsara0608/repos`).
  - Cache responses in Supabase `github_cache` to avoid rate limits. Update via background cron or revalidate every 12 hours.
- **UI:**
  - Profile card with contribution heatmap (using `react-github-calendar`).
  - Grid of repo cards showing languages, stars.
  - Modal or accordion to fetch and render `README.md` using `react-markdown`.

## 3.4 3D Printing & About Pages
**Goal:** Showcase physical prototypes and personal journey.
- **About Page:** Split layout bio, horizontal experience cards (sharp corners), typographic capabilities scale, circular toolbox icons.
- **3D Printing Showcase:** Image comparison component (CAD vs Print) using a slider or side-by-side layout.

## 3.5 Contact Form & Chatbot
**Goal:** Enable client communication.
- **Contact Form:** Use Server Actions to handle submission. Store in Supabase `contact_messages` table. Send email notification via Resend.
- **AI Chatbot (Optional/Future):** RAG pipeline using Supabase pgvector and Gemini/OpenAI API. Embed floating widget.
