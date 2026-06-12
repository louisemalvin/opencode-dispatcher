# Workflow

This document describes the high-level OpenCode Dispatcher workflow: how the orchestrator routes requests, how task artifacts are laid out, and how agents coordinate.

For a complete agent reference, see [docs/agents.md](agents.md).

## Role Split

Dispatcher uses five core agents with distinct responsibilities:

- **Orchestrator**: Conversation/context router, high-level decomposition coordinator, user-facing owner. Routes to the right agent, owns the state machine, and provides a structured handoff for non-trivial work.
- **Documentation**: Durable source artifact author for cross-cutting/reusable context (UX briefs, ADRs, domain models, API contracts, etc.). Reports when user approval is needed before task-planning.
- **Task Planner**: Task artifact author and planning mechanics owner. Owns path allocation, parent/child manifest format, required spec sections, and self-directed fallback decomposition.
- **Implementer**: Executes approved task specs by editing source code.
- **Validator**: Checks completed work against the task spec and any cited durable source artifacts.

Docs-first routing: When correctness depends on cross-cutting/reusable context not yet captured in durable form, the orchestrator routes to documentation BEFORE task-planner so task-planner has an approved source artifact to cite.

## Orchestrator State Machine

The orchestrator operates as a six-state state machine. Not every request passes through every state — the orchestrator always chooses the smallest safe workflow for the task.

- **INTAKE**: Classify the incoming request. Determine whether it is a question, idea exploration, simple edit, non-trivial implementation, research-backed decision, documentation task, validation or review, or a commit/push request.
- **CLARIFY**: Talk with the user until the request is solid enough to route. A request is solid when the desired outcome, affected files, rough scope, important non-goals, risk level, and expected verification are all understood. The orchestrator asks one focused question only when the missing answer would change scope, safety, or routing.
- **ROUTE**: Choose the smallest safe path. The orchestrator decides which agent or direct answer best fits the request, applying docs-first routing when durable context is needed.
- **DELEGATE**: Dispatch the work to the appropriate specialist agent. After the subagent completes, control always returns to the orchestrator.
- **REVIEW**: After non-trivial implementation or documentation work, validate the result against the task spec. If validation fails, allow one fix cycle. If issues remain, escalate to the user.
- **DONE**: Summarise the outcome, changed files or artifacts, verification results, and any open issues.

## Routing Logic

The orchestrator selects the smallest safe workflow based on the nature of the request:

- **Direct answer** — When no file changes are needed. Used for explanations, reviews, comparisons, and planning advice.
- **Docs-first routing** — When correctness depends on cross-cutting/reusable context not yet in durable form, route to documentation first, then to task-planner citing that artifact.
- **Executor (fast path)** — When the requested edit is exact, mechanical, low-risk, and does not need task planning or acceptance criteria.
- **Task-planner** — When the work is behaviour-changing, risky, unclear, needs acceptance criteria, or benefits from a written plan before implementation. The orchestrator provides a rich structured handoff (see [Rich Handoff Concept](#rich-handoff-concept)).
- **Research** — When a decision depends on external facts such as official documentation, vendor behaviour, pricing, APIs, or current best practices.
- **Shipper** — Only for explicit git commit or push requests after the intended file changes already exist.
- **Documentation** — When the task involves README updates, project context updates, decision notes, changelog entries, or documentation reports.
- **Model-config** — When the user wants to configure per-agent models for this project.

## Task Artifact Layout

Dispatcher stores durable task state under `.ai/tasks/`. Each task gets a zero-padded numeric prefix and a short slug:

```text
.ai/tasks/<NNN>-<task-id>/
    task-spec.md
    implementation-report.md
    validation-report.md
    documentation-report.md
    planning-handoff.md       (optional — see below)
    agy-handoff.md            (optional — see below)
```

| File | Purpose | Written by |
|------|---------|-----------|
| `task-spec.md` | Approved scope, acceptance criteria, constraints, relevant files, and validation plan. Includes an `## Execution` section listing the agent pipeline. | Task-planner |
| `implementation-report.md` | What files were changed, what approach was taken, and any open questions. | Implementer |
| `validation-report.md` | Verification results against the task spec's acceptance criteria and cited source artifacts. | Validator |
| `documentation-report.md` | Outcome, files changed, context or decisions updated, verification, and follow-ups. | Documentation |
| `planning-handoff.md` | Structured handoff from orchestrator to task-planner for non-trivial work. Written directly by orchestrator using a narrow edit exception. Contains the 10 handoff fields. | Orchestrator |
| `agy-handoff.md` | Full bounded context handoff from implementer to agy for implementation delegation. Written by implementer before agy invocation. | Implementer |

`planning-handoff.md` and `agy-handoff.md` are handoff artifacts, distinct from formal reports. They may appear alongside other task artifacts but are not required for every task.

The `## Execution` section in `task-spec.md` drives the agent pipeline: test-writer, implementer, and/or documentation, in that order. The orchestrator reads this section, spawns agents sequentially, and always runs the validator last.

## Project Context

`.ai/context.md` captures durable project truth that persists across tasks and sessions. It stores shared language, architecture facts, conventions, test framework, stable decisions, and workflow flags. The orchestrator checks for it on first interaction; if missing, delegates to the init agent. Specialist agents read it using the `read` tool before acting.

## Common Routes

### Ask a Question, Tiny Edit

These are unchanged from the current workflow: direct answer for questions, executor for exact mechanical edits.

### Substantial Feature or Fix

The orchestrator applies docs-first routing: if durable/cross-cutting context is needed, routes to documentation first. For non-trivial work, the orchestrator then writes a `planning-handoff.md` artifact directly with the structured handoff, using its narrow `.ai/tasks/**/planning-handoff.md` edit permission. After the handoff is materialized, routes to task-planner with the handoff file path for a task spec. After user approval, reads the spec's `## Execution` section, spawns agents sequentially (implementer, validator), and summarises the outcome.

### Research-Backed Change

The orchestrator routes to research first, then applies the substantial feature or fix route with the research findings as source context.

### Documentation Task, Commit/Push

These routes are unchanged.

## Rich Handoff Concept

When delegating non-trivial work to the task-planner, the orchestrator provides a **rich structured handoff** that preserves conversation-derived context. This prevents context loss in the orchestrator→task-planner delegation.

The handoff fields are: User Intent, Conversation-Derived Context, Source Artifacts / Source Context, Proposed Task Shape, Assigned Output Path(s), Scope and Non-Goals, Constraints, Acceptance Signals, Authority Boundary, Open Questions / Stop Conditions. Each field is filled; empty fields use "None."

**Materialization**: For non-trivial work, the structured handoff is materialized as a `planning-handoff.md` file in the task directory. The orchestrator writes the file directly using a narrow `.ai/tasks/**/planning-handoff.md` edit permission. The task-planner then reads this artifact as canonical source context.

Detailed field definitions and mechanics live in the orchestrator and task-planner agent prompts. The orchestrator owns composing the handoff for every non-trivial planning invocation.

For implementer-to-agy delegation, see [Configuration > Agy Integration](configuration.md#agy-integration).

## Decomposition Ownership

The orchestrator owns single-unit vs multi-unit classification and high-level decomposition. The task-planner formalizes from the orchestrator's handoff. Task-planner performs self-directed decomposition only as a fallback when the orchestrator has not provided a unit split.

## Planning Mechanics (Owned by Task-Planner)

Detailed task artifact mechanics — path allocation (computing the next `<NNN>`), parent/child manifest format, required spec sections, self-directed fallback decomposition, and planning-blocked behavior — are owned by the task-planner agent. See `workflow/agents/task-planner.md` for the full specification.
