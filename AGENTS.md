# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Cursor, Copilot, etc.) when working with code in this repository.

## Repository Overview

A curated collection of skill packs for AI coding assistants, providing framework-specific knowledge and architecture guidance. Skills follow the Skills CLI ecosystem conventions (see [skills.sh](https://skills.sh/)).

## Project Structure

```
skills/
  specs-workflow/         # the distributable skill package
    SKILL.md              # English skill definition
    GENERATION.md         # Provenance & generation metadata
    CHANGES.md            # Modification changelog
    references/           # Detailed reference documents
skills-zh/
  SKILL.zh.md             # Chinese version of skills/specs-workflow/SKILL.md
commands/*.toml           # Canonical command prompts (Gemini CLI custom commands)
rules/specs-workflow.md   # Canonical compact always-on ruleset
.opencode/commands/       # Derived opencode slash commands
.claude/commands/         # Derived Claude Code slash commands
.cursor/rules/            # Cursor rule adapter (alwaysApply)
.windsurf/rules/          # Windsurf rule adapter
.clinerules/              # Cline rule adapter
.kiro/steering/           # Kiro steering adapter
.agents/rules/            # Agent-compatible rules adapter
.qoder/rules/             # Qoder rules adapter
.github/                  # GitHub Copilot instructions adapter
docs/                     # agent-portability.md (host → file mapping)
scripts/check-sync.js     # Verifies adapters match the canonical sources
example/                  # Reference examples (gitignored), not part of this project
```

### Canonical Sources & Derived Adapters

- `commands/*.toml` is the canonical source for command prompts; `.opencode/commands/*.md` and `.claude/commands/*.md` are derived from it using the host argument variable (`$ARGUMENTS`).
- `rules/specs-workflow.md` is the canonical compact ruleset; all rule adapters copy its body verbatim (host-specific frontmatter only).
- **When modifying**: edit the canonical source first, then regenerate/update the derived files so `node scripts/check-sync.js` passes.

## Chinese/English Sync Rule

- **English version**: `skills/specs-workflow/SKILL.md` — the distributable, canonical skill file.
- **Chinese version**: `skills-zh/SKILL.zh.md` — for Chinese-speaking users, stored separately to keep the `skills/` directory clean.
- **When modifying**: Always update both files simultaneously. Content must be structurally and semantically identical — same sections, same tables, same code blocks, same examples. Only the language differs.

## Skill Document Format

`SKILL.md` files must follow this format:

```markdown
---
name: <skill-name>
description: "<brief description including trigger scenarios>"
---

# <Skill Title>

<One-line overview of what the skill does.>

## When to Use This Skill

<Bullet list of specific scenarios that trigger this skill.>

## Workflow

<Numbered steps describing how the agent should work through the task:>

### Step 1: ...

### Step 2: ...

...

## <Additional Sections>

<Tables for quick reference, layer details, code examples, decision flows, etc.>

## Prohibitions

<What the agent must NOT do.>

## When Unsure

<Fallback behavior when the agent cannot determine the answer.>
```

Key formatting conventions:
- Use **tables** for quick reference data (overview, naming, mappings).
- Use **numbered steps** in the Workflow section for procedural guidance.
- Use **code blocks** for directory trees and commands.
- Use **bullet lists** for scenario descriptions and constraints.
- Keep front matter `description` concise — it determines when the skill is activated.

## Naming Conventions

- **Skill directories**: `kebab-case` (e.g., `vue-tsx`, `find-skills`)
- **SKILL.md**: Always uppercase, always this exact filename
- **SKILL.zh.md**: Always uppercase prefix, always this exact filename
- **GENERATION.md**: Always uppercase, always this exact filename
- **CHANGES.md**: Always uppercase, always this exact filename
- **Reference files**: under `references/`, `kebab-case` or descriptive names

## Context Efficiency Guidelines

Skills are loaded on-demand — the agent sees only the skill name and description at startup. The full `SKILL.md` is read into context only when the agent decides the skill is relevant. To minimize context:

- **Keep SKILL.md under 500 lines** — put detailed reference material in `references/`
- **Write specific descriptions** — helps the agent know exactly when to activate
- **Use progressive disclosure** — link to reference files that get read only when needed
- **Front-load key information** — put the most important guidance early

## Working with Skills in This Repo

### Adding a New Skill

1. Create `skills/<skill-name>/` with:
   - `SKILL.md` (English, following the format above)
   - `GENERATION.md` (metadata: source, git SHA, generation date)
   - `CHANGES.md` (changelog in Chinese)
   - `references/` (optional, for supplementary docs)
2. Create `skills-zh/<skill-name>/` with:
   - `SKILL.zh.md` (Chinese, structurally identical to the English version)
3. Update `README.md` and `README.zh-CN.md` with the new skill entry and install command.

### Modifying an Existing Skill

1. Edit `skills/<skill-name>/SKILL.md` (English) first.
2. Synchronize all changes to `zh/<skill-name>/SKILL.zh.md` (Chinese).
3. Update `skills/<skill-name>/CHANGES.md` with the modification record.
4. If the skill's scope, description, or install instructions change, update `README.md` and `README.zh-CN.md`.

### Verifying Consistency

After modifying a skill, compare section headers to ensure both language versions are aligned:

```bash
grep -n '^##' skills/<skill-name>/SKILL.md
grep -n '^##' skills-zh/<skill-name>/SKILL.zh.md
```

Line counts and section numbers should match.

## Current Skills

| Skill | Description | Directory |
|---|---|---|
| specs-workflow | Spec-driven workflow (`.agents/specs/` requirements/design/tasks/CHANGELOG convention) | `skills/specs-workflow/` |

## Build / Test / Lint

This repository has no build pipeline or linter configuration. The one automated check keeps the multi-tool adapters aligned with the canonical sources:

```bash
node scripts/check-sync.js   # or: npm test
```

It fails if a rule adapter body (including the `AGENTS.md` marked ruleset section) drifts from `rules/specs-workflow.md`, or a `.opencode/` / `.claude/` command drifts from its `commands/*.toml` prompt. Otherwise verification is manual — review the rendered markdown and check for structural consistency between language versions.

## Specs Workflow Ruleset (distribution copy)

The marked block below is a verbatim distribution copy of `rules/specs-workflow.md` (the canonical compact ruleset). Hosts that auto-read `AGENTS.md` (Amp, Zed, Jules, Codex extension, Antigravity, CodeWhale, …) load it as always-on context when working from a checkout of this repo. Edit the canonical source, not this copy — `node scripts/check-sync.js` verifies the copy.

<!-- specs-workflow:ruleset:start -->

# Specs Workflow

Work spec-first in this project. Before writing code for a new module or feature, write the `.agents/specs/` documents first, keep them traceable, and keep the module status table current. The full workflow, templates, and prompting depth live in the `specs-workflow` skill (load it when available).

## Mandatory Rules

1. Before coding, create `.agents/specs/<module>/` with `requirements.md`, `design.md`, `tasks.md`, and `CHANGELOG.md`, and fill in the requirements. Add a row for the module in the `.agents/specs/index.md` status table and a row per task in its Task Summary table.
2. Keep traceability: every task references the requirement clauses it implements with `_Requirements: x.y, x.z_`; every design Correctness Property marks `**Validates: Requirements x.y**`. No dangling references.
3. Record design revisions in `CHANGELOG.md`; never create `v1.md` / `v2.md` version files.
4. Shared facilities reused by multiple modules get their own spec directory under `.agents/specs/shared/`.
5. Check off completed tasks `- [x]` and keep the `.agents/specs/index.md` status and Task Summary tables in sync (`draft` → `design` → `implementing` → `implemented` → `archived`). The index is the single source of task status; derive its `Progress` column, status bar, next task, and next gate from the task checkboxes and dependencies.
6. On acceptance, mark the module `archived` in the `.agents/specs/index.md` status table. The module directory stays in place; git history preserves the documents.
7. Read `.agents/specs/index.md` before any module document; use its Task Summary to determine which tasks to execute and load module docs on demand — do not read every module's documents upfront.
8. Derive the next task and next gate from dependencies: the next task is the first todo task (`[ ]`) whose `Depends on` are all done; the next gate is the next unchecked phase-terminal (Checkpoint) task. Record the result in the index status bar.

## Document Formats

- `index.md`: resident index — a top status bar (`📍 状态栏`: active module + status · done/total · blocked · next task · next gate · last updated), Module Status Table (`Module | Status | Progress | Depends on | Notes`, with `Progress` = `done/total (pct)`), Task Summary table (`Task | Status | Module | Title | Depends on`, with `Task` = globally unique `<module>.<N.M>` mirroring `tasks.md` checkboxes), execution order/dependencies, and a Change Log.
- `requirements.md`: `Requirement N` (integer, incrementing) + User Story (*As a `<role>` / I want `<capability>` / so that `<value>`*) + Acceptance Criteria numbered `N.M` in the `THE <System> SHALL` / `WHEN` / `IF` / `WHILE` forms, plus composite `AND` / `OR` conditions and state-based, performance, and security variants, every one machine-testable and together covering the happy path, boundary conditions, and error/exclusion cases.
- `design.md`: Overview (positioning + key trade-offs) / Architecture (layers + data flow with a Mermaid diagram; explain *why* the split) / Components & Composables (interface, responsibility, structured pseudocode) / Interfaces & Data Models (types, fields, defaults, optionality) / Key Decisions (decision records: context, options considered with pros/cons/effort, chosen option, rationale) / Error Handling (scenario/handling table) / Correctness Properties (`*For any* <precondition>, <conclusion>`, each marked `**Validates: Requirements x.y**`).
- `tasks.md`: hierarchical tasks numbered `N.M` (decoupled from requirement numbers), split by **dependency**, sequenced by a stated strategy (Foundation-First / Feature-Slice / Risk-First / Hybrid), each referencing `_Requirements: x.y_`, optional/MVP-skippable subtasks marked `*`, Checkpoint tasks that run the tests/build at meaningful milestones, and a JSON Task Dependency Graph (ordered waves). Task status is maintained in `.agents/specs/index.md`, not in a second status block.
- `CHANGELOG.md`: dated entries with what changed and the rationale.

## Prohibitions

- No code before the module's `.agents/specs/<module>/` documents (at minimum `requirements.md`) exist and are filled in.
- No reading every module's documents upfront; read `.agents/specs/index.md` first and load only what the current task needs.
- No versioned design files (`v1.md` / `v2.md`); use `CHANGELOG.md` instead.
- No skipping `_Requirements:` references in tasks or `**Validates:**` annotations in design properties.
- No leaving completed tasks unchecked or the status/Task Summary tables out of sync.
- No leaving the index status bar or the `Progress` column stale relative to the task checkboxes.
- No duplicating shared infrastructure requirements across modules; extract them to `.agents/specs/shared/`.

## Naming Conventions

| Item | Convention |
|------|------------|
| Module directory | Lowercase `kebab-case` |
| Status values | `draft` / `design` / `implementing` / `implemented` / `archived` |
| Requirement numbering | `Requirement N`; acceptance criteria `N.M` |
| Task numbering | Hierarchical `N.M`, decoupled from requirement numbers |

<!-- specs-workflow:ruleset:end -->
