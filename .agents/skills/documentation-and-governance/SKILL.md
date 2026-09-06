---
name: documentation-and-governance
description: Use when finalizing a pull request, writing commit messages, updating documentation, or making a change that touches database schema, data retention, PII classification, or other compliance-sensitive concerns.
---

# Documentation & Governance

## Documentation Requirements
Every repository maintains, and every change keeps current:
- `README.md` — what it is, how to run it locally, how to test it
- `ARCHITECTURE.md` — system overview, major components, key decisions (or a link to ADRs)
- `SECURITY.md` — how to report a vulnerability, supported versions
- `CHANGELOG.md` — human-readable list of notable changes per release
- API documentation (OpenAPI/Swagger, GraphQL schema docs, or equivalent) updated alongside the code
- Inline comments explain *why*, not *what*

## Data Management & Compliance
- Schema changes are versioned migrations, never manual/ad hoc changes against production.
- Backups are automated and periodically test-restored.
- PII/PHI classified explicitly in the data model; access to it logged; retention has a defined limit, not "forever by default."
- Right-to-deletion/data export supported where GDPR/CCPA-style obligations apply.
- Sensitive fields encrypted at the column/field level where risk posture requires it.

## Version Control & Collaboration
- Commit messages describe intent (what and why). Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`) is a good default.
- Branches are short-lived and scoped to one logical change.
- No direct commits to `main`/`master` — go through a reviewable PR, even for agent-authored changes.
- PR descriptions state: what changed, why, how it was tested, and any risk/rollback notes.
- No force-push to shared branches; no rewriting history others have pulled.
