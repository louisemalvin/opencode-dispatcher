# Task Spec: README Docs Restructure

## Scope

Rework the project README into a user-facing quickstart/overview with aggressive cleanup, and move internal details into dedicated files under `docs/`. Create `CHANGELOG.md` for version history.

The current `README.md` (559 lines) mixes user-facing quickstart content with deep internal documentation — agent role tables, mermaid flowcharts for every route, install safety mechanics, security/permission details, and a long version history. This makes the README hard to scan and buries the quickstart.

## Unit Table

| # | Unit                  | Delivers                                                          | Depends on | Parallel with |
|---|-----------------------|-------------------------------------------------------------------|------------|---------------|
| 1 | changelog-extract     | `CHANGELOG.md` with version history extracted from README          | —          | 2,3,4,5       |
| 2 | docs-workflow         | `docs/workflow.md` — orchestrator/subagent flow and task artifacts | —          | 1,3,4,5       |
| 3 | docs-agents           | `docs/agents.md` — subagent reference and permission philosophy    | —          | 1,2,4,5       |
| 4 | docs-configuration    | `docs/configuration.md` — model config, agy, opencode config, install locations | — | 1,2,3,5 |
| 5 | docs-development      | `docs/development.md` — repo maintenance, validation, release/publishing | —    | 1,2,3,4       |
| 6 | readme-cleanup        | Aggressively cut `README.md` to user-facing quickstart/overview    | 1,2,3,4,5  | —             |

## Execution Order

All six units are documentation-only work. Each unit's Execution section specifies `documentation`.

- Phase 1 (parallel): Units 1, 2, 3, 4, 5 can all run independently.
- Phase 2 (sequential after all Phase 1): Unit 6 rewrites README.md, referencing content extracted to CHANGELOG.md and docs/*.md.

## Acceptance Criteria

- `CHANGELOG.md` exists with full version history extracted from README, latest-first, standard changelog format.
- `docs/workflow.md` covers orchestrator state machine, routing logic, task artifact layout, and common routes.
- `docs/agents.md` lists all 11 agents with roles, permissions summaries, and explains the permission philosophy (deny-by-default, role-boundary enforcement).
- `docs/configuration.md` covers model config groups (MED/LOW), agy integration, opencode config file locations (`opencode.jsonc`, `.opencode/opencode.jsonc`, `~/.config/opencode/`), install locations, backup/restore/uninstall, and package commands.
- `docs/development.md` covers `npm run check` validation, semver conventions, conventional commits, release workflow, CI auto-publish, and `.ai/context.md` conventions.
- `README.md` is aggressively cut to a concise user-facing quickstart: brief intro, install commands, first-use steps, core value proposition, limitations, and links to `CHANGELOG.md` and `docs/*.md`.
- No implementation files, agent definitions, `package.json`, `bin/`, `.github/`, or `.ai/` files are edited (except this task's own documentation-report.md).
- All six units write a documentation-report.md under their unit subdirectory.
