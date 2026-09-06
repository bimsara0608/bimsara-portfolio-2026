---
name: release-and-operations
description: Use when setting up or modifying CI/CD pipelines, preparing a deployment or release, working on anything performance-sensitive, or adding/changing logging, metrics, tracing, or health checks.
---

# Release & Operations

## Performance & Scalability
- Define a latency/throughput budget for anything user-facing before optimizing blindly (e.g., p95 < 300ms).
- Paginate or stream any list endpoint that can grow unbounded — no `SELECT *` without a limit.
- Cache deliberately with an explicit invalidation strategy, not reflexively.
- N+1 queries are a defect — batch or join.
- Async/non-blocking I/O for anything network- or disk-bound in a request path, where the platform supports it.
- Load-test before a release that materially changes traffic patterns or a hot path.
- Set resource limits (memory/CPU/timeouts/pool sizes) explicitly for production workloads.

## Observability
- Structured logging (JSON), not free-text concatenation.
- Correlation/trace ID propagated across a request's full lifecycle, including downstream calls.
- `/health` and `/ready` endpoints for anything deployed as a service.
- Metrics on the golden signals: rate, errors, duration (and saturation for infra).
- Alerts tied to user-facing impact (SLO burn), not raw internal metrics no one can act on.
- Graceful shutdown: drain in-flight requests, close connections cleanly.

## CI/CD & Release
A change merges only after:
- [ ] Lint / static analysis passes
- [ ] Type-checking passes (if applicable)
- [ ] Unit + integration tests pass
- [ ] Security scan passes with no new critical/high findings
- [ ] Build succeeds
- [ ] Coverage does not regress below target
- [ ] At least one review approves

Release practice:
- Stage before prod, always.
- Prefer progressive rollout (canary/blue-green) over all-at-once for anything with real users.
- Every deploy has a tested rollback path, verified before it's needed.
- Migrations are backward-compatible with the previous app version during rollout (expand/contract), so rollback doesn't break on the new schema.
- Feature flags gate anything risky.
