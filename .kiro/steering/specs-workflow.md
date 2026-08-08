---
title: Specs Workflow
inclusion: always
---

# Specs Workflow

Work spec-first in this project. Before writing code for a new module or feature, write the `.specs/` documents first, keep them traceable, and keep the module status table current. The full workflow, templates, and prompting depth live in the `specs-workflow` skill (load it when available).

## Mandatory Rules

1. Before coding, create `.specs/<module>/` with `requirements.md`, `design.md`, `tasks.md`, and `CHANGELOG.md`, and fill in the requirements. Add a row for the module in the `.specs/index.md` status table and a row per task in its Task Summary table.
2. Keep traceability: every task references the requirement clauses it implements with `_Requirements: x.y, x.z_`; every design Correctness Property marks `**Validates: Requirements x.y**`. No dangling references.
3. Record design revisions in `CHANGELOG.md`; never create `v1.md` / `v2.md` version files.
4. Shared facilities reused by multiple modules get their own spec directory under `.specs/shared/`.
5. Check off completed tasks `- [x]` and keep the `.specs/index.md` status and Task Summary tables in sync (`draft` → `design` → `implementing` → `implemented` → `archived`). Update the `Progress` column, the index status bar, and each module's status block as tasks are checked.
6. On acceptance, mark the module `archived` in the `.specs/index.md` status table. The module directory stays in place; git history preserves the documents.
7. Read `.specs/index.md` before any module document; use its Task Summary to determine which tasks to execute and load module docs on demand — do not read every module's documents upfront.
8. Derive the next task and next gate from dependencies: the next task is the first todo task (`[ ]`) whose `Depends on` are all done; the next gate is the next unchecked phase-terminal (Checkpoint) task. Record the result in the index status bar.

## Document Formats

- `index.md`: resident index — a top status bar (`📍 状态栏`: active module + status · done/total · blocked · next task · next gate · last updated), Module Status Table (`Module | Status | Progress | Depends on | Notes`, with `Progress` = `done/total (pct)`), Task Summary table (`Task | Module | Title | Status | Depends on`, with `Task` = globally unique `<module>.<N.M>` mirroring `tasks.md` checkboxes), execution order/dependencies, and a Change Log.
- `requirements.md`: `Requirement N` (integer, incrementing) + User Story (*As a `<role>` / I want `<capability>` / so that `<value>`*) + Acceptance Criteria numbered `N.M` in the `THE <System> SHALL` / `WHEN` / `IF` / `WHILE` forms, plus composite `AND` / `OR` conditions and state-based, performance, and security variants, every one machine-testable and together covering the happy path, boundary conditions, and error/exclusion cases.
- `design.md`: Overview (positioning + key trade-offs) / Architecture (layers + data flow with a Mermaid diagram; explain *why* the split) / Components & Composables (interface, responsibility, structured pseudocode) / Interfaces & Data Models (types, fields, defaults, optionality) / Key Decisions (decision records: context, options considered with pros/cons/effort, chosen option, rationale) / Error Handling (scenario/handling table) / Correctness Properties (`*For any* <precondition>, <conclusion>`, each marked `**Validates: Requirements x.y**`).
- `tasks.md`: hierarchical tasks numbered `N.M` (decoupled from requirement numbers), split by **dependency**, sequenced by a stated strategy (Foundation-First / Feature-Slice / Risk-First / Hybrid), each referencing `_Requirements: x.y_`, optional/MVP-skippable subtasks marked `*`, Checkpoint tasks that run the tests/build at meaningful milestones, a JSON Task Dependency Graph (ordered waves), and a Status Block at the end (`进度 done/total · 当前：<module>.<current task> · 门禁链：<phase>.<last task> → …`).
- `CHANGELOG.md`: dated entries with what changed and the rationale.

## Prohibitions

- No code before the module's `.specs/<module>/` documents (at minimum `requirements.md`) exist and are filled in.
- No reading every module's documents upfront; read `.specs/index.md` first and load only what the current task needs.
- No versioned design files (`v1.md` / `v2.md`); use `CHANGELOG.md` instead.
- No skipping `_Requirements:` references in tasks or `**Validates:**` annotations in design properties.
- No leaving completed tasks unchecked or the status/Task Summary tables out of sync.
- No leaving the index status bar, the `Progress` column, or a module's status block stale relative to the task checkboxes.
- No duplicating shared infrastructure requirements across modules; extract them to `.specs/shared/`.

## Naming Conventions

| Item | Convention |
|------|------------|
| Module directory | Lowercase `kebab-case` |
| Status values | `draft` / `design` / `implementing` / `implemented` / `archived` |
| Requirement numbering | `Requirement N`; acceptance criteria `N.M` |
| Task numbering | Hierarchical `N.M`, decoupled from requirement numbers |
