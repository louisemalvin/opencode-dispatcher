# Task Spec: Split Acceptance Criteria into Testable and Inspectable Sections

## Scope

- Edit `.ai/templates/task-spec.md` to replace the single "Acceptance Criteria" section with two subsections: "Testable Acceptance Criteria" and "Inspectable Acceptance Criteria".
- Add a "Test File Paths" subsection under "Testable Acceptance Criteria" so the test-writer agent knows where to place executable tests.
- Each new section includes a one-line description of its purpose (e.g., "Criteria the test-writer encodes as executable tests and the validator re-runs").
- Preserve all other template sections unchanged: Scope, Non-Goals, Constraints, Relevant Files, Validation Plan.

## Non-Goals

- Do NOT modify any agent definitions (`workflow/agents/*.md`), `bin/install.js`, `README.md`, or any other template files.
- Do NOT change the Validation Plan section format or structure.
- Do NOT add new top-level sections to the template beyond the Acceptance Criteria split.
- Do NOT edit the global templates at `~/.config/opencode/templates/task-artifact-workflow/`.

## Testable Acceptance Criteria

Criteria the test-writer encodes as executable tests and the validator re-runs.

- The template file `.ai/templates/task-spec.md` contains a section `## Testable Acceptance Criteria` with a one-line description (test file path hint: check with `grep "## Testable Acceptance Criteria" .ai/templates/task-spec.md`).
- The template file contains a subsection `### Test File Paths` listing suggested test file locations as bullets (test file path hint: check with `grep "### Test File Paths" .ai/templates/task-spec.md`).

## Inspectable Acceptance Criteria

Criteria the validator checks manually (docs, file structure, content, configuration).

- The old single `## Acceptance Criteria` section no longer exists in the template.
- All other sections (`## Scope`, `## Non-Goals`, `## Constraints`, `## Relevant Files`, `## Validation Plan`) are present in the same order and with the same header text.
- The new `## Testable Acceptance Criteria` and `## Inspectable Acceptance Criteria` headings use the same H2 heading style (`## Section Name`) as the rest of the template.
- The `### Test File Paths` subsection uses H3 heading style.

## Constraints

- Edit only `.ai/templates/task-spec.md`.
- Preserve the existing template structure, formatting style, and blank-line spacing conventions.
- Match the existing heading level convention (`##` for top-level sections, `###` for subsections) used in the project's `.ai/templates/task-spec.md`.
- Keep descriptions concise (one line each) matching the tone of the existing template.

## Relevant Files

- `.ai/templates/task-spec.md` — the only file to be modified.
- `.ai/tasks/orchestrator-decompose/task-spec.md` — reference for how filled-in task specs look in practice.

## Validation Plan

- Verify `grep "## Acceptance Criteria" .ai/templates/task-spec.md` returns no matches (old section removed).
- Verify `grep "## Testable Acceptance Criteria" .ai/templates/task-spec.md` returns exactly one match.
- Verify `grep "## Inspectable Acceptance Criteria" .ai/templates/task-spec.md` returns exactly one match.
- Verify `grep "### Test File Paths" .ai/templates/task-spec.md` returns exactly one match.
- Verify all retained sections (`## Scope`, `## Non-Goals`, `## Constraints`, `## Relevant Files`, `## Validation Plan`) are present and in the original order.
- Verify `git diff --name-only` shows only `.ai/templates/task-spec.md`.
- Read-test the full template to confirm it reads as a coherent, fillable task spec form with the new split criteria.

## Open Questions

- None. Scope is fully specified from the task brief.
