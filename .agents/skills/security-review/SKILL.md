---
name: security-review
description: Use whenever a change touches authentication, authorization, payments, PII, user-submitted input, file uploads, external network calls, admin actions, or session/token handling — or whenever a security scan flags a finding. Contains the full requirement checklist; any critical/high gap blocks merge.
---

# Security Review

Treat every input as hostile, every dependency as a potential attack surface, and every secret as already at risk if not actively protected.

| Category | Requirement |
|---|---|
| Input validation | Validate and sanitize all input server-side using allow-lists, never deny-lists. Never trust client-side validation alone. |
| Injection prevention | Parameterized queries/prepared statements only. No string-concatenated SQL, shell commands, or LDAP/XPath queries. |
| Authentication | Strong password hashing (Argon2id or bcrypt, never MD5/SHA1/plain). Support MFA. Rate-limit and lock out after repeated failures. |
| Authorization | Least privilege, deny-by-default. Re-check authorization server-side on every request — never trust a client-supplied role/ID. |
| Session management | Secure, `HttpOnly`, `SameSite` cookies. Short-lived access tokens, rotate on privilege change, invalidate on logout. |
| Secrets management | Never hardcoded or committed. Use a secret manager/vault or environment injection. Rotate on a schedule and immediately on suspected leak. |
| Transport security | TLS 1.2+ everywhere, HSTS enabled, no mixed content. |
| Data at rest | Encrypt PII/sensitive fields (AES-256 or equivalent). Encrypt backups. |
| XSS | Escape/encode output by context. Content-Security-Policy header set. Sanitize rendered rich text/HTML. |
| CSRF | Anti-CSRF tokens on state-changing requests, `SameSite` cookies. |
| SSRF | Validate/allow-list destinations for any server-initiated outbound request. |
| File uploads | Validate type, size, and content (not just extension); store outside the web root; scan for malware where feasible. |
| Rate limiting | Throttle auth endpoints and public APIs; brute-force protection on login/reset flows. |
| Dependency security | Automated SCA scanning; patch critical/high CVEs promptly; pin versions. |
| Error handling | No stack traces, internal paths, or query details in client-facing errors. Generic message + internal correlation ID. |
| Logging | No secrets or PII in logs. Audit trail for sensitive actions. |
| Security headers | `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options`, `Referrer-Policy` set appropriately. |
| Infra/containers | Non-root container users, minimal base images, IAM least privilege, network segmentation between tiers. |
| API security | AuthN on every endpoint by default (explicit opt-out for public ones), schema-validated request bodies, no over-fetching of sensitive fields. |

Any critical/high finding from a security scan blocks merge. Call out explicitly in the PR description any change touching auth, payments, or PII — even a small one.
