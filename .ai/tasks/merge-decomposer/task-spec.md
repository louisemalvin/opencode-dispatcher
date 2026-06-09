# Task Spec: Merge Decomposer into Task-Planner and Simplify Orchestrator

## Scope

1. **Rewrite `workflow/agents/task-planner.md`** to absorb the decomposer agent's responsibilities:
   - Add `question: allow` to the frontmatter `permission` block (needed for the user approval step during decomposition).
   - On every invocation, assess whether the work is single-unit or multi-unit.
   - **Single-unit**: current behavior unchanged — create one `task-spec.md` at `.ai/tasks/<task-id>/task-spec.md`.
   - **Multi-unit**: decompose into independent work units:
     - Assign a slug per unit.
     - Detect file conflicts: two units touching the same file cannot run in parallel.
     - Detect true dependencies: unit Y needs unit X's output.
     - Present a unit table to the user for approval:
       ```
       | # | Unit       | Delivers              | Depends on | Parallel with |
       |---|------------|-----------------------|------------|---------------|
       | 1 | slug-name  | one-line deliverable  | —          | 2             |
       | 2 | slug-name  | one-line deliverable  | —          | 1             |
       ```
     - Wait for user approval before proceeding.
     - Create a **parent manifest** at `.ai/tasks/<task-id>/task-spec.md` containing the unit table and execution order.
     - Create one **child task-spec.md** per unit under numeric-prefixed subdirectories:
       ```
       .ai/tasks/<task-id>/
         task-spec.md              ← parent manifest
         01-unitname/
           task-spec.md
         02-unitname/
           task-spec.md
       ```
     - Write `.ai/tasks/current` pointer file containing the path to the first unit (e.g., `<task-id>/01-unitname`).
   - Preserve all existing responsibilities: read `.ai/context.md` for conventions, read candidate files and follow imports shallowly, make architectural decisions, create `.ai/tasks/<task-id>/task-spec.md`, scope-ambiguity guard, no implementation edits, default report-back format.

2. **Update `workflow/agents/orchestrator.md`** to remove decomposer references and routing:
   - Remove `decomposer: allow` (line 16) from the frontmatter `permission` `task` block.
   - Remove the routing line (line 42): "If the task is complex, multi-part, or touches multiple unrelated modules, delegate to decomposer agent to plan independent work units before any other agent."
   - Remove the entire "Decomposition and batching" section (lines 53–58), including all four paragraphs.
   - Update the "Complex multi-module" delegation workflow example (line 87) from:
     ```
     orchestrator -> decomposer (plan+approval) -> parallel task-planners -> ...
     ```
     to route through task-planner directly:
     ```
     orchestrator -> task-planner (decompose+plan+approval) -> parallel implementers -> parallel validators -> orchestrator.
     ```
   - Ensure all plan-requiring work now routes through task-planner only (no decomposer path remains).

3. **Delete `workflow/agents/decomposer.md`** from the repository.

## Non-Goals

- **The orchestrator's deterministic-loop rewrite** (reading `.ai/tasks/current` to detect which task/phase is active) is a **separate follow-up task**. This task only does the merge + orchestrator cleanup. The `.ai/tasks/current` pointer file is a spec output convention that task-planner will write; the orchestrator does not yet read it.
- Do NOT modify any other agent files (`implementer.md`, `validator.md`, `executor.md`, `init.md`, `research.md`, `shipper.md`, `test-writer.md`, `documentation.md`).
- Do NOT modify `README.md`, `package.json`, `bin/`, `.gitignore`, or any source code outside `workflow/agents/`.
- Do NOT create or modify `.ai/context.md`, decision records, or task artifacts outside this task's own spec.

## Testable Acceptance Criteria

Criteria the test-writer encodes as executable tests and the validator re-runs. Each criterion should include a test file path hint where practical.

- **TP-1**: `workflow/agents/task-planner.md` frontmatter `permission` block contains `question: allow` — `grep -c "question: allow" workflow/agents/task-planner.md` returns ≥ 1.
- **TP-2**: `workflow/agents/task-planner.md` contains instructions to assess whether work is single-unit or multi-unit on every invocation — `grep -c "single-unit\|multi-unit\|single unit\|multi unit\|single.*multi" workflow/agents/task-planner.md` returns ≥ 1.
- **TP-3**: `workflow/agents/task-planner.md` contains instructions for file conflict detection in multi-unit decomposition — `grep -c "conflict\|conflict.*file\|same file" workflow/agents/task-planner.md` returns ≥ 1.
- **TP-4**: `workflow/agents/task-planner.md` contains instructions for dependency detection in multi-unit decomposition — `grep -c "dependenc\|depends on\|needs.*output" workflow/agents/task-planner.md` returns ≥ 1.
- **TP-5**: `workflow/agents/task-planner.md` contains instructions to present an approval table to the user — `grep -c "table\|approv" workflow/agents/task-planner.md` returns ≥ 1.
- **TP-6**: `workflow/agents/task-planner.md` contains instructions to create parent manifest and numeric-prefixed subdirectory child task specs — `grep -c "01-\|0[0-9]-\|parent.*manifest\|child.*task-spec\|subdir" workflow/agents/task-planner.md` returns ≥ 1.
- **TP-7**: `workflow/agents/task-planner.md` contains instructions to write `.ai/tasks/current` pointer file — `grep -c "\.ai/tasks/current\|tasks/current" workflow/agents/task-planner.md` returns ≥ 1.
- **ORCH-1**: `workflow/agents/orchestrator.md` does NOT contain `decomposer: allow` in its permission block — `grep -c "decomposer: allow" workflow/agents/orchestrator.md` returns 0.
- **ORCH-2**: `workflow/agents/orchestrator.md` does NOT contain the phrase "delegate to decomposer" in the routing instructions — `grep -c "delegate.*decomposer\|decomposer agent" workflow/agents/orchestrator.md` returns 0.
- **ORCH-3**: `workflow/agents/orchestrator.md` does NOT contain a "Decomposition and batching" section heading — `grep -c "Decomposition and batching" workflow/agents/orchestrator.md` returns 0.
- **DEL-1**: `workflow/agents/decomposer.md` no longer exists on disk — `test -f workflow/agents/decomposer.md && echo "EXISTS" || echo "GONE"` returns "GONE".

