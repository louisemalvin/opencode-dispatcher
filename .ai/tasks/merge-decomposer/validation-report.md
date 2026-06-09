# Validation Report: Merge Decomposer into Task-Planner and Simplify Orchestrator

**Task ID:** merge-decomposer
**Validated by:** Validator Agent
**Date:** 2026-06-09

## Result

**QUALIFIED FAIL** — The core merge logic is correct and all testable acceptance criteria pass, but the implementation exceeds the task spec scope: the orchestrator was modified beyond removing decomposer references, and numerous files outside `workflow/agents/` were also changed, violating explicit constraints and non-goals.

## Checks Performed

### Testable Acceptance Criteria (11/11 PASS)

| Criterion | Check | Result |
|-----------|-------|--------|
| **TP-1** | `question: allow` in task-planner permission block | ✅ PASS (`grep -c` returns 1) |
| **TP-2** | Single-unit vs multi-unit assessment instructions | ✅ PASS (`grep -ci` returns 8) |
| **TP-3** | File conflict detection instructions | ✅ PASS (`grep -ci` returns 1) — line 36: "Detect file conflicts: two units touching the same file cannot run in parallel." |
| **TP-4** | Dependency detection instructions | ✅ PASS (`grep -ci` returns 3) — lines 37, 56 have "depends on" and "dependencies" |
| **TP-5** | Approval table instructions | ✅ PASS (`grep -ci` returns 9) — unit table template present (lines 40–45), approval flow described |
| **TP-6** | Parent manifest and numeric-prefixed child task specs | ✅ PASS (`grep -c` returns 7) — tree diagram with `01-unitslug/`, `02-unitslug/` on lines 52–58 |
| **TP-7** | `.ai/tasks/current` pointer file instructions | ✅ PASS (`grep -c` returns 1) — line 60 describes path format |
| **ORCH-1** | No `decomposer: allow` in orchestrator permission block | ✅ PASS (`grep -c` returns 0) |
| **ORCH-2** | No "delegate to decomposer" or "decomposer agent" in routing | ✅ PASS (`grep -ci` returns 0) |
| **ORCH-3** | No "Decomposition and batching" section heading | ✅ PASS (`grep -c` returns 0) |
| **DEL-1** | `workflow/agents/decomposer.md` no longer exists on disk | ✅ PASS (`test -f` returns "GONE") |

The remaining two occurrences of "decompos" in orchestrator.md are the intended replacement text — both refer to task-planner's new decomposition capability (lines 41, 78), not the old decomposer agent.

### Inspectable Acceptance Criteria (6/8 PASS, 2 FAIL)

| Criterion | Check | Result |
|-----------|-------|--------|
| **I-1** | "Complex multi-module" example routes through task-planner | ✅ PASS — line 78: `orchestrator -> task-planner (decompose+plan+approval) -> parallel implementers -> parallel validators -> orchestrator.` |
| **I-2** | No other decomposer references; all plan work routes through task-planner only | ✅ PASS — every routing line and example uses task-planner (or executor for atomic edits). No decomposer references remain. |
| **I-3** | Task-planner existing responsibilities survive intact | ✅ PASS — read context.md (line 24), read candidate files / follow imports (line 25), architectural decisions (line 26), scope-ambiguity guard (line 62), no implementation edits (line 29), default report-back format (lines 64–68) all present. |
| **I-4** | Task-planner describes creating task-spec with required sections | ✅ PASS — line 27: `Create .ai/tasks/<task-id>/task-spec.md with sections: Scope, Non-Goals, Testable Acceptance Criteria (with ### Test File Paths subsection), Inspectable Acceptance Criteria, Relevant Files.` |
| **I-5** | Orchestrator preserved without unintended mutation beyond decomposer removal | ❌ **FAIL** — see Issues Found below for details |
| **I-6** | `git diff --name-only` shows only 3 files changed | ❌ **FAIL** — see Issues Found below for details |
| **I-7** | Task-planner reads coherently as a single agent definition | ✅ PASS — flows naturally: assessment → single-unit workflow → multi-unit decomposition → scope guard → report-back |
| **I-8** | Orchestrator reads coherently with no dangling decomposer references | ✅ PASS — no dead references to a removed decomposer agent |

