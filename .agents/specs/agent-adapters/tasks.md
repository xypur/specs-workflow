# Implementation Plan: agent-adapters

## Overview

分五个阶段推进，采用 **Foundation-First** 策略：Phase 1（AGENTS.md 分发 + check-sync 扩展）是指令层地基，其 gate（1.4）通过后 Phase 2/3/4 与 CI（5.1）并行展开；Phase 5 做跨阶段收尾与全绿验证。每个 Phase 以 Checkpoint 任务收口，验证通过才进入下一阶段。MCP server 依设计决策缓期，不在任务列表中。

## Tasks

### Phase 1: 指令层 — AGENTS.md 分发与同步校验

- [x] 1.1 在根 `AGENTS.md` 追加 `<!-- specs-workflow:ruleset:start/end -->` 标记区块，区块内容为 `rules/specs-workflow.md` 主体逐字拷贝，置于贡献者指南之后
  - 保持区块外原有贡献者指南内容不变
  - _Requirements: 1.1_
- [x] 1.2 扩展 `scripts/check-sync.js`：提取 AGENTS.md 标记区块并与 canonical ruleset 比对，缺失或漂移时报错、非零退出
  - 复用既有 `check()` 输出风格；成功信息更新为包含 AGENTS.md
  - _Requirements: 1.2_
- [x] 1.3 更新 `docs/agent-portability.md`（+zh）与 `README.md`（+zh）：新增 AGENTS.md 行、列出自动读取 AGENTS.md 的 host 与两种使用方式
  - 同一变更内同步 zh 文档
  - _Requirements: 1.3, 1.4, 6.1, 6.2_
- [x] 1.4 Checkpoint — Phase 1 gate：`node scripts/check-sync.js` 与 `node scripts/validate-specs.js .` 全部通过
  - _Requirements: 1.2_

### Phase 2: 插件层 — Claude Code / Codex / Copilot CLI manifests

- [x] 2.1 新增 `.claude-plugin/plugin.json` 与 `.claude-plugin/marketplace.json`：命令与 skill 按显式路径引用（Decision 2），`hooks` 字段先省略
  - 字段以 Claude Code 插件官方文档为准
  - _Requirements: 2.1, 2.2, 2.5_
- [x] 2.2 新增 `.codex-plugin/plugin.json`：`skills: "./skills/"`，hooks 字段先省略
  - _Requirements: 2.3, 2.5_
- [x] 2.3 新增 `.github/plugin/plugin.json` 与 `marketplace.json`（Copilot CLI marketplace 结构）
  - _Requirements: 2.4, 2.5_
- [x] 2.4 在 `README.md`/`README.zh-CN.md` 增加三个插件的安装与卸载命令表格行
  - _Requirements: 2.6, 6.2_
- [x] 2.5 Checkpoint — Phase 2 gate：至少完成 Claude Code 插件本地安装冒烟验证（marketplace add + install，确认五命令与 skill 可见）；Codex / Copilot CLI 以文档核对替代
  - _Requirements: 2.1, 2.2, 2.4_

### Phase 3: 运行时层 — hooks 常驻提醒

- [x] 3.1 新增 `hooks/specs-reminder.js`：stdin JSON 取 cwd，存在 `.agents/specs/index.md` 时输出 ≤10 行工作流提醒，否则空输出；全文 try/catch、零依赖、恒 exit 0
  - 提醒文本与 SKILL.md 工作流语义一致（先读 index → 按需加载 → 同步状态）
  - _Requirements: 3.2, 3.3, 3.4_
- [x] 3.2 新增 `hooks/specs-hooks.json`（SessionStart + SubagentStart），并在 `.claude-plugin/plugin.json` 与 `.codex-plugin/plugin.json` 接入 `hooks` 字段
  - _Requirements: 3.1_
- [x] 3.3 Checkpoint — Phase 3 gate：本地验证 hook 行为（有/无 `.agents/specs/` 两种 cwd、非法 stdin），确认空输出与 exit 0
  - _Requirements: 3.2, 3.4_

### Phase 4: pi 扩展

- [x] 4.1 新增 `pi-extension/index.js`：扩展骨架，运行时解析 `commands/*.toml`（内置迷你解析器）并注册 `/specs`、`/specs-init`、`/specs-requirements`、`/specs-design`、`/specs-tasks`
  - `{{args}}` 透传命令参数；解析失败跳过该项并提示，不中断加载
  - _Requirements: 4.1, 4.2, 4.4_
- [x] 4.2 在扩展 `session_start` 事件中实现启动提醒：条件与文案语义同 `hooks/specs-reminder.js`
  - _Requirements: 4.3_
- [x] 4.3 新增 `pi-extension/package.json` 打包元数据，支持 `pi install`（本地路径）
  - 注：打包元数据落在根 `package.json` 的 `pi` 清单（git 安装时包根为仓库根，子目录清单不会被读取），同时分发 `skills/`
  - _Requirements: 4.1_
- [x] 4.4 Checkpoint — Phase 4 gate：`pi install` 本地安装后验证五命令提示词与 TOML 同源、提醒注入条件正确
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

### Phase 5: CI 与收尾

- [x] 5.1 新增 `.github/workflows/ci.yml`：push/PR 运行 `node scripts/check-sync.js`（npm test）
  - _Requirements: 5.1_
- [x] 5.2 全量一致性收尾：portability 文档按 instruction/plugin/runtime 分层整理（含新增项），README 中英核对，`grep -n '^##'` 核对 skill 中英标题对齐未受影响
  - _Requirements: 6.1, 6.2_
- [x] 5.3 Checkpoint — Phase 5 gate：`npm test` + `node scripts/validate-specs.js .` 全绿，CI 首次运行成功，模块状态置为 implemented
  - _Requirements: 5.1, 5.2_

## Notes

- Pick a sequencing strategy: **Foundation-First**（Phase 1 地基先行，2/3/4 并行）
- MCP server 缓期（design Decision 5），待有 MCP-only host 需求另立模块
- 插件 manifest 字段与 host 实际 schema 冲突时，以 host 官方文档为准并记入模块 CHANGELOG
- 每个 Checkpoint 运行对应验证命令并报告结果，通过后才勾选该 gate

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["1.4"] },
    { "id": 3, "tasks": ["2.1", "2.2", "2.3", "3.1", "4.1", "5.1"] },
    { "id": 4, "tasks": ["2.4", "3.2", "4.2", "4.3"] },
    { "id": 5, "tasks": ["2.5", "3.3", "4.4"] },
    { "id": 6, "tasks": ["5.2"] },
    { "id": 7, "tasks": ["5.3"] }
  ]
}
```

Task status is maintained in `.agents/specs/index.md`, which derives progress, the next task, and the next gate from task checkboxes and dependencies. Do not add a module-local status block.
