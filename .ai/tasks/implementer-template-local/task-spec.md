# Task Spec: Implementer Agent — Local Template Reference

## Scope

- Edit line 29 of `workflow/agents/implementer.md`.
- Change the template reference from global `~/.config/opencode/templates/task-artifact-workflow/implementation-report.md` (with fallback wording) to the project-local `.ai/templates/implementation-report.md`.
- The new line must read exactly:
  ```
  - Write `.ai/tasks/<task-id>/implementation-report.md` using the project `.ai/templates/implementation-report.md` template.
  ```
- This matches the pattern already used by `task-planner.md` and `validator.md`.

## Non-Goals

- Do NOT change any other line in `workflow/agents/implementer.md`.
- Do NOT touch other agent files (`task-planner.md`, `validator.md`, `orchestrator.md`, etc.).
- Do NOT create `.ai/templates/` directory or `implementation-report.md` template file.
- Do NOT modify any other files in the repository.

## Testable Acceptance Criteria

Criteria the test-writer encodes as executable tests and the validator re-runs. Each criterion should include a test file path hint where practical.

- N/A — this is a single-line text replacement with no executable logic.

### Test File Paths

- N/A

## Inspectable Acceptance Criteria

Criteria the validator checks manually (docs, file structure, content, configuration).

- Line 29 of `workflow/agents/implementer.md` reads: `- Write \`.ai/tasks/<task-id>/implementation-report.md\` using the project \`.ai/templates/implementation-report.md\` template.`
- No reference to `~/.config/opencode/templates/` remains anywhere in `workflow/agents/implementer.md`.
- All other content in `workflow/agents/implementer.md` (lines 1–28 and 30–45) is unchanged.
- `git diff --name-only` shows only `workflow/agents/implementer.md`.

## Constraints

- Edit only `workflow/agents/implementer.md`.
- Change exactly one line (line 29).
- Do not change any other content in the file.

## Relevant Files

- `workflow/agents/implementer.md` — the only file to be modified.

## Validation Plan

- Verify `grep "~/.config/opencode/templates" workflow/agents/implementer.md` returns no matches.
- Verify `grep ".ai/templates/implementation-report.md" workflow/agents/implementer.md` returns exactly one match (line 29).
- Verify the full line 29 content matches the new wording exactly.
- Verify `wc -l workflow/agents/implementer.md` still outputs 45 (line count unchanged).
- Verify `git diff --word-diff workflow/agents/implementer.md` shows a single-line change.

## Open Questions

- None. Scope is fully specified.
