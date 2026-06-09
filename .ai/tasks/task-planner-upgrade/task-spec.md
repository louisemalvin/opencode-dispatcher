# Task Spec: Upgrade Task-Planner Agent to Produce Split Acceptance Criteria Format

## Scope

- Edit `workflow/agents/task-planner.md` to align the agent's instructions with the upgraded `.ai/templates/task-spec.md` template, which now splits acceptance criteria into `## Testable Acceptance Criteria` (with `### Test File Paths`) and `## Inspectable Acceptance Criteria`.
- Add a responsibility: read `.ai/context.md` (specifically the `## Test Setup` section) to learn the project's test framework, test runner command, and test file location conventions before drafting testable criteria.
- Update the "Create" responsibility bullet to describe splitting acceptance criteria into testable and inspectable sections, with test file path hints derived from the project's conventions recorded in `.ai/context.md`.
- Verify that the template reference already points to the project `.ai/templates/task-spec.md` template (current line 19 already references it).

## Non-Goals

- Do NOT change permissions, the `hidden` or `mode` frontmatter, or any other frontmatter fields.
- Do NOT change other responsibilities (read context, capture scope/non-goals/constraints/files/validation plan/open questions, decisions notes, source-code editing boundary).
- Do NOT change the default report-back format.
- Do NOT touch any other agent files (`workflow/agents/*.md`) or the global templates at `~/.config/opencode/templates/task-artifact-workflow/`.

## Testable Acceptance Criteria

Criteria the test-writer encodes as executable tests and the validator re-runs. Each criterion should include a test file path hint where practical.

- The task-planner agent file `workflow/agents/task-planner.md` includes a responsibility bullet stating that the agent reads `.ai/context.md` (specifically `## Test Setup`) to learn the project's test framework, test runner command, and test file conventions — `grep -c "context.md" workflow/agents/task-planner.md` returns ≥ 1.
- The agent's "Create" responsibility bullet describes splitting acceptance criteria into testable (`## Testable Acceptance Criteria` with `### Test File Paths`) and inspectable (`## Inspectable Acceptance Criteria`) sections — `grep -c "Testable Acceptance Criteria" workflow/agents/task-planner.md` returns ≥ 1.
- The agent instructions mention including test file path hints in testable criteria based on the project's test file conventions from `.ai/context.md` — `grep -c "test file path" workflow/agents/task-planner.md` returns ≥ 1.

### Test File Paths

- `tests/test_task_planner_upgrade.py`

## Inspectable Acceptance Criteria

Criteria the validator checks manually (docs, file structure, content, configuration).

- The existing template reference on the "Create" line (currently "project `.ai/templates/task-spec.md` template") is preserved unchanged — it already points to the right location.
- All existing responsibility bullets (read context/docs/code/`.ai/` artifacts, capture scope/non-goals/etc., decisions notes, no source code edits) remain present and unchanged.
- The scope-ambiguity guard ("If scope is ambiguous, stop and report…") remains present and unchanged.
- The default report-back format (task artifact path, scope/acceptance criteria summary, open questions/decisions needed) remains present and unchanged.
- The file is edited in-place — no other files are created or modified, verified via `git diff --name-only` showing only `workflow/agents/task-planner.md`.

## Constraints

- Edit only `workflow/agents/task-planner.md`.
- Preserve the existing frontmatter block (`description`, `mode`, `hidden`, `permission`) exactly as-is.
- Match the existing prose style: imperative instructions, concise bullet points.
- Keep additions minimal — add only the .ai/context.md reading responsibility and the criteria-splitting language; do not expand beyond what is needed.

## Relevant Files

- `workflow/agents/task-planner.md` — the only file to be modified.
- `.ai/templates/task-spec.md` — confirms the split-criteria format the agent must produce.
- `.ai/tasks/ai-init-test-info/task-spec.md` — records that `.ai/context.md` now contains `## Test Setup` after `/ai-init`.
- `.ai/tasks/task-spec-format/task-spec.md` — records the template upgrade that introduced the split criteria.

## Validation Plan

- Run `git diff --name-only` to confirm only `workflow/agents/task-planner.md` was modified.
- Verify `grep "context.md" workflow/agents/task-planner.md` returns at least one match (the new .ai/context.md reading responsibility).
- Verify `grep "Testable Acceptance Criteria" workflow/agents/task-planner.md` returns at least one match.
- Verify `grep "test file path" workflow/agents/task-planner.md` returns at least one match.
- Verify all original responsibility bullets (decisions, source code edits, scope-guard, report-back) are still present via `grep` for key phrases.
- Verify the frontmatter block is unchanged (compare against `git show HEAD:workflow/agents/task-planner.md` frontmatter).
- Read-test the updated file end-to-end to confirm it reads as a coherent agent definition that clearly instructs the task-planner to read `.ai/context.md` for test conventions and produce specs with split acceptance criteria and test file path hints.

## Open Questions

- None. Scope is fully specified from the task brief.
