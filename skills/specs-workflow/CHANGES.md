# 修改记录

## 2026-08-06

### 引入渐进式披露（Progressive Disclosure）

将 skills 的渐进式披露协议映射到 `.specs/` 约定：`.specs/index.md` 作为常驻索引（L1），模块文档按需加载（L2），CHANGELOG/支撑文件按需读取（L3）。

- **`index.md` 新增 Task Summary 任务摘要表**：跨模块的全局任务索引，列 `Task | Module | Title | Status | Depends on`，`Task` 为全局唯一编号 `<module>.<N.M>`，与 `tasks.md` 勾选状态保持同步。代理先读 index 即可确定要执行哪些任务，无需打开每个 `tasks.md`。
- **新增强制规则 7**："读任何模块文档前，先读 `.specs/index.md`，根据任务摘要表确定要执行的任务并按需加载模块文档"。规则 1/5 同步扩展为登记/同步任务摘要表。
- `SKILL.md` / `SKILL.zh.md`：新增 "Progressive Disclosure" 章节（三层表格 + Mermaid 流程图）；改写 Step 1（先读索引）；Step 2/6 补充任务摘要表登记与同步；description、目录结构注释、Prohibitions 同步。
- `references/file-templates.md`：index.md 骨架新增 Task Summary 表；`references/prompt-templates.md` 新增 `index.md` 逐节思考要点；`references/checklists.md` 新增 `index.md` 验收清单与 tasks 同步项。
- `rules/specs-workflow.md` / `zh/rules/specs-workflow.zh.md`：Document Formats 新增 `index.md`；Prohibitions 新增"不一次性读遍所有模块文档"。
- `specs-workflow.md`（根模板）：目录结构、规则 7、index.md 骨架（含任务摘要表）同步。
- `commands/specs-init.toml`：index.md 引导加入 Task Summary 表；`commands/specs.toml`：第 5 步新增任务摘要表行登记；`commands/specs-tasks.toml`：新增 Index sync 规则。
- README / README.zh、docs/agent-portability（EN/ZH）提及渐进式披露与 Task Summary。
- 全部规则适配器与 `.opencode/` / `.claude/` 指令重新生成；`node scripts/check-sync.js` 通过。

## 2026-08-01

### `src/` 改名为 `zh/`

精简后 `src/` 仅剩两个中文文档，不再是"源码"目录，改名为 `zh/` 以准确表达其作用。

- `git mv src zh`：`src/SKILL.zh.md` → `zh/SKILL.zh.md`、`src/rules/specs-workflow.zh.md` → `zh/rules/specs-workflow.zh.md`。
- `AGENTS.md` / `AGENTS.zh.md`：结构树与 `src/<skill-name>/` 相关引用（共 4 处）改为 `zh/<skill-name>/`。
- `docs/agent-portability.zh.md`：`位于 src/` 改为 `位于 zh/`。
- `GENERATION.md` 的 Source（指向旧 `src/specs-workflow/...`）为生成时元数据，保留。

## 2026-08-01

### 精简 `src/` 中文镜像

`src/` 中的中文副本仅保留内容层的两个文档，删除命令/适配器/文档镜像（这些 zh 文件无任何宿主自动加载，仅作人类参考，且正文与规则集重复）：

- **保留**：`src/SKILL.zh.md`（中文技能定义）、`src/rules/specs-workflow.zh.md`（中文规则集）。
- **删除**（23 个）：`src/commands/*.zh.toml`、`src/.opencode/commands/*.zh.md`、`src/.claude/commands/*.zh.md`、7 个 zh 规则适配器（`.cursor/.windsurf/.clinerules/.kiro/.agents/.qoder/.github`）。
- **移动**：`src/docs/agent-portability.zh.md` → `docs/agent-portability.zh.md`，并更新其中对 `src/` 镜像与"中文链"的过时描述。
- `scripts/check-sync.js`：移除 ZH 校验链（`languages` 数组改为单一 EN 链），日志同步。
- `AGENTS.md` / `AGENTS.zh.md`：`README.zh.md` 引用更正为 `README.zh-CN.md`。

## 2026-08-01

### `.specs/README.md` 改名为 `.specs/index.md`

将 `.specs/` 约定中的入口索引文件从 `README.md` 改名为 `index.md`（其本质是"全局索引 + 状态总表"，而非项目简介；`index.md` 更贴合语义）。不兼容旧的 `.specs/README.md`，已有项目需手动迁移。

- `rules/specs-workflow.md` / `src/rules/specs-workflow.zh.md`：规则 1/5/6 中 `.specs/README.md` → `.specs/index.md`。
- `SKILL.md` / `SKILL.zh.md`：description、When to Use、Step 1/2/6/8、目录结构树、强制规则表、Prohibitions 全部引用同步。
- `references/file-templates.md`：节标题改为 `## .specs/index.md`；`references/checklists.md` 末尾检查项同步。
- `specs-workflow.md`（根模板）：目录树、规则 5/6、`### .specs/index.md` 节标题同步。
- `commands/specs-init.toml` / `src/...zh.toml`、`commands/specs.toml` / `src/...zh.toml`、`commands/specs-requirements.toml` / `src/...zh.toml`：相应引用同步。
- README / README.zh：intro 与 `/specs-init` 行同步。
- 全部规则适配器与 `.opencode/` / `.claude/` 指令重新生成；`node scripts/check-sync.js` 通过。

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
