# Implementation Report — 015 Orchestrator Task-Planner Cleanup

## Outcome

All edits from the task spec have been applied. Six files were modified to:
1. Slim the orchestrator prompt and add docs-first routing.
2. Strengthen the documentation agent with durable source artifact ownership.
3. Update task-planner required spec sections.
4. Expand validator scope to cited source artifacts.
5. Update `docs/workflow.md` and `docs/agents.md` to reflect the new role split.

## Files Changed

| File | Type of Change |
|------|---------------|
| `workflow/agents/orchestrator.md` | Added docs-first routing in ROUTE section; replaced detailed field-by-field handoff with concise checklist; removed Path Allocation Procedure section entirely; replaced Multi-Unit Parallel Planning Flow with concise Multi-Unit Coordination note (213→183 lines, −30 lines) |
| `workflow/agents/task-planner.md` | Updated required spec sections in Single-Unit Workflow and Assigned-Unit Workflow to include `Source Artifacts / Handoff Context`, `Validation Plan`, `Open Questions` |
| `workflow/agents/documentation.md` | Added durable source artifact ownership (UX design brief, product brief, ADR, domain model, etc.) and rule to report when user approval is needed before task-planning |
| `workflow/agents/validator.md` | Expanded validation scope to include cited source artifacts / durable documentation |
| `docs/workflow.md` | Replaced with concise document covering new role split, docs-first routing, rich handoff concept (not field-by-field), and note that detailed planning mechanics belong to task-planner |
| `docs/agents.md` | Updated Role Summary table for Orchestrator, Task Planner, Validator, Documentation; updated Role Boundaries section |

## Decisions

- **Preserved rich handoff as a concept**: The orchestrator still requires a structured handoff for non-trivial work, but it is described as a concise field checklist (field names only) rather than a field-by-field reference document.
- **Decomposition ownership preserved**: Orchestrator still owns single/multi-unit classification and high-level decomposition.
- **Execution pipeline preserved**: Orchestrator retains the rule to read `## Execution`, spawn agents sequentially, and run validator last.
- **No frontmatter changes**: All agent frontmatter (permissions, mode, description) remains unchanged per scope boundaries.
- **Path allocation lives in task-planner**: The detailed path computation procedure was removed from orchestrator; it already existed in task-planner's Single-Unit Workflow section.

## Verification

### `npm run check`
**PASS** — All frontmatter and cross-references valid.

### Grep Acceptance Criteria

| # | Criterion | Result |
|---|-----------|--------|
| 1 | `npm run check` passes | ✅ |
| 2a | Orchestrator lines reduced (183 < 213) | ✅ |
| 2b | No "Path.*Allocat" in orchestrator | ✅ |
| 2c | No "parent manifest" detail in orchestrator | ✅ |
| 3 | Docs-first routing language in orchestrator | ✅ |
| 4a | Documentation durable source artifact types named | ✅ |
| 4b | Documentation user-approval reporting present | ✅ |
| 5a | Task-planner has "Source Artifacts / Handoff Context" | ✅ (2 matches) |
| 5b | Task-planner has "Validation Plan" | ✅ (2 matches) |
| 5c | Task-planner has "Open Questions" | ✅ (2 matches) |
| 6a | Task-planner has "planning-blocked" | ✅ |
| 6b | Task-planner constrains decision authority | ⚠️ (see Known Issues) |
| 7 | Validator cites source artifacts | ✅ |
| 8a | docs/workflow.md has docs-first routing | ✅ |
| 8b | docs/workflow.md notes task-planner owns planning mechanics | ✅ |
| 9 | docs/agents.md references durable/source artifacts | ✅ |

### Manual Inspection

- Orchestrator: No detailed path allocation procedure ✅, no detailed multi-unit parallel flow breakdown ✅, docs-first routing present ✅, concise handoff checklist (field names only) ✅, decomposition ownership preserved ✅, execution pipeline trigger preserved ✅.
- Task-planner: Required spec sections complete ✅, path allocation procedure present ✅, planning-blocked preserved ✅, decision authority preserved ✅.
- Documentation: Durable artifact types named ✅, approval-needed reporting present ✅.
- Validator: Cited source artifact validation mentioned ✅.
- docs/workflow.md: Role split ✅, docs-first routing ✅, planning mechanics ownership noted ✅.
- docs/agents.md: Role summaries updated ✅.

## Known Issues

- **Acceptance criterion 6b (case sensitivity)**: The grep assertion `grep -q "must not invent"` fails because the task-planner file uses `Must not invent` (capital M). This is a pre-existing case mismatch in the acceptance criterion, not a content issue — the decision authority constraint text (`- **Must not invent**: ...`) is present at line 40 of `workflow/agents/task-planner.md` and was not modified by this task.

## Open Issues

- None. All scope items are implemented.
