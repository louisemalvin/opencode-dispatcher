# Implementation Report: 010-no-glob-for-dot-ai

## Outcome

All 8 target files were updated. Every `.ai/context.md` read instruction across the agent files now explicitly names the `read` tool and warns against using `glob` for `.ai/` paths. The orchestrator's first-interaction check and the task-planner's numbering instructions now reference direct `read`/directory listing instead of `glob`.

## Files Changed

1. **workflow/agents/orchestrator.md** — Line 68: Rewrote `.ai/context.md` existence check to use `read` tool directly with explicit anti-`glob` warning.
2. **workflow/agents/task-planner.md** — Lines 15 and 26: Replaced "scanning existing `.ai/tasks/` directories" with "listing existing `.ai/tasks/` directories (use the `read` tool on `.ai/tasks/` or `ls .ai/tasks/` — do **not** use `glob`)".
3. **workflow/agents/implementer.md** — Lines 22, 23, 29: Added `read` tool usage note and anti-`glob` warning to each `.ai/context.md` reference (agy block, pre-edit read, test runner lookup).
4. **workflow/agents/validator.md** — Line 19: Added `read` tool usage note and anti-`glob` warning to `.ai/context.md` test setup read.
5. **workflow/agents/shipper.md** — Line 58: Added `read` tool usage note and anti-`glob` warning to `.ai/context.md` pre-op read.
6. **workflow/agents/test-writer.md** — Line 25: Added `read` tool usage note and anti-`glob` warning to `.ai/context.md` test setup read.
7. **workflow/agents/documentation.md** — Line 30: Added `read` tool usage note and anti-`glob` warning to `.ai/context.md` pre-write read.
8. **docs/workflow.md** — Line 63: Documented that the first-interaction context check uses the `read` tool directly, with explicit anti-`glob` language.

## Decisions

- **No frontmatter changes**: Permission blocks including `glob: allow` were left untouched per the task spec's non-goals.
- **Consistent phrasing**: Each agent file received a consistent parenthetical note: `(use the \`read\` tool — \`glob\` is unreliable for \`.ai/\` paths)` with minor variations to read naturally in context.
- **init.md not touched**: The `init.md` file references "test file glob pattern" but that is not a `.ai/` enumeration instruction — it refers to a user-configured test file pattern, not globbing `.ai/` directories. Not in scope.
- **agy timeout**: agy was available but timed out after 120s, so edits were applied manually.

## Verification

- **`npm run check`**: ✅ Passed. All agents validated, frontmatter intact, cross-references consistent.
- **Glob audit**: `rg -n 'glob' workflow/agents/ docs/workflow.md` confirms that the only remaining `glob` references in scope are:
  - YAML frontmatter permission blocks (e.g., `glob: allow`) — unchanged per non-goals.
  - Instruction text warning *against* using `glob` for `.ai/` paths.
  - `init.md:19` ("test file glob pattern") — out of scope (not a `.ai/` enumeration instruction).
- **Inspectable criteria met**: Every `.ai/context.md` read across the 7 agent files names the `read` tool. The orchestrator check explicitly says "use the `read` tool, not `glob`". The task-planner numbering instructions explicitly reference `read` (directory listing) or `ls`.

## Known Issues

None.
