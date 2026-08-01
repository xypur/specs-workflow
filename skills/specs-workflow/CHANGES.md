# 修改记录

## 2026-08-01

### 移除 `.specs/archive/` 物理归档，只保留 `archived` 状态标记

原约定"验收完结后把整个模块目录移入 `.specs/archive/`"改为：在 `.specs/README.md` 状态总表中将模块状态标记为 `archived`，模块目录保留原位，文档由 git 历史保存。理由：与 git 历史冗余、物理移动破坏跨文档链接、状态列已足以下达信号、且与 `.specs/shared/` 依赖存在冲突。

- `rules/specs-workflow.md` / `src/rules/specs-workflow.zh.md`：强制规则 6 改为"标记 `archived`，目录保留原位"。
- `SKILL.md` / `SKILL.zh.md`：Step 8 改为"标记已归档"；目录结构删除 `archive/` 行；强制规则 6、description、When to Use 措辞同步。
- `references/file-templates.md`：`.specs/README.md` 状态图例下补充"Archived modules stay listed with status `archived`; their directories are not moved"。
- `specs-workflow.md`（根模板）：目录结构删除 `archive/` 行；规则 6 改为 README 标记归档。
- `commands/specs-init.toml` / `src/...zh.toml`：删除"创建空的 `.specs/archive/` 目录"步骤；`commands/specs.toml` / `src/...zh.toml` 引导括注去掉 `archive/`。
- README / README.zh：`/specs-init` 说明去掉 `archive/`。
- 全部规则适配器（EN + ZH）与 `.opencode/` / `.claude/` 指令重新生成；`node scripts/check-sync.js` 通过。
- 保留项：状态取值 `archived`、状态图例、`.specs/shared/` 约定均不变。

## 2026-08-01

### 新增统一创建命令 `/specs`

- 新增 `commands/specs.toml`（EN）与 `src/commands/specs.zh.toml`（ZH）：统一入口 `/specs <需求描述>` —— 直接在命令中输入功能描述，代理从描述推导 kebab-case 模块名（推导不出或信息不足时才追问），一次性生成 `requirements.md` / `design.md` / `tasks.md` / `CHANGELOG.md` 四个文档，在状态总表加行（状态 `design`）并更新 Change Log；`.specs/` 不存在时先引导。其余命令 `/specs-init`、`/specs-requirements`、`/specs-design`、`/specs-tasks` 作为其分步 / 单文档变体保留。
- `scripts/check-sync.js` 的 `COMMANDS` 数组加入 `'specs'`（首位）；`.opencode/commands/`、`.claude/commands/`（含 `src/` 中文链）派生文件重新生成。
- README / README.zh：指令表首行新增 `/specs <需求描述>`；安装表补充 `/specs`，斜杠指令数量改为五个。
- `docs/agent-portability.md` / `src/docs/agent-portability.zh.md`：opencode 与 Gemini 行补充 `/specs`。

## 2026-08-01

### 采纳 Kiro 方法论技术（对比 `references/kiro/`）

对比 `references/kiro/`（spec-driven 方法论技能集）后，保持"单技能 + 紧凑规则集"架构不变，采纳其三项技术深度改进：

- **设计新增 Key Decisions（ADR 段）**：`design.md` 增加"关键决策"节（上下文 / 含优缺点与工作量的备选方案 / 选定方案 / 理由）。同步到 `references/file-templates.md`、`references/prompt-templates.md`、`rules/specs-workflow.md`、`commands/specs-design.toml`、`SKILL.md`。
- **任务新增排序策略**：`tasks.md` 要求说明所选排序策略（Foundation-First / Feature-Slice / Risk-First / Hybrid）。同步到 `references/prompt-templates.md`、`references/file-templates.md`、`rules/specs-workflow.md`、`commands/specs-tasks.toml`、`SKILL.md`。
- **需求扩展 EARS 变体**：验收标准句式补充复合 `AND` / `OR` 条件以及基于状态、性能与安全类的变体。同步到 `references/prompt-templates.md`、`references/file-templates.md`、`rules/specs-workflow.md`、`commands/specs-requirements.toml`、`SKILL.md`。
- **新增 `references/checklists.md`**：三阶段（requirements / design / tasks）质量验收清单，逐条可判定通过/失败，避免"user-friendly"这类模糊项；`SKILL.md` / `SKILL.zh.md` Step 2 增加该链接。
- 全部变更同步中文镜像 `src/`（`SKILL.zh.md`、`src/rules/specs-workflow.zh.md`、`src/commands/*.zh.toml`），并重新生成全部规则适配器与 `.opencode/` / `.claude/` 指令；`node scripts/check-sync.js` 通过。
- README / README.zh 的 `references/` 描述补入"质量清单"。

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
