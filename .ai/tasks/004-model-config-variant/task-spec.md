# Task Spec: Add Model Variant Support to Model-Config Agent

## Scope

Update `workflow/agents/model-config.md` so the model-config agent handles the `variant` field alongside `model` when configuring per-agent assignments in `opencode.jsonc` / `.opencode/opencode.jsonc`. Currently the agent writes only `agent.<name>.model`; it should also discover and write `agent.<name>.variant`.

### Specific changes to `workflow/agents/model-config.md`

1. **Change model discovery command** — replace `opencode models` with `opencode models --verbose`. The verbose output includes a `variants` field per model (a JSON object mapping variant names to their parameter objects).

2. **Add variant selection step** — after the user picks a model for an agent, the agent must:
   - Parse the model's `variants` object from the verbose output.
   - If the model has variants (non-empty object), present the available variant names to the user and ask which one to assign (or skip).
   - If the model has no variants (empty `{}`), skip the variant step silently — do not ask the user.
   - If the user chooses to skip, do not write a `variant` field for that agent.

3. **Write `agent.<name>.variant`** — when the user picks a variant, write it alongside `agent.<name>.model` in the config file, using the target format:

   ```jsonc
   agent:
     orchestrator:
       model: "opencode-go/deepseek-v4-pro"
       variant: "medium"
   ```

4. **Preserve all existing config** — the variant writing logic must follow the same preservation rules already described for the model field: keep all existing config content exactly as-is and only add/modify the `agent.<name>` blocks.

5. **Update Responsibilities list** — add the variant discovery and selection step as a new bullet between "ask which model" and "write entries."

6. **Update Boundaries** — add a note that the agent must not write variant values for models that don't support variants, and must not invent variant names.

7. **Update Default report back** — include variant assignments in the summary (e.g., "agent orchestrator: model opencode-go/deepseek-v4-pro, variant medium").

## Execution

- documentation

## Non-Goals

- Do NOT change any other agent files (`workflow/agents/orchestrator.md`, `task-planner.md`, `implementer.md`, `validator.md`, `documentation.md`, `shipper.md`, `research.md`, `init.md`, `executor.md`).
- Do NOT change the orchestrator's routing, delegation, or permission blocks.
- Do NOT change the model-config agent's permission model (YAML frontmatter remains unchanged).
- Do NOT handle variant configuration via agent markdown frontmatter (YAML) — JSONC config only.
- Do NOT handle command-level (per-invocation) variant overrides.
- Do NOT modify `README.md`, `package.json`, `bin/install.js`, or any template files.
- Do NOT add a `variant` field to the YAML frontmatter of any agent definition file.

## Testable Acceptance Criteria

None. This task modifies an agent definition markdown file; there are no executable tests.

### Test File Paths

None.

## Inspectable Acceptance Criteria

### Modified file: `workflow/agents/model-config.md`

1. **`opencode models` replaced with `opencode models --verbose`** — the Responsibilities section uses the verbose flag to expose variant data.

2. **Variant discovery step exists** — a new bullet or paragraph in Responsibilities describes:
   - Parsing the `variants` field from the verbose model output.
   - Presenting variant names to the user when variants are present.
   - Skipping the variant prompt (not asking the user) when a model has no variants.

3. **Variant selection step exists** — after variant discovery, the agent asks the user to pick a variant or skip, before writing the config.

4. **`agent.<name>.variant` write instruction exists** — the spec describes writing the variant field in the same `agent.<name>` block as model, using the target JSONC format (indented, with quotes around values).

5. **Config preservation rule covers variant** — the same preservation rules that apply to model writing also apply to variant writing: never overwrite unrelated config, only modify the relevant `agent.<name>` block.

6. **Graceful handling of no-variant models** — the spec explicitly notes that models with empty `variants: {}` require no prompt; the agent must skip the variant question for those models.

7. **YAML frontmatter unchanged** — `description`, `mode`, `hidden`, and `permission` blocks are byte-for-byte identical to the current file.

8. **Boundaries section updated** — includes a prohibition against inventing variant names (only names from `opencode models --verbose` output are allowed) and against writing variant for models that lack variants.

9. **Default report back section updated** — the summary of configured agents includes both model and variant (when assigned).

10. **No other files modified** — `git diff --name-only` shows only `workflow/agents/model-config.md`.

11. **Tone, structure, and density match existing agents** — short YAML frontmatter, concise role description, bullet-list Responsibilities and Boundaries, short Default report back. No longer or more conversational than `executor.md` or `documentation.md`.

## Relevant Files

- `workflow/agents/model-config.md` — the only file to modify.
- `workflow/agents/executor.md` — style reference for a concise hidden subagent (short frontmatter, dense responsibilities, tight boundaries).
- `workflow/agents/documentation.md` — style reference for default report back conventions.
- `.ai/tasks/001-model-config-agent/task-spec.md` — original task spec that defined the model-config agent (provides the spec for what the file currently contains).
