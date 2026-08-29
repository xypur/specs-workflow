# Agent Portability

Specs-workflow is an agent-portable skill distribution. The behavior lives in `skills/specs-workflow/` (full skill) and `rules/specs-workflow.md` (compact always-on ruleset); the host-specific files are thin adapters that make the same behavior easy to load in a given agent. The workflow uses progressive disclosure: agents read `.agents/specs/index.md` (module status + Task Summary) first, then load only the relevant module documents on demand.

Adapters come in three tiers — a host may appear in several:

1. **Instruction tier** — always-on rule files; discipline depends on the agent following them.
2. **Plugin tier** — one-command native install; bundles slash commands + skill (+ hooks where supported).
3. **Runtime tier** — lifecycle hooks / extensions that inject a reminder every session (and into subagents), so the workflow does not rely on recall.

## Instruction Tier

| Host | Files | Notes |
|------|-------|-------|
| AGENTS.md hosts (Amp, Zed, Jules, Codex extension, Antigravity, CodeWhale, JetBrains Junie, Copilot CLI fallback, Qoder, …) | The marked ruleset section in the repo's root `AGENTS.md` | Any host that auto-reads `AGENTS.md` gets the ruleset when running from a checkout. Two usage modes: (a) run the agent from a checkout of this repo and it loads automatically; (b) copy the marked section into your project's or global `AGENTS.md`. Rules only, no slash commands. |
| Cursor | `.cursor/rules/specs-workflow.mdc` | Always-on project rule. |
| Cline | `.clinerules/specs-workflow.md` | Project rule. |
| GitHub Copilot | `.github/copilot-instructions.md` | Repository instruction file. |
| Other hosts (Windsurf, Kiro, Qoder per-project rules, …) | copy the body of `rules/specs-workflow.md` into the host's own rule file | Same canonical ruleset; no per-host adapter file is shipped. |

## Plugin Tier

| Host | Manifest | Install | What you get |
|------|----------|---------|--------------|
| Claude Code | `.claude-plugin/plugin.json` + `marketplace.json` | `/plugin marketplace add xypur/specs-workflow` → `/plugin install specs-workflow@specs-workflow` | The five `/specs*` commands + the skill + hooks (runtime tier). |

Uninstall: `/plugin remove specs-workflow` (Claude Code). Codex and GitHub Copilot CLI are covered instruction-tier via `AGENTS.md`; their native plugin manifests were removed as unmaintainable (see the `adapter-slimming` spec).

## Runtime Tier

| Host | Files | Behavior |
|------|-------|----------|
| Claude Code (via plugin) | `hooks/specs-hooks.json` + `hooks/specs-reminder.js` | `SessionStart` + `SubagentStart`: when the cwd has `.agents/specs/index.md`, inject a compact workflow reminder; silent otherwise; always exit 0. The script also detects Codex (`PLUGIN_DATA`), so a manually wired Codex hook gets the same JSON output. |
| pi | `pi-extension/index.js` (package manifest in root `package.json`) | `pi install git:github.com/xypur/specs-workflow` (or a local checkout path). Registers `/specs*` commands parsed at runtime from `commands/*.toml`, and appends the same reminder to the system prompt every turn while `.agents/specs/` exists. Also distributes `skills/`. |

## Slash Commands (copy-install)

| Host | Files | Notes |
|------|-------|-------|
| opencode | `.opencode/commands/*.md` | Copy into the project's `.opencode/commands/` (or global `~/.config/opencode/commands/`). `/specs`, `/specs-init`, `/specs-requirements`, `/specs-design`, `/specs-tasks`. |
| Claude Code | `.claude/commands/*.md` | Copy into the project's `.claude/commands/`. Same five commands. |
| Gemini CLI | `commands/*.toml` | Auto-discovered; `{{args}}` is the argument placeholder. |

## Generic Agents

Copy `rules/specs-workflow.md` into any instruction surface, or load `skills/specs-workflow/SKILL.md` directly.

## Canonical Sources

| Source | Purpose |
|--------|---------|
| `commands/*.toml` | Canonical command prompts; `.opencode/commands/` and `.claude/commands/` files are derived from it using the host argument variable (`$ARGUMENTS`); the pi extension parses it at runtime. |
| `rules/specs-workflow.md` | Canonical compact ruleset; all rule adapters copy its body verbatim (host frontmatter only), including the marked section in the repo's own `AGENTS.md`. |
| `skills/specs-workflow/SKILL.md` | Full skill definition with templates and prompting depth. |

## Sync

Keep the adapters aligned with the canonical sources — run the check after any edit:

```bash
node scripts/check-sync.js
```

It verifies (a) every rule adapter body equals `rules/specs-workflow.md` (including the marked ruleset section in `AGENTS.md`), and (b) every `.opencode/` + `.claude/` command equals its `commands/*.toml` prompt.
