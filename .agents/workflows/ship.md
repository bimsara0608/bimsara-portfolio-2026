---
description: Run the full engineering standard end-to-end for one task — plan, implement, test, security-check, and verify Definition of Done before calling it shipped.
---

When the user runs `/ship <task description>`, execute the following sequence. Do not skip a step. If a step fails, loop back and fix it before moving forward — do not proceed past a failing gate and do not report the task as shipped with an unresolved step.

1. **Plan** — Load the `architecture-and-planning` skill. Restate the requirement, identify non-functional requirements, and follow the Escalation Protocol in AGENTS.md §6 instead of guessing on anything security- or data-relevant. Produce a short plan (approach, affected files, risks, test strategy) before writing code.

2. **Implement** — Follow AGENTS.md §3 (Core Implementation Standards) for every line written. If the change touches auth, payments, PII, input handling, file uploads, or external calls, load the `security-review` skill now and apply it inline, not at the end.

3. **Test** — Load the `testing-strategy` skill. Write tests at the levels it specifies, meeting the coverage targets for the code category touched. Do not mark this step complete with only happy-path tests.

4. **File & dependency check** — If any config, Docker, migration, SQL, manifest, or asset file was touched, or a new dependency was added, load `file-types-and-dependencies` and verify each relevant item.

5. **Release readiness** — If this change affects deployment, performance, or observability, load `release-and-operations` and verify CI gates, rollback path, and logging/metrics are in place.

6. **Document & finalize** — Load `documentation-and-governance`. Update README/API docs/CHANGELOG as needed, and write a PR description stating what changed, why, how it was tested, and rollback notes.

7. **Gate check** — Walk the Definition of Done checklist in AGENTS.md §4 line by line. Any unchecked item is a blocker, not a note — go back to the relevant step and resolve it before continuing.

8. **Report** — Summarize to the user: what was built, what was tested, anything explicitly skipped and why, and any open escalation questions from AGENTS.md §6.
