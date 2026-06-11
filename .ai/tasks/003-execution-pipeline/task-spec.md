# Task Spec: Add Execution Pipeline Field to Task Specs

## Scope

Add an `## Execution` section to every task spec written by the task-planner. The section defines an ordered agent pipeline that the orchestrator reads to decide which agents to spawn and in what order. The orchestrator always appends `validator` at the end automatically.

### task-planner.md changes

- Add `Execution` to the list of sections the task-planner writes in its single-unit workflow (currently "Scope, Non-Goals, Testable Acceptance Criteria …" on line 26). The new order is: **Scope, Execution, Non-Goals, Testable Acceptance Criteria …**.
- Add a new paragraph or sub-bullet under the single-unit workflow describing:
  - The `## Execution` section format: a level-2 heading followed by a bullet list of agent names in execution order.
  - Valid agent names: `test-writer`, `implementer`, `documentation`. Never include `validator` — the orchestrator appends it automatically.
  - Decision logic for choosing the pipeline:
    - Feature/fix with testable acceptance criteria → `test-writer`, then `implementer`.
    - Feature/fix with no testable criteria (purely inspectable acceptance criteria) → `implementer` only.
    - Documentation task → `documentation` only.
    - Documentation that follows a previously implemented change → `documentation` only (implementation was handled by its own spec's Execution section).
- For multi-unit decomposition: update the line that describes child spec format ("Each child task spec follows the standard spec format: Scope, Non-Goals, …") to include Execution in the section list. Each child spec gets its own `## Execution` section.

### orchestrator.md changes

- In the REVIEW/DELEGATE flow description, add guidance: after the orchestrator receives a task spec from task-planner, read the `## Execution` section.
- Spawn agents in the listed order, one at a time, waiting for each to complete before starting the next (sequential pipeline).
- After the pipeline completes, always spawn `validator` as the final agent.
- The orchestrator must read the pipeline from the spec rather than assuming any default agent sequence (e.g., never assume "after planning, spawn implementer" — if the Execution section says `documentation`, spawn documentation).
- If the `## Execution` section is missing or empty, do not spawn any agents; report the gap to the user.

## Non-Goals

- Do NOT modify any other agent files (`workflow/agents/implementer.md`, `workflow/agents/validator.md`, `workflow/agents/test-writer.md`, `workflow/agents/documentation.md`, `workflow/agents/shipper.md`, `workflow/agents/research.md`, `workflow/agents/executor.md`, `workflow/agents/init.md`, `workflow/agents/model-config.md`).
- Do NOT change the task-planner's multi-unit decomposition flow logic (unit tables, approval, parallel markings) beyond adding the Execution section to child specs.
- Do NOT change the orchestrator's permission block, YAML frontmatter, or task allow list.
- Do NOT modify `bin/install.js`, `README.md`, `package.json`, or any template files under `/ai-init/`.
- Do NOT modify any existing task specs under `.ai/tasks/` to retroactively add `## Execution` sections.
- Do NOT change the validator's own behavior — it already validates against task specs and requires no pipeline awareness.

## Testable Acceptance Criteria

None — these are markdown agent definition file changes with no executable tests.

### Test File Paths

None.

## Inspectable Acceptance Criteria

### Modified file: `workflow/agents/task-planner.md`

1. The single-unit workflow bullet (line ~26) lists sections as: `Scope, Execution, Non-Goals, Testable Acceptance Criteria (with ### Test File Paths subsection), Inspectable Acceptance Criteria, Relevant Files`.
2. A new instruction block (bullet or sub-bullet) under the single-unit workflow defines:
   - The `## Execution` format: heading followed by a bullet list of agent names.
   - Valid agent names: `test-writer`, `implementer`, `documentation`. Validator is excluded.
   - Decision logic for pipeline composition (testable feature → test-writer then implementer; inspectable-only feature → implementer; docs → documentation; follow-up docs → documentation).
3. The multi-unit child spec description line (line ~51) includes Execution in the section list: `Scope, Execution, Non-Goals, Testable Acceptance Criteria …`.
4. No other existing task-planner instructions are altered or removed (numbering rule, directory naming, context.md read, file imports, decision notes, file editing prohibition, unit table format, approval flow, `current` pointer).

### Modified file: `workflow/agents/orchestrator.md`

1. The `### DELEGATE` section (or an adjacent flow description near lines 124–144) includes guidance that:
   - After receiving a task spec from task-planner, the orchestrator reads the `## Execution` section.
   - It spawns agents in the listed order sequentially.
   - After the pipeline completes, it spawns `validator` as the final agent.
   - If the Execution section is missing or empty, it reports the gap to the user instead of guessing.
2. Any existing language that implies a hardcoded "after planning, spawn implementer" post-planner flow is replaced with instruction to read the Execution section from the spec. (If no such language exists, no removal is needed beyond the addition above.)
3. No existing ROUTE, DELEGATE, or REVIEW bullets are altered or removed beyond the Execution-pipeline additions.
4. The orchestrator's state machine (INTAKE → CLARIFY → ROUTE → DELEGATE → REVIEW → DONE) remains unchanged.
5. The permission block and YAML frontmatter are byte-for-byte identical.
6. The artifact source-of-truth rules remain unchanged.

## Constraints

- Edit only two files: `workflow/agents/task-planner.md` and `workflow/agents/orchestrator.md`.
- Preserve all YAML frontmatter, permission blocks, and existing section structure in both files.
- New content must match the existing tone, markdown style, and density of each agent definition.
- The `## Execution` section format is a simple bullet list of agent names — no JSON, no YAML, no annotative metadata.
- Validator is intentionally excluded from the Execution section because the orchestrator appends it; listing it in the spec would cause a duplicate validation run.

## Relevant Files

- `workflow/agents/task-planner.md` — the task planner agent definition to modify (add Execution section rules to single-unit workflow and multi-unit child spec format).
- `workflow/agents/orchestrator.md` — the orchestrator agent definition to modify (add Execution-driven pipeline spawning logic to the REVIEW/DELEGATE flow).
- `.ai/tasks/001-model-config-agent/task-spec.md` — format reference for a single-unit task spec (shows current section ordering: Scope, Non-Goals, Testable Acceptance Criteria, Inspectable Acceptance Criteria, Constraints, Relevant Files, Validation Plan, Open Questions).
- `.ai/tasks/002-task-directory-numbering/task-spec.md` — format reference for a multi-file agent-definition change task spec.

## Validation Plan

- Verify `workflow/agents/task-planner.md` lists `Execution` in its single-unit workflow section ordering (between Scope and Non-Goals).
- Verify `workflow/agents/task-planner.md` contains the Execution format description: `## Execution` heading, bullet list, valid agent names, decision logic.
- Verify `workflow/agents/task-planner.md` includes Execution in its multi-unit child spec section list.
- Verify `workflow/agents/orchestrator.md` contains pipeline-spawning guidance in its DELEGATE/REVIEW flow: read Execution section, spawn sequentially, append validator, handle missing section.
- Verify no other files in the repository were modified (`git diff --name-only` shows only `workflow/agents/task-planner.md` and `workflow/agents/orchestrator.md`).
- Read-test both agent definitions to confirm they read coherently as agent prompts, with no contradictions between the new Execution pipeline rules and existing single-task routing/delegation rules.
- Verify the orchestrator's permission block and YAML frontmatter are unchanged (byte-for-byte identical to current).

## Open Questions

- None. The Execution section format, decision logic, valid agent list, and orchestrator pipeline behavior are all fully specified.
