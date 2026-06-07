# Implementation Report

## Outcome

- Updated the installer so OpenCode Dispatcher installs only `agents`, `skills`, and `templates`, never `AGENTS.md`.
- Updated user-facing installer output/help and README wording to make `~/.config/opencode/AGENTS.md` explicitly user-owned and untouched.
- Kept `workflow/AGENTS.md` as repository reference/source documentation and package-check reference, not an install payload.

## Files Changed

- `bin/install.js`
- `README.md`
- `.ai/tasks/never-touch-agents-md/implementation-report.md`

## Decisions

- Used a shared `installPayloads` list containing only `agents`, `skills`, and `templates` so install behavior and help text stay aligned.
- Left `workflow/AGENTS.md` in the package check as a separately named reference file, while package check output identifies install payloads separately.
- Did not add new dependencies or installer commands.

## Verification

- `npm run check` passed.
- `node ./bin/install.js nope` printed invalid-command usage that lists only `agents`, `skills`, and `templates` for install.
- Ran a temporary-`HOME` install simulation at `/tmp/opencode/dispatcher-never-agents-A3auSb` with a pre-existing `~/.config/opencode/AGENTS.md` sentinel and pre-existing managed `agents`, `skills`, and `templates` paths.
- Confirmed the sentinel `AGENTS.md` content remained byte-for-byte unchanged.
- Confirmed no `AGENTS.md.bak-*` path was created.
- Confirmed managed path backups were created for `agents`, `skills`, and `templates`, and managed payloads installed.

## Known Issues

- None.
