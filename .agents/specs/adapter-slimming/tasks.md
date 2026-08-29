# Implementation Plan: adapter-slimming

## Overview

单阶段删减，采用 **Foundation-First** 的变体：先改校验脚本清单，再删文件与文档引用，每项删除与其引用清理绑定在同一任务内，避免中间态红测试；最后全量 grep 复核。MCP 无涉及。

## Tasks

### Phase 1: 删减与引用收敛

- [x] 1.1 收敛 `scripts/check-sync.js` 规则副本清单：移除 Windsurf/Kiro/Qoder 三项
  - _Requirements: 2.1_
- [x] 1.2 移除 Windsurf 适配：删除 `.windsurf/`，清理 README/portability 引用（EN+zh）
  - _Requirements: 1.1, 3.1, 3.2, 3.3_
- [x] 1.3 移除 Kiro 适配：删除 `.kiro/`，清理 README/portability 引用（EN+zh）
  - _Requirements: 1.1, 3.1, 3.2, 3.3_
- [x] 1.4 移除 Qoder 适配：删除 `.qoder/`，清理 README/portability 引用（EN+zh）
  - _Requirements: 1.1, 3.1, 3.2, 3.3_
- [x] 1.5 移除 Copilot CLI 插件：删除 `.github/plugin/`，清理 README 安装/卸载表与 portability 插件层引用（EN+zh）
  - _Requirements: 1.1, 3.1, 3.3_
- [x] 1.6 移除 Codex 插件：删除 `.codex-plugin/`，清理 README/portability 引用（EN+zh）；`hooks/specs-reminder.js` 保留 Codex 输出分支并记录决策
  - _Requirements: 1.1, 3.1, 3.3, 4.2_
- [x] 1.7 更新根 `AGENTS.md` 项目结构图（移除三个规则适配行，补充插件/扩展/hooks 行）
  - _Requirements: 3.1, 4.1_
- [x] 1.8 Checkpoint — npm test + validate-specs 全绿；grep 全仓无 `windsurf|kiro|qoder|codex-plugin|\.github/plugin` 残留；保留项清单逐一核对
  - _Requirements: 2.2, 1.2, 4.1_

## Notes

- Pick a sequencing strategy: **Foundation-First**（1.1 脚本先行，随后删减项可并行，1.8 收口）
- 删减后 portability 指令层保留通用说明（Decision 1），宿主自助路径不断
- 保留项清单见 requirements.md Glossary

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4", "1.5", "1.6", "1.7"] },
    { "id": 2, "tasks": ["1.8"] }
  ]
}
```

Task status is maintained in `.agents/specs/index.md`, which derives progress, the next task, and the next gate from task checkboxes and dependencies. Do not add a module-local status block.
