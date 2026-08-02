# specs-workflow

Spec-driven workflow for AI coding assistants. Before code is written, every module gets `requirements.md`, `design.md`, `tasks.md`, and `CHANGELOG.md` under `.specs/`, kept traceable to each other and synced through `.specs/index.md`.

This repo is a portable distribution: one skill + one compact ruleset, shipped as thin adapters for multiple AI CLI tools.

## What's in the box

- **`skills/specs-workflow/`** — the full skill (`SKILL.md` + `references/` with file templates, prompting guidance, quality checklists, and a traceability example). Loaded on demand by skill-capable agents.
- **`commands/*.toml`** — canonical command prompts (Gemini CLI custom commands).
- **`rules/specs-workflow.md`** — canonical compact always-on ruleset (mandatory rules + document formats + prohibitions).
- **Adapters** — tool-specific copies of the above.

## Install

| Tool | How | What you get |
|------|-----|--------------|
| opencode | Copy `.opencode/commands/*.md` into the project's `.opencode/commands/` (or global `~/.config/opencode/commands/`) | `/specs`, `/specs-init`, `/specs-requirements`, `/specs-design`, `/specs-tasks` |
| Claude Code | Copy `.claude/commands/*.md` into the project's `.claude/commands/` | Same five slash commands |
| Gemini CLI | Copy `commands/*.toml` into the project's `commands/` | Same five slash commands |
| Cursor | Copy `.cursor/rules/specs-workflow.mdc` into the project's `.cursor/rules/` | Always-on spec-first rule |
| Windsurf | Copy `.windsurf/rules/specs-workflow.md` into the project's `.windsurf/rules/` | Always-on spec-first rule |
| Cline | Copy `.clinerules/specs-workflow.md` into the project's `.clinerules/` | Always-on spec-first rule |
| Kiro | Copy `.kiro/steering/specs-workflow.md` into `~/.kiro/steering/` or the project's `.kiro/steering/` | Always-on spec-first rule |
| Qoder | Copy `.qoder/rules/specs-workflow.md` into the project's `.qoder/rules/` | Always-on spec-first rule |
| GitHub Copilot | Copy `.github/copilot-instructions.md` into the repo | Repo-wide spec-first instructions |
| Generic agents | Copy `rules/specs-workflow.md` or load `skills/specs-workflow/SKILL.md` | Ruleset or full skill |

The skill itself works in any skill-capable host (Claude Code, Codex, opencode, Gemini, Qoder, Devin, etc.): register `skills/specs-workflow/` as a skill and it activates on `.specs/` work.

See [docs/agent-portability.md](docs/agent-portability.md) for the full host → file mapping.

## Commands

| Command | What it does |
|---------|--------------|
| `/specs <description>` | Unified entry: describe the feature, creates all four spec documents for the derived module in one pass. The commands below are the step-by-step / single-document variants. |
| `/specs-init [<dir>]` | Bootstrap `.specs/` (index + status table) |
| `/specs-requirements <module>` | Create/update a module's `requirements.md` |
| `/specs-design <module>` | Create/update a module's `design.md` |
| `/specs-tasks <module>` | Create/update a module's `tasks.md` |

The `<module>` argument is passed to the command; if omitted, the agent asks for it.

## Development

The derived adapters must stay aligned with the canonical sources:

```bash
node scripts/check-sync.js   # or: npm test
```

The check verifies (a) every rule adapter body equals `rules/specs-workflow.md`, and (b) every `.opencode/` and `.claude/` command equals its `commands/*.toml` prompt (`{{args}}` → `$1`).
