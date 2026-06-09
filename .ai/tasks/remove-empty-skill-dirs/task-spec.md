# Task Spec

## Scope

- Delete these four empty directories under `workflow/skills/`:
  - `workflow/skills/agent-memory-systems/`
  - `workflow/skills/deep-research/`
  - `workflow/skills/grill-with-docs/`
  - `workflow/skills/mermaid-diagram-specialist/`
- The directories contain zero files (verified by filesystem inspection) and have no references anywhere in the repository (verified by grep across the entire codebase). No code, docs, agent definitions, or config files mention any of these skill names.
- Removing them prevents the installer (`bin/install.js`) from copying empty directories into `~/.config/opencode/skills/` during install, which would create pointless empty folders in the user's OpenCode configuration.

## Non-Goals

- Do not modify `workflow/skills/task-artifact-workflow/` or its `SKILL.md` — that is the only shipped skill and must remain untouched.
- Do not modify `bin/install.js`, `README.md`, or any agent definitions.
- Do not commit, push, or publish.
- Do not create or modify any other files or directories.

## Acceptance Criteria

- The four directories (`agent-memory-systems/`, `deep-research/`, `grill-with-docs/`, `mermaid-diagram-specialist/`) no longer exist on disk under `workflow/skills/`.
- `workflow/skills/task-artifact-workflow/` is untouched and still contains `SKILL.md`.
- `npm run check` passes (the check validates required install payloads — while it does not directly inspect skills directories, it must still pass to confirm no unintended breakage).

## Constraints

- Only delete the four specified directories. Touch nothing else.
- No file modifications outside the four deletions.
- No git operations.

## Relevant Files

- `workflow/skills/agent-memory-systems/` (empty, to be deleted)
- `workflow/skills/deep-research/` (empty, to be deleted)
- `workflow/skills/grill-with-docs/` (empty, to be deleted)
- `workflow/skills/mermaid-diagram-specialist/` (empty, to be deleted)
- `workflow/skills/task-artifact-workflow/SKILL.md` (must be preserved)
- `bin/install.js` (installer — copies everything under `workflow/skills/`; not to be modified)

## Validation Plan

- Confirm the four directories no longer exist: `ls workflow/skills/agent-memory-systems/` and equivalents should error/fail.
- Confirm `task-artifact-workflow/SKILL.md` is still present and unchanged.
- Confirm `workflow/skills/` listing shows only `task-artifact-workflow/`.
- Run `npm run check` and confirm exit code 0.
- Confirm no other files or directories were modified (check `git diff` shows only the four directory deletions).
