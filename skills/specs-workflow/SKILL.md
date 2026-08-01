---
name: specs-workflow
description: "Spec-driven workflow for AI coding tasks. Use when starting or continuing feature/module work in a project and you need to set up or follow a .specs/ convention: create requirements/design/tasks/CHANGELOG docs before writing code, keep requirements↔design↔tasks traceable, sync the .specs/README.md status table, and mark completed modules as archived."
license: MIT
---

# Specs Workflow

This skill enforces a spec-driven, traceable workflow for AI coding tasks. Before code is written, each module gets a `requirements.md`, `design.md`, `tasks.md`, and `CHANGELOG.md` under `.specs/`, so the agent always knows what to build, why, and how it fits the bigger picture.

## When to Use This Skill

Use this skill when the user:

- Starts a new feature, module, or project and wants requirements, design, and task plans written down before implementation
- Continues work on a project that already has a `.specs/` directory and needs to follow its conventions
- Wants requirements, design decisions, and implementation tasks to stay traceable to each other
- Needs to decide module status, dependencies, or implementation order in `.specs/README.md`
- Finishes a module and needs to mark it as archived
- Redesigns a module without creating scattered version documents

## Workflow

### Step 1: Read the Existing Specs Context

If `.specs/` already exists, read `.specs/README.md` first to learn the module status table, dependencies, and execution order. Determine whether the requested work belongs to an existing module or needs a new one. If `.specs/` does not exist, propose creating it before starting the task.

### Step 2: Create Module Documents Before Coding

Before writing any code for a new module or feature, create `.specs/<module>/` containing `requirements.md`, `design.md`, `tasks.md`, and `CHANGELOG.md`, and fill in the requirements. Add a row for the module in the `.specs/README.md` status table. Use the skeletons in [references/file-templates.md](references/file-templates.md) for structure, the per-section prompting guidance in [references/prompt-templates.md](references/prompt-templates.md) for depth, the quality gates in [references/checklists.md](references/checklists.md) for acceptance, and the [references/examples/traceability.md](references/examples/traceability.md) example for the exact traceability format.

### Step 3: Write Requirements

Document what the system must do in `requirements.md`. Number each requirement as `Requirement N` (integer, incrementing per module), each with a user story and acceptance criteria numbered `N.M`. Write acceptance criteria in SHALL / WHEN / IF / WHILE form, plus composite `AND` / `OR` conditions and state-based, performance, and security variants, so they are testable.

### Step 4: Write the Design

Document how the system is built in `design.md`: architecture, data flow, component interfaces, data models, error handling, and the key decisions you made (context, options considered, chosen option, rationale). For every correctness guarantee, add a **Correctness Property** and mark it with `**Validates: Requirements x.y**` so the design maps back to the requirements.

### Step 5: Write the Task Plan

Break the implementation into hierarchical tasks numbered `N.M` (independent of requirement numbers) in `tasks.md`, sequenced by a stated strategy (Foundation-First / Feature-Slice / Risk-First / Hybrid). Every task references the requirements it implements with `_Requirements: x.y, x.z_`. Include a Task Dependency Graph (waves) and checkpoint tasks that run tests/builds at meaningful milestones.

### Step 6: Implement and Sync Progress

Execute tasks in dependency order. Check off completed tasks with `- [x]` and keep the `.specs/README.md` module status table up to date (move the module along `draft → design → implementing → implemented`). At each checkpoint, run the tests/build and report results.

### Step 7: Record Design Changes

When a design changes, append the change to `<module>/CHANGELOG.md` with the date, what changed, and the rationale. Never create `v1.md` / `v2.md` version files.

### Step 8: Mark Completed Modules as Archived

When a module is accepted and finished, set its status to `archived` in the `.specs/README.md` status table. The module directory stays in place; git history preserves the documents.

## Directory Structure

```
.specs/
├── README.md            # Global index + module status table + dependencies/priority
└── <module>/
    ├── requirements.md  # Requirements (Requirement N + acceptance criteria)
    ├── design.md        # Design (architecture/data flow/interfaces + Correctness Properties)
    ├── tasks.md         # Tasks (reference requirement numbers + dependency graph)
    └── CHANGELOG.md     # Change log (design revision records)
```

## Mandatory Rules

| # | Rule |
|---|------|
| 1 | Create the four `.specs/<module>/` files and fill in requirements before starting implementation |
| 2 | Keep traceability: tasks reference `_Requirements: x.y_`; each Correctness Property marks `**Validates: Requirements x.y**` |
| 3 | Record design revisions in `CHANGELOG.md`; never create `v1.md`/`v2.md` files |
| 4 | Shared facilities reused across modules get their own spec dir under `.specs/shared/` |
| 5 | Check off tasks `- [x]` and sync the `.specs/README.md` status table as you go |
| 6 | Mark accepted modules `archived` in the `.specs/README.md` status table |

## Naming Conventions

| Item | Convention |
|------|------------|
| Module directory | Lowercase `kebab-case` (e.g. `vue-tree-lib`, `shared`) |
| Status values | `draft` / `design` / `implementing` / `implemented` / `archived` |
| Requirement numbering | `Requirement N` (integer, incrementing per module); acceptance criteria use `N.M` sub-numbers |
| Task numbering | Hierarchical `N.M`, decoupled from requirement numbers |

## Prohibitions

- Do not write code for a module before its `.specs/<module>/` documents (at minimum `requirements.md`) exist and are filled in.
- Do not create versioned design files such as `v1.md` / `v2.md`; use `CHANGELOG.md` instead.
- Do not skip requirement references in tasks or `Validates` annotations in design properties.
- Do not leave completed tasks unchecked or out of sync with the `.specs/README.md` status table.
- Do not duplicate shared infrastructure requirements across modules; extract them to `.specs/shared/`.

## When Unsure

- If the requested work spans multiple modules or its boundaries are unclear, ask the user how to scope it.
- If `.specs/` already exists, follow its existing conventions and status values rather than inventing new ones.
- If a module is already partially implemented, create documents retroactively for the next increment instead of reconstructing full history.
- If a design decision conflicts with an existing Correctness Property, update the design and CHANGELOG, then confirm with the user.
