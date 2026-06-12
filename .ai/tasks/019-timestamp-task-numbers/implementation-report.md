# Implementation Report: Timestamp-Based Task Numbers

## Outcome

Successfully replaced the collision-prone sequential `<NNN>` task-numbering scheme with a timestamp-based `<timestamp>-<task-id>` scheme across three files. All verification checks pass.

## Files Changed

### 1. `workflow/agents/orchestrator.md` (8 lines changed)

- **Bash allowlist** (lines 40-41): Added `"date": allow` and `"date *": allow` entries before the catch-all `"*": deny`.
- **Line 67**: Updated `.ai/tasks/<NNN>-<task-id>/task-spec.md` → `.ai/tasks/<timestamp>-<task-id>/task-spec.md`.
- **Line 159**: Updated `.ai/tasks/<NNN>-<task-id>/planning-handoff.md` → `.ai/tasks/<timestamp>-<task-id>/planning-handoff.md`.
- **Line 161**: Changed numbering instruction from "listing/reading `.ai/tasks/`" to "running `date +%s`".

### 2. `workflow/agents/task-planner.md` (58-line reduction)

- **Line 17**: `<NNN>` → `<timestamp>` in the "Do NOT compute..." instruction.
- **Line 63**: `<NNN>` → `<timestamp>` in the Assigned-Unit Workflow.
- **Removed** entire "Single-Unit Workflow (no assigned path)" section (previously lines 59-68) — contained `<NNN>` zero-padded numbering formula and `.ai/tasks/` listing logic.
- **Removed** entire "Self-Directed Decomposition (fallback)" section (previously lines 80-115) — contained multi-unit decomposition logic and `<NNN>-<task-id>` path references.
- **Planning Flow section**: Replaced the self-directed decomposition fallback bullet with a "No assigned output path" bullet stating to STOP and return a planning-blocked report.
- **Default Report Back**: Simplified to remove multi-unit parentheticals (no longer applicable).

### 3. `.ai/decisions/2026-06-12-file-based-agent-handoffs.md` (1 word changed)

- **Line 27**: Replaced `<NNN>` with `<timestamp>` in the path reference `.ai/tasks/<timestamp>-<task-id>/`.

**Note**: The decision artifact edit was delegated to `agy` via `.ai/tasks/019-timestamp-task-numbers/agy-handoff.md` because the implementer agent's boundaries prevent editing `.ai/decisions/**`. agy successfully performed the single-line substitution.

## Decisions

- The task-planner's self-directed numbering fallback was removed entirely (as resolved in the planning handoff). The task-planner always requires an orchestrator-assigned path; if none is provided, it reports planning-blocked.
- `date` permissions were added only to the orchestrator's bash allowlist, not the task-planner's, since the orchestrator now owns the `date +%s` call.
- Files outside the three target files (validator.md, implementer.md, shipper.md, documentation.md) still reference `<NNN>-<task-id>` in their own prompts. These were intentionally left unchanged per the task spec's non-goals — those agents do not compute task numbers, they only consume paths assigned by the orchestrator.

## Verification

All validation steps from the task spec pass:

| # | Check | Result |
|---|-------|--------|
| 1 | `npm run check` | ✅ Exit 0 |
| 2 | No `<NNN-` in `orchestrator.md` | ✅ Zero hits |
| 3 | `timestamp` in `orchestrator.md` lines ~67, ~159 | ✅ Present |
| 4 | `"date": allow` and `"date *": allow` in orchestrator bash allowlist | ✅ Both present |
| 5 | No `<NNN` in `task-planner.md` | ✅ Zero hits (hits in other files are expected) |
| 6 | No `Self-Directed Decomposition` or `Single-Unit Workflow` in `task-planner.md` | ✅ Zero hits |
| 7 | `planning-blocked` in Planning Flow describing no-assigned-path case | ✅ Present at line 34 |
| 8 | No `<NNN-` in decision artifact | ✅ Zero hits; line 27 shows `<timestamp>` |
| 9 | Only the three target files changed | ✅ `git diff --stat` confirms 3 files |
| 10 | `npm run check` passes after all edits | ✅ Exit 0 |

## Known Issues

None. Pre-existing `<NNN>-<task-id>` references in `validator.md`, `implementer.md`, `shipper.md`, and `documentation.md` are outside scope — those agents receive paths from the orchestrator and do not compute task numbers.
