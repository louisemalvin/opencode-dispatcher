# Task Spec

## Scope

1. Delete `workflow/agents/builder.md` — orphaned/legacy agent, not referenced by orchestrator, not in any allowlist, superseded by `implementer.md`.
2. Delete `workflow/agents/release.md` — superseded by `shipper.md`. Shipper is the primary git agent, not a compatibility alias.
3. Delete `workflow/agents/reviewer.md` — orphaned/legacy agent, not referenced by orchestrator, not in any allowlist, not wired into the workflow.
4. Update `workflow/agents/shipper.md`:
   - Change description from `"Compatibility alias for release work"` to describe it as the primary git commit/push agent.
   - Remove "You are a compatibility alias for the Release Agent" language; make it the primary git agent.
5. Update `workflow/agents/orchestrator.md`:
   - Remove `release: allow` from the permission task allowlist (line 13).
   - Change all "release or shipper" references to just "shipper".
   - Remove "Shipper remains available as a compatibility alias..." language for commit/push routing.
   - Update delegation examples at the bottom (replace "release or shipper" with "shipper").
6. Update `workflow/AGENTS.md` line 7: change `"release/shipper"` to `"shipper"`.
7. Update `workflow/skills/task-artifact-workflow/SKILL.md` line 44: change `"Release or shipper"` to `"Shipper"`.
8. Update `README.md`:
   - Line 9: change "release work" to "shipping work".
   - Line 58: change "release, shipping" to "shipper, shipping" (or just "shipper").

## Non-Goals

- Do not change the behavior or permission model of `shipper.md` beyond the description/promotion wording.
- Do not touch `install.js` (it copies the workflow directory by name, not by agent references).
- Do not change any other agent definitions (documentation.md, implementer.md, validator.md, task-planner.md, research.md).
- Do not rename files or create new agents.
- Do not change uses of the word "release" in non-agent contexts (e.g., "software release", "release the workflow").

## Acceptance Criteria

- `builder.md` is deleted.
- `release.md` is deleted.
- `reviewer.md` is deleted.
- `shipper.md` no longer calls itself a "compatibility alias" — it is self-described as the primary git agent.
- `orchestrator.md` no longer references `release` as a subagent or in routing instructions.
- `workflow/AGENTS.md` references `"shipper"` instead of `"release/shipper"`.
- `workflow/skills/task-artifact-workflow/SKILL.md` references `"Shipper"` instead of `"Release or shipper"`.
- `README.md` references `"shipper"` or `"shipping"` instead of `"release"` where referring to the agent.
- No file in the workflow references `"release"` as a git agent name (the word may still appear in non-agent contexts).

## Constraints

- The word "release" may appear in non-agent contexts (e.g., "software release" or "release the workflow") — those must NOT be changed.
- Only the eight files listed in Scope may be modified (or, in the case of builder.md, release.md, and reviewer.md, deleted).

## Relevant Files

- `workflow/agents/builder.md` — delete
- `workflow/agents/release.md` — delete
- `workflow/agents/reviewer.md` — delete
- `workflow/agents/shipper.md` — edit description and self-identification wording
- `workflow/agents/orchestrator.md` — remove release permission, references, and aliasing language
- `workflow/AGENTS.md` — line 7: `"release/shipper"` → `"shipper"`
- `workflow/skills/task-artifact-workflow/SKILL.md` — line 44: `"Release or shipper"` → `"Shipper"`
- `README.md` — lines 9 and 58: agent references to "release" → "shipper" / "shipping"

## Validation Plan

1. Confirm `workflow/agents/builder.md` no longer exists.
2. Confirm `workflow/agents/release.md` no longer exists.
3. Confirm `workflow/agents/reviewer.md` no longer exists.
4. Read `workflow/agents/shipper.md` and verify it is self-described as the primary git agent, not an alias.
5. Read `workflow/agents/orchestrator.md` and grep for `"release"` — confirm no agent references remain.
6. Grep the entire `workflow/` directory for `"release"` — confirm only non-agent uses remain.
7. Grep `README.md` for `"release"` — confirm only non-agent uses remain.
8. Read `workflow/skills/task-artifact-workflow/SKILL.md` and confirm `"Shipper"` replaces `"Release or shipper"`.
