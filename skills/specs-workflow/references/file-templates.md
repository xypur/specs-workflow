# File Templates for the `.specs/` Convention

Use these skeletons when creating `.specs/` documents. Copy each block into the corresponding file and fill in the content.

## `.specs/index.md`

`.specs/index.md` is the **always-read entry point** of the progressive disclosure chain. Its Task Summary table lets the agent decide which tasks to execute without opening every module's `tasks.md`.

```markdown
# Specs Index

Organized by functional module, each module is a self-contained directory (requirements / design / tasks / CHANGELOG).

Read this file before any module document: use the Status Bar, Module Status Table, and Task Summary below to determine which module(s) and task(s) the current request touches, then open only the relevant module documents on demand.

> 📍 **Status Bar** · cs-foundation [`design`] · 0/31 done · 0 blocked ·
> Next task: **cs-foundation.1.1** (deps satisfied) · Next gate: **cs-foundation.1.6**
> Last updated: YYYY-MM-DD (init .specs)

## Module Status Table

| Module | Status | Progress | Depends on | Notes |
|--------|--------|----------|------------|-------|
| shared | implementing | 2/5 (40%) | - | Cross-module shared facilities |
| tree | design | 0/12 (0%) | shared | Tree component |
| modal | draft | 0/8 (0%) | - | Modal dialog |

`Progress` = `done/total (pct)` counting every task checkbox in `<module>/tasks.md`. Status values: `draft` → `design` → `implementing` → `implemented` → `archived`. Archived modules stay listed with status `archived`; their directories are not moved.

## Task Summary

Global index of every task across modules. Add one row per task in `<module>/tasks.md`; keep the checkbox state in sync.

| Task | Module | Title | Status | Depends on |
|------|--------|-------|--------|------------|
| shared.1 | shared | Selection behavior core | [x] | - |
| tree.1 | tree | Tree state model | [ ] | shared.1 |
| tree.2 | tree | Tree node rendering | [ ] | tree.1 |

`Task` is the globally unique id `<module>.<N.M>` (the module dir name + the task's number in `tasks.md`). `Status` mirrors the `- [ ]` / `- [x]` checkbox in `tasks.md`.

**Next task / next gate** are derived from the dependencies, not hand-written:
- **Next task** = the first Task Summary row with `[ ]` whose every `Depends on` id is `[x]`; if none, note "all blocked".
- **Blocked count** = number of `[ ]` tasks whose deps are not all done.
- **Next gate** = the first unchecked phase-terminal (Checkpoint) task in the active module's gate chain.
- Update the Status Bar (and `Progress` / `Last updated`) whenever a task is checked off.

## Execution Order / Dependencies

Module implementation order arranged by dependency (who runs first, who blocks whom).

## Change Log

| Date | Change |
|------|--------|
| YYYY-MM-DD | Description |
```

## `<module>/requirements.md`

```markdown
# Requirements Document

## Introduction

One sentence describing what this module is and what problem it solves.

## Glossary

- **Term**: definition.

## Requirements

### Requirement 1：<Capability Title>

**User Story:** As a <role>, I want <capability>, so that <value>.

#### Acceptance Criteria

1. THE <System> SHALL <behavior>。
2. WHEN <condition>，THE <System> SHALL <behavior>。
3. IF <condition>，THEN THE <System> SHALL <behavior>。
4. WHEN <event> AND <additional condition>，THEN THE <System> SHALL <behavior>。
5. WHEN <system> is in <state>，THEN THE <System> SHALL <behavior>。
```

## `<module>/design.md`

````markdown
# Design Document

## Overview

Module positioning and core design principles.

## Architecture

Directory structure, data flow, and module collaboration. Use Mermaid for diagrams (e.g. architecture layers, data flow, traceability).

## Components / Composables

Interface, responsibility, and core logic of each core component (in structured pseudocode).

## Interfaces & Data Models

Type definitions and data structures.

## Key Decisions

```markdown
### Decision 1: <Decision Title>

**Context:** <situation requiring the decision>

**Options Considered:**
- **Option A: <name>** — Pros: <benefits> / Cons: <drawbacks> / Effort: <low|medium|high>
- **Option B: <name>** — Pros: <benefits> / Cons: <drawbacks> / Effort: <low|medium|high>

**Decision:** <chosen option>

**Rationale:** <why it beats the alternatives>
```

## Error Handling

| Scenario | Handling |
|----------|----------|
| <exceptional scenario> | <handling strategy> |

## Correctness Properties

*A property is a formal statement about what the system should do.*

### Property 1: <Invariant Name>

*For any* <precondition>，<conclusion>。

**Validates: Requirements x.y**
````

## `<module>/tasks.md`

````markdown
# Implementation Plan: <module>

## Overview

Phased implementation approach with explicit verification methods.

## Tasks

## Phase 1: <Phase Title>
  - [ ] 1.1 <Task Description>
    - <Implementation key points>
    - _Requirements: x.y, x.z_
  - [ ] 1.2 ...

- [ ] 1.3 Checkpoint — <Verification Description>
  - _Requirements: x.y_
  - Run tests/build, make sure they pass, ask the user if there are issues.

## Notes

- Subtasks marked with `*` are optional and can be skipped in the MVP phase
- Pick a sequencing strategy (Foundation-First / Feature-Slice / Risk-First / Hybrid) and state it in the Overview
- Every task references requirement clauses to guarantee traceability

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1"] }
  ]
}
```

Task status is maintained in `.specs/index.md`, which derives progress, the next task, and the next gate from task checkboxes and dependencies. Do not add a module-local status block.
````

## `<module>/CHANGELOG.md`

```markdown
# <Module> Change Log

## YYYY-MM-DD

- <Description of this change>
- <Design tradeoff / rationale>
```
