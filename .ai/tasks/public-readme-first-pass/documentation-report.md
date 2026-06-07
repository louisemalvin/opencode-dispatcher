# Documentation Report

## Changed files

- `README.md`
- `.ai/tasks/public-readme-first-pass/documentation-report.md`

## Rationale

- Rewrote `README.md` as a concise, usage-first public README for OpenCode Dispatcher.
- Grounded install, check, binary, package metadata, packaged files, and license wording in `package.json`.
- Grounded installer behavior in `bin/install.js`, including default `install`, explicit `check`, managed payloads, target directory, timestamped `.bak-*` backups, restart guidance, invalid usage shape, and user-owned global `AGENTS.md` safety wording.
- Corrected installer safety, restore/uninstall, and limitations wording after validation found that `bin/install.js` backs up existing managed paths and then recursively copies Dispatcher files into those paths without removing them first; this can overwrite same-named files while leaving unrelated pre-existing files in place.
- Kept `AGENTS.md` references limited to install safety and the distinction between repository reference material and user/global config ownership.
- Avoided claims of npm publication; documented `npx` usage as conditional on registry publication.

## Verification performed

- Read `.ai/tasks/public-readme-first-pass/task-spec.md` for scope, acceptance criteria, constraints, and validation plan.
- Read `package.json` to verify package name, version, bin command, scripts, packaged files, keywords context, and MIT license.
- Read `bin/install.js` to verify install/check command behavior, managed payloads, target paths, backup naming, restart guidance, and unsupported command usage.
- Read `.ai/tasks/public-readme-first-pass/validation-report.md` to address the reported installer-behavior accuracy issue.
- Read `workflow/skills/task-artifact-workflow/SKILL.md`, `workflow/AGENTS.md`, and workflow file layout to verify workflow and installed-file descriptions stayed accurate.
- Checked README content for concise usage-first structure, unsupported publication claims, duplicate bloat, installed-files accuracy, backup/restore/uninstall guidance, limitations, and limited `AGENTS.md` scope.
- Ran `npm run check`; package workflow sanity check passed.
- Ran `git status --short`; repository currently shows files as untracked, so status is not useful for isolating this task's edits beyond the files listed above.

## Deviations or follow-up

- No deviations from the requested README-only documentation scope.
- No blocking follow-up questions.
