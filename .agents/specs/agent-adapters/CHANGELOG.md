# agent-adapters Change Log

## 2026-08-27

- 模块立项：对齐 ponytail 的 AI Agent 适配能力（AGENTS.md 分发、插件 manifests、运行时 hooks、pi 扩展、CI）。
- 关键决策：AGENTS.md 采用标记区块（Decision 1）；manifest 显式声明组件路径（Decision 2）；hooks 文件避开根 `hooks/hooks.json`（Decision 3）；pi 扩展运行时解析 TOML（Decision 4）；MCP server 缓期（Decision 5）。
