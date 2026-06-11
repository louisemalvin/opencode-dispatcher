# Validation Report: 010-no-glob-for-dot-ai

## Result

**PASS** — All testable and inspectable acceptance criteria are satisfied. No blocking or non-blocking issues found.

---

## Checks Performed

### 1. `npm run check` — Frontmatter Integrity & Cross-References

Ran `npm run check`:

```
Workflow package check passed. Agents: documentation, executor, implementer, init, model-config, orchestrator, research, shipper, task-planner, test-writer, validator.
```

✅ **PASS** — All agent files have valid YAML frontmatter, and the orchestrator's permitted-task list remains consistent with the agent files.

### 2. Audit of `glob` references in scope (grep)

Used `rg -n 'glob' workflow/agents/ docs/workflow.md` to audit every mention of `glob` across the 8 target files. Results:

| File | Line | Context | Status |
|---|---|---|---|
| `orchestrator.md` | 7 | `glob: allow` (YAML frontmatter permission) | ✅ Unchanged per non-goals |
| `orchestrator.md` | 68 | `Do **not** use \`glob\`` (warning text) | ✅ Correct — anti-`glob` instruction |
| `task-planner.md` | 15 | `do **not** use \`glob\`` (warning text) | ✅ Correct — anti-`glob` instruction |
| `task-planner.md` | 26 | `do **not** use \`glob\`` (warning text) | ✅ Correct — anti-`glob` instruction |
| `task-planner.md` | 27 | `\`glob\` is unreliable for \`.ai/\` paths` (warning text) | ✅ Correct — anti-`glob` instruction |
| `implementer.md` | 22 | `\`glob\` is unreliable for \`.ai/\` paths` (warning text) | ✅ Correct — anti-`glob` instruction |
| `implementer.md` | 23 | `\`glob\` does not match dot-directories reliably` (warning text) | ✅ Correct — anti-`glob` instruction |
| `implementer.md` | 29 | `\`glob\` is unreliable for \`.ai/\` paths` (warning text) | ✅ Correct — anti-`glob` instruction |
| `validator.md` | 19 | `\`glob\` is unreliable for \`.ai/\` paths` (warning text) | ✅ Correct — anti-`glob` instruction |
| `shipper.md` | 58 | `\`glob\` is unreliable for \`.ai/\` paths` (warning text) | ✅ Correct — anti-`glob` instruction |
| `test-writer.md` | 25 | `\`glob\` is unreliable for \`.ai/\` paths` (warning text) | ✅ Correct — anti-`glob` instruction |
| `documentation.md` | 30 | `\`glob\` is unreliable for \`.ai/\` paths` (warning text) | ✅ Correct — anti-`glob` instruction |
| `docs/workflow.md` | 63 | `\`glob\` must not be used for \`.ai/\` paths` (warning text) | ✅ Correct — anti-`glob` instruction |
| `init.md` | 19 | `test file glob pattern` (out of scope) | ✅ Not `.ai/` enumeration — refers to user-configured test file pattern |

Every `glob` mention in instruction text is either explicitly warning *against* using `glob` for `.ai/` paths or is an out-of-scope YAML frontmatter permission setting.

✅ **PASS** — No agent instruction suggests or implies using `glob` for `.ai/` access.

### 3. Audit of `read` tool references for `.ai/` paths

Grep for `read` tool references near `.ai/context.md` or `.ai/tasks/` mentions:

| File | Line | Text excerpt | Status |
|---|---|---|---|
| `orchestrator.md` | 68 | `using the \`read\` tool on the path directly` | ✅ Explicitly names `read` tool |
| `task-planner.md` | 15 | `use the \`read\` tool on \`.ai/tasks/\` or \`ls .ai/tasks/\`` | ✅ Explicitly names `read` tool / `ls` |
| `task-planner.md` | 26 | `use the \`read\` tool on \`.ai/tasks/\` or \`ls .ai/tasks/\`` | ✅ Explicitly names `read` tool / `ls` |
| `task-planner.md` | 27 | `use the \`read\` tool` | ✅ Explicitly names `read` tool |
| `implementer.md` | 22 | `use the \`read\` tool` | ✅ Explicitly names `read` tool |
| `implementer.md` | 23 | `use the \`read\` tool` | ✅ Explicitly names `read` tool |
| `implementer.md` | 29 | `read it with the \`read\` tool` | ✅ Explicitly names `read` tool |
| `validator.md` | 19 | `use the \`read\` tool` | ✅ Explicitly names `read` tool |
| `shipper.md` | 58 | `use the \`read\` tool` | ✅ Explicitly names `read` tool |
| `test-writer.md` | 25 | `use the \`read\` tool` | ✅ Explicitly names `read` tool |
| `documentation.md` | 30 | `use the \`read\` tool` | ✅ Explicitly names `read` tool |
| `docs/workflow.md` | 63 | `using the \`read\` tool directly on the path` | ✅ Explicitly names `read` tool |

