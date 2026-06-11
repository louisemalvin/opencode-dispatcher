# Validation Report: 007-shipper-inspection-permissions

## Result

**PASS** — all acceptance criteria are satisfied, all non-goals respected, `npm run check` passes.

## Checks Performed

1. **File diff review** — `git diff` inspected for all three changed files:
   - `workflow/agents/shipper.md`
   - `.ai/context.md`
   - `workflow/agents/task-planner.md`
2. **`npm run check`** — run and exited with code 0, no errors.
3. **Permission rule audit** — all 17 pre-existing deny rules verified present and unchanged.
4. **Body text audit** — version/README prohibition, shell pipeline guidance, and "individually" wording verified.
5. **`.ai/context.md` audit** — lines 18 and 25 cross-checked for consistent "prepare before invoking shipper" language.
6. **`task-planner.md` audit** — Execution section instruction verified: bare bullet list, no orchestration notes, no mention of validator/orchestrator append behavior.

## Acceptance Criteria Review

| # | Criterion | Status | Details |
|---|-----------|--------|---------|
| 1 | `grep *` allow rule | ✅ PASS | Line 27: `"grep *": allow` |
| 2 | `head *` allow rule | ✅ PASS | Line 28: `"head *": allow` |
| 3 | `git show*` allow rule | ✅ PASS | Line 33: `"git show*": allow` |
| 4 | `node -p *` allow rule | ✅ PASS | Line 34: `"node -p *": allow`. Narrow scope (not `node *`) preserves `"*": ask` catch-all. |
| 5 | `cat *`, `tail *`, `wc *`, `file *` allow rules | ✅ PASS | Lines 29–32. |
| 6 | `npm run check` passes | ✅ PASS | Exit code 0, 11 agents validated. |
| 7 | Only target files modified | ✅ PASS (qualified) | `git diff --name-only` shows 3 files: `workflow/agents/shipper.md`, `.ai/context.md`, and `workflow/agents/task-planner.md`. The spec's Relevant Files section and scope item 4 explicitly require task-planner changes; AC 7's file list is incomplete but the implementation correctly covers all scope items. |
| 8 | All pre-existing denies preserved | ✅ PASS | All 17 deny rules match `HEAD` exactly (verified via `diff`). |
| 9 | Shipper body prohibits version bump/README edits | ✅ PASS | Line 66: "Version bump preparation, README.md edits, and changelog updates are out of scope for the shipper agent and must be prepared by other agents (implementer, executor, documentation) before shipper is invoked." |
| 10 | Shipper body discourages shell pipelines | ✅ PASS | Line 78: "Run inspection commands individually; do not combine allowed commands with shell operators like |, &&, ||, or ;." Pipe `|` added to list; "separately" → "individually". |
| 11 | `.ai/context.md` no longer implies shipper responsibility | ✅ PASS | Line 18: "…prepare these edits before invoking shipper." Line 25 unchanged (already correct). |
| 12 | task-planner.md Execution section instruction clean | ✅ PASS | Line 32: "must contain only the agent bullet list — no explanatory orchestration notes." No mention of validator, orchestrator append, or decision-logic sub-bullets. |

### Inspectable Acceptance Criteria

- **Eight new allow rules** inserted after `npm run check *` and before `git reset*: deny` — ✅ confirmed (lines 27–34).
- **No rule removed, reworded, or reordered** — ✅ confirmed.
- **Shipper body additions** in Hard boundaries section after "Do not prepare changes" line — ✅ confirmed.
- **`.ai/context.md` line 18 reworded** — ✅ confirmed; line 25 left as-is (already correct).
- **Shell pipelines disallowed** — ✅ confirmed (line 78 including `|`).
- **task-planner.md no orchestration notes** — ✅ confirmed.

## Issues Found

### Non-blocking Issues

1. **AC 7 incomplete in spec** — The testable acceptance criterion 7 lists only `workflow/agents/shipper.md` and `.ai/context.md` as expected changed files, but scope item 4 and AC 12 explicitly require `workflow/agents/task-planner.md` changes. The implementation correctly changed all three files. This is a pre-existing spec inconsistency, not an implementation defect.

2. **Removal of decision-logic sub-bullets in task-planner.md** — The prior version of `task-planner.md` included four sub-bullets with decision logic for choosing which agents to include in `## Execution` (e.g., "Feature/fix with testable acceptance criteria → `test-writer`, then `implementer`"). These were removed and replaced with the instruction that Execution sections must contain only the bare agent bullet list with no explanatory orchestration notes.

   **Assessment: Acceptable under anti-bloat direction.** The decision-logic sub-bullets effectively instructed planners to embed orchestration rationale in Execution sections — exactly what the anti-bloat directive prohibits. Keeping them would contradict the requirement for bare agent lists. The decision logic is implicit: the Scope and Non-Goals sections of a task spec already define the work type; the Execution heading needs only agent names. No quality concern arises from this removal.

### Blocking Issues

None.

### Unrelated/Baseline Issues

None.

## Residual Risks

- **`node -p *` narrowness**: The `node -p *` rule allows `node -p "require('./package.json').version"` which is a read-only inspection command and matches the spec. However, `node -p` can execute arbitrary JavaScript expressions. This is the intended design per AC 4 ("Broader `node *` … remains under `"*": ask`"), so it is not a residual risk introduced by this task.
- **Shell pipeline enforcement**: The shipper's body text instructs against combining commands with `|`, `&&`, `||`, `;`, but this is instruction-level (not enforced by the permission model). The spec acknowledges this with "Existing deny rules provide defense-in-depth against destructive command chaining for any pipeline that escapes the instruction boundary." This is within spec and not a new risk.

## Verification Run

```
$ npm run check
> opencode-dispatcher@0.3.0 check
> node ./bin/install.js check
Workflow package check passed. Agents: documentation, executor, implementer, init,
model-config, orchestrator, research, shipper, task-planner, test-writer, validator.
Exit code: 0
```

## Limitations

- Permission prompt behavior (AC 1–5) was verified via frontmatter inspection only; no runtime agent test harness exists to actually trigger bash permission prompts. The `npm run check` validator does not simulate permission resolution.

---

**Report generated by Validator Agent.** All checks completed against `.ai/tasks/007-shipper-inspection-permissions/task-spec.md`.
