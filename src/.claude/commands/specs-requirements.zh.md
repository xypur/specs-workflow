---
description: 创建或更新模块的 requirements.md
---

为模块 `$1` 创建或更新 `.specs/$1/requirements.md` 文档。若 `$1` 为空，先向用户询问模块名。

加载 specs-workflow 技能（skill 工具，名称为 `specs-workflow`），然后从技能目录中阅读：`references/file-templates.md`（骨架）、`references/prompt-templates.md`（深度指引）、`references/examples/traceability.md`（追溯格式），并遵循它们。若技能不可用，遵循下方规则。

遵循以下规则：

- **Introduction（简介）**：1–2 段——该模块是什么、解决什么问题、谁在使用。以核心技术痛点为开头。
- **Glossary（术语表）**：定义文档依赖的每个关键术语（组件、状态、协议、配置名）。每个术语一条精确的要点。
- **Requirements（需求）**：每条编号为 `Requirement N`（整数，模块内从 1 递增），包含：
  - 以动词开头的可读能力标题
  - 完整的 User Story，三段式齐全：*As a `<角色>`, I want `<能力>`, so that `<价值>`* —— 价值从句必须说明"为什么"，而非复述能力本身
  - 验收标准按 `N.M` 编号，使用 `THE <System> SHALL` / `WHEN` / `IF` / `WHILE` 句式，每一条都必须可被机器测试，整体覆盖正常路径、边界条件与错误/排除场景

若 `.specs/$1/requirements.md` 已存在，保留原有内容进行扩展，而不是重写。若 `.specs/README.md` 存在且状态总表中没有模块 `$1`，为其添加一行。
