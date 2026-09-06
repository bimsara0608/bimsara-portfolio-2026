---
name: testing-strategy
description: Use whenever writing, reviewing, or planning tests for any code change, or deciding what test coverage a change needs. Covers the test pyramid, per-test-type triggers, coverage targets by code category, and test hygiene rules.
---

# Testing Strategy

Follow the pyramid: many fast unit tests, fewer integration tests, few end-to-end tests. Never invert it.

## Test Types and When They Run

| Test type | Purpose | Runs |
|---|---|---|
| Unit | Verify logic in isolation, mocked dependencies | Every commit, pre-commit/CI |
| Integration | Verify real interaction with DB/API/queue/filesystem | Every PR |
| Contract | Verify service/API boundaries don't break consumers | Every PR touching a public interface |
| End-to-end | Verify critical user journeys through the full stack | Every PR (or nightly if slow) |
| Regression | Lock in every bug fix so it can't silently return | Added at time of fix, runs forever after |
| Performance/load | Verify latency/throughput under expected and peak load | Before major releases, on perf-sensitive changes |
| Security (SAST/DAST/SCA) | Catch vulnerable code, vulnerable dependencies | Every PR / every build |
| Secrets scanning | Catch committed credentials | Every commit (pre-commit + CI) |
| Accessibility | Verify WCAG compliance on user-facing UI | Every PR (automated), pre-release (manual spot check) |
| Mutation testing | Verify tests actually catch bugs, not just run | Periodically on critical modules |
| Smoke test | Sanity-check a deployment before real traffic | Every deploy, pre- and post- |

## Coverage Targets

| Code category | Minimum coverage |
|---|---|
| Overall line coverage | 80% |
| Core business logic | 90% |
| Security, auth, payment, or data-deletion logic | 100% branch coverage |
| Generated code, trivial getters/setters, vendored code | Excluded from targets, not from review |

Coverage is a floor, not a goal. A suite that hits 100% asserting only "it didn't throw" is worse than 70% with real behavioral assertions.

## Test Hygiene
- Deterministic: no reliance on execution order, wall-clock time, network access, or shared mutable fixtures.
- Arrange–Act–Assert structure; one logical assertion focus per test.
- Names describe behavior: `returns_404_when_resource_missing`, not `test1`.
- Test data via factories/builders, not copy-pasted fixtures that drift out of sync.
- A flaky test is a P1 bug, not something to retry past — quarantine and fix, don't ignore.
