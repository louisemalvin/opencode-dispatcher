# Task Spec: 005-agent-fixes

## Scope

Fix three bugs in Dispatcher agent workflow definitions:

1. **model-config.md — JSON(C) syntax in target format block**: Replace the YAML-like colon-separated block (lines 27–33) with proper JSON(C) using `{}` and quoted keys, so that `model-config` presents a valid `opencode.jsonc` target format.

2. **shipper.md — Missing bash permissions for pre-commit inspection**: Add `allow` rules for `find *`, `echo *`, `sort *`, and `git config *` to the YAML frontmatter permission block, preventing the catch-all `"*": ask` from triggering permission prompts during the shipper's pre-commit inspection workflow.

3. **model-config.md — Exclude orchestrator from agent list**: Update the bullet on line 24 to explicitly exclude the orchestrator from the list of agents presented for model configuration.

## Non-Goals

- Do not modify any other agent files (`orchestrator`, `implementer`, `validator`, `executor`, `research`, `init`, `documentation`, `task-planner`, `test-writer`, or any other agent).
- Do not change `bin/install.js`, `package.json`, `README.md`, templates, or `.ai/context.md`.
- Do not change the permission model for any agent other than shipper.
- Do not touch `.ai/tasks/` artifacts except to create this task spec.

## Execution

The orchestrator spawns agents in the listed order, one at a time, waiting for each to complete before starting the next. The orchestrator always appends `validator` as the final agent after the pipeline completes, so `validator` is omitted here to avoid redundancy.

1. **implementer** — Apply the three fixes:
   - In `workflow/agents/model-config.md`: replace the YAML-like target format block (lines 27–33) with proper JSON(C) using `{}` and quoted keys; update line 24 to exclude the orchestrator from the agents-to-configure list.
   - In `workflow/agents/shipper.md`: insert `"find *": allow`, `"echo *": allow`, `"sort *": allow`, and `"git config*": allow` into the bash permission block after `"git push*": allow` and before `"git reset*": deny`.

## Testable Acceptance Criteria

1. **model-config.md target format is valid JSON(C), not YAML**: The fenced code block at lines 27–33 uses `{}` braces and double-quoted keys (e.g., `"agent"`, `"orchestrator"`, `"model"`, `"variant"`) in standard JSON(C) syntax.

2. **model-config.md excludes orchestrator**: Line 24 reads: `- Present the user with the list of installed Dispatcher subagents (excluding the orchestrator, whose model is chosen directly by the user) and ask which agents they want to configure.`

3. **shipper.md bash permissions include the four missing allow rules**: The YAML frontmatter permission block contains (each on its own line):
   - `"find *": allow`
   - `"echo *": allow`
   - `"sort *": allow`
   - `"git config*": allow`

4. **Existing permissions preserved**: All pre-existing permission rules in `shipper.md` remain intact — no rule is removed, reordered, or altered.

5. **`npm run check` passes**: Running `npm run check` exits with code 0.

6. **Only target files modified**: `git diff --name-only` shows only `workflow/agents/model-config.md` and `workflow/agents/shipper.md`.

### Test File Paths

- `workflow/agents/model-config.md` — visual inspection of target format block and line 24.
- `workflow/agents/shipper.md` — visual inspection of bash permission block.
- `npm run check` — automated validation gate.

## Inspectable Acceptance Criteria

- The target format code block in `model-config.md` begins with `{` and ends with `}`, with keys quoted in double quotes and values separated by colons within the JSON object structure.
- The four new `allow` rules in `shipper.md` are inserted after `"git push*": allow` (line 17) and before `"git reset*": deny` (line 18), preserving the existing ordering of deny rules.
- No other agent markdown files contain unintended changes.

## Relevant Files

- `workflow/agents/model-config.md` — target format block (lines 27–33) and orchestrator exclusion bullet (line 24).
- `workflow/agents/shipper.md` — bash permission frontmatter block (lines 7–34).

## Implementation Notes

- **shipper.md permission insertion point**: The four new `allow` rules should be inserted on new lines immediately after line 17 (`"git push*": allow`) and before line 18 (`"git reset*": deny`). This groups all `allow` rules together before the `deny` block, maintaining readability.
- **model-config.md target format**: Replace the entire 7-line YAML-like block (lines 27–33 inclusive, starting from `  ```jsonc` through the closing `  ``` `) with the proper JSON(C) version. The new block is:

  ````
    ```jsonc
    "agent": {
      "orchestrator": {
        "model": "opencode-go/deepseek-v4-pro",
        "variant": "medium"
      }
    }
    ```
  ````

- **model-config.md orchestrator exclusion**: Change only line 24 as specified. Do not modify any other bullet points, responsibility lines, or boundaries.
