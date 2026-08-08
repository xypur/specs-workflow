---
description: Create or update a module's tasks.md
---

Create or update the `.specs/$1/tasks.md` document for the module `$1`. If `$1` is empty, ask the user for the module name first.

Load the specs-workflow skill (skill tool, name `specs-workflow`), then read from the skill directory: `references/file-templates.md` (skeleton), `references/prompt-templates.md` (depth guidance), and `references/examples/traceability.md` (traceability format), and follow them. If the skill is not available, follow the rules below.

Follow these rules:

- **Overview**: phased implementation approach with explicit verification methods. State the sequencing strategy you chose — Foundation-First (new/complex systems), Feature-Slice (MVP/early validation), Risk-First (high uncertainty), Hybrid (default) — and why.
- **Tasks**: hierarchical tasks numbered `N.M` (decoupled from requirement numbers), split by **dependency**, not by time or file order. Every task references the requirement clauses it implements with `_Requirements: x.y, x.z_`. Mark optional / MVP-skippable subtasks with `*`.
- **Checkpoints**: at meaningful milestones, add checkpoint tasks that run the test suite/build and surface issues early.
- **Task Dependency Graph**: express the phases as ordered waves in JSON so execution order is unambiguous.
- **Status Block**: at the end of `tasks.md`, add a one-line status snapshot — `进度 done/total · 当前：<module>.<current task> · 门禁链：<phase>.<last task> → …`. Each phase's terminal task (its last `N.M`, usually the Checkpoint) is a gate; the chain lists each phase's terminal task in order.
- **Index sync**: after writing/updating the tasks, add or update one row per task in the `.specs/index.md` Task Summary table — `Task` = `<module>.<N.M>`, `Status` mirrors the checkbox in `tasks.md`; update the module's `Progress` column; and rebuild the Status Bar (next task = first `[ ]` with all deps done, next gate = next unchecked phase-terminal task, blocked count, done/total, last updated) — so the index stays the single source of truth for what to execute.

Read the module's `.specs/$1/requirements.md` first so every requirement clause referenced by `_Requirements:` actually exists — no dangling references. If `.specs/$1/tasks.md` already exists, preserve its content and extend it rather than rewriting.
