# Implementation Report: Standardize Task Directory Numbering Across Agent Definitions

## Outcome

All 6 agent definition files under `workflow/agents/` now consistently reference task directories using the `<NNN>-<task-id>` format. The task-planner now has a prominent, standalone numbering rule at the top of its agent description and the numbering instruction is the first bullet in the single-unit workflow.

## Files Changed

| File | Change |
|---|---|
| `workflow/agents/orchestrator.md` | Line 30: `<task-id>` → `<NNN>-<task-id>` |
| `workflow/agents/implementer.md` | Line 18: `<task-id>` → `<NNN>-<task-id>`; Line 27: `<task-id>` → `<NNN>-<task-id>` |
| `workflow/agents/validator.md` | Line 15: `<task-id>` → `<NNN>-<task-id>`; Line 25: `<task-id>` → `<NNN>-<task-id>` |
| `workflow/agents/documentation.md` | Line 32: `<task-id>` → `<NNN>-<task-id>` |
| `workflow/agents/shipper.md` | Line 53: `<task-id>` → `<NNN>-<task-id>` |
| `workflow/agents/task-planner.md` | Inserted standalone mandatory numbering rule after line 13 (before "Own task specification and decomposition..."); moved the numbering bullet to be the first bullet in the single-unit workflow |

## Decisions

- **Standalone rule placement**: Placed the mandatory numbering rule immediately after "You are the Task Planner Agent." and before the agent's core description, ensuring the LLM cannot miss it.
- **Bullet reorder**: The create/numbering bullet is now the first bullet in the single-unit workflow, elevating it above preparatory steps (reading context, scanning files).

## Verification

- `git diff --name-only` confirms only the 6 expected files were changed.
- `grep -Pn '<task-id>' workflow/agents/*.md | grep -v '<NNN>-<task-id>'` returns zero matches — no bare `<task-id>` references remain.
- All 12 `<NNN>-<task-id>` references are confirmed across all 6 files.
- Task-planner.md verified:
  - Standalone mandatory rule present at line 15.
  - Numbering bullet is now the first bullet in the single-unit workflow (line 26).
  - Existing `<NNN>` references on lines 50, 54, 62 remain intact.
- No existing task directories were renamed.
- No files outside `workflow/agents/` were modified.
