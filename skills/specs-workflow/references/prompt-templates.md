# Prompting Templates for `.agents/specs/` Documents

Use these prompts together with the skeletons in [file-templates.md](file-templates.md) when generating `.agents/specs/` documents. Each section below states what the AI must *think about* when filling that section — the skeletons define the structure, the prompts define the depth. For the concrete traceability format (`Validates:` / `_Requirements:`), see [examples/traceability.md](examples/traceability.md).

## `index.md`

`index.md` is the resident index that drives progressive disclosure — the agent reads it before any module document, so it must be scannable and accurate.

### Status Bar

A blockquote at the top of the file — the "IDE bottom bar" equivalent: one glance shows the whole project's state. Fields:

1. **Active module + status** — the module currently being worked on, with its status in brackets (e.g. `cs-foundation [\`design\`]`).
2. **done/total** — count of `[x]` over all task checkboxes, plus the blocked count (todo tasks whose deps are not all done).
3. **Next task** — the first Task Summary row with `[ ]` whose every `Depends on` id is `[x]`; if no task is ready, note "all blocked". This is the "smart next step" — derive it, never hand-pick.
4. **Next gate** — the first unchecked phase-terminal (Checkpoint) task in the active module's gate chain.
5. **Last updated** — date + a one-line note (e.g. "init .agents/specs").

Keep the status bar in sync every time a task is checked off, a module status changes, or the task list is edited.

### Module Status Table

One row per module: name, current status, `Progress` (`done/total (pct)` counting every task checkbox in the module's `tasks.md`), what it depends on, and a one-line note. Status values follow the `draft` → `design` → `implementing` → `implemented` → `archived` convention.

### Task Summary

One row per task across all modules so the agent can pick what to execute without opening every `tasks.md`. For each row:

1. **Task** — the globally unique id `<module>.<N.M>` (module dir name + the task's number in that module's `tasks.md`).
2. **Module** — the module dir name the task belongs to.
3. **Title** — a short task title matching `tasks.md`.
4. **Status** — `[x]` / `[ ]`, always mirroring the checkbox in `tasks.md`.
5. **Depends on** — task ids that must be done first; `-` if none.

Keep the table in sync with `tasks.md` whenever a task is added, checked off, or reprioritized.

### Execution Order / Dependencies

State which modules run first and who blocks whom, derived from the Task Summary dependencies.

## `requirements.md`

### Introduction

Write 1–2 paragraphs answering: what is this module, what problem does it solve, and who uses it? Lead with the core technical pain point.

### Glossary

Define every key term the document relies on (components, state, protocols, config names). One term per bullet, each a single precise sentence. Do not skip terms that are implied but never defined.

### Requirements

For each `Requirement N`:

1. **Title** — a readable capability title starting with a verb (e.g. "Checkbox checking with indeterminate state"), not a component name.
2. **User Story** — fill all three parts: *As a `<role>` / I want `<capability>` / so that `<value>`*. The value clause must explain *why*, not restate the capability.
3. **Acceptance Criteria** — every criterion must be machine-testable. Use the `THE <System> SHALL` / `WHEN` / `IF` / `WHILE` forms, plus composite `AND` / `OR` conditions and these variants when the scenario calls for them:
   - state-based: `WHEN <system> is in <state>, THEN <system> SHALL <behavior>`
   - performance: `WHEN <user action>, THEN <system> SHALL <respond within X seconds/milliseconds>`
   - security: `IF <authentication condition>, THEN <system> SHALL <security response>`
   Cover three cases in total:
   - happy path (the normal behavior)
   - boundary conditions (empty, single, max, first/last, no-op)
   - error/exclusion cases (disabled states, invalid input, failure paths)
   Do not leave a criterion that cannot be turned into a test assertion.

## `design.md`

### Overview

State the module's positioning and core design principles, and call out the key trade-offs you made (e.g. "headless means no styles are shipped; consumers own the visual layer").

### Architecture

Show layers/modules and data flow. **Explain *why* the system is split this way**, not just how it is split. Use a Mermaid diagram for the layer/data-flow picture (see the convention in [file-templates.md](file-templates.md)).

### Components / Composables

For each core component: interface, responsibility, and core logic in structured pseudocode. For every implementation choice, explain **why it is done this way** (the trade-off, the constraint it satisfies), not just what it does. Highlight state transitions and the core branching logic.

### Interfaces & Data Models

List the types, their fields, literal union values, and defaults. State which fields are optional and what an omitted field means.

### Key Decisions

Record every decision that involved a real trade-off. For each: the **Context** (situation that forced the decision), the **Options Considered** with pros/cons/effort for each, the **Decision** (chosen option), and a **Rationale** explaining why it beats the alternatives. Do not pad with obvious choices; if the right answer is forced by the requirements, say so in one line.

### Error Handling

Fill a scenario/strategy table covering: exceptional inputs, disabled/empty states, async failures, and misuse (e.g. used outside a provider). Each row must state the actual handling strategy, not just acknowledge the scenario.

### Correctness Properties

Each property is a formal, machine-verifiable statement about what the system should do. Write it in the `*For any* <precondition>, <conclusion>` form and mark `**Validates: Requirements x.y**`. Every property must be checkable by a test; if it cannot be asserted, it is not a property.

## `tasks.md`

### Task breakdown

- Split phases by **dependency**, not by time or file order.
- Choose a sequencing strategy and state it in the Overview:
  - **Foundation-First** — core interfaces/data models before dependent components (new or complex systems)
  - **Feature-Slice** — complete vertical slices end-to-end (MVP, early validation)
  - **Risk-First** — tackle the most uncertain parts first (high-uncertainty, proof-of-concept)
  - **Hybrid** — minimal foundation, then the highest-value/highest-risk slice, then expand (default)
- Every task references the requirement clauses it implements: `_Requirements: x.y, x.z_`.
- Mark optional/MVP-skippable subtasks with `*`.
- Include **Checkpoint** tasks at meaningful milestones that run the test suite/build and surface issues early.

### Task Dependency Graph

Express the phases as ordered waves so execution order is unambiguous.

### Derived Status

Do not add a module-local status snapshot. The index is the single source of status and derives progress, the next task, and the next gate from task checkboxes and dependencies.

## Cross-cutting: Traceability

- Tasks link **forward** to requirements (`_Requirements:_`).
- Design properties link **backward** to requirements (`**Validates:**`).
- Every `Requirement N.M`, property, and task number referenced in any document must exist in that module's other documents — no dangling references.

Check the concrete format in [examples/traceability.md](examples/traceability.md).
