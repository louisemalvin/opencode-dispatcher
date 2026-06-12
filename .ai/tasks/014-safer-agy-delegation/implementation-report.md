# Implementation Report — 014 Safer Agy Delegation

## Outcome

All changes specified in the task spec have been applied successfully. The agy integration instruction in `workflow/agents/implementer.md` and the Agy Integration section in `docs/configuration.md` have been rewritten to remove `--dangerously-skip-permissions`, require rich prompt construction with full context, and add explicit length/feasibility and permissions gates that cause fallback to manual implementation rather than bypassing permissions. All acceptance criteria pass.

### Fix Cycle (2026-06-12)

**Observation**: The literal string `--dangerously-skip-permissions` remained in both target files in forbidding-only contexts (e.g., "Do **not** add `--dangerously-skip-permissions`"). The spec validation plan requires **no occurrence** in either file.

**Action**: Replaced all 4 occurrences (2 in `implementer.md`, 2 in `docs/configuration.md`) with generic prohibition language using "permission-bypassing flags" — no literal flag name mentioned.

**Verification**: Grep confirms zero occurrences; `npm run check` passes.

## Files Changed

### 1. `workflow/agents/implementer.md` (lines 22–38)

- **Old**: Single-line agy integration instruction that used `--dangerously-skip-permissions` and only required a rudimentary prompt (persona + task spec + relevant file contents).
- **New**: Multi-line instruction that:
  - Removes `--dangerously-skip-permissions` entirely.
  - Mandates `agy --print "<prompt>"` without any permission-bypassing flag.
  - Requires a rich prompt including: full persona, complete task spec, `.ai/context.md` context, relevant file contents, output/report path, verification commands, constraints/non-goals, and stop conditions.
  - Explicitly states a vague one-line summary is **not sufficient**.
  - Adds a **length/feasibility gate**: if prompt exceeds practical CLI limits, fall back to manual implementation.
  - Adds a **permissions gate**: if agy requires permissions at runtime, stop and fall back; do not add `--dangerously-skip-permissions` or equivalent.
  - Requires describing agy delegation in the implementation report.
  - Clarifies that the implementer remains responsible for verifying agy's output.
  - Preserves the existing fallback ("If agy is not enabled or not available, proceed with the manual implementation steps below").
  - Preserves the existing boundary about not modifying agy config/toggle (unchanged in the Boundaries section, line 54).

### 2. `docs/configuration.md` (lines 55–67, 81–83)

- **How It Works** subsection (lines 55–67):
  - Updated prompt construction description to list all required prompt elements matching the new agent instruction.
  - Changed invocation from `agy --dangerously-skip-permissions --print "<prompt>"` to `agy --print "<prompt>"` (without the dangerous flag).
  - Added a bullet about length/quoting and permissions fallback.
- **Fallback** subsection (lines 81–83):
  - Extended to also mention prompt length limits and runtime permissions as fallback triggers.
  - Added explicit statement that `--dangerously-skip-permissions` is never used.

### Files verified unchanged (read-only)

- `bin/install.js` — no changes needed; `npm run check` passes.
- `.ai/context.md` — no changes made; `agy: enabled` flag preserved.
- `workflow/agents/init.md` — no contradictory `--dangerously-skip-permissions` instruction found.
- `workflow/agents/orchestrator.md` — no contradictory `--dangerously-skip-permissions` instruction found.

## Decisions

1. **Removed `--dangerously-skip-permissions` entirely — even from forbidding contexts**: The original implementation kept the literal string in prohibition text (e.g., "Do **not** add `--dangerously-skip-permissions`"). The fix cycle replaced all 4 occurrences with generic terms ("permission-bypassing flags") to satisfy the spec's acceptance criterion of zero occurrences in both target files.
2. **Extended Fallback section in docs**: The original spec targeted "lines 49–77" for the Agy Integration section, but the Fallback subsection naturally extended past line 77 after editing. The entire `## Agy Integration` block (lines 49–83) is now coherent and consistent. The additional content is within the same section heading.
3. **No new files created**: Both changes were in-place edits to existing files. No backward compatibility, dependencies, or abstractions added.
4. **No agy invoked**: Per the non-goals, agy was not run or tested. This is a human-readable instruction change.

## Verification

All validation steps from the task spec's Validation Plan were executed and passed:

| Step | Method | Result |
|------|--------|--------|
| 1. Structural check | `npm run check` | ✅ Passed (frontmatter valid, orchestrator cross-references intact) |
| 2. Dangerous flag removed | `grep` on both files | ✅ Zero occurrences of `--dangerously-skip-permissions` in either file (removed even from forbidding contexts; now uses generic "permission-bypassing flags" language) |
| 3. Required prompt elements | `grep` on `implementer.md` | ✅ All elements present: persona (line 24), task spec (25), context (26), file contents (27), output path (28), verification commands (29), constraints (30), stop conditions (31) |
| 4. Fallback gates | `grep` on `implementer.md` | ✅ Length/feasibility gate (line 33), permissions gate (line 34) |
| 5. Docs consistency | Side-by-side read comparison | ✅ Both files agree on: invocation (`agy --print`), required prompt elements, fallback conditions, and prohibition of permission bypass |

## Known Issues

None. All acceptance criteria are met.