### Test File Paths

- `tests/test_merge_decomposer.py`

## Inspectable Acceptance Criteria

Criteria the validator checks manually (docs, file structure, content, configuration).

- **I-1**: The orchestrator's "Complex multi-module" workflow example (in "Delegation workflow examples") now routes through `task-planner` instead of `decomposer`, making task-planner the sole decomposition agent.
- **I-2**: No other routing line in orchestrator.md references the decomposer; all plan-requiring work routes through task-planner only. The "simple clear edit", "non-trivial feature", and "test-driven task" workflow examples still flow through task-planner as before.
- **I-3**: Task-planner's existing responsibilities survive the rewrite intact: read `.ai/context.md` for conventions, read candidate files, follow imports shallowly, make architectural decisions, scope-ambiguity guard ("If scope is ambiguous, stop and report…"), no implementation edits, and the default report-back format (task artifact path, scope/acceptance criteria summary, open questions/decisions needed).
- **I-4**: The task-planner still describes first creating `.ai/tasks/<task-id>/task-spec.md` with sections: Scope, Non-Goals, Testable Acceptance Criteria (with Test File Paths), Inspectable Acceptance Criteria, Relevant Files.
- **I-5**: The orchestrator's artifact source-of-truth rules, core routing (minus decomposer line), clarification and routing rules, direct work rules, final output style, and remaining delegation workflow examples are all preserved without unintended mutation.
- **I-6**: `git diff --name-only` shows only three changes: `workflow/agents/task-planner.md` (modified), `workflow/agents/orchestrator.md` (modified), `workflow/agents/decomposer.md` (deleted).
- **I-7**: The full updated task-planner.md reads coherently as a single agent definition — the new decomposition responsibilities integrate naturally with the existing task-spec writing responsibilities, not as a bolted-on afterthought.
- **I-8**: The full updated orchestrator.md reads coherently with no dangling references to a decomposer that no longer exists.

## Constraints

- Edit only `workflow/agents/task-planner.md` and `workflow/agents/orchestrator.md`. Delete only `workflow/agents/decomposer.md`.
- Preserve the existing frontmatter fields `description`, `mode`, and `hidden` on both agent files exactly as-is.
- Preserve existing `permission` entries on both files exactly as-is, except where this task explicitly adds or removes entries (`question: allow` addition to task-planner; `decomposer: allow` removal from orchestrator).
- Match the existing prose style in each agent file: imperative instructions, concise bullet points, same section heading convention (`## Section name`).
- For the `.ai/tasks/current` pointer file concept, describe the format as a simple relative path (e.g., `tasks/<task-id>/01-unitname`) — not a JSON or multi-line structure.

## Relevant Files

- `workflow/agents/task-planner.md` — current 33-line agent definition; to be substantially rewritten to absorb decomposition.
- `workflow/agents/orchestrator.md` — current 100-line agent definition; to have decomposer references and "Decomposition and batching" section removed, and "Complex multi-module" example updated.
- `workflow/agents/decomposer.md` — current 39-line agent definition; to be deleted.
- `.ai/tasks/task-planner-upgrade/task-spec.md` — reference for the current task-planner spec format and acceptance criteria style.
- `.ai/tasks/orchestrator-decompose/task-spec.md` — reference for the decomposer-related orchestrator spec that added the section now being removed.

## Validation Plan

- Run `git diff --name-only` to confirm only three files changed: `workflow/agents/task-planner.md` (M), `workflow/agents/orchestrator.md` (M), `workflow/agents/decomposer.md` (D).
- Run `grep` checks for the seven task-planner testable criteria (TP-1 through TP-7).
- Run `grep` checks for the three orchestrator removal criteria (ORCH-1 through ORCH-3).
- Run the existence check for the decomposer deletion (DEL-1).
- Manually inspect task-planner.md to confirm it describes:
  - The single-unit vs. multi-unit assessment step.
  - The decomposition process: slugs, file conflicts, dependencies, approval table.
  - The artifact output: parent manifest with unit table + order, numeric-prefixed child task-specs in subdirs, `.ai/tasks/current` pointer.
  - All original responsibilities preserved (context.md reading, scope guard, etc.).
- Manually read orchestrator.md to confirm:
  - No "decomposer" anywhere in permissions or routing.
  - No "Decomposition and batching" section.
  - "Complex multi-module" example updated.
  - All other sections intact and coherent.
- Read-test both files end-to-end to confirm each reads as a complete, internally consistent agent definition.

## Open Questions

- None. The merge plan, orchestrator cleanup, and what stays out of scope (deterministic-loop rewrite) are all explicitly specified.
