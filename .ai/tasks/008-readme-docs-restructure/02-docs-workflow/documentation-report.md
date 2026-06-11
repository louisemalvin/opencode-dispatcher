# Documentation Report — docs/workflow.md

## Outcome

Created `docs/workflow.md` as specified in the task spec. The document covers all six required areas:

1. **Orchestrator state machine** — INTAKE → CLARIFY → ROUTE → DELEGATE → REVIEW → DONE, with prose descriptions for each state.
2. **Routing logic** — Direct answer, executor, task-planner, research, shipper, documentation, and model-config routes, including the "smallest safe workflow" principle.
3. **Task artifact layout** — `.ai/tasks/<NNN>-<task-id>/` directory structure with a table explaining each file's purpose and which agent writes it.
4. **Project context** — `.ai/context.md` role as durable project truth, its contents, and how agents read it.
5. **Common routes** — Seven routes described in prose (question, tiny edit, substantial feature, test-first, research-backed, documentation task, commit/push), each naming the agents involved and the flow.
6. **Single-unit vs multi-unit** — Task-planner behavior for decomposition, including the unit table format and directory layout.

## Files Changed

| File | Action |
|------|--------|
| `docs/workflow.md` | Created (new file) |

## Context Or Decisions Updated

None. No changes to `.ai/context.md` or decision notes were needed.

## Verification

- [x] `docs/workflow.md` exists.
- [x] All six scope areas are covered.
- [x] State machine states are named and explained (INTAKE, CLARIFY, ROUTE, DELEGATE, REVIEW, DONE).
- [x] Routing logic accurately reflects the orchestrator agent definition.
- [x] Task artifact layout reflects the actual `.ai/tasks/<NNN>-<task-id>/` structure.
- [x] `.ai/context.md` role is accurately described.
- [x] Common routes are described in prose with agent names and flow.
- [x] Single vs multi-unit decomposition is covered, referencing task-planner behavior.
- [x] Links to `docs/agents.md` are included where appropriate.
- [x] No mermaid diagrams.
- [x] No configuration or development content.
- [x] No source code or unrelated files modified.
