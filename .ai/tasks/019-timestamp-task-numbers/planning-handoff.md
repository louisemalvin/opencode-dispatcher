# Planning Handoff: Timestamp Task Numbers

## User Intent

Replace the collision-prone sequential `<NNN>` task numbering scheme with a timestamp-based scheme that is safe when multiple orchestrator/task-planner agents work concurrently on the same project.

The user explicitly wants:
- Timestamp-based task numbers (epoch seconds via `date +%s`)
- No multi-unit splitting by task-planner — orchestrator owns decomposition, task-planner stays simple and single-unit
- Keep the change focused and low-risk

## Conversation-Derived Context

- The problem: both orchestrator and task-planner instructions say "list `.ai/tasks/`, find highest NNN, increment." When 3 agents do this concurrently on the same project, they all read the same state and pick the same number.
- Evidence of the problem already exists in the project: `009-` and `014-` both have duplicate directories with different task-ids.
- The user rejected alternative solutions (mkdir-based atomic claim, date-hour-minute, hash) and chose epoch seconds for simplicity.
- The user wants no extra script — just use the built-in `date +%s` command.
- The orchestrator should always assign the output path; task-planner's self-directed path computation is a fallback, not the primary path.

## Source Artifacts / Source Context

- `workflow/agents/orchestrator.md` — lines 59, 65, 157 reference `<NNN>-<task-id>`. Line 159 says "Determine the task number by listing/reading `.ai/tasks/` before writing." Bash allowlist (lines 13-40) needs `date` added.
- `workflow/agents/task-planner.md` — lines 61-62 describe the `<NNN>` computation via listing directories. Line 17 says "Do NOT compute the next `<NNN>` yourself" when an assigned path exists; lines 59-62 handle the self-directed fallback.
- `.ai/decisions/2026-06-12-file-based-agent-handoffs.md` — references `<NNN>-<task-id>` at line 27; should be updated to the new convention.
- `.ai/context.md` — does not currently document the numbering convention; not in scope to add it here.

## Proposed Task Shape

Single-unit. Two agent files need coordinated changes plus one decision artifact:

1. **Orchestrator agent** (`workflow/agents/orchestrator.md`):
   - Add `date` and `date *` to the bash allowlist
   - Change the numbering instruction from "list directory, find highest, increment" to "run `date +%s`"
   - Update all path references from `<NNN>-<task-id>` to `<timestamp>-<task-id>`

2. **Task-planner agent** (`workflow/agents/task-planner.md`):
   - Update the Single-Unit Workflow fallback numbering instruction to use `date +%s`
   - Update path references to `<timestamp>-<task-id>`
   - If task-planner needs `date` in bash permissions, add it (check current permissions — task-planner currently has no bash block at all; decide whether it needs one or whether the fallback should be removed entirely in favor of always requiring an assigned path)
   - Reinforce that orchestrator owns decomposition; task-planner should not self-decompose into multi-unit

3. **Decision artifact** (`.ai/decisions/2026-06-12-file-based-agent-handoffs.md`):
   - Line 27 references `<NNN>-<task-id>` — update to `<timestamp>-<task-id>`

## Assigned Output Path(s)

`.ai/tasks/019-timestamp-task-numbers/task-spec.md`

## Scope and Non-Goals

**In scope:**
- Change the numbering instruction in orchestrator and task-planner agent prompts
- Add `date` to orchestrator's bash allowlist (and task-planner's if needed)
- Update `<NNN>-<task-id>` references to `<timestamp>-<task-id>` in both agent files
- Update the decision artifact's path reference
- Verify with `npm run check` that agent frontmatter still validates

**Out of scope:**
- Changing directory layout or task artifact format beyond the prefix
- Adding a wrapper script, CLI tool, or external dependency
- Renaming existing task directories (they stay as-is)
- Updating other agent files (implementer, validator, etc.) — they don't compute task numbers
- Writing a migration guide or updating `docs/` for the old-vs-new convention

## Constraints

- `npm run check` must continue to pass
- No new external dependencies
- The `date` command must work with the exact invocation `date +%s`
- Task-planner's assigned-unit path (when orchestrator provides a path) must remain unchanged — it already says "use it exactly"
- Keep task-planner simple: the orchestrator owns decomposition; task-planner should not invent multi-unit splits

## Acceptance Signals

1. Orchestrator agent prompt no longer instructs listing `.ai/tasks/` to find the next number; instead instructs running `date +%s`
2. Orchestrator bash allowlist includes `date` and `date *`
3. Task-planner agent prompt's self-directed numbering fallback uses `date +%s` (or is removed in favor of always requiring an assigned path)
4. All `<NNN>-<task-id>` path references in orchestrator.md and task-planner.md are updated to `<timestamp>-<task-id>`
5. Decision artifact line 27 updated
6. `npm run check` passes
7. No new files created outside `workflow/agents/`, `.ai/decisions/`, and this task's artifact directory

## Authority Boundary

- The implementer may choose exact wording for prompt changes
- The implementer may decide whether task-planner needs its own `date` permission or whether to remove the self-directed fallback entirely
- The implementer must not change agent behavior beyond numbering mechanics
- The implementer must not rename existing task directories
- The implementer must not add new agent capabilities or permission scopes beyond the `date` addition

## Open Questions / Stop Conditions

- **Task-planner bash permissions**: Task-planner currently has no bash block. Should it get one (with just `date`), or should its self-directed numbering fallback be removed entirely so it always requires an orchestrator-assigned path? The user's preference is for orchestrator to always own path assignment. **Decision: remove the self-directed numbering fallback from task-planner; it always uses the assigned path from orchestrator. If no path is assigned, task-planner reports planning-blocked.** (Approved by user: "i feel like orchestrator should do the split task, so i dont want task planner to complicate itself")
- None remaining after the above decision.
