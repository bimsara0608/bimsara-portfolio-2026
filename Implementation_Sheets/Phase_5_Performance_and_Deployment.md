# Phase 5: Performance, Observability, and Deployment

## 5.1 Performance Optimization (Minimal Loading Times)
**Goal:** Adhere to `release-and-operations` skills for sub-second load times.
- **Image Optimization:** 
  - Use Next.js `<Image>` component for automatic WebP conversion, resizing, and lazy loading.
  - Set strict `width` and `height` to prevent Cumulative Layout Shift (CLS).
- **3D Asset Loading:** 
  - Host `.glb` files on Supabase CDN. Use `poster` images in `<model-viewer>` so the 3D model only loads on user interaction.
- **Data Caching:** 
  - Cache heavy DB queries (like featured projects) using Next.js `unstable_cache` or `fetch` caching with specific revalidation tags.
- **Bundle Size:**
  - Dynamically import heavy libraries (e.g., `model-viewer`, markdown parsers) only on the pages that need them using `next/dynamic`.

## 5.2 SEO and Structured Data
**Goal:** Maximize discoverability for jobs and freelance work.
- **Dynamic Metadata:** Generate title, description, and OpenGraph (OG) images dynamically for every project page.
- **JSON-LD:** Add structured data for `Person` on the homepage and `CreativeWork` on project pages to enhance Google search snippets.
- **Sitemap & Robots:** Automatically generate `sitemap.xml` and configure `robots.txt` to exclude `/admin`.

## 5.3 Observability and Error Handling
**Goal:** Don't let the system fail silently.
- **Error Boundaries:** Implement React Error Boundaries to catch UI crashes gracefully and show a branded fallback UI.
- **Structured Error Logging:** Log server action failures with correlation IDs. (Do not leak stack traces to the client).
- **Analytics:** Integrate Vercel Web Vitals and Vercel Analytics (or Google Analytics) to monitor traffic and performance metrics.

## 5.4 Final Release and Operations
**Goal:** Deploy to production flawlessly.
- **Pre-flight Checks:**
  - Run full test suite (Unit tests).
  - Run Lighthouse audit (Target: 95+ in Performance, Accessibility, SEO, Best Practices).
- **Vercel Deployment:**
  - Connect GitHub repo to Vercel.
  - Setup production environment variables.
  - Ensure custom domain is mapped and SSL/TLS is active.
- **Post-Deploy Smoke Test:** Verify public routing, contact form submission, and admin login on production.
