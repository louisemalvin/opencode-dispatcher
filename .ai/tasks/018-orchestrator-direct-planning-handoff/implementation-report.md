# Implementation Report: Orchestrator Direct Planning Handoff

## Outcome

All four target files have been edited according to the approved task spec. The orchestrator now has a narrow `.ai/tasks/**/planning-handoff.md` edit exception and writes planning handoff files directly instead of delegating to the documentation agent. The documentation agent is no longer in the planning-handoff materialization path. Documentation (`docs/workflow.md` and `docs/agents.md`) has been updated to reflect this change.

`npm run check` passes with zero errors. All 12 testable acceptance criteria pass.

## Files Changed

1. **`workflow/agents/orchestrator.md`**
   - **Permission**: Changed `edit: deny` (flat string) to a map with `"*": deny` and `".ai/tasks/**/planning-handoff.md": allow`.
   - **Hard boundary** (line 59): Updated to acknowledge the narrow planning-handoff exception while preserving the general no-edit stance for all other files.
   - **Rich Handoff Contract — Materialization requirement** (lines 157–162): Replaced three bullet points delegating to documentation agent with four bullet points instructing orchestrator to write the file directly, determine task number, create directory, and then delegate to task-planner.
   - All other permission blocks, sections (INTAKE, CLARIFY, ROUTE, DELEGATE, REVIEW, DONE, Multi-Unit Coordination, Decomposition Ownership), and delegation paths remain intact.

2. **`workflow/agents/documentation.md`**
   - **Permission**: Removed `".ai/tasks/**/planning-handoff.md": allow` from the frontmatter.
   - **Responsibilities**: Removed the bullet "Write planning handoff artifacts when delegated by orchestrator:" and its three sub-bullets (lines 36–39).
   - All other responsibilities (durable source artifacts, `.ai/context.md`, decision notes, `documentation-report.md`, concise docs) and boundaries are preserved.

3. **`docs/workflow.md`**
   - **Task Artifact Layout table** (line 63): Changed `planning-handoff.md` row — "Written by" from "Documentation" to "Orchestrator", updated description text.
   - **Substantial Feature or Fix** (line 82): Changed from "delegates to documentation to write a `planning-handoff.md`" to "writes a `planning-handoff.md` artifact directly".
   - **Rich Handoff Concept — Materialization** (line 98): Replaced "Since the orchestrator has `edit: deny`, it delegates the file writing to the **documentation agent**" with "The orchestrator writes the file directly using a narrow `.ai/tasks/**/planning-handoff.md` edit permission."

4. **`docs/agents.md`**
   - **Agent Reference table — Orchestrator row** (line 15): Changed "materializes planning handoffs via documentation agent" to "writes planning handoff artifacts directly".
   - **Agent Reference table — Documentation row** (line 21): Removed "writes planning handoff artifacts when delegated by orchestrator;" from role summary.
   - **Permission Philosophy — Deny-by-Default** (line 39): Updated orchestrator bullet from `edit: deny` to describe the narrow `.ai/tasks/**/planning-handoff.md` exception.

## Decisions

- **Permission syntax**: Used `**` (double-star) as specified in the task spec, matching the existing pattern used by documentation agent in task 017. This matches OpenCode's glob convention for arbitrary directory depth.
- **Hard boundary language**: Crafted to explicitly enumerate what remains off-limits (source code, docs, configuration, task specs, reports, and all other task artifacts) while acknowledging the single narrow exception.
- **Direct writing instructions**: Followed the spec exactly — "write yourself using the narrow `.ai/tasks/**/planning-handoff.md` edit exception", "determine task number by listing/reading `.ai/tasks/`", "create task directory as needed", "delegate to task-planner with handoff file path".
- **Preserved delegations**: The orchestrator still delegates docs/context/decision updates to documentation agent for other purposes. Only planning-handoff materialization was changed.
- **Preserved implementer→agy handoff**: The agy handoff design from task 017 is untouched, as required by the non-goals.

## Verification

| # | Acceptance Criterion | Result |
|---|---------------------|--------|
| 1 | `npm run check` passes | PASS |
| 2 | Orchestrator permission includes `".ai/tasks/**/planning-handoff.md": allow` and `"*": deny` | PASS |
| 3 | Orchestrator no longer delegates to doc agent for materialization (grep count 0) | PASS |
| 4 | Orchestrator instructs direct writing (grep count ≥1) | PASS |
| 5 | Documentation agent permission does not include planning-handoff.md (grep count 0) | PASS |
| 6 | Documentation agent no longer has planning handoff writing responsibility (grep count 0) | PASS |
| 7 | `docs/workflow.md` table says Orchestrator writes (grep count ≥1) | PASS |
| 8 | `docs/workflow.md` no longer says doc agent writes (grep count 0) | PASS |
| 9 | `docs/agents.md` orchestrator row credits direct writing (old text count 0, new text count ≥1) | PASS |
| 10 | `docs/agents.md` documentation row no longer mentions planning handoff (grep count 0) | PASS |
| 11 | Task-planner unchanged by my edits | PASS (pre-existing uncommitted changes from task 017 are unrelated) |
| 12 | Orchestrator hard boundary acknowledges exception (grep count ≥2) | PASS (count=3) |

Additional verification:
- Read all four edited files to confirm YAML frontmatter integrity and prompt consistency.
- Blast-radius check: `git diff --name-only` confirms changes are in the 4 intended files only; the other two modified files (`workflow/agents/implementer.md`, `workflow/agents/task-planner.md`, `docs/configuration.md`) contain pre-existing uncommitted changes from task 017.

## Known Issues

- **Pre-existing uncommitted changes**: The working tree contains uncommitted changes from task 017 (`docs/configuration.md`, `workflow/agents/implementer.md`, `workflow/agents/task-planner.md`). These are unrelated to this task. AC11 (task-planner unchanged) would fail if evaluated against the dirty working tree, but my edits did not touch those files.
- **AC12 count**: The acceptance criterion requires `>= 2` occurrences of `.ai/tasks/**/planning-handoff.md` in orchestrator.md. The actual count is 3 (once in YAML frontmatter, once in hard boundary text, once in materialization instruction), which exceeds the minimum.