## Issues Found

### Issue 1: Orchestrator mutated beyond decomposer removal (I-5 FAIL) — Severity: HIGH

The orchestrator diff contains changes not authorized by the task spec. The spec required only:
- Remove `decomposer: allow` from the permission block
- Remove one routing line about delegating to decomposer
- Remove the "Decomposition and batching" section
- Update the "Complex multi-module" workflow example
- Ensure no decomposer paths remain

However, the following additional changes were made:

| Change | Constraint Violated |
|--------|---------------------|
| **Description** field changed: removed "and keeps default build/plan agents out of the workflow." | "Preserve the existing frontmatter fields `description`, `mode`, and `hidden` on both agent files exactly as-is." |
| **Permission block**: added `init: allow` and `executor: allow` | "Preserve existing `permission` entries on both files exactly as-is, except where this task explicitly adds or removes entries (`question: allow` addition to task-planner; `decomposer: allow` removal from orchestrator)." |
| Hard boundary paragraph: removed "Do not use OpenCode's default build or plan agents for this custom workflow." | Unintended mutation |
| Artifact source-of-truth: removed `/ai-init` and `task-artifact-workflow` skill bullets | Unintended mutation |
| Core routing: simplified "ambiguous/serious/high-risk" line, removed "Do not use the default opencode build agent" qualifier, added executor path | Unintended mutation |
| Validator fix cycle: rewritten from "decide whether to delegate…or ask user" to "at most once…escalate" | Unintended mutation |
| Delegation examples: added "Simple atomic edit" and "Project initialization"; removed "Multi-unit parallel decomposition" | Scope expansion |

### Issue 2: Files outside scope modified (I-6 FAIL) — Severity: CRITICAL

`git diff --name-only HEAD` shows 22 files changed, not 3:

**Other agent files modified (non-goal violation):**
- `workflow/agents/documentation.md`
- `workflow/agents/implementer.md`
- `workflow/agents/shipper.md`
- `workflow/agents/test-writer.md`
- `workflow/agents/validator.md`

**New agent files created (untracked, non-goal violation):**
- `workflow/agents/executor.md`
- `workflow/agents/init.md`

**Non-agent files modified (non-goal violation):**
- `README.md`
- `package.json`
- `bin/install.js`

**Template/skill files deleted (non-goal violation):**
- `.ai/templates/` (4 files deleted)
- `workflow/templates/` (4 files deleted)
- `workflow/skills/task-artifact-workflow/SKILL.md` (deleted)

### Issue 3: Minor task-planner wording refinement (LOW, acceptable)

The task-planner rewrite replaced some specific wording:
- Lost explicit reference to `.ai/context.md` `## Test Setup` section (now says "test setup" generically)
- Lost explicit reference to project `.ai/templates/task-spec.md` template

These are within the tolerance of I-3 (the responsibilities survive intact) and do not break any testable criterion.

## Verification Run

```bash
# All 11 testable criteria verified via grep/existence checks
# I-1 through I-8 verified via manual file inspection
# git diff --name-only HEAD confirmed 22 files changed (vs. expected 3)
# Decomposer.md confirmed deleted from disk and git index
```

## Limitations

- Did not run `tests/test_merge_decomposer.py` (file does not exist on disk; no test file was created as part of this task).
- Only read-only inspections performed.
- The out-of-scope file changes in other agents/templates were not inspected for correctness — only their existence was noted as a scope violation.

## Recommendation

1. **Restore orchestrator.md to minimal changes**: revert all changes except the four spec-specified ones (remove `decomposer: allow`, remove decomposer routing line, remove "Decomposition and batching" section, update "Complex multi-module" example).
2. **Restore all files outside `workflow/agents/task-planner.md` and `workflow/agents/orchestrator.md`** to their HEAD state (except `decomposer.md` deletion).
3. Re-run validation against this report after fixes.
