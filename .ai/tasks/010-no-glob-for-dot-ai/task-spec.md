## Scope

Fix Dispatcher agent instructions and docs so agents do not use `glob` to detect or enumerate files under `.ai/` (especially `.ai/context.md` and `.ai/tasks/`). `glob` does not match dot-directories reliably across environments. Agents should instead use:

- **Direct file reads** (`read` tool) for known `.ai/...` paths like `.ai/context.md` — the read either succeeds or returns an error if the file is missing.
- **Directory listing** (`read` tool on the directory path, or `ls`) for `.ai/` enumeration such as scanning `.ai/tasks/` to find the next task number.

The change touches agent definitions that reference `.ai/` paths and project docs that document the first-interaction context check.

## Execution

- implementer
- validator

## Non-Goals

- Changing agent permission frontmatter (e.g., `glob: allow/deny` settings in YAML blocks).
- Modifying `bin/install.js`, `npm run check` logic, or any validation scripts.
- Creating new tooling, scripts, or validation automation.
- Modifying `opencode.jsonc`, `package.json`, or project configuration.
- Changing how agents access files outside `.ai/`.

## Testable Acceptance Criteria

1. **orchestrator.md**: The "check if `.ai/context.md` exists" instruction on or near line 68 is rewritten to say **use the `read` tool on the path directly** (an error means it does not exist) and to **explicitly warn against using `glob`** for `.ai/` paths.

2. **task-planner.md**: The "scanning existing `.ai/tasks/` directories" instruction on or near lines 15 and 26 is rewritten to say **use directory listing (`read` tool on `.ai/tasks/` or `ls .ai/tasks/`)** and to **explicitly warn against using `glob`** for `.ai/` paths.

3. **implementer.md, validator.md, shipper.md, test-writer.md, documentation.md**: Every instruction that says "Read `.ai/context.md`" (or similar `.ai/` read) includes an explicit note that the `read` tool must be used — `glob` is unreliable for dot-directories and must not be used for `.ai/` paths. These are:
   - `implementer.md` lines 22–23 (agy block and pre-edit read), line 29 (test runner lookup)
   - `validator.md` line 19 (test setup read)
   - `shipper.md` line 58 (pre-op read)
   - `test-writer.md` line 25 (test setup read)
   - `documentation.md` line 30 (pre-write read)

4. **docs/workflow.md**: The paragraph near line 63 that says "The orchestrator checks for `.ai/context.md` on first interaction" documents that the check uses a direct `read`, not `glob`.

5. **`npm run check` passes**: All agent markdown files maintain valid YAML frontmatter, and the orchestrator's permitted-task list remains consistent with the agent files.

### Test File Paths

- `workflow/agents/orchestrator.md`
- `workflow/agents/task-planner.md`
- `workflow/agents/implementer.md`
- `workflow/agents/validator.md`
- `workflow/agents/shipper.md`
- `workflow/agents/test-writer.md`
- `workflow/agents/documentation.md`
- `docs/workflow.md`

No new test files are written. The project's sole validation is `npm run check`.

## Inspectable Acceptance Criteria

- No agent instruction within scope implies, suggests, or leaves room for using `glob` to detect or enumerate `.ai/` files or directories.
- Every reference to reading `.ai/context.md` across the seven agent files explicitly names the `read` tool.
- The task-planner's task-numbering instructions explicitly reference `read` (directory listing) or `ls` as the enumeration method.
- The orchestrator's first-interaction context check explicitly says "use the `read` tool, not `glob`".

## Relevant Files

- `workflow/agents/orchestrator.md` — line 68 ("check if `.ai/context.md` exists")
- `workflow/agents/task-planner.md` — lines 15, 26–27 (task numbering and `.ai/context.md` read)
- `workflow/agents/implementer.md` — lines 22–23, 29 (`.ai/context.md` reads)
- `workflow/agents/validator.md` — line 19 (`.ai/context.md` read)
- `workflow/agents/shipper.md` — line 58 (`.ai/context.md` read)
- `workflow/agents/test-writer.md` — line 25 (`.ai/context.md` read)
- `workflow/agents/documentation.md` — line 30 (`.ai/context.md` read)
- `docs/workflow.md` — line 63 (first-interaction context check documentation)

## Validation Plan

1. Run `npm run check` to verify frontmatter integrity and cross-references pass unchanged.
2. Grep each changed agent file for the word `glob` to confirm no instruction suggests using it for `.ai/` access.
3. Grep each changed agent file for `read` tool references near `.ai/context.md` or `.ai/tasks/` mentions to confirm explicit tool guidance is present.
4. Human-inspect the orchestrator's first-interaction check instruction and the task-planner's numbering instruction for clarity and correctness.
