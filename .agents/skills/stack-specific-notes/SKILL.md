---
name: stack-specific-notes
description: Use to apply language- or framework-specific conventions alongside the core standards — JavaScript/TypeScript, Python, Java/Kotlin, Go, frontend frameworks, or mobile platforms.
---

# Stack-Specific Notes

Quick pointers only — AGENTS.md and the other skills always apply on top of these.

- **Node/TypeScript:** `tsc --strict`; ESLint + Prettier; Zod/Joi for runtime validation at boundaries; `npm audit`/lockfile committed; avoid `any`.
- **Python:** `mypy` or equivalent; `black` + `ruff`/`flake8`; `pytest` with fixtures over ad hoc setup; `pip-audit`; pinned lockfile (`poetry.lock`/`requirements.txt`).
- **Java/Kotlin:** Checkstyle/ktlint; JUnit5 + Mockito; Maven/Gradle version catalogs; OWASP Dependency-Check.
- **Go:** `go vet` + `staticcheck`; table-driven tests; `go mod tidy` and `govulncheck`; explicit error wrapping (`%w`), no ignored errors.
- **Frontend (React/Vue/etc.):** Component-level tests (Testing Library) over implementation-detail tests; accessibility linting (`eslint-plugin-jsx-a11y`/axe); bundle size budgets; CSP-compatible code.
- **Mobile (iOS/Android):** Platform-native secure storage for tokens (Keychain/Keystore), never plain preferences for secrets; background/foreground state handled explicitly; store review guidelines checked before release-blocking work.
