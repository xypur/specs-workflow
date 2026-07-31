---
description: 创建或更新模块的 design.md
---

为模块 `$1` 创建或更新 `.specs/$1/design.md` 文档。若 `$1` 为空，先向用户询问模块名。

加载 specs-workflow 技能（skill 工具，名称为 `specs-workflow`），然后从技能目录中阅读：`references/file-templates.md`（骨架）、`references/prompt-templates.md`（深度指引）、`references/examples/traceability.md`（追溯格式），并遵循它们。若技能不可用，遵循下方规则。

遵循以下规则：

- **Overview（概述）**：模块定位、核心设计原则，以及所做的关键取舍。
- **Architecture（架构）**：分层/模块与数据流。使用 Mermaid 图。说明系统为何这样拆分，而不只是如何拆分。
- **Components / Composables（组件 / 组合式函数）**：对每个核心组件——接口、职责、结构化伪代码形式的核心逻辑。解释每个选择背后的取舍与约束，突出状态转换与核心分支逻辑。
- **Interfaces & Data Models（接口与数据模型）**：类型、字段、字面量联合取值、默认值，以及哪些字段可选、缺省时意味着什么。
- **Error Handling（错误处理）**：场景/策略表格，覆盖异常输入、空/禁用状态、异步失败与误用（如在 provider 之外使用）。
- **Correctness Properties（正确性属性）**：以 `*For any* <前置条件>, <结论>` 形式书写的正式陈述，每条标注 `**Validates: Requirements x.y**`。每条属性必须能被测试断言；若无法断言，则不是属性。

先阅读模块的 `.specs/$1/requirements.md`，确保 `**Validates:**` 引用的每个需求编号真实存在。若 `.specs/$1/design.md` 已存在，保留原有内容进行扩展，而不是重写。
