## Scope

Update the model-config agent workflow (`workflow/agents/model-config.md`) so that, by default:

1. **Exclude orchestrator and task-planner** from the list of agents presented for model assignment. The orchestrator's model is chosen directly by the user in OpenCode itself. The task-planner is intended to use the same model as the orchestrator (outside the model-config flow) and should not be configurable via model-config.

2. **Group remaining subagents into two practical tiers** and present them to the user for bulk assignment instead of one-by-one fine-tuning:

   | Group | Agents                                                     | Intended model class |
   |-------|------------------------------------------------------------|-----------------------|
   | MED   | `validator`, `test-writer`, `documentation`, `init`        | DeepSeek Pro class    |
   | LOW   | `implementer`, `research`, `executor`, `shipper`, `model-config` | Flash / cheap class   |

3. **Simplified user interaction**: present the two groups with their intended model tiers, let the user pick a model (and variant, if applicable) for each group once, then write those assignments into `opencode.jsonc` / `.opencode/opencode.jsonc` for every agent in that group.

## Execution

- implementer

## Non-Goals

- Not changing the orchestrator or task-planner agent definitions themselves.
- Not modifying `opencode.jsonc` — the model-config agent will apply the new grouping logic the next time it runs; existing project config is left as-is.
- Not changing the model-config agent's own permissions block.
- Not introducing new agent files or renaming agents.
- Not changing how `opencode models --verbose` output is parsed or how variants are presented — the group-level assignment reuses the existing model/variant selection logic, just applied once per group instead of once per agent.

## Testable Acceptance Criteria

<!-- No automated test framework for agent markdown files; validation is via inspectable criteria below. -->

### Test File Paths

N/A — this project uses `npm run check` (frontmatter + orchestrator cross-reference validation) as its sole validation gate. Agent markdown content is inspected, not unit-tested.

## Inspectable Acceptance Criteria

1. `workflow/agents/model-config.md` no longer presents orchestrator or task-planner as configurable agents. The exclusion list must be explicit: orchestrator (user-selected) and task-planner (inherits orchestrator's model).

2. The agent instructions define two named, hardcoded groups:
   - **MED**: `validator`, `test-writer`, `documentation`, `init`
   - **LOW**: `implementer`, `research`, `executor`, `shipper`, `model-config`

3. The workflow presents both groups to the user with their intended model tiers and asks the user to select a model (and variant) for each group exactly once — not per-agent.

4. The existing responsibilities are preserved:
   - Running `opencode models --verbose` to discover available models.
   - Parsing model variants from verbose output.
   - Writing `agent.<name>.model` (and optionally `agent.<name>.variant`) entries into `opencode.jsonc` or `.opencode/opencode.jsonc`.
   - Preserving all existing config content exactly as-is (merge, not overwrite).
   - If no opencode config exists, creating one with the new agent entries.
   - Reporting back with a summary of what was configured.

5. `npm run check` passes after the change (frontmatter fields and orchestrator cross-references are intact).

## Relevant Files

| File | Role |
|------|------|
| `workflow/agents/model-config.md` | **Primary**: the model-config agent definition to update |
| `opencode.jsonc` | Context: example of current per-agent model config written by model-config (read-only reference; not modified by this task) |
