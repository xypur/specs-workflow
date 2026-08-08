# specs-workflow

[English](./README.md) | 中文

面向 AI 编码助手的规范驱动工作流（spec-driven workflow）。在写代码之前，每个模块在 `.specs/` 下获得 `requirements.md`、`design.md`、`tasks.md`、`CHANGELOG.md`，保持相互可追溯，并通过 `.specs/index.md` 同步状态。`.specs/index.md` 是渐进式披露索引：顶部状态栏（done/blocked、由依赖推导的下一任务与下一门禁）、含 `Progress` 的模块状态总表与任务摘要表让代理确定要执行哪些任务，模块文档按需加载 —— 只加载当前任务涉及的模块。每个 `tasks.md` 末尾有模块状态块（进度 · 当前任务 · 门禁链）。

本仓库是可移植分发：一个技能 + 一个紧凑规则集，以薄适配器的形式分发到多个 AI CLI 工具。

## 包含内容

- **`skills/specs-workflow/`** — 完整技能（`SKILL.md` + `references/`，含文件模板、提示深度指引、质量清单与追溯示例）。由支持技能的代理按需加载。
- **`commands/*.toml`** — 命令提示词规范源（Gemini CLI 自定义指令）。
- **`rules/specs-workflow.md`** — 紧凑常驻规则集规范源（强制规则 + 文档格式 + 禁止事项）。
- **适配器** — 上述内容的各工具副本。

## 安装

| 工具 | 方式 | 得到什么 |
|------|------|----------|
| opencode | 将 `.opencode/commands/*.md` 复制到项目的 `.opencode/commands/`（或全局 `~/.config/opencode/commands/`） | `/specs`、`/specs-init`、`/specs-requirements`、`/specs-design`、`/specs-tasks` |
| Claude Code | 将 `.claude/commands/*.md` 复制到项目的 `.claude/commands/` | 同样的五个斜杠指令 |
| Gemini CLI | 将 `commands/*.toml` 复制到项目的 `commands/` | 同样的五个斜杠指令 |
| Cursor | 将 `.cursor/rules/specs-workflow.mdc` 复制到项目的 `.cursor/rules/` | 常驻的规范先行规则 |
| Windsurf | 将 `.windsurf/rules/specs-workflow.md` 复制到项目的 `.windsurf/rules/` | 常驻的规范先行规则 |
| Cline | 将 `.clinerules/specs-workflow.md` 复制到项目的 `.clinerules/` | 常驻的规范先行规则 |
| Kiro | 将 `.kiro/steering/specs-workflow.md` 复制到 `~/.kiro/steering/` 或项目的 `.kiro/steering/` | 常驻的规范先行规则 |
| Qoder | 将 `.qoder/rules/specs-workflow.md` 复制到项目的 `.qoder/rules/` | 常驻的规范先行规则 |
| GitHub Copilot | 将 `.github/copilot-instructions.md` 复制到仓库 | 仓库级规范先行指令 |
| 通用代理 | 复制 `rules/specs-workflow.md` 或加载 `skills/specs-workflow/SKILL.md` | 规则集或完整技能 |

### 技能

使用 [Skills CLI](https://skills.sh/) 安装完整的 `specs-workflow` 技能：

```bash
npx skills add https://github.com/xypur/specs-workflow --skill specs-workflow
```

技能本身可用于任何支持技能的宿主（Claude Code、Codex、opencode、Gemini、Qoder、Devin 等）：把 `skills/specs-workflow/` 注册为技能，遇到 `.specs/` 相关工作即会激活。

完整的宿主 → 文件映射见 [docs/agent-portability.md](docs/agent-portability.md)。

## 指令

| 指令 | 作用 |
|------|------|
| `/specs <需求描述>` | 统一入口：描述功能，一次性为推导出的模块创建四个 spec 文档。下列指令是其分步 / 单文档变体。 |
| `/specs-init` | 初始化 `.specs/`（索引：状态栏 + 状态总表 + 任务摘要表 + 依赖） |
| `/specs-requirements <module>` | 创建/更新模块的 `requirements.md` |
| `/specs-design <module>` | 创建/更新模块的 `design.md` |
| `/specs-tasks <module>` | 创建/更新模块的 `tasks.md` |

`/specs` 接收自由文本的 `<需求描述>`；若省略，代理会先询问。各 `<module>` 指令接收模块名；若省略，代理会先询问。

## 开发

派生适配器必须与规范源保持一致：

```bash
node scripts/check-sync.js   # 或：npm test
```

检查验证：(a) 每个规则适配器正文等于 `rules/specs-workflow.md`；(b) 每个 `.opencode/` 与 `.claude/` 指令等于其 `commands/*.toml` 提示词（`{{args}}` → `$1`）。中英文两条链都会校验。
