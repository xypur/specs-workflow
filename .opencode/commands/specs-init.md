---
description: Initialize the .specs/ directory convention
---

Bootstrap the `.specs/` spec-driven workflow convention in this project.

Load the specs-workflow skill (skill tool, name `specs-workflow`), then read `references/file-templates.md` from the skill directory and follow its skeleton. If the skill is not available, follow the rules below.

1. Create `.specs/README.md` with:
   - A "Module Status Table" with columns `Module | Status | Depends on | Notes`, using only the status values `draft` → `design` → `implementing` → `implemented` → `archived`
   - An "Execution Order / Dependencies" section
   - A "Change Log" table with `Date | Change` columns
   - If there are no modules yet, leave the status table with its header row only and note the status value legend
2. Do NOT create any module directories yet.

Match the template's structure and wording exactly. Do not invent status values or extra sections.
