# Prompting Templates for `.specs/` Documents

Use these prompts together with the skeletons in [file-templates.md](file-templates.md) when generating `.specs/` documents. Each section below states what the AI must *think about* when filling that section — the skeletons define the structure, the prompts define the depth. For the concrete traceability format (`Validates:` / `_Requirements:`), see [examples/traceability.md](examples/traceability.md).

## `requirements.md`

### Introduction

Write 1–2 paragraphs answering: what is this module, what problem does it solve, and who uses it? Lead with the core technical pain point.

### Glossary

Define every key term the document relies on (components, state, protocols, config names). One term per bullet, each a single precise sentence. Do not skip terms that are implied but never defined.

### Requirements

For each `Requirement N`:

1. **Title** — a readable capability title starting with a verb (e.g. "Checkbox checking with indeterminate state"), not a component name.
2. **User Story** — fill all three parts: *As a `<role>` / I want `<capability>` / so that `<value>`*. The value clause must explain *why*, not restate the capability.
3. **Acceptance Criteria** — every criterion must be machine-testable. Use the `THE <System> SHALL` / `WHEN` / `IF`/`WHILE` forms. Cover three cases in total:
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

### Error Handling

Fill a scenario/strategy table covering: exceptional inputs, disabled/empty states, async failures, and misuse (e.g. used outside a provider). Each row must state the actual handling strategy, not just acknowledge the scenario.

### Correctness Properties

Each property is a formal, machine-verifiable statement about what the system should do. Write it in the `*For any* <precondition>, <conclusion>` form and mark `**Validates: Requirements x.y**`. Every property must be checkable by a test; if it cannot be asserted, it is not a property.

## `tasks.md`

### Task breakdown

- Split phases by **dependency**, not by time or file order.
- Every task references the requirement clauses it implements: `_Requirements: x.y, x.z_`.
- Mark optional/MVP-skippable subtasks with `*`.
- Include **Checkpoint** tasks at meaningful milestones that run the test suite/build and surface issues early.

### Task Dependency Graph

Express the phases as ordered waves so execution order is unambiguous.

## Cross-cutting: Traceability

- Tasks link **forward** to requirements (`_Requirements:_`).
- Design properties link **backward** to requirements (`**Validates:**`).
- Every `Requirement N.M`, property, and task number referenced in any document must exist in that module's other documents — no dangling references.

Check the concrete format in [examples/traceability.md](examples/traceability.md).
