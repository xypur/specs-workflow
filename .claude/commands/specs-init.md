---
description: Initialize the .specs/ directory convention
---

Bootstrap the `.specs/` spec-driven workflow convention in this project.

Load the specs-workflow skill (skill tool, name `specs-workflow`), then read `references/file-templates.md` from the skill directory and follow its skeleton. If the skill is not available, follow the rules below.

1. Create `.specs/index.md` with:
   - A "Status Bar" blockquote at the top (`> 📍 **Status Bar**`): active module + status, done/total, blocked, next task, next gate, last updated. With no modules yet, show `-` placeholders and a "no modules yet" note.
   - A "Module Status Table" with columns `Module | Status | Progress | Depends on | Notes`, using only the status values `draft` → `design` → `implementing` → `implemented` → `archived`. `Progress` is `done/total (pct)` counting every task checkbox in the module's `tasks.md` (0/0 (0%) until tasks exist).
   - A "Task Summary" table with columns `Task | Module | Title | Status | Depends on` (Task is the globally unique `<module>.<N.M>` id; it gains rows as `tasks.md` files are written)
   - An "Execution Order / Dependencies" section
   - A "Change Log" table with `Date | Change` columns
   - If there are no modules yet, leave the status table and Task Summary table with their header rows only and note the status value legend
2. Do NOT create any module directories yet.

Match the template's structure and wording exactly. Do not invent status values or extra sections.
