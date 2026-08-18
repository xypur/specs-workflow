# Specs 工作流

在本项目中以规范先行（spec-first）的方式工作。为新模块或新功能编写任何代码之前，先编写 `.specs/` 文档，保持它们相互可追溯，并让模块状态总表保持最新。完整的工作流、模板与提示深度见 `specs-workflow` 技能（可用时加载它）。

## 强制规则

1. 编码之前，先创建 `.specs/<module>/`，包含 `requirements.md`、`design.md`、`tasks.md`、`CHANGELOG.md` 四个文件，并填好需求。在 `.specs/index.md` 状态总表中为模块添加一行，并在任务摘要表中为每个任务添加一行。
2. 保持可追溯：每条任务用 `_Requirements: x.y, x.z_` 引用其实现的需求条款；每条设计 Correctness Property 标注 `**Validates: Requirements x.y**`。不允许悬空引用。
3. 设计改版记录到 `CHANGELOG.md`；绝不创建 `v1.md` / `v2.md` 版本文件。
4. 被多个模块复用的共享设施单独建目录 `.specs/shared/`。
5. 勾选已完成的任务 `- [x]`，并让 `.specs/index.md` 状态总表与任务摘要表保持同步（`draft` → `design` → `implementing` → `implemented` → `archived`）。索引是任务状态的唯一来源，`Progress` 列、索引状态栏、下一任务和下一门禁都由任务勾选与依赖推导。
6. 模块验收完结后，在 `.specs/index.md` 状态总表中将其状态标记为 `archived`。模块目录保留原位，文档由 git 历史保存。
7. 读任何模块文档之前，先读 `.specs/index.md`；根据其任务摘要表确定要执行的任务，按需加载模块文档 —— 不要一次性读遍所有模块文档。
8. 从依赖推导下一任务与下一门禁：下一任务 = 第一个状态为 `[ ]` 且其 `Depends on` 全部已完成的任务；下一门禁 = 门禁链中下一个尚未勾选的阶段终态（Checkpoint）任务。将推导结果记录在索引状态栏中。

## 文档格式

- `index.md`：常驻索引 —— 顶部状态栏（`📍 状态栏`：当前模块 + 状态 · done/total · 阻塞数 · 下一任务 · 下一门禁 · 最近更新）、模块状态总表（`Module | Status | Progress | Depends on | Notes`，`Progress` 格式为 `done/total (pct)`）、任务摘要表（`Task | Module | Title | Status | Depends on`，`Task` 为全局唯一编号 `<module>.<N.M>`，与 `tasks.md` 勾选状态一致）、执行顺序/依赖，以及变更记录。

- `requirements.md`：`Requirement N`（整数，递增）+ User Story（*As a `<角色>` / I want `<能力>` / so that `<价值>`*）+ 验收标准按 `N.M` 编号，使用 `THE <System> SHALL` / `WHEN` / `IF` / `WHILE` 句式，可补充复合 `AND` / `OR` 条件以及基于状态、性能与安全类的变体，每一条都必须可被机器测试，整体覆盖正常路径、边界条件与错误/排除场景。
- `design.md`：Overview（定位 + 关键取舍）/ Architecture（分层 + Mermaid 图表达数据流；说明"为什么"这样拆分）/ Components & Composables（接口、职责、结构化伪代码）/ Interfaces & Data Models（类型、字段、默认值、可选项）/ Key Decisions（决策记录：上下文、含优缺点与工作量的备选方案、选定方案、理由）/ Error Handling（场景/策略表）/ Correctness Properties（`*For any* <前置条件>, <结论>`，每条标注 `**Validates: Requirements x.y**`）。
- `tasks.md`：层级任务按 `N.M` 编号（与需求编号解耦），按**依赖**划分，并按选定的排序策略组织（Foundation-First / Feature-Slice / Risk-First / Hybrid），每条引用 `_Requirements: x.y_`，可选 / MVP 可跳过的子任务用 `*` 标注，在有意义的里程碑处设置运行测试/构建的 Checkpoint 任务，以及 JSON 形式的 Task Dependency Graph（有序 waves）。任务状态只维护在 `.specs/index.md` 中，不在 `tasks.md` 添加手工状态块。
- `CHANGELOG.md`：带日期的条目，说明改了什么与原因。

## 禁止事项

- 模块的 `.specs/<module>/` 文档（至少 `requirements.md`）存在并填好之前，不写任何代码。
- 不一次性读遍所有模块文档；先读 `.specs/index.md`，只加载当前任务需要的文档。
- 不创建版本化设计文件（`v1.md` / `v2.md`）；用 `CHANGELOG.md`。
- 不省略任务中的 `_Requirements:` 引用或设计属性中的 `**Validates:**` 标注。
- 不遗留未勾选的已完成任务，或状态总表 / 任务摘要表不同步。
- 不让索引状态栏或 `Progress` 列与任务勾选状态脱节。
- 不在各模块间重复共享基础设施需求；提取到 `.specs/shared/`。

## 命名约定

| 项目 | 约定 |
|------|------|
| 模块目录 | 小写 `kebab-case` |
| 状态取值 | `draft` / `design` / `implementing` / `implemented` / `archived` |
| 需求编号 | `Requirement N`；验收标准 `N.M` |
| 任务编号 | 层级 `N.M`，与需求编号解耦 |
