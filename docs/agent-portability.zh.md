# 多工具移植（Agent Portability）

Specs-workflow 是可移植的 AI 技能分发。核心行为在 `skills/specs-workflow/`（完整技能）与 `rules/specs-workflow.md`（紧凑常驻规则集）中；各宿主文件是让同一行为在特定代理中易于加载的薄适配器。该工作流采用渐进式披露：代理先读 `.agents/specs/index.md`（模块状态 + 任务摘要表），再按需加载相关模块文档。

适配器分三个层级——同一宿主可出现在多个层级：

1. **指令层（instruction）**——常驻规则文件；纪律依赖代理自觉遵守。
2. **插件层（plugin）**——一条命令原生安装；打包斜杠指令 + 技能（部分宿主还含 hooks）。
3. **运行时层（runtime）**——生命周期 hooks / 扩展在每次会话（含子代理）注入提醒，使工作流不依赖代理自发回忆。

## 指令层

| 宿主 | 文件 | 说明 |
|------|------|------|
| AGENTS.md 宿主（Amp、Zed、Jules、Codex 扩展、Antigravity、CodeWhale、JetBrains Junie、Copilot CLI 回退等） | 仓库根 `AGENTS.md` 中的标记规则区块 | 任何自动读取 `AGENTS.md` 的宿主在 checkout 中运行即可生效。两种使用方式：(a) 从本仓库 checkout 运行代理，自动加载；(b) 将标记区块复制到项目或全局 `AGENTS.md`。仅规则，无斜杠指令。 |
| Cursor | `.cursor/rules/specs-workflow.mdc` | 常驻项目规则。 |
| Windsurf | `.windsurf/rules/specs-workflow.md` | 项目规则。 |
| Cline | `.clinerules/specs-workflow.md` | 项目规则。 |
| Kiro | `.kiro/steering/specs-workflow.md` | Steering 规则；可全局（`~/.kiro/steering/`）或按项目复制。 |
| Qoder | `.qoder/rules/specs-workflow.md` | 项目规则（Qoder 也会自动加载 `AGENTS.md`）。 |
| GitHub Copilot | `.github/copilot-instructions.md` | 仓库级指令文件。 |

## 插件层

| 宿主 | Manifest | 安装 | 得到什么 |
|------|----------|------|----------|
| Claude Code | `.claude-plugin/plugin.json` + `marketplace.json` | `/plugin marketplace add xypur/specs-workflow` → `/plugin install specs-workflow@specs-workflow` | 五个 `/specs*` 指令 + 技能 + hooks（运行时层）。 |
| Codex | `.codex-plugin/plugin.json` | `codex plugin marketplace add xypur/specs-workflow` → `codex plugin add specs-workflow@specs-workflow` | 技能 + hooks（运行时层）。 |
| GitHub Copilot CLI | `.github/plugin/plugin.json` + `marketplace.json` | `copilot plugin marketplace add xypur/specs-workflow` → `copilot plugin install specs-workflow@specs-workflow` | 五个 `/specs*` 指令 + 技能。 |

卸载：`/plugin remove specs-workflow`（Claude Code）、`codex plugin remove specs-workflow`（Codex）、`copilot plugin uninstall specs-workflow`（Copilot CLI）。

## 运行时层

| 宿主 | 文件 | 行为 |
|------|------|------|
| Claude Code、Codex（经插件） | `hooks/specs-hooks.json` + `hooks/specs-reminder.js` | `SessionStart` + `SubagentStart`：当 cwd 存在 `.agents/specs/index.md` 时注入紧凑工作流提醒；否则无输出；恒以退出码 0 结束。两个宿主共用同一 hooks 文件。 |
| pi | `pi-extension/index.js`（包清单在根 `package.json`） | `pi install git:github.com/xypur/specs-workflow`（或本地 checkout 路径）。注册从 `commands/*.toml` 运行时解析的 `/specs*` 指令，并在 `.agents/specs/` 存在时每轮向系统提示词追加同一提醒。同时分发 `skills/`。 |

## 斜杠指令（复制安装）

| 宿主 | 文件 | 说明 |
|------|------|------|
| opencode | `.opencode/commands/*.md` | 复制到项目的 `.opencode/commands/`（或全局 `~/.config/opencode/commands/`）。`/specs`、`/specs-init`、`/specs-requirements`、`/specs-design`、`/specs-tasks`。 |
| Claude Code | `.claude/commands/*.md` | 复制到项目的 `.claude/commands/`。同样的五个指令。 |
| Gemini CLI | `commands/*.toml` | 自动发现；`{{args}}` 为参数占位符。 |

## 通用代理

将 `rules/specs-workflow.md` 复制到任意指令面，或直接加载 `skills/specs-workflow/SKILL.md`。

## 规范源

| 源 | 用途 |
|----|------|
| `commands/*.toml` | 命令提示词规范源；`.opencode/commands/` 与 `.claude/commands/` 由它派生，并使用宿主参数变量（`$ARGUMENTS`）；pi 扩展在运行时解析它。 |
| `rules/specs-workflow.md` | 紧凑规则集规范源；所有规则适配器原样复制其正文（仅宿主 frontmatter 不同），包括本仓库自身 `AGENTS.md` 中的标记区块。 |
| `skills/specs-workflow/SKILL.md` | 完整技能定义，含模板与提示深度。 |

中文参考：`SKILL.zh.md` 与 `rules/specs-workflow.zh.md` 位于 `skills-zh/`，仅供中文用户参考，不被各宿主自动加载。

## 同步

保持适配器与规范源对齐——任何修改后运行检查：

```bash
node scripts/check-sync.js
```

它验证：(a) 每个规则适配器正文等于 `rules/specs-workflow.md`（含 `AGENTS.md` 中的标记规则区块）；(b) 每个 `.opencode/` + `.claude/` 指令等于其 `commands/*.toml` 提示词。
