# AI 项目工作流模板：.specs 目录约定

> 复制本文件到项目根目录命名为 `AGENTS.md`，AI 在项目内执行任务时会自动读取并遵循。
> 参考真实示例：`example/.specs/` 下的 `vue-tree-lib`、`vue-headless-tabs`、`vue-popover-library`。

## 目录结构

```
.specs/
├── README.md            # 全局索引 + 模块状态总表 + 依赖/优先级
├── archive/             # 完结/废弃模块整目录归档
└── <module>/
    ├── requirements.md  # 需求（编号 Requirement N + 验收标准）
    ├── design.md        # 设计（架构/数据流/接口 + Correctness Properties）
    ├── tasks.md         # 任务（引用需求编号 + 依赖图）
    └── CHANGELOG.md     # 变更日志（设计改版记录）
```

## 强制规则（AI 执行任务前必须先落实）

1. **开工前先建文档**：新模块/新功能动工前，先创建 `.specs/<module>/` 下的 `requirements.md`、`design.md`、`tasks.md`、`CHANGELOG.md` 四个文件，并填好需求。
2. **可追溯**：`tasks.md` 中每条任务引用需求编号（格式 `_Requirements: 3.5, 3.6_`）；`design.md` 中每条 Correctness Property 标注 `**Validates: Requirements x.y**`。
3. **设计改版不建散文件**：设计变更追加到 `CHANGELOG.md`，不要创建 `v1.md` / `v2.md` 等版本文件。
4. **共享设施单独成 spec**：被多个模块复用的基础设施（如 `useSelectionBehavior`、定位 composable）建独立目录 `.specs/shared/`，避免任务重复。
5. **进度同步**：任务完成勾选 `- [x]`，同时更新 `.specs/README.md` 的模块状态总表。
6. **归档**：模块验收完结后，将整个模块目录移入 `.specs/archive/`。

## 各文件骨架模板

### .specs/README.md

```markdown
# Specs 索引

按功能模块组织，每个模块一个自包含目录（requirements / design / tasks / CHANGELOG）。

## 模块状态总表

| 模块 | 状态 | 依赖 | 说明 |
|------|------|------|------|
| shared | implementing | - | 跨模块共享设施 |
| tree | design | shared | 树形组件 |
| modal | draft | - | 模态框 |

状态取值：`draft`（草稿）→ `design`（设计）→ `implementing`（实现中）→ `implemented`（已实现）→ `archived`（已归档）

## 执行顺序 / 依赖

按依赖关系排列模块实现顺序（谁先做、谁阻塞谁）。

## 变更记录

| 日期 | 变更 |
|------|------|
| YYYY-MM-DD | 描述 |
```

### <module>/requirements.md

```markdown
# Requirements Document

## Introduction

一句话说明该模块是什么、解决什么问题。

## Glossary

- **术语**：定义。

## Requirements

### Requirement 1：<能力标题>

**User Story:** As a <角色>, I want <能力>, so that <价值>。

#### Acceptance Criteria

1. THE <System> SHALL <行为描述>。
2. WHEN <条件>，THE <System> SHALL <行为描述>。
3. IF <条件>，THEN THE <System> SHALL <行为描述>。
```

### <module>/design.md

```markdown
# Design Document

## Overview

模块定位与核心设计原则。

## Architecture

目录结构、数据流、模块协作关系。

## Components / Composables

各核心模块的接口、职责、核心逻辑（用结构化伪代码）。

## Interfaces & Data Models

类型定义、数据结构。

## Error Handling

| 场景 | 处理方式 |
|------|---------|
| <异常场景> | <处理策略> |

## Correctness Properties

*A property is a formal statement about what the system should do.*

### Property 1: <不变式名称>

*For any* <前置条件>，<结论描述>。

**Validates: Requirements x.y**
```

### <module>/tasks.md

```markdown
# Implementation Plan: <module>

## Overview

分阶段实现思路，明确验证方式。

## Tasks

- [ ] 1. <阶段标题>
  - [ ] 1.1 <任务描述>
    - <实现要点>
    - _Requirements: x.y, x.z_
  - [ ] 1.2 ...

- [ ] N. Checkpoint — <验证描述>
  - 运行测试/构建，确保通过，如有问题询问用户。

## Notes

- 标有 `*` 的子任务为可选，可在 MVP 阶段跳过
- 每条任务引用需求条款以保证可追溯

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1"] }
  ]
}
```
```

### <module>/CHANGELOG.md

```markdown
# <Module> 变更日志

## YYYY-MM-DD

- <本次变更描述>
- <设计取舍 / 原因>
```

## 命名约定

- 模块目录名：小写 kebab-case（如 `vue-tree-lib`、`shared`）。
- 状态值：`draft` / `design` / `implementing` / `implemented` / `archived`。
- 需求编号：`Requirement N`（N 为整数），按模块内从 1 递增；验收标准用 `N.M` 子编号。
- 任务编号：`N.M` 层级编号，与需求编号解耦。
