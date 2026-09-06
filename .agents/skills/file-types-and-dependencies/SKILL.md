---
name: file-types-and-dependencies
description: Use when creating or editing config files, Dockerfiles, CI pipeline files, database migrations, SQL, package manifests, static assets, or log output — or whenever a new dependency is being added.
---

# File-Type Rules & Dependency Management

| File type | Required checks / optimizations |
|---|---|
| Source code | Linted & auto-formatted; type-checked where supported; no debug prints in committed code; complexity kept low |
| Config (`.env`, `.yaml`, `.json`, `.toml`, `.ini`) | No secrets committed; `.env.example` maintained with dummy values; validated against a schema where possible |
| Dockerfiles/container configs | Multi-stage builds; non-root user; minimal base image; pinned base image version; image scanned |
| CI/CD pipeline files | Pinned action/tool versions (not `@latest`/`@main`); least-privilege tokens/permissions; no plaintext secrets |
| Database migrations | Reversible (up/down); timestamped and ordered; tested against production-like data volume before merge |
| SQL files | Parameterized only; new query patterns checked against existing indexes |
| Package manifests | Lockfile committed; versions pinned for production dependencies; audited for known vulnerabilities |
| Static assets | Compressed; modern formats where supported (WebP/AVIF, SVG for icons); responsive sizes; lazy-loaded; images have alt text |
| Test files | Mirror source structure; deterministic; isolated from each other |
| Log output | Never committed; structured; rotated; free of PII/secrets |
| Build artifacts/binaries | Excluded via `.gitignore`; not committed; Git LFS if a binary genuinely must be versioned |
| Environment/secret files (`.env`, `*.pem`, `*.key`) | Always `.gitignore`d; never present in git history (checked, not assumed) |

## Dependency & Supply Chain Management
- New dependencies are a deliberate decision: check maintenance status, license compatibility, and known vulnerabilities before adding.
- Lockfiles always committed and respected — no floating versions in production dependency trees.
- Automated vulnerability scanning on every build; critical/high findings block release.
- Prefer well-maintained dependencies over "more elegant" unmaintained ones.
- Remove unused dependencies when found.
