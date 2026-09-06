---
name: architecture-and-planning
description: Use at the start of any new feature, service, endpoint, or non-trivial change — before writing code — to pin down requirements, non-functional constraints, and the architecture approach. Also use when a change would affect data ownership, service boundaries, or a public API contract.
---

# Architecture & Planning

## Requirements & Discovery
- Restate the requirement before building; surface conflicting or missing requirements rather than guessing on anything security-, money-, or data-loss-relevant.
- Define non-functional requirements explicitly: expected scale, data volume, latency budget, availability target, compliance constraints (GDPR/HIPAA/PCI/SOC2 as applicable).
- Define acceptance criteria before implementation — what observable behavior proves this is done.
- Classify the change: new capability / bug fix / refactor / performance / security patch — this determines how much ceremony applies.

## Architecture & Design
- Default to a modular monolith or well-bounded services — don't reach for microservices/distributed complexity without a scale or team-topology reason.
- Separate presentation / business logic / data access as distinct layers, even in small apps.
- Design for statelessness in application servers so horizontal scaling doesn't require code changes.
- Every external call (network, disk, DB) assumes failure: timeouts, retries with backoff, and circuit breakers for anything called repeatedly.
- APIs are versioned from the first release (`/v1/...` or header-based); no unversioned public contract.
- Idempotency for any retryable operation (payments, order creation, message processing) via idempotency keys.
- Record significant decisions as a short ADR: context, decision, alternatives considered, consequences (10–20 lines is enough).
- Data ownership is explicit: one service/module owns writes to a dataset; others go through its interface, not its database directly.
