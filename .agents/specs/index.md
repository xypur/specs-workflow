# Specs Index

Organized by functional module, each module is a self-contained directory (requirements / design / tasks / CHANGELOG).

Read this file before any module document: use the Status Bar, Module Status Table, and Task Summary below to determine which module(s) and task(s) the current request touches, then open only the relevant module documents on demand.

> 📍 **Status Bar** · agent-adapters [`implemented`] · 19/19 done · 0 blocked ·
> Next task: —（模块已实现，待验收后归档） · Next gate: —（全部 gate 已通过）
> Last updated: 2026-08-27 (Phase 5 done: CI + final consistency pass; module implemented)

## Module Status Table

| Module | Status | Progress | Depends on | Notes |
|--------|--------|----------|------------|-------|
| agent-adapters | implemented | 19/19 (100%) | - | 对齐 ponytail 的适配升级：AGENTS.md 分发、插件 manifests、运行时 hooks、pi 扩展、CI |

`Progress` = `done/total (pct)` counting every task checkbox in `<module>/tasks.md`. Status values: `draft` → `design` → `implementing` → `implemented` → `archived`. Archived modules stay listed with status `archived`; their directories are not moved.

## Task Summary

Global index of every task across modules. Add one row per task in `<module>/tasks.md`; keep the checkbox state in sync.

| Task | Status | Module | Title | Depends on |
|------|--------|--------|-------|------------|
| agent-adapters.1.1 | [x] | agent-adapters | AGENTS.md 标记区块分发 ruleset | - |
| agent-adapters.1.2 | [x] | agent-adapters | check-sync 校验 AGENTS.md 区块 | agent-adapters.1.1 |
| agent-adapters.1.3 | [x] | agent-adapters | 指令层文档更新（EN+zh） | agent-adapters.1.1 |
| agent-adapters.1.4 | [x] | agent-adapters | Checkpoint — Phase 1 同步校验通过 | agent-adapters.1.2, agent-adapters.1.3 |
| agent-adapters.2.1 | [x] | agent-adapters | .claude-plugin 插件 manifest | agent-adapters.1.4 |
| agent-adapters.2.2 | [x] | agent-adapters | .codex-plugin 插件 manifest | agent-adapters.1.4 |
| agent-adapters.2.3 | [x] | agent-adapters | .github/plugin（Copilot CLI）manifest | agent-adapters.1.4 |
| agent-adapters.2.4 | [x] | agent-adapters | 插件安装/卸载文档（EN+zh） | agent-adapters.2.1, agent-adapters.2.2, agent-adapters.2.3 |
| agent-adapters.2.5 | [x] | agent-adapters | Checkpoint — 插件安装冒烟验证 | agent-adapters.2.4 |
| agent-adapters.3.1 | [x] | agent-adapters | hooks/specs-reminder.js 提醒脚本 | agent-adapters.1.4 |
| agent-adapters.3.2 | [x] | agent-adapters | hooks/specs-hooks.json 并接入 manifests | agent-adapters.3.1, agent-adapters.2.1, agent-adapters.2.2 |
| agent-adapters.3.3 | [x] | agent-adapters | Checkpoint — hook 行为验证 | agent-adapters.3.2 |
| agent-adapters.4.1 | [x] | agent-adapters | pi 扩展骨架 + 命令注册 | agent-adapters.1.4 |
| agent-adapters.4.2 | [x] | agent-adapters | pi 会话启动提醒注入 | agent-adapters.4.1 |
| agent-adapters.4.3 | [x] | agent-adapters | pi 扩展打包元数据 | agent-adapters.4.1 |
| agent-adapters.4.4 | [x] | agent-adapters | Checkpoint — pi 本地安装验证 | agent-adapters.4.2, agent-adapters.4.3 |
| agent-adapters.5.1 | [x] | agent-adapters | GitHub Actions CI 工作流 | agent-adapters.1.4 |
| agent-adapters.5.2 | [x] | agent-adapters | 全量一致性收尾（EN/zh 对齐） | agent-adapters.2.5, agent-adapters.3.3, agent-adapters.4.4, agent-adapters.5.1 |
| agent-adapters.5.3 | [x] | agent-adapters | Checkpoint — 全绿并标记 implemented | agent-adapters.5.2 |

`Task` is the globally unique id `<module>.<N.M>` (the module dir name + the task's number in `tasks.md`). `Status` mirrors the `- [ ]` / `- [x]` checkbox in `tasks.md`.

**Next task / next gate** are derived from the dependencies, not hand-written:
- **Next task** = the first Task Summary row with `[ ]` whose every `Depends on` id is `[x]`; if none, note "all blocked".
- **Blocked count** = number of `[ ]` tasks whose deps are not all done.
- **Next gate** = the first unchecked phase-terminal (Checkpoint) task in the active module's gate chain.
- Update the Status Bar (and `Progress` / `Last updated`) whenever a task is checked off.

## Execution Order / Dependencies

Phase 1（指令层 AGENTS.md + 同步校验）是其余所有阶段的前置基础；Phase 2（插件 manifests）/ Phase 3（hooks）/ Phase 4（pi 扩展）/ 5.1（CI）在 Phase 1 gate 之后并行推进；Phase 5 其余任务做跨阶段收尾。3.2 依赖 2.1/2.2（hooks 需接入已存在的 manifests），5.2 依赖全部前序 gate。

## Change Log

| Date | Change |
|------|--------|
| 2026-08-27 | init .agents/specs（agent-adapters 模块立项） |
| 2026-08-27 | Phase 1 完成：AGENTS.md 标记区块分发、check-sync 校验、文档中英同步（1.1–1.4） |
| 2026-08-27 | Phase 2 完成：三个插件 manifest + 安装/卸载文档（2.1–2.5）。实现发现：Claude Code plugin.json 路径字段必须以 `./` 开头；marketplace.json 为严格 schema（拒绝根级 `$schema`/`description`）；命令路径取 `./.claude/commands` 复用既有派生文件 |
| 2026-08-27 | Phase 3 完成：提醒脚本 + hooks 接入 manifests（3.1–3.3）。实现发现：Claude 的 SubagentStart 上下文必须用 hookSpecificOutput JSON 包裹，否则被丢弃；Codex 以 PLUGIN_DATA 环境变量检测 |
| 2026-08-27 | Phase 5 完成：CI 工作流 + portability 文档三层重组（EN/zh）+ 全量一致性收尾（5.1–5.3），模块标记 implemented。CI 首次运行需 push 至 GitHub 后确认；其调用的两个脚本本地均通过 |