✅ **PASS** — Every `.ai/context.md` and `.ai/tasks/` read reference explicitly names the `read` tool.

### 4. Human Inspection — Orchestrator First-Interaction Check

**orchestrator.md** line 68:
> On first interaction with a project, check if `.ai/context.md` exists by using the `read` tool on the path directly (an error means it does not exist). Do **not** use `glob` — it does not match dot-directories reliably.

- ✅ States that the `read` tool must be used.
- ✅ Explains that an error return means the file is missing (no need for `glob`).
- ✅ Explicitly warns against using `glob`.
- ✅ Clear, unambiguous, actionable.

### 5. Human Inspection — Task-Planner Numbering Instruction

**task-planner.md** lines 15 and 26:
> `<NNN>` is the next available zero-padded number (001, 002, …) found by listing existing `.ai/tasks/` directories (use the `read` tool on `.ai/tasks/` or `ls .ai/tasks/` — do **not** use `glob`, which is unreliable for dot-directories).

- ✅ Uses "listing" (not "scanning" or globbing).
- ✅ Names two concrete approaches: `read` tool on the directory, or `ls`.
- ✅ Explicitly warns against using `glob`.
- ✅ Clear and actionable.

### 6. Non-Goals Compliance

- ✅ **Permission frontmatter**: Not changed. `glob: allow` in `orchestrator.md` line 7 remains intact.
- ✅ **`bin/install.js`, `npm run check` logic**: Not modified.
- ✅ **New tooling/scripts/validation**: Not created.
- ✅ **`opencode.jsonc`, `package.json`, project configuration**: Not modified by this task.
- ✅ **Agent access to files outside `.ai/`**: Not changed.

### 7. Git Diff Audit

Verified via `git diff HEAD~1` that only the 8 target files were modified for this change set. No unintended file modifications.

---

## Acceptance Criteria Review

### Testable Acceptance Criteria

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | orchestrator.md ~line 68: rewritten to use `read` tool, warn against `glob` | ✅ PASS | Line 68: `using the \`read\` tool on the path directly` + `Do **not** use \`glob\`` |
| 2 | task-planner.md ~lines 15, 26: directory listing, anti-`glob` warning | ✅ PASS | Lines 15, 26: `listing existing \`.ai/tasks/\` directories (use the \`read\` tool on \`.ai/tasks/\` or \`ls .ai/tasks/\`)` with anti-`glob` warning |
| 3 | All 5 agent files (implementer, validator, shipper, test-writer, documentation): explicit `read` tool + anti-`glob` warning | ✅ PASS | All `.ai/context.md` reads annotated with `(use the \`read\` tool — \`glob\` is unreliable for \`.ai/\` paths)` or equivalent |
| 4 | docs/workflow.md ~line 63: documents `read` tool check, not `glob` | ✅ PASS | Line 63: documents the `read` tool check with anti-`glob` language |
| 5 | `npm run check` passes | ✅ PASS | `Workflow package check passed.` |

### Inspectable Acceptance Criteria

| # | Criterion | Status | Evidence |
|---|---|---|---|
| 1 | No agent instruction suggests using `glob` for `.ai/` access | ✅ PASS | All `glob` mentions in instruction text are warnings against its use |
| 2 | Every `.ai/context.md` reference names the `read` tool | ✅ PASS | All 11 references across 8 files explicitly name the `read` tool |
| 3 | Task-planner numbering references `read` (directory listing) or `ls` | ✅ PASS | Lines 15 and 26: `use the \`read\` tool on \`.ai/tasks/\` or \`ls .ai/tasks/\`` |
| 4 | Orchestrator check says "use the `read` tool, not `glob`" | ✅ PASS | Line 68: `using the \`read\` tool ... Do **not** use \`glob\`` |

---

## Issues Found

**None.** All acceptance criteria are fully satisfied. No blocking or non-blocking issues were identified.

---

## Residual Risks

None identified.

---

## Verification Summary

| Check | Result |
|---|---|
| `npm run check` | ✅ Passed |
| `glob` audit (no `.ai/` enumeration uses `glob`) | ✅ Passed |
| `read` tool audit (all `.ai/` reads name the tool) | ✅ Passed |
| Orchestrator first-interaction check | ✅ Clear and correct |
| Task-planner numbering instruction | ✅ Clear and correct |
| Non-goals respected | ✅ No violations |
| Unintended file changes | ✅ None |
