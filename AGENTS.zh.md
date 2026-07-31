# AGENTS.md

本文件为 AI 编程助手（Claude Code、Cursor、Copilot 等）在使用本仓库代码时提供指导。

## 仓库概述

为 AI 编程助手精心策划的技能包集合，提供特定框架的知识和架构指导。这些技能遵循 Skills CLI 生态系统约定（参见 [skills.sh](https://skills.sh/)）。

## 项目结构

```
skills/
  <skill-name>/           # kebab-case 命名，可分发的技能包
    SKILL.md              # 英文技能定义（必需）
    GENERATION.md         # 来源与生成元数据
    CHANGES.md            # 修改变更日志
    references/           # 可选：详细参考文档
      ...
src/
  <skill-name>/           # 技能文档的中文版本
    SKILL.zh.md           # 中文技能定义，内容与 skills/<skill-name>/SKILL.md 相同
commands/*.toml           # 命令提示词规范源（Gemini CLI 自定义指令）
rules/specs-workflow.md   # 紧凑常驻规则集规范源
.opencode/commands/       # 派生的 opencode 斜杠指令
.claude/commands/         # 派生的 Claude Code 斜杠指令
.cursor/rules/            # Cursor 规则适配器（alwaysApply）
.windsurf/rules/          # Windsurf 规则适配器
.clinerules/              # Cline 规则适配器
.kiro/steering/           # Kiro steering 适配器
.agents/rules/            # 通用代理规则适配器
.qoder/rules/             # Qoder 规则适配器
.github/                  # GitHub Copilot 指令适配器
docs/                     # agent-portability.md（宿主 → 文件映射）
scripts/check-sync.js     # 校验适配器与规范源一致
example/                  # 参考示例（已 gitignore），不属于本项目
```

### 规范源与派生适配器

- `commands/*.toml` 是命令提示词的规范源；`.opencode/commands/*.md` 与 `.claude/commands/*.md` 由它派生（`{{args}}` → `$1`）。
- `rules/specs-workflow.md` 是紧凑规则集的规范源；所有规则适配器原样复制其正文（仅宿主 frontmatter 不同）。
- **修改时**：先改规范源，再更新派生文件，确保 `node scripts/check-sync.js` 通过。

## 中英文同步规则

- **英文版本**：`skills/<skill-name>/SKILL.md` — 可分发的规范技能文件。
- **中文版本**：`src/<skill-name>/SKILL.zh.md` — 面向中文用户，单独存放以保持 `skills/` 目录整洁。
- **修改时**：必须同时更新两个文件。内容必须在结构和语义上完全一致 — 相同的章节、相同的表格、相同的代码块、相同的示例。仅语言不同。

## 技能文档格式

`SKILL.md` 文件必须遵循以下格式：

```markdown
---
name: <skill-name>
description: "<一句话描述何时使用该技能，包括触发场景>"
---

# <技能标题>

<技能功能的单行概述。>

## 何时使用本技能

<触发本技能的具体场景的列表。>

## 工作流程

<描述代理应如何完成任务的分步说明：>

### 步骤 1：...

### 步骤 2：...

...

## <附加章节>

<快速参考表格、层级详情、代码示例、决策流程等。>

## 禁止事项

<代理绝不能做的事情。>

## 不确定时

<当代理无法确定答案时的回退行为。>
```

关键格式约定：
- 使用**表格**提供快速参考数据（概览、命名、映射）。
- 在工作流程章节使用**编号步骤**提供流程指导。
- 使用**代码块**展示目录树和命令。
- 使用**列表**描述场景和约束。
- 保持 front matter 中的 `description` 简洁 — 它决定技能何时被激活。

## 命名约定

- **技能目录**：`kebab-case`（例如 `vue-tsx`、`find-skills`）
- **SKILL.md**：始终大写，始终使用此确切文件名
- **SKILL.zh.md**：始终大写前缀，始终使用此确切文件名
- **GENERATION.md**：始终大写，始终使用此确切文件名
- **CHANGES.md**：始终大写，始终使用此确切文件名
- **参考文件**：位于 `references/` 下，使用 `kebab-case` 或描述性名称

## 上下文效率指南

技能按需加载 — 代理在启动时只能看到技能名称和描述。只有当代理判定技能相关时，完整的 `SKILL.md` 才会被读入上下文。为最小化上下文：

- **保持 SKILL.md 在 500 行以内** — 将详细的参考材料放在 `references/` 中
- **编写具体的描述** — 帮助代理准确判断何时激活
- **渐进式披露** — 链接到仅在需要时读取的参考文件
- **关键信息前置** — 将最重要的指导放在前面

## 在本仓库中使用技能

### 添加新技能

1. 创建 `skills/<skill-name>/`，包含：
   - `SKILL.md`（英文，遵循上述格式）
   - `GENERATION.md`（元数据：来源、git SHA、生成日期）
   - `CHANGES.md`（中文变更日志）
   - `references/`（可选，用于补充文档）
2. 创建 `src/<skill-name>/`，包含：
   - `SKILL.zh.md`（中文，与英文版本结构一致）
3. 更新 `README.md` 和 `README.zh.md`，添加新技能条目和安装命令。

### 修改现有技能

1. 首先编辑 `skills/<skill-name>/SKILL.md`（英文）。
2. 将所有更改同步到 `src/<skill-name>/SKILL.zh.md`（中文）。
3. 更新 `skills/<skill-name>/CHANGES.md`，记录修改。
4. 如果技能的范围、描述或安装指令发生变化，更新 `README.md` 和 `README.zh.md`。

### 验证一致性

修改技能后，比较章节标题以确保两个语言版本对齐：

```bash
grep -n '^##' skills/<skill-name>/SKILL.md
grep -n '^##' src/<skill-name>/SKILL.zh.md
```

行数和章节编号应该匹配。

## 当前技能

| 技能 | 描述 | 目录 |
|---|---|---|
| vue-tsx | Vue 3 Composition API + TSX 开发 | `skills/vue-tsx/` |
| fsd | Feature-Sliced Design 前端架构 | `skills/fsd/` |

## 构建 / 测试 / 代码检查

本仓库没有构建流程或代码检查配置。唯一的自动化检查保持多工具适配器与规范源对齐：

```bash
node scripts/check-sync.js   # 或：npm test
```

若某个规则适配器正文偏离 `rules/specs-workflow.md`，或某个 `.opencode/` / `.claude/` 指令偏离其 `commands/*.toml` 提示词（英文与中文链都会校验），检查会失败。其余验证是手动的 — 检查渲染后的 markdown 并确认各语言版本之间的结构一致性。