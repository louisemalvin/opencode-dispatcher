# Task Spec: Orchestrator Routing — Add Test Writer to Workflow

## Scope

- Edit `workflow/agents/orchestrator.md` to integrate the test-writer subagent into the orchestrator's permission block, core routing chain, delegation examples, and decomposition constraints.
- Add `test-writer: allow` to the `task:` permission block (YAML frontmatter), alongside the existing subagent allow entries.
- Update Core routing to include `test-writer` in the chain: after task-planner creates spec → test-writer writes tests → implementer implements → validator validates. The routing text must describe when test-writer is invoked (testable criteria present in the task spec) and that it runs before implementer.
- Add a `Test-driven task` delegation workflow example: `task-planner -> test-writer -> implementer -> validator`.
- Update the Decomposition and batching section to note that test-writer and implementer for the same unit must run sequentially (not in parallel — the adversarial guarantee). The existing "planner → implementer → validator" sequential chain text should be extended to include test-writer.

## Non-Goals

- Do NOT change any existing routing rules, remove any permission entries, or modify the decomposition logic.
- Do NOT modify any file other than `workflow/agents/orchestrator.md`.
- Do NOT edit other agent definition files, templates, or `.ai/` artifacts.
- Do NOT remove, reorder, or weaken any existing YAML permission rules.
- Do NOT change the structure, tone, or density of the orchestrator definition beyond the four targeted edits.

## Testable Acceptance Criteria

Criteria the test-writer encodes as executable tests and the validator re-runs.

- Criterion 1: `workflow/agents/orchestrator.md` YAML frontmatter contains `test-writer: allow` under the `task:` permission key — `grep -A10 "^permission:" workflow/agents/orchestrator.md` matches `test-writer: allow`
- Criterion 2: Core routing section (between `## Core routing` and `## Decomposition`) includes language routing to test-writer between planner and implementer — `grep -q "test-writer" workflow/agents/orchestrator.md` returns success on a line in the Core routing region

### Test File Paths

- N/A (no test framework established in this project; validation is inspectable)

## Inspectable Acceptance Criteria

Criteria the validator checks manually (docs, file structure, content, configuration).

- Criterion 3: A `Test-driven task` delegation workflow example exists in the Delegation workflow examples section and reads `task-planner -> test-writer -> implementer -> validator` (or equivalent text).
- Criterion 4: The Decomposition and batching section states that test-writer and implementer for the same unit must run sequentially (not parallelized), extending or following the existing "planner → implementer → validator" sequential-chain text.
- Criterion 5: All existing YAML permission entries (`task-planner`, `implementer`, `documentation`, `validator`, `research`, `shipper`) remain present and unchanged.
- Criterion 6: All existing Core routing rules remain present and unchanged (no entries removed or reworded beyond the test-writer addition).
- Criterion 7: The file is valid YAML frontmatter followed by valid markdown — the `---` fences open and close the frontmatter block correctly.

## Constraints

- Edit only `workflow/agents/orchestrator.md`.
- The `test-writer: allow` entry must be added inside the `task:` block, indented at the same level as the other `allow` entries.
- New routing text must match the existing tone and density of the orchestrator definition.
- The sequential constraint in the decomposition section must be clear: test-writer runs after planner's task-spec is approved and before implementer writes code; both act on the same unit and cannot run in parallel.

## Relevant Files

- `workflow/agents/orchestrator.md` — the only file to edit.

## Validation Plan

- Check `git diff workflow/agents/orchestrator.md` shows exactly four logical changes with no unrelated modifications.
- Verify `test-writer: allow` appears in the YAML frontmatter permission block.
- Verify Core routing text includes a test-writer routing sentence between the task-planner routing and the implementer routing.
- Verify Delegation workflow examples section includes the `Test-driven task` example.
- Verify Decomposition section includes the sequential constraint for test-writer/implementer on the same unit.
- Verify all pre-existing `task:` permission entries and all pre-existing routing rules are untouched.
- Verify the file is parseable YAML + markdown (no broken frontmatter fences).
