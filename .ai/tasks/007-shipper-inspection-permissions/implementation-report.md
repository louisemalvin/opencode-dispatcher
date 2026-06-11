# Implementation Report: 007-shipper-inspection-permissions

## Outcome

All 12 testable acceptance criteria are satisfied. Three files were modified: `workflow/agents/shipper.md`, `.ai/context.md`, and `workflow/agents/task-planner.md`. The `npm run check` validation passes with exit code 0.

## Files Changed

### `workflow/agents/shipper.md`

1. **Eight new `allow` rules** inserted in the bash permission block after `"npm run check *": allow` and before the first deny rule:
   - `"grep *": allow`
   - `"head *": allow`
   - `"tail *": allow`
   - `"cat *": allow`
   - `"wc *": allow`
   - `"file *": allow`
   - `"git show*": allow`
   - `"node -p *": allow`

2. **Explicit version/README/changelog prohibition** added after the existing "Do not prepare changes" line in the Hard boundaries section:
   - "Version bump preparation, README.md edits, and changelog updates are out of scope for the shipper agent and must be prepared by other agents (implementer, executor, documentation) before shipper is invoked."

3. **Shell pipeline guidance extended** — the pre-commit inspection line now says `|, &&, ||, or ;` (added `|` pipe operator) and uses "individually" instead of "separately".

All pre-existing deny rules are preserved unchanged.

### `.ai/context.md`

Line 18 harmonized from:
> "Every version bump commit must also update `README.md` Version History with a new entry describing the changes."

to:
> "Every version bump commit must include updated `README.md` Version History entries describing the changes; prepare these edits before invoking shipper."

Line 25 was already correct and left unchanged.

### `workflow/agents/task-planner.md`

Line 32 updated to:
- Remove the explanatory orchestration note "— the orchestrator appends it automatically" (which mentioned validator/orchestrator append behavior).
- Add explicit instruction: "The `## Execution` section must contain only the agent bullet list — no explanatory orchestration notes."

## Decisions

- `task-planner.md` required adjustment because its original text contained an explanatory orchestration note ("the orchestrator appends it automatically") which violated the spec's requirement that Execution sections must not mention validator/orchestrator append behavior.
- `node -p *` is allow-listed narrowly (not `node *`) to permit read-only version inspection while keeping full `node` invocations under the `"*": ask` catch-all.
- Pipes (`|`) were added to the existing shell operator prohibition rather than creating a separate line, keeping the scope change minimal.
- The `.ai/context.md` line 25 was left as-is since it already correctly states "prepare ... before invoking shipper."

## Verification

- `npm run check` — passes with exit code 0. All 11 agents validated, orchestrator cross-references intact.
- `git diff --name-only` — only the three target files listed above appear.
- Visual inspection confirms all 8 new allow rules are present, all 17 deny rules are preserved, and no permission rule was removed, reworded, or reordered.
- Visual inspection confirms the version/README/changelog prohibition and pipeline guidance are present in the shipper body text.
- Visual inspection confirms `.ai/context.md` lines 18 and 25 are harmonized.
- Visual inspection confirms `task-planner.md` line 32 has no explanatory orchestration notes and instructs planners correctly.

## Known Issues

None.
