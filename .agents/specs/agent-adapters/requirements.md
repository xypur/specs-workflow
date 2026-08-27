# Requirements Document

## Introduction

本模块（agent-adapters）为 specs-workflow 补齐与 ponytail 对齐的 AI Agent 工具适配能力：以 AGENTS.md 形态分发规则集、提供 Claude Code / Codex / Copilot CLI 插件级安装、增加运行时 hooks 常驻提醒、提供 pi 扩展，并以 CI 固化同步校验，使 spec 纪律覆盖"指令层 / 插件层 / 运行时层"三个层级。

## Glossary

- **指令层（instruction tier）**：host 通过读取项目内规则文件（AGENTS.md、.cursor/rules 等）获得 always-on 行为约束的适配方式。
- **插件层（plugin tier）**：host 通过原生插件机制（manifest + 一条安装命令）同时获得命令、skill 与 hooks 的适配方式。
- **运行时层（runtime tier）**：通过生命周期 hooks 在会话/子代理启动时注入提醒的适配方式。
- **Thin adapter**：适配文件只引用既有 canonical 源（ruleset / commands / skills），不复制正文。
- **canonical ruleset**：`rules/specs-workflow.md`，所有规则副本的单一事实源。

## Requirements

### Requirement 1：AGENTS.md 规则集分发（指令层扩容）

**User Story:** 作为使用自动读取 `AGENTS.md` 的 agent（Amp、Zed、Jules、Junie、Codex 扩展、Antigravity、CodeWhale 等）的用户，我希望规则集以 AGENTS.md 形态随仓库分发，从而零配置获得 spec 纪律（checkout 自动加载，或单文件复制进目标项目）。

#### Acceptance Criteria

1. 根目录 `AGENTS.md` SHALL 包含一个以 HTML 注释标记的区块（起始/结束标记），区块内规则正文与 `rules/specs-workflow.md` 主体逐字一致，且不破坏原有仓库贡献者指南。
2. THE 同步校验脚本（`node scripts/check-sync.js`）SHALL 校验该标记区块与 canonical ruleset 一致，并在漂移时以非零退出码失败。
3. THE `docs/agent-portability.md` SHALL 列出自动读取 AGENTS.md 的 host，并说明两种使用方式（checkout 自动加载 / 复制进项目与全局路径）。
4. THE `README.md` 与 `README.zh-CN.md` 的安装表 SHALL 增加 AGENTS.md 行，且两份文档结构一致。

### Requirement 2：插件级安装（Claude Code / Codex / Copilot CLI）

**User Story:** 作为 Claude Code、Codex 或 Copilot CLI 用户，我希望通过一条插件安装命令同时获得 `/specs*` 命令、specs-workflow skill 与 hooks，而不必手动逐个复制文件。

#### Acceptance Criteria

1. 仓库 SHALL 提供 `.claude-plugin/plugin.json` 与 `.claude-plugin/marketplace.json`，支持 `/plugin marketplace add <owner>/specs-workflow` 加 `/plugin install` 两步安装。
2. WHEN 插件安装完成，THEN host SHALL 能发现 `/specs`、`/specs-init`、`/specs-requirements`、`/specs-design`、`/specs-tasks` 五个命令与 specs-workflow skill。
3. THE `.codex-plugin/plugin.json` SHALL 声明 skills 与 hooks 入口，使 `codex plugin marketplace add` + `codex plugin add` 安装路径可用。
4. THE `.github/plugin/` SHALL 提供 `plugin.json` 与 `marketplace.json`，支持 Copilot CLI 的 marketplace 安装路径。
5. 所有插件 manifest SHALL 仅以路径引用既有 `skills/`、命令与 hooks 文件，不得复制规则或命令正文。
6. THE `README.md` 与 `README.zh-CN.md` SHALL 记录各插件的安装与卸载命令。

### Requirement 3：运行时常驻提醒（hooks）

**User Story:** 作为通过插件安装 specs-workflow 的用户，我希望 agent 每次会话（含 subagent）在项目存在 `.agents/specs/` 时被提醒遵守 spec 工作流，使工作流执行不依赖 agent 的自发回忆。

#### Acceptance Criteria

1. THE `hooks/specs-hooks.json` SHALL 注册 SessionStart 与 SubagentStart 两类生命周期 hook，并供 Claude Code 与 Codex 插件 manifest 共用同一文件。
2. WHEN 会话或 subagent 的 cwd 存在 `.agents/specs/index.md`，THEN hook 脚本 SHALL 输出一段紧凑提醒（先读 index.md、按需加载模块文档、同步状态表）；IF 该文件不存在，THEN 脚本 SHALL 不输出任何内容。
3. THE 提醒文本 SHALL 与 `skills/specs-workflow/SKILL.md` 的核心工作流语义一致，且长度不超过 10 行。
4. THE hook 脚本 SHALL 仅依赖 Node.js 内置模块，捕获全部异常并始终以退出码 0 结束，任何情况下不得阻塞或向宿主报错。

### Requirement 4：pi 扩展

**User Story:** 作为 pi agent harness 的用户，我希望通过 `pi install` 安装扩展，获得 `/specs*` 命令与同等的会话启动提醒。

#### Acceptance Criteria

1. THE `pi-extension/` SHALL 提供可通过 pi 包机制安装的扩展入口（含打包元数据）。
2. THE 扩展 SHALL 注册 `/specs`、`/specs-init`、`/specs-requirements`、`/specs-design`、`/specs-tasks` 五个命令，提示词与 `commands/*.toml` 保持同源。
3. WHEN 会话启动且 cwd 存在 `.agents/specs/index.md`，THEN 扩展 SHALL 注入与 Requirement 3 相同语义的启动提醒。
4. THE 扩展 SHALL 在运行时解析 `commands/*.toml` 获取命令提示词，不得在扩展代码中复制提示词正文。

### Requirement 5：CI 与仓库自检

**User Story:** 作为仓库维护者，我希望 push/PR 自动运行同步校验与 specs 结构校验，保证任何 adapter 漂移在合并前即被发现。

#### Acceptance Criteria

1. WHEN 向主分支 push 或发起 PR，THEN GitHub Actions 工作流 SHALL 运行 `node scripts/check-sync.js`（`npm test`），并在校验失败时使 CI 失败。
2. WHEN 本模块全部阶段完成，THEN 本仓库自身 SHALL 通过 `node scripts/check-sync.js` 与 `node scripts/validate-specs.js .`（dogfooding 自检）。

### Requirement 6：文档分层与中英同步

**User Story:** 作为文档读者（含中文用户），我希望 portability 文档按适配层级组织，且所有用户可见文档保持中英同步。

#### Acceptance Criteria

1. THE `docs/agent-portability.md` SHALL 按 instruction / plugin / runtime 三个层级分组列出全部适配（含本模块新增项），`docs/agent-portability.zh.md` SHALL 结构一致。
2. WHEN 任何用户可见文档（README、portability 文档）发生变更，THEN 对应中文文档 SHALL 在同一变更中同步更新。
