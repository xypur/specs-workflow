---
title: Specs Workflow
inclusion: always
---

# Specs Workflow

Work spec-first in this project. Before writing code for a new module or feature, write the `.specs/` documents first, keep them traceable, and keep the module status table current. The full workflow, templates, and prompting depth live in the `specs-workflow` skill (load it when available).

## Mandatory Rules

1. Before coding, create `.specs/<module>/` with `requirements.md`, `design.md`, `tasks.md`, and `CHANGELOG.md`, and fill in the requirements. Add a row for the module in the `.specs/README.md` status table.
2. Keep traceability: every task references the requirement clauses it implements with `_Requirements: x.y, x.z_`; every design Correctness Property marks `**Validates: Requirements x.y**`. No dangling references.
3. Record design revisions in `CHANGELOG.md`; never create `v1.md` / `v2.md` version files.
4. Shared facilities reused by multiple modules get their own spec directory under `.specs/shared/`.
5. Check off completed tasks `- [x]` and keep the `.specs/README.md` status table in sync (`draft` → `design` → `implementing` → `implemented` → `archived`).
6. On acceptance, move the module directory into `.specs/archive/` and set its status to `archived`.

## Document Formats

- `requirements.md`: `Requirement N` (integer, incrementing) + User Story (*As a `<role>` / I want `<capability>` / so that `<value>`*) + Acceptance Criteria numbered `N.M` in the `THE <System> SHALL` / `WHEN` / `IF` / `WHILE` forms, every one machine-testable and together covering the happy path, boundary conditions, and error/exclusion cases.
- `design.md`: Overview (positioning + key trade-offs) / Architecture (layers + data flow with a Mermaid diagram; explain *why* the split) / Components & Composables (interface, responsibility, structured pseudocode) / Interfaces & Data Models (types, fields, defaults, optionality) / Error Handling (scenario/handling table) / Correctness Properties (`*For any* <precondition>, <conclusion>`, each marked `**Validates: Requirements x.y**`).
- `tasks.md`: hierarchical tasks numbered `N.M` (decoupled from requirement numbers), split by **dependency**, each referencing `_Requirements: x.y_`, optional/MVP-skippable subtasks marked `*`, Checkpoint tasks that run the tests/build at meaningful milestones, and a JSON Task Dependency Graph (ordered waves).
- `CHANGELOG.md`: dated entries with what changed and the rationale.

## Prohibitions

- No code before the module's `.specs/<module>/` documents (at minimum `requirements.md`) exist and are filled in.
- No versioned design files (`v1.md` / `v2.md`); use `CHANGELOG.md` instead.
- No skipping `_Requirements:` references in tasks or `**Validates:**` annotations in design properties.
- No leaving completed tasks unchecked or the status table out of sync.
- No duplicating shared infrastructure requirements across modules; extract them to `.specs/shared/`.

## Naming Conventions

| Item | Convention |
|------|------------|
| Module directory | Lowercase `kebab-case` |
| Status values | `draft` / `design` / `implementing` / `implemented` / `archived` |
| Requirement numbering | `Requirement N`; acceptance criteria `N.M` |
| Task numbering | Hierarchical `N.M`, decoupled from requirement numbers |
