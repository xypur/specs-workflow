# Quality Checklists for `.agents/specs/` Documents

Use these checklists as acceptance gates before a document is considered done. Every item is written so a reader (or a test) can decide it pass/fail — no vague items like "be user-friendly". Cross off only what is actually true; if an item does not apply, leave it and note why.

## `index.md`

- [ ] `.agents/specs/index.md` exists and was read before any module document (progressive disclosure entry point).
- [ ] The Status Bar blockquote exists at the top with all fields filled: active module + status, done/total, blocked, next task, next gate, last updated.
- [ ] `Next task` is the first Task Summary row with `[ ]` whose every `Depends on` id is `[x]` — derived, not hand-picked.
- [ ] `Next gate` is the first unchecked phase-terminal task in the active module's gate chain.
- [ ] Module Status Table lists every module with a valid status and no duplicate rows.
- [ ] Every module row's `Progress` (`done/total`) matches the count of `[x]` over all its task checkboxes.
- [ ] Task Summary lists every task from every `tasks.md` with a globally unique id `<module>.<N.M>`.
- [ ] Every `[x]` / `[ ]` checkbox in the Task Summary matches its `tasks.md` counterpart.
- [ ] `Depends on` in the Task Summary only references existing task ids.
- [ ] The execution order respects the stated dependencies.

## `requirements.md`

- [ ] Every requirement has a title, a User Story with all three parts, and acceptance criteria numbered `N.M`.
- [ ] Requirement numbers increment from 1 with no gaps (`Requirement 1`, `2`, …).
- [ ] Each acceptance criterion is machine-testable (turns into a test assertion), not a sentiment.
- [ ] Together the criteria cover the happy path, at least one boundary condition, and at least one error/exclusion case.
- [ ] Terms used in criteria (states, configs, protocols) are defined in the Glossary.
- [ ] No two criteria contradict each other.
- [ ] No criterion describes *how* to build it (no implementation details).

## `design.md`

- [ ] Every requirement is addressed by a component, an interface, or an error-handling row.
- [ ] Components and composables have an interface, a responsibility, and core logic (structured pseudocode).
- [ ] Interfaces & Data Models list fields, defaults, and which fields are optional and what omission means.
- [ ] Key Decisions record context, options considered, the chosen option, and a rationale for real trade-offs.
- [ ] Error Handling table covers exceptional inputs, empty/disabled states, async failures, and misuse.
- [ ] Every Correctness Property is in the `*For any* <precondition>, <conclusion>` form and marks `**Validates: Requirements x.y**`.
- [ ] Every `**Validates:**` reference points to a requirement number that exists in `requirements.md` (no dangling references).
- [ ] Every property can be asserted by a test; anything un-assertable is not listed as a property.

## `tasks.md`

- [ ] Tasks are numbered hierarchically `N.M` and split by dependency, not by file order or time.
- [ ] Every task references the requirement clauses it implements with `_Requirements: x.y, x.z_`.
- [ ] Every `_Requirements:` reference points to a requirement number that exists in `requirements.md` (no dangling references).
- [ ] Optional / MVP-skippable subtasks are marked with `*`.
- [ ] Checkpoint tasks run the test suite/build at meaningful milestones.
- [ ] The Task Dependency Graph (JSON waves) lists every task and respects task dependencies.
- [ ] The sequencing strategy (Foundation-First / Feature-Slice / Risk-First / Hybrid) is stated in the Overview.
- [ ] Every task has a row in the `.agents/specs/index.md` Task Summary with a matching `Status`.
- [ ] The index derives progress, next task, and next gate from task checkboxes and the dependency graph.
- [ ] Completed tasks are checked off `- [x]`, and the `.agents/specs/index.md` status, Task Summary, `Progress` column, and Status Bar are in sync.
