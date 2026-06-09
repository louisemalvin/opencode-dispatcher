# Task Spec

## Scope

- Edit `workflow/agents/validator.md` permission block:
  - Change `bash: "*": ask` to `bash: "*": allow`
  - Remove the three `git *: allow` lines (no longer needed since `*: allow` covers them)
- This gives the validator full bash access, removing permission-prompt friction for safe operations like test runs, git status/diff/log, and read-only inspections.

## Non-Goals

- Do not modify any other part of the validator definition (description, mode, responsibilities, boundaries, report format)
- Do not modify any other agent files
- Do not modify `bin/install.js`, `README.md`, templates, or any other file
- Do not change other permission rules (`edit: *: deny` and `edit: .ai/tasks/*/validation-report.md: allow` stay as-is)

## Acceptance Criteria

- `workflow/agents/validator.md` permission block has `bash: "*": allow` instead of `bash: "*": ask`
- The three `git status*`, `git diff*`, `git log*` allow lines are removed
- All other permission rules (`edit: *: deny`, `edit: .ai/tasks/*/validation-report.md: allow`) remain unchanged
- All other content in the file remains unchanged (responsibilities, boundaries, report format, etc.)

## Constraints

- Only edit the permission block YAML in `workflow/agents/validator.md` (lines 5–14)
- Preserve existing YAML indentation (2-space)

## Relevant Files

- `workflow/agents/validator.md` — the sole file to edit

## Validation Plan

- Read `workflow/agents/validator.md` and confirm:
  - `bash:` key has only `"*": allow` (no `ask`, no git-specific entries)
  - `edit:` rules are unchanged (`"*": deny` and `".ai/tasks/*/validation-report.md": allow`)
  - All other content matches the pre-edit version (responsibilities, boundaries, etc.)
- Verify the YAML is valid and properly indented
