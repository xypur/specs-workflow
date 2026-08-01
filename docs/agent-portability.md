# Agent Portability

Specs-workflow is an agent-portable skill distribution. The behavior lives in `skills/specs-workflow/` (full skill) and `rules/specs-workflow.md` (compact always-on ruleset); the host-specific files are thin adapters that make the same behavior easy to load in a given agent.

## Supported Adapters

| Host | Files | Notes |
|------|-------|-------|
| opencode | `.opencode/commands/*.md`, `skills/specs-workflow/` | Slash commands `/specs`, `/specs-init`, `/specs-requirements`, `/specs-design`, `/specs-tasks`. The skill is loaded on demand via the skill tool. |
| Claude Code | `.claude/commands/*.md`, `skills/specs-workflow/` | Custom slash commands; the skill is loaded on demand when available. |
| Gemini CLI | `commands/*.toml` | Custom commands auto-discovered (`/specs`, `/specs-init`, `/specs-requirements`, `/specs-design`, `/specs-tasks`); `{{args}}` is the argument placeholder. |
| Cursor | `.cursor/rules/specs-workflow.mdc` | Always-on project rule. |
| Windsurf | `.windsurf/rules/specs-workflow.md` | Project rule. |
| Cline | `.clinerules/specs-workflow.md` | Project rule. |
| Kiro | `.kiro/steering/specs-workflow.md` | Steering rule; copy globally (`~/.kiro/steering/`) or into a project. |
| Qoder | `.qoder/rules/specs-workflow.md` | Project rule (Qoder also auto-loads `AGENTS.md`). |
| GitHub Copilot | `.github/copilot-instructions.md` | Repository instruction file. |
| Generic agents | `rules/specs-workflow.md` or `skills/specs-workflow/SKILL.md` | Copy the compact ruleset or load the skill directly. |

## Canonical Sources

| Source | Purpose |
|--------|---------|
| `commands/*.toml` | Canonical command prompts; `.opencode/commands/` and `.claude/commands/` files are derived from it (`{{args}}` → `$1`). |
| `rules/specs-workflow.md` | Canonical compact ruleset; all rule adapters copy its body verbatim (host frontmatter only). |
| `skills/specs-workflow/SKILL.md` | Full skill definition with templates and prompting depth. |

## Sync

Keep the adapters aligned with the canonical sources — run the check after any edit:

```bash
node scripts/check-sync.js
```

It verifies (a) every rule adapter body equals `rules/specs-workflow.md`, and (b) every `.opencode/` + `.claude/` command equals its `commands/*.toml` prompt.
