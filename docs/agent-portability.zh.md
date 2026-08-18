# 多工具移植（Agent Portability）

Specs-workflow 是可移植的 AI 技能分发。核心行为在 `skills/specs-workflow/`（完整技能）与 `rules/specs-workflow.md`（紧凑常驻规则集）中；各宿主文件是让同一行为在特定代理中易于加载的薄适配器。该工作流采用渐进式披露：代理先读 `.specs/index.md`（模块状态 + 任务摘要表），再按需加载相关模块文档。

## 支持的适配器

| 宿主 | 文件 | 说明 |
|------|------|------|
| opencode | `.opencode/commands/*.md`、`skills/specs-workflow/` | 斜杠指令 `/specs`、`/specs-init`、`/specs-requirements`、`/specs-design`、`/specs-tasks`。技能通过 skill 工具按需加载。 |
| Claude Code | `.claude/commands/*.md`、`skills/specs-workflow/` | 自定义斜杠指令；可用时按需加载技能。 |
| Gemini CLI | `commands/*.toml` | 自动发现的自定义指令（`/specs`、`/specs-init`、`/specs-requirements`、`/specs-design`、`/specs-tasks`）；`{{args}}` 为参数占位符。 |
| Cursor | `.cursor/rules/specs-workflow.mdc` | 常驻项目规则。 |
| Windsurf | `.windsurf/rules/specs-workflow.md` | 项目规则。 |
| Cline | `.clinerules/specs-workflow.md` | 项目规则。 |
| Kiro | `.kiro/steering/specs-workflow.md` | Steering 规则；可全局（`~/.kiro/steering/`）或按项目复制。 |
| Qoder | `.qoder/rules/specs-workflow.md` | 项目规则（Qoder 也会自动加载 `AGENTS.md`）。 |
| GitHub Copilot | `.github/copilot-instructions.md` | 仓库级指令文件。 |
| 通用代理 | `rules/specs-workflow.md` 或 `skills/specs-workflow/SKILL.md` | 复制紧凑规则集或直接加载技能。 |

## 规范源

| 源 | 用途 |
|----|------|
| `commands/*.toml` | 命令提示词规范源；`.opencode/commands/` 与 `.claude/commands/` 由它派生，并使用宿主参数变量（`$ARGUMENTS`）。 |
| `rules/specs-workflow.md` | 紧凑规则集规范源；所有规则适配器原样复制其正文（仅宿主 frontmatter 不同）。 |
| `skills/specs-workflow/SKILL.md` | 完整技能定义，含模板与提示深度。 |

中文参考：`SKILL.zh.md` 与 `rules/specs-workflow.zh.md` 位于 `zh/`，仅供中文用户参考，不被各宿主自动加载。

## 同步

保持适配器与规范源对齐——任何修改后运行检查：

```bash
node scripts/check-sync.js
```

它验证：(a) 每个规则适配器正文等于 `rules/specs-workflow.md`；(b) 每个 `.opencode/` + `.claude/` 指令等于其 `commands/*.toml` 提示词。
