# Requirements Document

## Introduction

本模块（adapter-slimming）按既定优先级移除五个低价值/无法本地验证的适配物（Qoder 规则、Kiro steering、Windsurf 规则、Copilot CLI 插件 manifest、Codex 插件 manifest），收敛验证面与文档面，同时保证保留项不受影响、其他宿主仍有通用接入路径。

## Glossary

- **低价值适配**：与 AGENTS.md 自动加载或通用规则复制路径冗余，或无法在本地验证的适配物。
- **保留项**：Cline、Cursor、GitHub Copilot 指令文件、Claude Code 插件、pi 扩展、AGENTS.md 区块、skill、`commands/*.toml` canonical、opencode/claude 派生命令。

## Requirements

### Requirement 1：移除五个适配物

**User Story:** 作为仓库维护者，我希望删除 Qoder/Kiro/Windsurf 规则文件与 Copilot CLI/Codex 插件 manifest，从而收敛需要验证与解释的适配面。

#### Acceptance Criteria

1. `.qoder/`、`.kiro/`、`.windsurf/`、`.codex-plugin/`、`.github/plugin/` 五个路径 SHALL 从仓库移除。
2. 除上述五项外，仓库 SHALL 不存在任何被误删的适配文件（其余目录与文件保持不变）。

### Requirement 2：校验收敛

**User Story:** 作为维护者，我希望同步校验脚本只覆盖实际存在的适配文件，测试保持全绿。

#### Acceptance Criteria

1. THE `scripts/check-sync.js` 的规则副本清单 SHALL 与实际存在的 rule adapter 一致（移除 Windsurf/Kiro/Qoder 三项，保留 Cursor/Cline/.agents/.github 四项）。
2. WHEN `npm test` 与 `node scripts/validate-specs.js .` 运行，THEN SHALL 全部通过。

### Requirement 3：文档一致

**User Story:** 作为文档读者（含中文用户），我希望文档不再引用已移除的适配，同时保留通用接入说明，使未维护的宿主仍有自助路径。

#### Acceptance Criteria

1. `README.md`、`README.zh-CN.md`、`docs/agent-portability.md`、`docs/agent-portability.zh.md`、根 `AGENTS.md` SHALL 不再引用已移除的五个适配物。
2. THE portability 文档 SHALL 保留通用说明：自定义规则格式的宿主可将 `rules/specs-workflow.md` 正文复制进其规则文件。
3. 所有文档变更 SHALL 中英同步（结构一致）。

### Requirement 4：保留项与运行时行为不变

**User Story:** 作为现有用户，我希望本次精简不影响任何保留项的功能与提醒脚本的兼容性。

#### Acceptance Criteria

1. THE Cline/Cursor/Copilot 指令文件、Claude Code 插件、pi 扩展、AGENTS.md 区块、skill、`commands/*.toml` 及 opencode/claude 派生命令 SHALL 全部保留且校验通过。
2. THE `hooks/specs-reminder.js` SHALL 保留 Codex 输出分支（经 `PLUGIN_DATA` 检测），使手动接线的 Codex 用户仍可获得 JSON 形态的提醒。
