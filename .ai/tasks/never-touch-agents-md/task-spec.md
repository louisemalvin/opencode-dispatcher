# Task Spec

## Scope

- Change OpenCode Dispatcher so installer behavior never installs, overwrites, backs up, restores, deletes, renames, or otherwise touches user/global `~/.config/opencode/AGENTS.md`.
- Keep `workflow/AGENTS.md` in the repository as reference/source documentation if useful, but ensure it is not part of the installed payload and is not treated as a required install target.
- Update installer payload selection, installer success/help text, backup reporting, and any restore/uninstall wording so they describe only paths the installer actually manages.
- Update package check expectations if needed so `workflow/AGENTS.md` can remain a repository reference without implying it is installed or required as an install payload.
- Update public documentation in `README.md` to state clearly that `~/.config/opencode/AGENTS.md` is user-owned and untouched by OpenCode Dispatcher.
- Update documentation sections that currently say Dispatcher installs, overwrites, backs up, restores, or removes global `AGENTS.md`, including installed-files, backups/restore, uninstall, and limitations language.
- Add or update validation coverage using a temporary `HOME` with a pre-existing `~/.config/opencode/AGENTS.md`, proving the file content remains unchanged and no `AGENTS.md.bak-*` backup is created.

## Non-Goals

- Do not remove `workflow/AGENTS.md` from the repository unless implementation discovers it is no longer useful and the approved scope is explicitly expanded.
- Do not migrate, merge, rewrite, or manage a user's existing global `AGENTS.md`.
- Do not add interactive prompts, new dependencies, telemetry, platform-specific installers, or a broad installer redesign beyond the behavior needed to stop touching global `AGENTS.md`.
- Do not change OpenCode provider config, secrets, project `.ai/` initialization behavior, or unrelated workflow agent/skill behavior.
- Do not publish, commit, push, or perform release work.

## Acceptance Criteria

- Running the installer with a temporary `HOME` that already contains `~/.config/opencode/AGENTS.md` leaves that file byte-for-byte unchanged.
- The same installer run creates no `AGENTS.md.bak-*` file or directory next to the pre-existing global `AGENTS.md`.
- Installer payloads no longer include `AGENTS.md`; managed payloads are limited to the Dispatcher-owned workflow directories/files that remain in scope, such as `agents`, `skills`, and `templates`.
- Installer success output, backup messages, invalid-command/help text, and restore/uninstall guidance do not instruct users to copy, replace, back up, restore, remove, or rename `~/.config/opencode/AGENTS.md`.
- `npm run check` or `node ./bin/install.js check` passes after expectations are updated; the check may still verify that repository reference docs exist, but it must not imply global `AGENTS.md` is installed.
- `README.md` clearly states that global `~/.config/opencode/AGENTS.md` is user-owned and untouched, while accurately listing what Dispatcher installs and backs up.
- Any retained references to `workflow/AGENTS.md` distinguish repository reference/source documentation from installer-managed user/global config.
- Implementation and validation reports document the changed files, temporary-`HOME` install simulation, unchanged `AGENTS.md` proof, absence of `AGENTS.md.bak-*`, and package check result.

## Constraints

- Do not edit implementation/source/docs as part of this planning task; implementation is for a later approved implementer pass.
- Preserve unrelated user changes and keep edits focused on global `AGENTS.md` ownership and installer/documentation accuracy.
- Do not run installer validation against the real `HOME` or real `~/.config/opencode`; use a temporary `HOME` only.
- Installer must remain dependency-free Node ESM and compatible with the existing `bin` entry in `package.json`.
- Documentation must not claim npm publication has happened unless package state proves it; preserve existing local-install vs possible `npx` distinction.
- Keep project language aligned with existing terms: OpenCode Dispatcher, workflow, agents, skills, templates, task artifacts, `.ai/context.md`, `.ai/tasks/<task-id>/`, orchestrator, task-planner, implementer, documentation, validator.

## Relevant Files

- `bin/install.js`
- `README.md`
- `package.json`
- `workflow/AGENTS.md`
- `workflow/agents/*.md`
- `workflow/skills/task-artifact-workflow/SKILL.md`
- `workflow/templates/task-artifact-workflow/*.md`
- `.ai/tasks/first-run-usability/task-spec.md`
- `.ai/tasks/first-run-usability/implementation-report.md`
- `.ai/tasks/first-run-usability/validation-report.md`

## Validation Plan

- Run `npm run check` or `node ./bin/install.js check` and confirm required package checks pass with the updated `AGENTS.md` expectations.
- Run installer invalid-command/help path if help text changes, and confirm it lists only the paths Dispatcher installs.
- Create a temporary `HOME` outside the repository with a pre-existing `~/.config/opencode/AGENTS.md` containing a unique sentinel string, plus any pre-existing managed paths needed to exercise backup behavior.
- Run `node ./bin/install.js install` with that temporary `HOME` and inspect the temporary OpenCode config.
- Confirm the pre-existing temporary `~/.config/opencode/AGENTS.md` still contains exactly the original sentinel content.
- Confirm no temporary `~/.config/opencode/AGENTS.md.bak-*` path exists.
- Confirm managed payloads such as `agents`, `skills`, and `templates` still install and backup behavior still works for managed pre-existing paths when applicable.
- Review installer output and README for any remaining user/global `AGENTS.md` install, overwrite, backup, restore, uninstall, or removal instructions.

## Open Questions

- No blocking questions identified. The requested behavior is explicit: user/global `~/.config/opencode/AGENTS.md` is user-owned and must be untouched.
