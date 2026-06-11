# Task Spec: Add model-config Subagent

## Scope

- Create `workflow/agents/model-config.md` — a new hidden subagent that configures per-agent model assignments in a project's opencode config file (`opencode.jsonc` or `.opencode/opencode.jsonc`).
- Modify `workflow/agents/orchestrator.md` — add `model-config: allow` to the task permission block, and add routing/delegation entries so the orchestrator knows when and how to delegate to this agent.

## Non-Goals

- Do NOT modify any other agent files (`implementer.md`, `task-planner.md`, `validator.md`, `shipper.md`, `research.md`, `init.md`, `executor.md`, `documentation.md`, `test-writer.md`).
- Do NOT modify `bin/install.js`, `README.md`, `package.json`, or any template files.
- Do NOT change the orchestrator's existing ROUTE or DELEGATE bullets — only add new ones.
- Do NOT write any implementation code, config files, or test files.
- Do NOT create an `.ai/context.md` for this project.

## Testable Acceptance Criteria

None. This task creates an agent definition file and modifies another agent definition file; there are no executable tests.

### Test File Paths

None.

## Inspectable Acceptance Criteria

### New file: `workflow/agents/model-config.md`

- File exists with valid YAML frontmatter (`---` fences) containing:
  - `description`: a concise one-liner describing the agent's purpose (e.g., "Configures per-agent model assignments in project opencode config").
  - `mode: subagent`
  - `hidden: true`
  - `permission` block with exactly:
    - `bash`: `"*": allow`
    - `edit`: `"*": deny` plus `"opencode.jsonc": allow` and `".opencode/opencode.jsonc": allow`
    - `task`: `"*": deny`
- Role description paragraph explains the agent's purpose: configuring per-agent model overrides under `agent.<name>.model` in project opencode config.
- A workflow or responsibilities section covers:
  - Running `opencode models` (or equivalent) to list available models on the system.
  - Reading the current project's opencode config from either `opencode.jsonc` or `.opencode/opencode.jsonc` (checking both locations).
  - Presenting the user with a list of installed Dispatcher agents and asking which agents to configure.
  - Asking which model to assign to each selected agent (from the available models list).
  - Writing `agent.<name>.model` entries into the project's opencode config, preserving all existing config content.
  - If no opencode config exists, creating one.
  - Reporting back to the orchestrator with a summary of what was configured.
- A boundaries section explicitly prohibits:
  - Editing any files other than the project's opencode config.
  - Delegating to other agents (no `task` permission).
  - Modifying code, tests, docs, `.ai/` artifacts, or other agent definitions.
- A default report back section describes what the agent returns to the orchestrator: config file edited, agents configured, models assigned, any issues encountered.
- Tone, structure, and density match existing agent definitions (e.g., `workflow/agents/executor.md`, `workflow/agents/init.md`): short YAML frontmatter, role description paragraph, workflow/responsibilities section, boundaries section, default report back section.

### Modified file: `workflow/agents/orchestrator.md`

- The `permission.task` block in the YAML frontmatter includes `model-config: allow` (added as a new line alongside the existing allow entries, preserving alphabetical or logical ordering).
- The `### ROUTE` section (or equivalent routing guidance) includes a bullet like:
  ```
  - Use model-config when the user wants to configure per-agent models for this project.
  ```
- The `### DELEGATE` section includes a bullet like:
  ```
  - model-config: per-agent model assignment in opencode config
  ```
- No existing ROUTE or DELEGATE bullets are altered or removed.
- No other section of the orchestrator file is changed.

## Constraints

- Create only the two files: `workflow/agents/model-config.md` and the modifications to `workflow/agents/orchestrator.md`.
- The `model-config.md` file must follow the same two-part markdown format as existing agents: YAML frontmatter block followed by a role description and sections.
- The orchestrator modifications must preserve all existing content exactly; only add the three new entries described above.
- The `opencode models` command in the agent workflow refers to the OpenCode CLI command for listing available models.

## Relevant Files

- `workflow/agents/model-config.md` — the new agent definition to create.
- `workflow/agents/orchestrator.md` — the orchestrator to modify (task permission block, ROUTE section, DELEGATE section).
- `workflow/agents/executor.md` — style reference for hidden subagent definition (short, permission-restricted, focused role).
- `workflow/agents/init.md` — style reference for a subagent that has restricted file-scoped edit permissions.
- `workflow/agents/task-planner.md` — style reference for subagent with question permission and `edit: deny` for non-`.ai/` files.

## Validation Plan

- Verify `workflow/agents/model-config.md` exists.
- Verify the file begins with valid YAML frontmatter containing: `description`, `mode: subagent`, `hidden: true`, and a `permission` block with `bash`, `edit`, and `task` keys.
- Verify `permission.bash` is `"*": allow`.
- Verify `permission.edit` denies `"*"` and allows `"opencode.jsonc"` and `".opencode/opencode.jsonc"`.
- Verify `permission.task` denies `"*"`.
- Verify the role description paragraph conveys the agent's purpose.
- Verify a workflow or responsibilities section covers: running `opencode models`, reading project config, asking user for agent/model selection, writing `agent.<name>.model` entries, preserving existing config, creating config if missing, reporting results.
- Verify a boundaries section explicitly prohibits file edits beyond opencode config and prohibits delegating to other agents.
- Verify a default report back section describes the return format.
- Verify `workflow/agents/orchestrator.md` has `model-config: allow` in its `permission.task` block.
- Verify `workflow/agents/orchestrator.md` ROUTE section contains a model-config routing line.
- Verify `workflow/agents/orchestrator.md` DELEGATE section contains a model-config delegation line.
- Verify no other files were created or modified (`git diff --name-only` shows only `workflow/agents/model-config.md` and `workflow/agents/orchestrator.md`).

## Open Questions

- None. The agent purpose, permission model, workflow steps, and orchestrator integration points are all fully specified in the design brief.
