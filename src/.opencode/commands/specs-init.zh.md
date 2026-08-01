---
description: 初始化 .specs/ 目录约定
---

在本项目中初始化 `.specs/` 规范驱动的工作流约定。

加载 specs-workflow 技能（skill 工具，名称为 `specs-workflow`），然后从技能目录中阅读 `references/file-templates.md` 并遵循其骨架。若技能不可用，遵循下方规则。

1. 创建 `.specs/README.md`，包含：
   - "模块状态总表"，列为 `模块 | 状态 | 依赖 | 说明`，状态取值只能使用 `draft`（草稿）→ `design`（设计）→ `implementing`（实现中）→ `implemented`（已实现）→ `archived`（已归档）
   - "执行顺序 / 依赖"小节
   - "变更记录"表格，列为 `日期 | 变更`
   - 若当前还没有任何模块，状态总表只保留表头并注明状态取值图例
2. 不要创建任何模块目录。

严格对齐模板的结构与措辞。不要发明状态取值或额外的小节。
