# File Templates for the `.specs/` Convention

Use these skeletons when creating `.specs/` documents. Copy each block into the corresponding file and fill in the content.

## `.specs/README.md`

```markdown
# Specs Index

Organized by functional module, each module is a self-contained directory (requirements / design / tasks / CHANGELOG).

## Module Status Table

| Module | Status | Depends on | Notes |
|--------|--------|------------|-------|
| shared | implementing | - | Cross-module shared facilities |
| tree | design | shared | Tree component |
| modal | draft | - | Modal dialog |

Status values: `draft` → `design` → `implementing` → `implemented` → `archived`

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
```

## `<module>/design.md`

```markdown
# Design Document

## Overview

Module positioning and core design principles.

## Architecture

Directory structure, data flow, and module collaboration. Use Mermaid for diagrams (e.g. architecture layers, data flow, traceability).

## Components / Composables

Interface, responsibility, and core logic of each core component (in structured pseudocode).

## Interfaces & Data Models

Type definitions and data structures.

## Error Handling

| Scenario | Handling |
|----------|----------|
| <exceptional scenario> | <handling strategy> |

## Correctness Properties

*A property is a formal statement about what the system should do.*

### Property 1: <Invariant Name>

*For any* <precondition>，<conclusion>。

**Validates: Requirements x.y**
```

## `<module>/tasks.md`

```markdown
# Implementation Plan: <module>

## Overview

Phased implementation approach with explicit verification methods.

## Tasks

- [ ] 1. <Phase Title>
  - [ ] 1.1 <Task Description>
    - <Implementation key points>
    - _Requirements: x.y, x.z_
  - [ ] 1.2 ...

- [ ] N. Checkpoint — <Verification Description>
  - Run tests/build, make sure they pass, ask the user if there are issues.

## Notes

- Subtasks marked with `*` are optional and can be skipped in the MVP phase
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
```

## `<module>/CHANGELOG.md`

```markdown
# <Module> Change Log

## YYYY-MM-DD

- <Description of this change>
- <Design tradeoff / rationale>
```
