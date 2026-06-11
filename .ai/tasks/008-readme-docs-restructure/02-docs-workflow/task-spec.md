# Unit 2: docs/workflow.md

## Scope

Create `docs/workflow.md` covering the orchestrator/subagent workflow and task artifact system.

The section draws from multiple sources in the README and agent definitions to produce a single coherent reference for the workflow's internal mechanics:

1. **Orchestrator state machine** — From `workflow/agents/orchestrator.md`: INTAKE → CLARIFY → ROUTE → DELEGATE → REVIEW → DONE. Explain each state briefly.
2. **Routing logic** — How the orchestrator decides between direct answer, executor (fast path), task-planner (full workflow), research, shipper, documentation. Include the "smallest safe workflow" principle.
3. **Task artifact layout** — The `.ai/tasks/<NNN>-<task-id>/` directory structure: `task-spec.md`, `implementation-report.md`, `validation-report.md`, `documentation-report.md`. Explain what each file captures and when it gets written.
4. **Project context** — `.ai/context.md` and its role as durable project truth.
5. **Common routes** — Describe each route from the README's `## Common Routes` section (question, tiny edit, substantial feature, test-first, research-backed, documentation task, commit/push). Use prose, not mermaid diagrams. Reference the relevant agents for each route.
6. **Single-unit vs multi-unit** — Briefly cover how the task-planner decomposes work.

### Source material

- README `## What Dispatcher Changes` (mermaid overview)
- README `## Core Idea`
- README `## Workflow Layers`
- README `## Common Routes`
- README `## Project Artifacts`
- `workflow/agents/orchestrator.md` (state machine, routing rules)
- `workflow/agents/task-planner.md` (single/multi-unit decomposition)

## Execution

- `documentation`

## Non-Goals

- Do not create or edit any files other than `docs/workflow.md` and this unit's `documentation-report.md`.
- Do not duplicate the agent reference table (that goes in `docs/agents.md`). Reference agents by name and link to `docs/agents.md` when needed.
- Do not cover configuration, model assignment, or install locations (that goes in `docs/configuration.md`).
- Do not cover development workflow, validation, or release processes (that goes in `docs/development.md`).
- Do not use mermaid diagrams. Use prose and ASCII/text-based descriptions.

## Testable Acceptance Criteria

None. Documentation-only.

## Inspectable Acceptance Criteria

1. `docs/workflow.md` exists.
2. The file covers all six areas listed in Scope (state machine, routing logic, task artifacts, project context, common routes, single vs multi-unit).
3. State machine states are named and explained (INTAKE, CLARIFY, ROUTE, DELEGATE, REVIEW, DONE).
4. Routing logic accurately reflects the orchestrator agent definition: direct answers for questions, executor for exact mechanical edits, task-planner for substantial work, research for external facts, shipper only when explicitly requested, documentation for doc tasks.
5. Task artifact layout reflects the actual `.ai/tasks/<NNN>-<task-id>/` structure from the README and task-planner agent definition.
6. `.ai/context.md` role is accurately described (project conventions, test setup, workflow flags).
7. Common routes are described in prose — each route names the agents involved and the flow.
8. Single vs multi-unit decomposition is briefly covered, referencing the task-planner's behavior.
9. Links to `docs/agents.md` are included where appropriate.
10. No mermaid diagrams. No configuration or development content bleeding in.

## Relevant Files

- `README.md` (sections: What Dispatcher Changes, Core Idea, Workflow Layers, Common Routes, Project Artifacts)
- `workflow/agents/orchestrator.md`
- `workflow/agents/task-planner.md`
