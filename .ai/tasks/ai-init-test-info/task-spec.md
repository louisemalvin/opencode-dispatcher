# Task Spec

## Scope

- Extend the `/ai-init` process (driven by the `task-artifact-workflow` skill and executed by the `documentation` agent) to capture test-specific project information and record it in `.ai/context.md`.
- The `/ai-init` process must ask the user for and record:
  - **Test framework** (e.g., pytest, jest, vitest, go test, etc.)
  - **Test runner command** (e.g., `npm test`, `pytest`, `cargo test`, etc.)
  - **Test file location convention** (e.g., `tests/`, `__tests__/`, alongside source, etc.)
- The `.ai/context.md` must include a new `## Test Setup` section with the captured information after `/ai-init` runs.

## Non-Goals

- Do not create a new agent or skill.
- Do not modify agent permission models.
- Do not modify `bin/install.js`, `README.md`, or global templates.

## Acceptance Criteria

- The `/ai-init` process captures test framework, test runner command, and test file location convention from the user.
- `.ai/context.md` includes a `## Test Setup` section after `/ai-init` completes, formatted like:
  ```markdown
  ## Test Setup
  - Framework: <value>
  - Runner: `<value>`
  - Test file convention: `<value>`
  ```
- The `task-artifact-workflow` skill instructions (under the "Initialize a project" section) include the test setup capture as part of `/ai-init`.
- The `documentation` agent's `/ai-init` responsibility explicitly covers writing the `## Test Setup` section into `.ai/context.md`.

## Constraints

- Files to modify: `workflow/skills/task-artifact-workflow/SKILL.md` and `workflow/agents/documentation.md`.
- Keep changes minimal — only add test setup capture to the existing `/ai-init` flow.
- Preserve existing `/ai-init` behavior (creating missing files, preserving existing content).
- Do not invent default test values for the user's project.

## Relevant Files

- `workflow/skills/task-artifact-workflow/SKILL.md` — defines the `/ai-init` process (lines 21–34)
- `workflow/agents/documentation.md` — handles `/ai-init` delegation (line 29)
- `workflow/agents/orchestrator.md` — references `/ai-init` (line 28); no change needed here
- `.ai/context.md` — target file for the new `## Test Setup` section

## Validation Plan

- After implementation, run `/ai-init` in a test project and verify that:
  1. The orchestrator or documentation agent prompts for test framework, runner command, and file conventions.
  2. `.ai/context.md` is created (or updated) with a `## Test Setup` section containing the user's answers.
  3. The skill file and documentation agent file both reference the test setup capture.
- Verify existing `/ai-init` behavior is preserved (other `.ai/` files are created/left intact).

## Open Questions

- None — scope is well-defined from user request.
