## Scope

Update `workflow/agents/model-config.md` so the model-config agent never silently applies default model assignments. The agent must present curated recommendations with available choices, prompt the user to confirm or override each group's assignment, and wait for an explicit user response before writing any configuration to disk. The current instructions (lines 32–33) say "present both groups … ask the user to pick" but do not enforce a mandatory pause for user consent, which leads the model to shortcut and write defaults without interaction.

### Specific changes to `workflow/agents/model-config.md`

1. **Add a hard "must ask first" rule** at the top of the Responsibilities section — a standalone sentence or bullet: "Never write any model or variant config until the user has explicitly confirmed each group assignment."

2. **Structure the user interaction as a recommendation-first flow**:
   - After running `opencode models --verbose`, parse the output and match available models to each group's intended tier (MED → DeepSeek Pro class, LOW → Flash/cheap class).
   - Present recommendations to the user in a clear format: for each group, show the recommended model (best match from available models), the group's agents, and list available alternatives the user could pick instead.
   - Ask the user to confirm or override each group's model choice, and wait for an explicit response before proceeding.
   - Only after both groups are confirmed, proceed to the variant selection step (already defined) and then write config.

3. **Add a Boundaries prohibition**: "Do not assume, infer, or default the user's model choices. If the user does not respond with a confirmed selection, stop and report back without writing any config."

4. **Remove any implication that selecting defaults is OK** — the existing text "intended model tier" is fine as a recommendation label, but ensure no phrase like "pick for the user" or "choose sensible defaults" exists.

5. **Preserve all existing workflow**: `opencode models --verbose`, variant selection, group definitions (MED/LOW), agent exclusion (orchestrator, task-planner), config writing format, merge-not-overwrite, report-back summary, and all YAML frontmatter.

## Execution

- implementer

## Non-Goals

- Not changing the group definitions (MED/LOW agent lists stay the same).
- Not changing the orchestrator's routing or delegation logic.
- Not changing the model-config agent's YAML frontmatter (permissions, mode, description unchanged).
- Not modifying any other agent files (`orchestrator.md`, `task-planner.md`, etc.).
- Not modifying `opencode.jsonc`, `package.json`, `README.md`, or any template files.
- Not adding automated tests (no test framework in this project).

## Testable Acceptance Criteria

<!-- No automated test framework for agent markdown files; validation is via inspectable criteria below. -->

### Test File Paths

N/A — this project uses `npm run check` (frontmatter + orchestrator cross-reference validation) as its sole validation gate. Agent markdown content is inspected, not unit-tested.

## Inspectable Acceptance Criteria

1. `workflow/agents/model-config.md` contains an explicit, prominent rule (standalone sentence or bullet early in Responsibilities) that prohibits writing any model or variant config until the user has explicitly confirmed each group assignment.

2. The Responsibilities section prescribes a recommendation-first interaction flow:
   - Run `opencode models --verbose`.
   - Match available models to each group's tier.
   - Present a recommendation per group (best-fit model) along with available alternatives.
   - Ask the user to confirm or override each group.
   - Wait for an explicit user response before proceeding.
   - Only after confirmation, continue to variant selection and config writing.

3. The Boundaries section includes a prohibition against assuming, inferring, or defaulting the user's model choices. It explicitly states: if the user does not respond with a confirmed selection, stop and report back without writing any config.

4. All existing agent capabilities are preserved:
   - Running `opencode models --verbose` to discover available models.
   - Parsing model variants from verbose output.
   - Group-based assignment (MED: `validator`, `test-writer`, `documentation`, `init`; LOW: `implementer`, `research`, `executor`, `shipper`, `model-config`).
   - Excluding orchestrator and task-planner from configuration.
   - Writing `agent.<name>.model` (and optionally `agent.<name>.variant`) entries into `opencode.jsonc` or `.opencode/opencode.jsonc`.
   - Preserving all existing config content exactly as-is (merge, not overwrite).
   - If no opencode config exists, creating one with the new agent entries.
   - Reporting back with a summary of what was configured.

5. `npm run check` passes after the change (frontmatter fields and orchestrator cross-references are intact).

6. No other files are modified — `git diff --name-only` shows only `workflow/agents/model-config.md`.

## Relevant Files

| File | Role |
|------|------|
| `workflow/agents/model-config.md` | **Primary**: the model-config agent definition to update |
| `workflow/agents/orchestrator.md` | Context: the orchestrator's delegation rules for model-config (read-only) |
| `opencode.jsonc` | Context: example of current per-agent model config written by model-config (read-only) |
