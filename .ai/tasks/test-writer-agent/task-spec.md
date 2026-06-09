# Task Spec: Add Test Writer Agent

## Scope

- Create `workflow/agents/test-writer.md` — a new specialist subagent that encodes acceptance criteria as executable tests **before** any implementation code is written.
- Define the agent's YAML frontmatter with a permission model that allows edits only to test files and test directories, while explicitly denying `.ai/tasks/*/implementation-report.md`.
- Write a role description that clearly states the agent never writes implementation code, only test files.
- Specify responsibilities: read `.ai/context.md` and task spec, write tests that encode each testable acceptance criterion, run the test suite to confirm parse/compile, report coverage and ambiguities.
- Specify boundaries: no source file edits, no feature implementation, no fixing existing tests or source code, no editing other agents' report files.

## Non-Goals

- Do NOT modify any existing agent files (`workflow/agents/orchestrator.md`, `workflow/agents/task-planner.md`, `workflow/agents/implementer.md`, `workflow/agents/validator.md`, `workflow/agents/shipper.md`, `workflow/agents/research.md`, `workflow/agents/documentation.md`).
- Do NOT add test-writer to any other agent's permission block or `task:` allow list.
- Do NOT modify `bin/install.js`, `README.md`, `.ai/context.md`, or any template files.
- Do NOT create any additional files beyond `workflow/agents/test-writer.md`.

## Acceptance Criteria

- `workflow/agents/test-writer.md` exists with valid YAML frontmatter containing `description`, `mode: subagent`, `hidden: true`, and the exact `permission` block:
  - `edit` rules allow `"**/*.test.*"`, `"**/test_*"`, `"**/*_test.*"`, `"**/__tests__/**"`, `"**/tests/**"`, `"**/spec/**"`, deny `"*"`, and deny `".ai/tasks/*/implementation-report.md"`.
  - `bash` rule allows `"*"`.
  - `task` rule denies `"*"`.
- Role description explicitly states the agent never writes implementation code and only writes test files.
- Responsibilities section covers:
  - Reading `.ai/context.md` to learn the project's test framework, runner, and conventions.
  - Reading the approved task spec, focusing on testable acceptance criteria.
  - Writing test files that encode each testable criterion as one or more test cases.
  - Naming test functions descriptively so failures clearly reference the criterion.
  - Running the test suite to confirm tests parse/compile (expected to fail — no implementation yet).
  - Reporting which tests were written, which criteria they cover, and confirming they parse.
  - Never writing implementation code, never touching source files, never editing other agents' reports.
- Boundaries section explicitly prohibits: source file edits, config edits, doc edits, feature implementation, fixing existing tests or source code, and editing other agents' report files.
- Boundaries section states: if the spec lacks enough detail to write tests, report the ambiguity to the orchestrator instead of guessing.
- Output format section describes the expected return to orchestrator: tests written (file paths + function names), criteria coverage mapping, parse/compile confirmation, and any ambiguities found.
- Tone, structure, and density match existing agent definitions (`workflow/agents/validator.md`, `workflow/agents/implementer.md`): short YAML frontmatter, role description paragraph, Responsibilities section, Boundaries section, Default report back section.

## Constraints

- Create only `workflow/agents/test-writer.md`.
- Follow the same markdown format as existing agent definitions: YAML frontmatter, level-2 headings (`##`), concise bullet-point responsibilities and boundaries under each section.
- The `bash: "*": allow` permission is intentional — the test writer must be able to run the test framework to verify tests parse/compile.
- Ensure the `edit` deny rule `"*": deny` combined with the permissive test-file rules uses correct OpenCode permission precedence (denial applies except where overwritten by more specific allows).

## Relevant Files

- `workflow/agents/test-writer.md` — the only file to create.
- `workflow/agents/validator.md` — style reference for agent definition tone and structure.
- `workflow/agents/implementer.md` — style reference for agent definition tone and structure.
- `.ai/context.md` — the test writer reads this to discover project test framework conventions (note: file may not yet exist; that is a project-context gap, not a task-spec scope issue).

## Validation Plan

- Verify `workflow/agents/test-writer.md` exists.
- Verify the file begins with valid YAML frontmatter (`---` fences) containing the keys: `description`, `mode`, `hidden`, `permission`.
- Verify `permission.edit` includes the six test-file allow patterns and the explicit `implementation-report.md` deny.
- Verify `permission.bash` is `"*": allow` and `permission.task` is `"*": deny`.
- Verify the role description paragraph contains the phrase "never writes implementation code" or equivalent.
- Verify a `## Responsibilities` section exists and covers all items listed in Acceptance Criteria.
- Verify a `## Boundaries` section exists and explicitly prohibits source file edits, feature implementation, and fixing existing code.
- Verify a `## Default report back` section exists describing the return format to orchestrator.
- Verify no other files in the working tree were created or modified (`git diff --name-only --cached` and `git diff --name-only` are empty aside from the new file).

## Open Questions

- None. The scope, permission model, role description, and boundaries are all fully specified in the design brief.
