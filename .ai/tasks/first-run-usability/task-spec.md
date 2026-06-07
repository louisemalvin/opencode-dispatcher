# Task Spec

## Scope

- Perform a first-run usability pass aimed at making this repository feel like a real installable tool that strangers can install, understand, use, and recover from without private context.
- Inspect the existing package and workflow surface before editing, especially:
  - `package.json` package metadata, bin entry, npm scripts, and package file list.
  - `bin/install.js` install/check command behavior, output, backups, and error/help text.
  - `workflow/AGENTS.md`, `workflow/agents/*.md`, and `workflow/skills/task-artifact-workflow/SKILL.md` for trigger wording and first-use guidance that affects whether users know how to invoke the workflow.
  - `README.md` as the practical user-facing usage document.
- Test or reason through the first-run path from a stranger's perspective: clone/package install, run installer, restart OpenCode, initialize/use `.ai/`, understand next steps, and recover from mistakes.
- Improve concrete onboarding friction where the inspection shows value, including installer next-step output, command/help wording, trigger wording in workflow instructions or skill text if needed, and README usage guidance.
- Add uninstall and/or restore guidance if practical, especially explaining backups created by the installer and how to recover prior `~/.config/opencode` files.
- Treat the current README as possibly affected by a prior accidental rewrite: preserve useful product-oriented content, but revise or replace sections that make the tool less clear, less installable, or too portfolio-like.

## Non-Goals

- Do not publish the package to npm or perform release/commit/push work.
- Do not add large new architecture, dependencies, telemetry, interactive installers, or platform-specific package managers unless required to fix a clear first-run blocker.
- Do not redesign the whole workflow model or rewrite all agent prompts; keep prompt/trigger edits targeted to first-run discoverability and correct routing.
- Do not remove backup behavior or make destructive changes to user OpenCode configuration.
- Do not create project-level `.ai/templates/` overrides as part of this task.

## Acceptance Criteria

- The first-run path is documented and executable enough for a new user to know what command to run, what files are installed, why OpenCode must restart, and what to do next inside a project.
- Installer output gives practical next steps after install, including restart/use guidance and where backups were written when applicable.
- The package/check workflow still works, and any new or changed command/help text is accurate for the current package shape.
- If prompt or skill trigger wording is part of the friction, targeted edits make it clearer when to use the task-artifact workflow and how the orchestrator/task agents should guide users without over-triggering broad rewrites.
- README serves as a practical product usage document rather than only a portfolio explanation: install, verify, first use, installed files, backups/restore or uninstall guidance, and limitations are clear.
- Uninstall/restore guidance exists either in README and/or installer output when practical, with safe instructions that account for timestamped backups.
- Any retained content from the prior README is intentionally useful to product onboarding; confusing or non-actionable content is adjusted to match the tool's user needs.
- Implementation report records changed files, first-run reasoning/testing performed, and any limitations.
- Validation report checks the completed work against this spec, including package check behavior and a safe first-run simulation or reasoned equivalent.

## Constraints

- Preserve unrelated user changes and keep edits small and focused on first-run usability.
- Avoid destructive commands and avoid modifying the real `~/.config/opencode` during validation unless explicitly approved; prefer a temporary `HOME` or read-only reasoning for installer simulations.
- Installer must remain dependency-free Node ESM and compatible with the existing `bin` entry.
- Documentation should not claim npm publication has happened unless the repository/package state proves it; distinguish cloned/local install from future npm/npx usage if needed.
- Keep workflow language aligned with existing terms: OpenCode Dispatcher, task artifacts, `.ai/context.md`, `.ai/tasks/<task-id>/`, orchestrator, task-planner, implementer, documentation, validator, research, release/shipper.

## Relevant Files

- `package.json`
- `bin/install.js`
- `README.md`
- `workflow/AGENTS.md`
- `workflow/agents/orchestrator.md`
- `workflow/agents/task-planner.md`
- `workflow/agents/implementer.md`
- `workflow/agents/documentation.md`
- `workflow/agents/validator.md`
- `workflow/skills/task-artifact-workflow/SKILL.md`
- `workflow/templates/task-artifact-workflow/*.md`
- `.ai/tasks/first-run-usability/task-spec.md`
- `.ai/tasks/first-run-usability/implementation-report.md`
- `.ai/tasks/first-run-usability/validation-report.md`

## Validation Plan

- Run `npm run check` or `node ./bin/install.js check` and confirm required workflow files are still present.
- Run installer help/invalid command path, if changed, and confirm usage output is accurate.
- Simulate install with a temporary `HOME` to avoid touching the real OpenCode config, then inspect resulting `~/.config/opencode` contents and installer output for clear next steps.
- If backup/restore behavior is changed or documented, simulate an existing temporary target config and confirm backups are created and restore guidance matches actual backup names/paths.
- Review README from the perspective of a new user and confirm it answers: what this is, when to use it, how to install/check, what to do after restart, how to uninstall/restore, and what is not handled.
- Review any workflow/skill wording edits for targetedness: they should improve first-run discoverability without broad behavioral drift.

## Open Questions

- No blocking questions identified for this pass. Treat npm publication/package-name finalization as out of scope unless the orchestrator/user explicitly expands the task.
