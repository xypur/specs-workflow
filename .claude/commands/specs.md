---
description: Create all spec documents for a module from a requirement description
---

Create the `.agents/specs/<module>/` for the feature described in `$ARGUMENTS`, with all four documents at once. If `$ARGUMENTS` is empty, ask the user to describe the feature first.

Derive a lowercase `kebab-case` module name from the description (e.g. "a user auth module with registration and OAuth" → `user-auth`). If you cannot derive one, ask the user. If the description lacks essential details — scope boundaries, edge cases, or constraints — ask 1–2 focused questions before writing; otherwise proceed directly.

If `.agents/specs/` does not exist yet, bootstrap it first (index.md + status table) before creating the module.

Load the specs-workflow skill (skill tool, name `specs-workflow`), then read from the skill directory: `references/file-templates.md` (skeleton), `references/prompt-templates.md` (depth guidance), `references/checklists.md` (quality gates), and `references/examples/traceability.md` (traceability format), and follow them. If the skill is not available, follow the rules below.

Generate the documents in dependency order:

1. **requirements.md** — `Requirement N` (integer, incrementing) + User Story + acceptance criteria numbered `N.M` in the `THE <System> SHALL` / `WHEN` / `IF` / `WHILE` forms (plus composite `AND` / `OR` and state-based / performance / security variants), each machine-testable, together covering the happy path, boundary conditions, and error/exclusion cases.
2. **design.md** — read `requirements.md` first: Overview / Architecture (Mermaid, explain *why*) / Components & Composables / Interfaces & Data Models / Key Decisions (context, options, rationale) / Error Handling / Correctness Properties (`*For any* <precondition>, <conclusion>`, each marked `**Validates: Requirements x.y**`, no dangling references).
3. **tasks.md** — read `requirements.md` first: hierarchical tasks numbered `N.M`, sequenced by a stated strategy (Foundation-First / Feature-Slice / Risk-First / Hybrid), each referencing `_Requirements: x.y, x.z_`, checkpoint tasks, and a JSON Task Dependency Graph (waves).
4. **CHANGELOG.md** — create with a header and no entries yet.
5. Add a row for the module in the `.agents/specs/index.md` status table with status `design` and `Progress` `0/<total> (0%)` (requirements + design complete, ready for implementation), add a row per task in the `.agents/specs/index.md` Task Summary table (Task = `<module>.<N.M>`), append to the Change Log table, and rebuild the index Status Bar (done/total, blocked, next task, next gate, last updated). The index is the only task status source; do not add a module-local status block.

If the project has a `.agents/specs/` directory, run `node scripts/validate-specs.js .` when available before finishing and report any validation errors.

Do not write any implementation code. If the module directory already exists, tell the user and extend the existing documents rather than overwriting. To update a single document later, use `/specs-requirements`, `/specs-design`, or `/specs-tasks`.
