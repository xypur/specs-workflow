# Specs 工作流

在本项目中以规范先行（spec-first）的方式工作。为新模块或新功能编写任何代码之前，先编写 `.specs/` 文档，保持它们相互可追溯，并让模块状态总表保持最新。完整的工作流、模板与提示深度见 `specs-workflow` 技能（可用时加载它）。

## 强制规则

1. 编码之前，先创建 `.specs/<module>/`，包含 `requirements.md`、`design.md`、`tasks.md`、`CHANGELOG.md` 四个文件，并填好需求。在 `.specs/README.md` 状态总表中为模块添加一行。
2. 保持可追溯：每条任务用 `_Requirements: x.y, x.z_` 引用其实现的需求条款；每条设计 Correctness Property 标注 `**Validates: Requirements x.y**`。不允许悬空引用。
3. 设计改版记录到 `CHANGELOG.md`；绝不创建 `v1.md` / `v2.md` 版本文件。
4. 被多个模块复用的共享设施单独建目录 `.specs/shared/`。
5. 勾选已完成的任务 `- [x]`，并让 `.specs/README.md` 状态总表保持同步（`draft` → `design` → `implementing` → `implemented` → `archived`）。
6. 模块验收完结后，将整个模块目录移入 `.specs/archive/`，并将其状态设为 `archived`。

## 文档格式

- `requirements.md`：`Requirement N`（整数，递增）+ User Story（*As a `<角色>` / I want `<能力>` / so that `<价值>`*）+ 验收标准按 `N.M` 编号，使用 `THE <System> SHALL` / `WHEN` / `IF` / `WHILE` 句式，每一条都必须可被机器测试，整体覆盖正常路径、边界条件与错误/排除场景。
- `design.md`：Overview（定位 + 关键取舍）/ Architecture（分层 + Mermaid 图表达数据流；说明"为什么"这样拆分）/ Components & Composables（接口、职责、结构化伪代码）/ Interfaces & Data Models（类型、字段、默认值、可选项）/ Error Handling（场景/策略表）/ Correctness Properties（`*For any* <前置条件>, <结论>`，每条标注 `**Validates: Requirements x.y**`）。
- `tasks.md`：层级任务按 `N.M` 编号（与需求编号解耦），按**依赖**划分，每条引用 `_Requirements: x.y_`，可选 / MVP 可跳过的子任务用 `*` 标注，在有意义的里程碑处设置运行测试/构建的 Checkpoint 任务，以及 JSON 形式的 Task Dependency Graph（有序 waves）。
- `CHANGELOG.md`：带日期的条目，说明改了什么与原因。

## 禁止事项

- 模块的 `.specs/<module>/` 文档（至少 `requirements.md`）存在并填好之前，不写任何代码。
- 不创建版本化设计文件（`v1.md` / `v2.md`）；用 `CHANGELOG.md`。
- 不省略任务中的 `_Requirements:` 引用或设计属性中的 `**Validates:**` 标注。
- 不遗留未勾选的已完成任务，或状态总表不同步。
- 不在各模块间重复共享基础设施需求；提取到 `.specs/shared/`。

## 命名约定

| 项目 | 约定 |
|------|------|
| 模块目录 | 小写 `kebab-case` |
| 状态取值 | `draft` / `design` / `implementing` / `implemented` / `archived` |
| 需求编号 | `Requirement N`；验收标准 `N.M` |
| 任务编号 | 层级 `N.M`，与需求编号解耦 |
