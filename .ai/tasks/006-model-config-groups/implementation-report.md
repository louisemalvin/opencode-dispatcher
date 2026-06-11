# Implementation Report: Model-Config Groups

## Outcome

Successfully updated `workflow/agents/model-config.md` to exclude orchestrator and task-planner from the model-config flow, and to group the remaining subagents into two tiers (MED and LOW) for bulk model assignment instead of per-agent fine-tuning.

## Files Changed

| File | Change |
|------|--------|
| `workflow/agents/model-config.md` | Replaced per-agent selection workflow with two-tier group-based model assignment. Updated the `Responsibilities` section to: (1) explicitly exclude orchestrator and task-planner from configurable agents, (2) define two hardcoded agent groups (MED and LOW) via a markdown table, (3) present groups to the user for one-time model/variant selection per group, (4) apply the chosen model/variant to every agent in the group when writing config. |

## Decisions

- **Exclusion rationale**: Orchestrator's model is chosen directly by the user in OpenCode itself. Task-planner inherits the orchestrator's model by design. Both are excluded from the model-config flow with explicit documented reasons.
- **Group membership preserved as specified**: MED = `validator`, `test-writer`, `documentation`, `init`. LOW = `implementer`, `research`, `executor`, `shipper`, `model-config`. These match the spec exactly.
- **Report back format unchanged**: The existing "list of agents configured" format remains correct since the agent will enumerate each agent written within each group.
- **No changes to model/variant parsing logic**: The variant detection and prompting logic is preserved, just applied per group instead of per agent.
- **No changes to config writing logic**: The merge-preserving write behavior remains the same, now applied across all agents in each group.
- **`opencode.jsonc` not modified**: As specified in Non-Goals, the project config is left as-is.
- **`npm run check` passes**: Frontmatter fields and orchestrator cross-references are intact.

## Verification

- Ran `npm run check` — passed. Output: `Workflow package check passed. Agents: documentation, executor, implementer, init, model-config, orchestrator, research, shipper, task-planner, test-writer, validator.`
- No test suite exists for agent markdown files; acceptance criteria are inspectable (see below).

### Acceptance Criteria Verification

1. ✅ Orchestrator and task-planner are explicitly excluded with documented reasons (line 24).
2. ✅ Two named groups defined: MED (validator, test-writer, documentation, init) and LOW (implementer, research, executor, shipper, model-config) — lines 27-30.
3. ✅ Groups presented with intended model tiers; user selects model/variant once per group (line 32-33).
4. ✅ Existing responsibilities preserved: `opencode models --verbose` (line 22), variant parsing (line 33), merge-preserving config write (line 34), config creation (line 43), reporting (line 44).
5. ✅ `npm run check` passes.

## Known Issues

None.
