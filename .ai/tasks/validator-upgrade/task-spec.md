# Task Spec

## Scope

- Edit `workflow/agents/validator.md` responsibilities and description to reflect the validator's upgraded role:
  - Run test commands specified in the task spec's testable acceptance criteria and confirm they pass.
  - Audit test quality — spot-check test files for substance, not just pass/fail.
  - Preserve manual inspection responsibilities for inspectable criteria (docs, file structure, content).
- Keep all existing boundaries (read-only except validation reports, no code edits, no fixes, report-only).
- Keep all existing permissions (`bash: "*": allow`, restricted `edit`) unchanged.

## Non-Goals

- Do not change the permission block (already `bash: "*": allow`, `edit` restricted)
- Do not remove or weaken existing responsibilities; only add and clarify
- Do not touch any other agent files (`test-writer.md`, `implementer.md`, `orchestrator.md`, etc.)
- Do not modify templates, `bin/install.js`, `README.md`, or any other file
- Do not change the validation report template reference (remains `.ai/templates/validation-report.md`)

## Testable Acceptance Criteria

None. This task is purely a documentation/definition change to an agent markdown file; there are no executable tests.

## Inspectable Acceptance Criteria

- `workflow/agents/validator.md` responsibilities include (or clearly imply) running test commands from the task spec's testable acceptance criteria and confirming they pass
- `workflow/agents/validator.md` includes a responsibility to audit test quality — spot-check test files to verify tests actually cover what the criteria ask for, not hollow pass-throughs
- `workflow/agents/validator.md` preserves manual inspection responsibilities for inspectable criteria (docs, file structure, content) — explicitly stated or clearly implied
- The description/opening line (`Own validation against the task spec…`) is updated if needed to reflect the expanded role (running tests, auditing quality) without losing the existing meaning
- Boundaries section remains intact: no code edits, no docs/context/decisions/specs edits, no fixing issues (report to orchestrator), no destructive commands
- Permission block is exactly as-is (unchanged from current state)
- Template reference `.ai/templates/validation-report.md` is preserved (in the last responsibility bullet about writing reports)
- No existing responsibility is removed; additions are clarifications or expansions, not replacements

## Constraints

- Only edit `workflow/agents/validator.md`
- Preserve existing YAML frontmatter exactly as-is (permissions, mode, hidden, description)
- Preserve existing markdown structure and formatting conventions
- New text should match the existing tone and style of the file

## Relevant Files

- `workflow/agents/validator.md` — the sole file to edit

## Validation Plan

- Read `workflow/agents/validator.md` and confirm:
  - Responsibilities section includes language about running test commands from the spec
  - Responsibilities section includes language about auditing test quality / spot-checking test files
  - Responsibilities section preserves language about manual inspections for inspectable criteria
  - Boundaries section is unchanged (no code edits, no fixes, no destructive commands)
  - Permission block (YAML frontmatter lines 5–11) is byte-for-byte identical to the pre-edit version
  - Template reference `.ai/templates/validation-report.md` is still present
  - No existing responsibility bullet was removed
- Spot-check the edited file against the original (via `git diff`) to verify:
  - Only additions and clarifications, no removals
  - Permission block unchanged
