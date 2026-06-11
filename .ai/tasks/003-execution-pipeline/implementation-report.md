# Implementation Report: Add Execution Pipeline Field to Task Specs

## Outcome

Successfully added `## Execution` section support to the task-planner and orchestrator agent definitions. The task-planner now writes an Execution section in every task spec, and the orchestrator reads it to determine the agent pipeline sequence.

## Files Changed

- `workflow/agents/task-planner.md` — 2 insertions, 2 modifications:
  - Line 26: Added `Execution` to the single-unit workflow section order (`Scope, Execution, Non-Goals, ...`)
  - Lines 32–36: Added new bullet defining the `## Execution` section format, valid agent names (`test-writer`, `implementer`, `documentation` — explicitly excluding `validator`), and decision logic for pipeline composition (testable → test-writer+implementer, inspectable-only → implementer, docs → documentation, follow-up docs → documentation)
  - Line 56: Added `Execution` to the multi-unit child spec section order (`Scope, Execution, Non-Goals, ...`)

- `workflow/agents/orchestrator.md` — 7 insertions:
  - Lines 140–146: Added "Execution pipeline for task specs" block between DELEGATE and REVIEW sections. Instructs orchestrator to read the `## Execution` section, spawn agents sequentially, append `validator` automatically, and report missing/empty sections to the user.

## Decisions

- Placed the new Execution instruction as a top-level bullet in the single-unit workflow (not a sub-bullet of the sections bullet). This matches the density of the surrounding instructions.
- Placed the orchestrator's pipeline guidance as a level-3-ish paragraph between the DELEGATE agent list and the REVIEW section, keeping all delegation-related rule content adjacent.
- Used bullet list format (not a table or code block) for the orchestrator pipeline steps to match the existing DELEGATE section style.
- The decision logic sub-bullets use `→` arrows to maintain consistency with the task-planner's existing style.

## Verification

- `git diff --name-only` confirms only the two target files were modified.
- `git diff` confirms the orchestrator's YAML frontmatter and permission block are byte-for-byte identical to the original (all changes are after line 51).
- Read-test of both files confirms:
  1. `task-planner.md` lists `Execution` in its single-unit workflow section ordering between Scope and Non-Goals.
  2. `task-planner.md` contains the Execution format description with heading format, valid agent names, and decision logic.
  3. `task-planner.md` includes `Execution` in its multi-unit child spec section list.
  4. `orchestrator.md` contains pipeline-spawning guidance: read Execution section, spawn sequentially, append validator, handle missing section, never assume defaults.
  5. No existing task-planner instructions were altered or removed (numbering rule, directory naming, context.md read, file imports, decision notes, file editing prohibition, unit table format, approval flow, `current` pointer).
  6. No existing orchestrator ROUTE, DELEGATE, or REVIEW bullets were altered or removed.
  7. The orchestrator's state machine (INTAKE → CLARIFY → ROUTE → DELEGATE → REVIEW → DONE) remains unchanged.
  8. The artifact source-of-truth rules remain unchanged.

## Known Issues

None.
