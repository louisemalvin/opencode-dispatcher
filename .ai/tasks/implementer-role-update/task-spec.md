# Task Spec

## Scope

- Update `workflow/agents/implementer.md` to reflect the new test-writer agent split:
  1. Add a boundary stating the implementer does not write test files — the test-writer agent owns tests.
  2. Add a responsibility to run the project's test suite (from `.ai/context.md` test runner) and confirm all tests pass before reporting completion.
  3. Add test results (pass/fail counts, any failures) to the default report-back format.

## Non-Goals

- Do not change `permission:` block (`bash: "*": allow` must remain).
- Do not remove, reorder, or reword existing responsibilities or boundaries beyond the three specific additions.
- Do not touch other agent files (e.g., test-writer, orchestrator, validator).
- Do not modify `.ai/templates/implementation-report.md`.

## Testable Acceptance Criteria

Criteria the test-writer encodes as executable tests and the validator re-runs. Each criterion should include a test file path hint where practical.

- N/A — this task only edits an agent instruction file (markdown) with no executable code changes. Validation is inspectable-only.

### Test File Paths

- N/A

## Inspectable Acceptance Criteria

Criteria the validator checks manually (docs, file structure, content, configuration).

- **Boundary present:** `workflow/agents/implementer.md` contains a boundary line stating the implementer does not write test files and that the test-writer agent owns tests.
- **Responsibility present:** `workflow/agents/implementer.md` contains a responsibility to run the project's test suite and confirm all tests pass before reporting completion.
- **Report format updated:** The "Default report back" section includes test results (pass/fail counts, any failures).
- **Existing content preserved:** All original responsibilities, boundaries, the `permission:` block (including `bash: "*": allow`), the template reference to `.ai/templates/implementation-report.md`, and the overall structure remain intact.
- **No unintended changes:** `git diff` shows only the three additions described in scope.

## Constraints

- Edit only `workflow/agents/implementer.md`.
- The three additions must be inserted at sensible locations within the existing sections (boundary under Boundaries, responsibility under Responsibilities, test results under Default report back).
- Wording must be consistent with the existing document's tone and formatting.

## Relevant Files

- `workflow/agents/implementer.md` — the file to edit.
- `.ai/context.md` — referenced in the new responsibility as the source for the test runner command.
- `.ai/templates/implementation-report.md` — template referenced in existing responsibility; not to be modified.

## Validation Plan

- Read `workflow/agents/implementer.md` and confirm:
  - The test-file boundary is present under `Boundaries:`.
  - The test-suite responsibility is present under `Responsibilities:`.
  - The test-results line is present under `Default report back:`.
  - All original content sections (description, mode, hidden, permission, responsibilities #1-6, boundaries #1-5, report format #1-4) are preserved verbatim except for the added lines.
- Run `git diff workflow/agents/implementer.md` to confirm only the three additions appear.
