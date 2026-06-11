# Validation Report: 006-model-config-groups

## Result

**PASS** — All inspectable acceptance criteria are satisfied. No blocking or non-blocking issues found.

## Checks Performed

### 1. File Inspected

| File | Status |
|------|--------|
| `workflow/agents/model-config.md` | Modified (only changed file) |
| `opencode.jsonc` | Unmodified (as required by non-goals) |

### 2. Git Diff Review

Only `workflow/agents/model-config.md` was modified. The diff shows:
- Orchestrator + task-planner exclusion replaced the old open-ended agent list prompt.
- Two hardcoded groups (MED, LOW) added as a markdown table.
- Variant-parsing and config-writing responsibilities preserved, now applied per group instead of per agent.

No changes to any other agent file, frontmatter, permissions, or `opencode.jsonc`.

### 3. `npm run check` — Passed

```
$ npm run check
> opencode-dispatcher@0.2.11 check
> node ./bin/install.js check

Workflow package check passed. Agents: documentation, executor, implementer, init,
model-config, orchestrator, research, shipper, task-planner, test-writer, validator.
```

The check validates:
- All agent files have YAML frontmatter with `description` and valid `mode` fields.
- All agents permitted by the orchestrator have a corresponding markdown file and vice-versa.
- No extraneous files in `workflow/skills/` or `workflow/templates/`.

### 4. Frontmatter Verification

The model-config agent frontmatter is intact and unchanged:
- `description` — present
- `mode: subagent` — valid
- `hidden: true` — preserved
- `permission` block — unchanged (non-goal #3)

## Acceptance Criteria Review

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Orchestrator and task-planner are excluded from configurable agents | ✅ **Pass** | Line 24: "Determine the set of configurable subagents by excluding **orchestrator** ... and **task-planner** ... from the full list of installed Dispatcher subagents." Both exclusions carry documented reasons. |
| 2 | Two named groups defined (MED + LOW) with exact agent membership | ✅ **Pass** | Lines 26-30: Markdown table defines MED = `validator`, `test-writer`, `documentation`, `init` and LOW = `implementer`, `research`, `executor`, `shipper`, `model-config`. |
| 3 | Groups presented once per group, not per agent, with intended model tiers | ✅ **Pass** | Line 32: "Present both groups to the user with their intended model tiers. Ask the user to pick a model (and optionally a variant) for each group **once** — not per-agent." |
| 4a | Runs `opencode models --verbose` | ✅ **Pass** | Line 22: "Run `opencode models --verbose` to list available models and their variants on the system." |
| 4b | Parses model variants from verbose output | ✅ **Pass** | Line 33: variant parsing logic fully preserved ("If the model has variants (non-empty object), present..."). |
| 4c | Writes `agent.<name>.model` + `agent.<name>.variant` entries | ✅ **Pass** | Lines 34-42: Target format shows `agent.<name>.model` and `agent.<name>.variant` structure. |
| 4d | Merges into existing config (preserve, not overwrite) | ✅ **Pass** | Line 34: "preserving all existing config content exactly as-is." |
| 4e | Creates config if none exists | ✅ **Pass** | Line 43: "If no opencode config exists, create one with only the agent entries." |
| 4f | Reports back with summary | ✅ **Pass** | Line 44 and "Default report back" section: summary of configured agents and models. |
| 5 | `npm run check` passes | ✅ **Pass** | Verified above. |

## Non-Goals Verification

| Non-Goal | Status | Evidence |
|----------|--------|----------|
| Not changing orchestrator or task-planner agent definitions | ✅ **Pass** | Only `model-config.md` was modified. |
| Not modifying `opencode.jsonc` | ✅ **Pass** | `git diff` shows no changes to `opencode.jsonc`. |
| Not changing model-config's permissions block | ✅ **Pass** | Frontmatter `permission` block is identical to original. |
| Not introducing new agent files or renaming agents | ✅ **Pass** | No new files in `workflow/agents/`; all 10 agent files present and unchanged. |
| Not changing model/variant parsing or presentation logic | ✅ **Pass** | Variant prompting logic preserved verbatim, scoped to per-group instead of per-agent. |

## Issues Found

**None.** All criteria are met. No blocking, non-blocking, or baseline issues were identified.

## Residual Risks

None. The change is limited to the agent markdown workflow file. The validation gate (`npm run check`) passes, and every inspectable acceptance criterion is satisfied. The implementation does not touch any executable code, config file, or other agent definition.

## Verification Run and Limitations

- **Verification**: Manual inspection of the only changed file (`workflow/agents/model-config.md`), git diff review, and execution of `npm run check`.
- **Limitation**: There is no automated test suite for agent markdown workflow files (as noted in the task spec). Validation relies on inspection and the `npm run check` gate.
