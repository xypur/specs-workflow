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
zh/
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
- **Chinese version**: `zh/SKILL.zh.md` — for Chinese-speaking users, stored separately to keep the `skills/` directory clean.
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
2. Create `zh/<skill-name>/` with:
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
grep -n '^##' zh/<skill-name>/SKILL.zh.md
```

Line counts and section numbers should match.

## Current Skills

| Skill | Description | Directory |
|---|---|---|
| specs-workflow | Spec-driven workflow (`.specs/` requirements/design/tasks/CHANGELOG convention) | `skills/specs-workflow/` |

## Build / Test / Lint

This repository has no build pipeline or linter configuration. The one automated check keeps the multi-tool adapters aligned with the canonical sources:

```bash
node scripts/check-sync.js   # or: npm test
```

It fails if a rule adapter body drifts from `rules/specs-workflow.md`, or a `.opencode/` / `.claude/` command drifts from its `commands/*.toml` prompt. Otherwise verification is manual — review the rendered markdown and check for structural consistency between language versions.
