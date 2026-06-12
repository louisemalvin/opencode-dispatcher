## Source Artifacts / Handoff Context

- **Originating handoff**: `.ai/tasks/019-timestamp-task-numbers/planning-handoff.md` (canonical source of scope, constraints, and acceptance signals)
- **Orchestrator agent**: `workflow/agents/orchestrator.md` — references `<NNN>-<task-id>` at lines 65, 157; determines numbering at line 159; bash allowlist at lines 13–40
- **Task-planner agent**: `workflow/agents/task-planner.md` — references `<NNN>` at line 17, 74; contains Single-Unit Workflow (no assigned path) at lines 59–68 and Self-Directed Decomposition at lines 80–115
- **Decision artifact**: `.ai/decisions/2026-06-12-file-based-agent-handoffs.md` — line 27 references `<NNN>-<task-id>`
- **Project conventions**: `.ai/context.md` — validation gate is `npm run check` (frontmatter integrity, agent cross-references); no other test framework
- **Open question resolved**: Remove the self-directed numbering fallback from task-planner entirely — it should always require an orchestrator-assigned path. If no path is assigned, report planning-blocked.

## Scope

Replace the collision-prone sequential `<NNN>` task-numbering scheme with a timestamp-based scheme (`<timestamp>-<task-id>`) using epoch seconds from `date +%s`. The orchestrator always assigns the output path; task-planner no longer computes its own numbering or performs self-directed decomposition.

Three files require coordinated changes:

1. **`workflow/agents/orchestrator.md`**:
   - Add `"date": allow` and `"date *": allow` to the bash allowlist
   - Change the numbering instruction from listing `.ai/tasks/` to running `date +%s`
   - Update all `<NNN>-<task-id>` path references to `<timestamp>-<task-id>`

2. **`workflow/agents/task-planner.md`**:
   - Update `<NNN>` references to `<timestamp>` (lines 17, 74)
   - Remove the Single-Unit Workflow (no assigned path) section (lines 59–68)
   - Remove the Self-Directed Decomposition (fallback) section (lines 80–115)
   - Replace the Planning Flow fallback bullet with: if no assigned unit is provided, STOP and report planning-blocked
   - Simplify the Default Report Back section to remove multi-unit parentheticals (no longer applicable)

3. **`.ai/decisions/2026-06-12-file-based-agent-handoffs.md`**:
   - Line 27: update `<NNN>-<task-id>` to `<timestamp>-<task-id>`

## Execution

- implementer

## Non-Goals

- Renaming any existing task directories (e.g., `008-`, `009-`, `014-`, `019-` stay as-is)
- Adding wrapper scripts, CLI tools, or external dependencies
- Updating other agent files (implementer, validator, shipper, etc.) — they do not compute task numbers
- Writing a migration guide or updating `docs/`
- Adding task-planner bash permissions (the self-directed fallback is removed, so `date` is not needed by task-planner)
- Changing agent behaviour beyond numbering mechanics
- Adding new sections to `.ai/context.md`

## Testable Acceptance Criteria

1. **Orchestrator bash allowlist**: `npm run check` passes; the allowlist includes `"date": allow` and `"date *": allow`
2. **Orchestrator numbering instruction**: The orchestrator prompt no longer instructs listing `.ai/tasks/` directories to find the next number; it instructs running `date +%s`
3. **Orchestrator path references**: All `<NNN>-<task-id>` occurrences in `orchestrator.md` are replaced with `<timestamp>-<task-id>`
4. **Task-planner no self-numbering**: The task-planner prompt contains no instruction to list `.ai/tasks/` and no `<NNN>` zero-padded numbering formula
5. **Task-planner path references**: All `<NNN>` / `<NNN>-<task-id>` references in `task-planner.md` are updated to `<timestamp>` / `<timestamp>-<task-id>`
6. **Task-planner no self-decomposition**: The task-planner prompt no longer contains a Self-Directed Decomposition section or a Single-Unit Workflow (no assigned path) section
7. **Task-planner planning-blocked fallback**: The Planning Flow section states that if no assigned output path is provided, STOP with a planning-blocked report
8. **Decision artifact updated**: Line 27 of `.ai/decisions/2026-06-12-file-based-agent-handoffs.md` reads `<timestamp>-<task-id>`
9. **No unintended file changes**: Only the three files listed in Scope are modified
10. **Validation gate**: `npm run check` passes after all edits

### Test File Paths

- `workflow/agents/orchestrator.md`
- `workflow/agents/task-planner.md`
- `.ai/decisions/2026-06-12-file-based-agent-handoffs.md`

## Inspectable Acceptance Criteria

1. The orchestrator bash allowlist allows `date` (exact match) and `date *` (wildcard), positioned before the catch-all `"*": deny`
2. The orchestrator's line ~159 reads "Determine the task number by running `date +%s`" (or equivalent text to that effect) instead of instructing a directory listing
3. The task-planner prompt is substantially shorter: Self-Directed Decomposition and Single-Unit Workflow (no assigned path) sections are absent
4. The task-planner's Planning Flow section has exactly one bullet under the intro sentence: the orchestrator-assigned unit case, followed by a statement that missing assignment triggers planning-blocked
5. The task-planner's Default Report Back section no longer contains parenthetical references to multi-unit work or parent manifest paths
6. The decision artifact change is a single-word substitution on line 27

## Relevant Files

- `workflow/agents/orchestrator.md` — primary change target (allowlist + numbering + references)
- `workflow/agents/task-planner.md` — secondary change target (reference update + section removals + fallback logic)
- `.ai/decisions/2026-06-12-file-based-agent-handoffs.md` — tertiary change target (line 27 reference update)
- `.ai/context.md` — read for conventions; not modified
- `package.json` — contains `npm run check` script; not modified

## Validation Plan

1. Run `npm run check` — must exit 0 (frontmatter integrity, orchestrator cross-references)
2. Grep `workflow/agents/orchestrator.md` for `<NNN-` — must return zero hits
3. Grep `workflow/agents/orchestrator.md` for `timestamp` — must return hits on lines ~65, ~157, ~159
4. Grep `workflow/agents/orchestrator.md` for `"date"` or `date ` in the bash allowlist block — must find both allow entries
5. Grep `workflow/agents/task-planner.md` for `<NNN` — must return zero hits
6. Grep `workflow/agents/task-planner.md` for `Self-Directed Decomposition` and `Single-Unit Workflow` — must return zero hits
7. Grep `workflow/agents/task-planner.md` for `planning-blocked` — must appear in the Planning Flow section describing the no-assigned-path case
8. Grep `.ai/decisions/2026-06-12-file-based-agent-handoffs.md` for `<NNN-` — must return zero hits (line 27 should now say `<timestamp>`)
9. `git diff --stat` — only the three target files should show changes

## Open Questions

None — the one open question (task-planner bash permissions vs. removing the fallback) was resolved by the user in the planning handoff: remove the self-directed fallback entirely; task-planner always requires an orchestrator-assigned path.
