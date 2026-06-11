# Task Spec: Standardize Task Directory Numbering Across Agent Definitions

## Scope

The README and task-planner agent spec both require task directories to use the `<NNN>-<task-id>` format (e.g., `001-model-config-agent`). However, five other agent definition files under `workflow/agents/` still reference the old `<task-id>`-only format. The orchestrator directs the task-planner to work at `.ai/tasks/<task-id>/`, causing conflicting signals and causing the task-planner to skip the numeric prefix.

Update all agent definition files under `workflow/agents/` that reference `.ai/tasks/<task-id>/` to consistently use `.ai/tasks/<NNN>-<task-id>/`. Also strengthen the task-planner's numbering instruction so it is unmistakably prominent.

### Specific changes

1. **`workflow/agents/orchestrator.md` line 30**: change `<task-id>` to `<NNN>-<task-id>`
2. **`workflow/agents/implementer.md` lines 18 and 27**: change `<task-id>` to `<NNN>-<task-id>`
3. **`workflow/agents/validator.md` lines 15 and 25**: change `<task-id>` to `<NNN>-<task-id>`
4. **`workflow/agents/documentation.md` line 32**: change `<task-id>` to `<NNN>-<task-id>`
5. **`workflow/agents/shipper.md` line 53**: change `<task-id>` to `<NNN>-<task-id>`
6. **`workflow/agents/task-planner.md`**:
   - Move the numbering requirement to the first bullet in the Single-unit workflow (currently buried as a trailing sentence on line 27).
   - Add a standalone numbering rule immediately after "You are the Task Planner Agent." (line 13), before "Own task specification and decomposition...", so the LLM cannot miss it. The rule should state: every task directory must use the `<NNN>-<task-id>` format with the next available zero-padded number.

## Non-Goals

- Do NOT rename any existing task directories under `.ai/tasks/`.
- Do NOT modify `README.md`.
- Do NOT modify any files outside `workflow/agents/`.
- Do NOT change any permission blocks or YAML frontmatter.
- Do NOT change any other content in these files — only the `<task-id>` references and the task-planner strengthening described above.

## Testable Acceptance Criteria

None — these are markdown agent definition files.

## Inspectable Acceptance Criteria

1. **`orchestrator.md`**: line 30 reads `.ai/tasks/<NNN>-<task-id>/task-spec.md` (not `<task-id>`).
2. **`implementer.md`**: line 18 reads `.ai/tasks/<NNN>-<task-id>/task-spec.md` and line 27 reads `.ai/tasks/<NNN>-<task-id>/implementation-report.md`.
3. **`validator.md`**: line 15 reads `.ai/tasks/<NNN>-<task-id>/task-spec.md` and line 25 reads `.ai/tasks/<NNN>-<task-id>/validation-report.md`.
4. **`documentation.md`**: line 32 reads `.ai/tasks/<NNN>-<task-id>/documentation-report.md`.
5. **`shipper.md`**: line 53 reads `.ai/tasks/<NNN>-<task-id>/`.
6. **`task-planner.md`**: has a prominent, standalone numbering rule early in the agent description (before "Own task specification and decomposition..."), and the numbering instruction is the first bullet in the Single-unit workflow. Existing `<NNN>` references on lines 27, 48, 52, 60 remain intact.
7. **No other files changed**: `git diff --name-only` shows only the 6 files above.

## Validation Plan

- Grep all `workflow/agents/*.md` for `<task-id>/` (without `<NNN>` prefix) — should find zero matches.
- Grep all `workflow/agents/*.md` for `<NNN>-<task-id>` — should find matches in all 6 files.
- Verify `task-planner.md` has a prominent early numbering instruction as the first bullet in the single-unit workflow and as a standalone rule before "Own task specification and decomposition...".

## Relevant Files

- `workflow/agents/orchestrator.md`
- `workflow/agents/implementer.md`
- `workflow/agents/validator.md`
- `workflow/agents/documentation.md`
- `workflow/agents/shipper.md`
- `workflow/agents/task-planner.md`
