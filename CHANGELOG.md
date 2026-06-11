# Changelog

All notable changes to this project will be documented in this file.

## [v0.3.3]

- **Workflow Fix**: Agents now use direct reads/directory listings for `.ai/` files instead of `glob`, preventing missed `.ai/context.md` checks.

## [v0.3.2]

- **Model-Config Consent Fix**: The `model-config` agent no longer silently accepts default model selections without explicit user consent — it now requires the user to confirm before applying default models.

## [v0.3.1]

- **Shipper Inspection & Release-Boundary Fixes**: Tightened shipper bash permission whitelist to eliminate pre-commit inspection prompts and fixed release-boundary routing so the shipper only commits and pushes explicitly intended changes.

## [v0.3.0]

- **Model-Config Groups**: Replaced per-agent model selection with two-tier group-based workflow (MED/LOW), excluding orchestrator and task-planner.

## [v0.2.11]

- **Routing Clarity**: Clarified executor routing as exact, mechanical, low-risk edits rather than file-count-based; clarified planner auto-proceed behavior when no user-facing decisions are introduced.
- **Shipper Boundary**: Tightened shipper routing so it only commits and pushes existing intended changes.
- **CI Update**: Updated publish workflow to Node 24-compatible GitHub Actions (`actions/checkout@v6`, `actions/setup-node@v6`, `node-version: 24`).

## [v0.2.10]

- **Agent Context**: Shipper agent now reads `.ai/context.md` for project-specific conventions (commit format, version bump patterns, auto-publish). Added `read` permission to shipper. Updated `.ai/context.md` with publication and auto-publish conventions. Added CI workflow (`.github/workflows/publish.yml`) to auto-publish on version bump commits.

## [v0.2.8]

- **Agent Clarity**: Updated `init` and `orchestrator` agents to accurately describe `agy` as an Antigravity CLI integration for splitting quota across models. Removed "file count" from the orchestrator's executor and task-planner routing rules — routing decisions now key on risk, complexity, and clarity instead.

## [v0.2.7]

- **Agent Fixes**: Fixed the `model-config` agent so it writes valid JSON(C) (not YAML) into `opencode.jsonc`, added `find`/`echo`/`sort`/`git config`/`ls` bash permissions to the `shipper` agent to eliminate pre-commit inspection permission prompts, and updated `model-config` to skip the orchestrator when presenting agents for model selection (the orchestrator's model is chosen directly by the user).

## [v0.2.6]

- **Agent Improvements**: Added `agy` integration awareness to the `init` and `orchestrator` agents. Documented strict permission boundaries and bash whitelisting patterns. Added common request routing patterns to the orchestrator. Removed unnecessary `.ai` edit denials from the executor agent.

## [v0.2.5]

- **Model Configuration**: Added the `model-config` agent to seamlessly assign specific models to different agents in the project's `opencode.jsonc`.
- **Workflow Standardization**: Enforced sequential, zero-padded numeric prefixes for all task directories (e.g., `001-feature-name`) across all agents to ensure proper sorting and tracking.
- **Usability Fixes**: Granted `bash` execution allowances to `implementer` and `validator` agents to reduce excessive permission prompts during test and build cycles.
- **Artifact Improvements**: Split the task spec template into *Testable Acceptance Criteria* (with explicit test file path hints) and *Inspectable Acceptance Criteria* to better guide the `test-writer` and `validator`.

## [v0.2.4]

- Hardened security boundaries by applying explicit read-only bash whitelists to the `orchestrator` and sealing `edit: deny` escape hatches.

## [v0.2.1]

- Minor permission fixes to allow the orchestrator to cleanly delegate to the `executor` fast-path agent.

## [v0.2.0]

- **Major Overhaul**: Replaced the general conversational agents with a durable, stateful task workflow.
- Introduced the central `orchestrator` as a user-facing router.
- Shifted to explicit `.ai/tasks/` artifacts (task specs, implementation reports, validation reports) to make agent work inspectable, resumable, and git-trackable.
- Consolidated legacy roles into specialized agents (`task-planner`, `implementer`, `validator`, `test-writer`).
