# Implementation Report

## Outcome

Successfully split the flat "Acceptance Criteria" section in `.ai/templates/task-spec.md` into two subsections: "Testable Acceptance Criteria" (with a "Test File Paths" subsection) and "Inspectable Acceptance Criteria". All other template sections preserved unchanged.

## Files Changed

- `.ai/templates/task-spec.md` — replaced `## Acceptance Criteria` with the split format.

## Decisions

- Kept the existing placeholder tone (empty bullets, short descriptions) consistent with the rest of the template.
- Used H2 (`##`) for both new sections and H3 (`###`) for "Test File Paths" to match the template's heading convention.
- Included example criterion with test file path hint (`pytest tests/test_example.py -k test_name`) and example test file paths to guide task spec authors.

## Verification

- `grep "## Acceptance Criteria"` → no matches (old section removed).
- `grep -c "## Testable Acceptance Criteria"` → 1 match.
- `grep -c "## Inspectable Acceptance Criteria"` → 1 match.
- `grep -c "### Test File Paths"` → 1 match.
- All retained sections (`## Scope`, `## Non-Goals`, `## Constraints`, `## Relevant Files`, `## Validation Plan`) present exactly once and in original order.
- Read-test: template reads as a coherent, fillable task spec form with the new split criteria.

## Known Issues

- None.
