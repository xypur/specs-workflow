# 修改记录

## 2026-07-31

### 多工具适配（ponytail 风格）

将 specs-workflow 从 opencode 单工具扩展为多 AI CLI 工具的可移植分发，参考 `references/ponytail/` 的适配模式：

- 新增 `commands/*.toml`：命令提示词规范源（Gemini CLI 自定义指令）；`.opencode/commands/*.md` 与 `.claude/commands/*.md` 由它派生（`{{args}}` → `$1`）。
- 新增 `rules/specs-workflow.md`：紧凑的常驻规则集规范源（强制规则 + 文档格式 + 禁止事项 + 命名约定）；以下适配器复制其正文：`.cursor/rules/specs-workflow.mdc`、`.windsurf/rules/specs-workflow.md`、`.clinerules/specs-workflow.md`、`.kiro/steering/specs-workflow.md`、`.agents/rules/specs-workflow.md`、`.qoder/rules/specs-workflow.md`、`.github/copilot-instructions.md`。
- 新增 `docs/agent-portability.md`：host → 文件映射说明。
- 新增 `scripts/check-sync.js`（`npm test`）：校验规则适配器与 `rules/specs-workflow.md` 一致、`.opencode/` 与 `.claude/` 指令与 `commands/*.toml` 一致。
- `SKILL.md` frontmatter 增加 `license: MIT`；README、AGENTS.md 同步更新。
- 生成中文副本至 `src/`：`src/commands/*.zh.toml`、`src/.claude/commands/*.zh.md`、`src/rules/specs-workflow.zh.md`、`src/.cursor|.windsurf|.clinerules|.kiro|.agents|.qoder` 规则适配器、`src/.github/copilot-instructions.zh.md`、`src/docs/agent-portability.zh.md`；`check-sync.js` 同时校验中英文两条链；新增 `README.zh.md`。

## 2026-07-31

### 新建 skills/specs-workflow

将 `src/specs-workflow/specs-workflow.md`（`.specs` 目录约定）提炼为可分发技能包：

- `SKILL.md`：英文规范定义，含 Workflow、目录结构、强制规则、命名约定、Prohibitions、When Unsure。
- `references/file-templates.md`：`.specs/README.md`、`requirements.md`、`design.md`、`tasks.md`、`CHANGELOG.md` 完整骨架模板。
- `references/example.md`：完整示例文档（后续拆分记录见下方）。
- `GENERATION.md`：来源与生成元数据。

同时创建中文版 `src/specs-workflow/SKILL.zh.md`，结构内容与英文版保持一致。

### 重写 references/example.md 为完整示例

- 由"压缩示例（截取片段 + 追溯链）"重写为**三份完整示例文档合一个文件**（英文，基于 `example/.specs/vue-headless-tabs/` 裁剪）：
  - requirements.md 示例：保留 Requirement 1–3，每条约含 User Story + 完整验收标准
  - design.md 示例：保留 Introduction / Architecture / Key Design Decisions / Data Models & Types / Components / Error Handling / Correctness Properties（3 条，`Validates: Requirements 2.2/2.3/2.5`）
  - tasks.md 示例：保留阶段 1–3 及 Checkpoint，含 `_Requirements:` 引用与 Task Dependency Graph
  - 内部引用保持自洽，只指向保留项
- `SKILL.md` / `SKILL.zh.md`：Step 2 中在 file-templates 链接旁补充 `references/example.md` 链接

### 拆分示例为独立文件

- 删除 `references/example.md`，三份完整示例拆分为独立文件，置于 `references/examples/` 子目录：
  - `references/examples/requirements.md` / `references/examples/design.md` / `references/examples/tasks.md`
  - 内容从围栏中取出，即为可直接参照的真实示例文档
- `SKILL.md` / `SKILL.zh.md`：Step 2 链接更新为指向 `references/examples/` 下的三个文件

### 示例图表改用 Mermaid

- `references/examples/design.md`：`## Architecture` 的 ASCII 框图替换为 Mermaid `flowchart TB` 图（保留三层结构：Consumer → API Layer → TabsContext，含 `uses` / `provide / inject` 边标签）
- `references/file-templates.md`：design.md 骨架的 Architecture 小节补充约定："Use Mermaid for diagrams (e.g. architecture layers, data flow)."，使 AI 生成的图表格式保持一致

### 示例改为"提示为主 + 精简追溯示例"

- 新建 `references/prompt-templates.md`：**事前规划版**填空提示（与骨架配套，定深度而非结构）——
  - requirements.md：Introduction 点出痛点、Glossary 逐条定义、User Story 三要素、AC 须可测试且覆盖 happy path + 边界 + 异常
  - design.md：Overview 点出取舍、Architecture 用 Mermaid 并说明"为什么这样分层"、Components 写"为什么"、每条 Property 用 `*For any*` 形式并回指需求
  - tasks.md：按依赖划分阶段、任务引用需求条款、Checkpoint 必须可验证、依赖图 waves
  - 横切追溯约定（`Validates:` / `_Requirements:`）
- 删除 `references/examples/requirements.md` / `design.md` / `tasks.md` 三份完整示例，新增 `references/examples/traceability.md`：精简追溯链示例（一段完整需求 → 一条完整 Property → 一个完整任务 + 依赖图片段 + 追溯链图）
- `SKILL.md` / `SKILL.zh.md`：Step 2 链接更新为 `file-templates.md` + `prompt-templates.md` + `examples/traceability.md`

### 追溯链图改用 Mermaid

- `references/examples/traceability.md`：`## The traceability chain` 的 ASCII 图改为 Mermaid `flowchart TD`（Property 与 Task 两条带标签边指向 Requirement，保留 `Validates:` / `_Requirements:` 双向语义）
- `references/file-templates.md`：Mermaid 约定措辞扩展为 "e.g. architecture layers, data flow, traceability"，明确覆盖关系/追溯图
