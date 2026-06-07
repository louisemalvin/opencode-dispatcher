# Validation Report

## Result

- PASS: Completed work satisfies `.ai/tasks/never-touch-agents-md/task-spec.md`. The installer no longer installs, overwrites, backs up, restores, removes, renames, or otherwise touches user/global `~/.config/opencode/AGENTS.md`.

## Checks Performed

- Read task spec: `.ai/tasks/never-touch-agents-md/task-spec.md`.
- Read implementation report: `.ai/tasks/never-touch-agents-md/implementation-report.md`.
- Attempted to read project context at `.ai/context.md`; no project context file exists.
- Inspected changed/relevant files: `bin/install.js`, `README.md`, `package.json`.
- Ran `git status --short`; repository has no commits and relevant files are untracked along with the rest of the project files.
- Ran `git diff -- bin/install.js README.md package.json .ai/tasks/never-touch-agents-md/task-spec.md .ai/tasks/never-touch-agents-md/implementation-report.md`; no diff output was available because the repository has no baseline commit and files are untracked.
- Ran `git log --oneline -10`; failed with `fatal: your current branch 'master' does not have any commits yet`.
- Searched installer and README references to `AGENTS.md`, `.bak-*`, install/backup/restore/uninstall wording.
- Ran `npm run check`; passed with output identifying install payloads as `agents`, `skills`, `templates` and `workflow/AGENTS.md` as a reference file checked separately.
- Ran `node ./bin/install.js nope`; invalid-command usage listed only `agents`, `skills`, and `templates` as installed payloads.
- Ran temporary-HOME installer simulation at `/tmp/opencode/dispatcher-validator-never-agents-OcfuJx` with a pre-existing `~/.config/opencode/AGENTS.md` sentinel and pre-existing managed `agents`, `skills`, and `templates` paths.

## Acceptance Criteria Review

- PASS: Temporary-HOME install left pre-existing `~/.config/opencode/AGENTS.md` byte-for-byte unchanged. SHA-256 before and after: `c992887adc56eb78fe712a41150ae4d264b7a6c3dff2c361144c958d018c6811`.
- PASS: Temporary-HOME install created no `AGENTS.md.bak-*` path; observed backup count was `0`.
- PASS: `bin/install.js` install payload list is `agents`, `skills`, and `templates`; `AGENTS.md` is not copied by `install()`.
- PASS: Installer success output, backup output, invalid-command/help text, and restore guidance reference managed installed paths only and do not instruct users to copy, replace, back up, restore, remove, or rename `~/.config/opencode/AGENTS.md`.
- PASS: `npm run check` passed and check output distinguishes install payloads from `workflow/AGENTS.md` reference documentation.
- PASS: `README.md` states that global `~/.config/opencode/AGENTS.md` is user-owned and not installed, overwritten, backed up, restored, removed, or renamed; installed files and backup/uninstall sections list only managed paths.
- PASS: Retained `workflow/AGENTS.md` references distinguish it as repository reference/source documentation, not installer-managed user/global config.
- PASS: Implementation report documents changed files, temporary-HOME simulation, unchanged sentinel proof, absence of `AGENTS.md.bak-*`, managed backups, and package check result.

## Issues Found

- None.

## Residual Risks

- The repository has no commits, so validation could not compare changes against a committed baseline with `git diff`.
- Validation inspected current files and ran local installer simulations only; it did not test npm registry publication or installed package execution via a real `npx` package.
