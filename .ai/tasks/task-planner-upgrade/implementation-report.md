# Implementation Report

## Outcome

- Successfully upgraded `workflow/agents/task-planner.md` with two additions:
  1. New responsibility bullet instructing the agent to read `.ai/context.md` (specifically `## Test Setup`) for test framework, runner, and file conventions.
  2. Expanded "Create" bullet to describe splitting acceptance criteria into testable (`## Testable Acceptance Criteria` with `### Test File Paths`) and inspectable (`## Inspectable Acceptance Criteria`) sections, with test file path hints derived from `.ai/context.md` conventions.
- Template reference to `.ai/templates/task-spec.md` preserved unchanged.
- All existing responsibility bullets, scope-ambiguity guard, and report-back format preserved unchanged.
- Frontmatter block unchanged.

## Files Changed

- `workflow/agents/task-planner.md` — lines 19–20 added/expanded.

## Decisions

- Followed task spec constraint to add only two specific changes with minimal addition; no rephrasing or restructuring of surrounding content.
- Used the same imperative bullet-point style as existing responsibilities for consistency.
- Kept the `.ai/context.md` reading responsibility as a separate bullet (rather than folding into the existing "Read existing project context" bullet) to make the specific Test Setup expectation explicit and grep-able.

## Verification

- `git diff --name-only` confirms modifications scoped to `workflow/agents/task-planner.md` (other files are pre-existing uncommitted changes).
- `grep -c "context.md"` → 2 (≥ 1 ✓)
- `grep -c "Testable Acceptance Criteria"` → 1 (≥ 1 ✓)
- `grep -c "test file path"` → 1 (≥ 1 ✓)
- All original responsibility bullets, scope-ambiguity guard, and report-back format verified present via grep.
- Frontmatter block matches `git show HEAD:workflow/agents/task-planner.md` exactly.
- Read-test confirms the file reads as a coherent agent definition.

## Known Issues

- None.
