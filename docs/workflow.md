# Workflow

This document describes the internal mechanics of the OpenCode Dispatcher workflow: how the orchestrator routes requests, how task artifacts are laid out, and how the task-planner decomposes complex work.

For a complete agent reference, see [docs/agents.md](agents.md).

## Orchestrator State Machine

The orchestrator operates as a six-state state machine. Not every request passes through every state — the orchestrator always chooses the smallest safe workflow for the task.

- **INTAKE**: Classify the incoming request. Determine whether it is a question, idea exploration, simple edit, non-trivial implementation, research-backed decision, documentation task, validation or review, or a commit/push request.
- **CLARIFY**: Talk with the user until the request is solid enough to route. A request is solid when the desired outcome, affected files, rough scope, important non-goals, risk level, and expected verification are all understood. The orchestrator asks one focused question only when the missing answer would change scope, safety, or routing.
- **ROUTE**: Choose the smallest safe path. The orchestrator decides which agent or direct answer best fits the request (see Routing Logic below).
- **DELEGATE**: Dispatch the work to the appropriate specialist agent. After the subagent completes, control always returns to the orchestrator.
- **REVIEW**: After non-trivial implementation or documentation work, validate the result against the task spec. If validation fails, allow one fix cycle. If issues remain, escalate to the user.
- **DONE**: Summarise the outcome, changed files or artifacts, verification results, and any open issues.

## Routing Logic

The orchestrator selects the smallest safe workflow based on the nature of the request:

- **Direct answer** — When no file changes are needed. Used for explanations, reviews, comparisons, and planning advice.
- **Executor (fast path)** — When the requested edit is exact, mechanical, low-risk, and does not need task planning or acceptance criteria. If the edit turns out to need multiple files, a new pattern, a dependency, or an architecture decision, the orchestrator escalates to the full task workflow.
- **Task-planner** — When the work is behaviour-changing, risky, unclear, needs acceptance criteria, or benefits from a written plan before implementation. This is the main route for substantial development work.
- **Research** — When a decision depends on external facts such as official documentation, vendor behaviour, pricing, APIs, or current best practices. Research findings feed back into the orchestrator, which may then route to the task-planner.
- **Shipper** — Only for explicit git commit or push requests after the intended file changes already exist. Never used automatically.
- **Documentation** — When the task involves README updates, project context updates, decision notes, changelog entries, or documentation reports. Typically reached through the task-planner.
- **Model-config** — When the user wants to configure per-agent models for this project.

The "smallest safe workflow" principle means the orchestrator will answer directly or use the fast path whenever the request does not benefit from formal task artifacts, and will escalate to the full task workflow only when safety, complexity, or clarity demand it.

## Task Artifact Layout

Dispatcher stores durable task state under `.ai/tasks/`. Each task gets a zero-padded numeric prefix and a short slug:

```text
.ai/tasks/<NNN>-<task-id>/
    task-spec.md
    implementation-report.md
    validation-report.md
    documentation-report.md
```

| File | Purpose | Written by |
|------|---------|-----------|
| `task-spec.md` | Approved scope, acceptance criteria, constraints, relevant files, and validation plan. Includes an `## Execution` section listing the agent pipeline. | Task-planner |
| `implementation-report.md` | What files were changed, what approach was taken, and any open questions. | Implementer |
| `validation-report.md` | Verification results against the task spec's acceptance criteria. | Validator |
| `documentation-report.md` | Outcome, files changed, context or decisions updated, verification, and follow-ups. | Documentation |

The `## Execution` section in `task-spec.md` drives the agent pipeline: test-writer, implementer, and/or documentation, in that order. The orchestrator reads this section, spawns agents sequentially, and always runs the validator last.

## Project Context

`.ai/context.md` captures durable project truth that persists across tasks and sessions. It stores:

- Shared language, architecture facts, and conventions (naming, styling, file layout, test setup)
- Test framework, runner command, and test file patterns
- Project-specific rules and constraints
- Stable decisions relevant to the project
- Workflow flags (e.g., `agy: enabled`)

The orchestrator checks for `.ai/context.md` on first interaction with a project by using the `read` tool directly on the path (an error means the file does not exist). If it is missing, the orchestrator delegates to the init agent to interview the user and create it before routing non-trivial work. Specialist agents (task-planner, implementer, validator) read `.ai/context.md` using the `read` tool before acting — `glob` must not be used for `.ai/` paths because it does not match dot-directories reliably.

## Common Routes

### Ask a Question

The user asks a question (explanation, review, comparison, planning advice). The orchestrator answers directly with no file changes, no agent delegation, and no task artifacts. This is the simplest route.

### Tiny Edit

The user requests an exact, mechanical, low-risk edit (for example, "Change the button label from 'Submit' to 'Save'"). The orchestrator routes to the **executor**, which performs the edit directly. The executor reports back, and the orchestrator summarises the result. No task spec or validation report is created.

### Substantial Feature or Fix

The user describes a feature or fix that changes behaviour, is risky, or would benefit from a written plan. The orchestrator routes to the **task-planner**, which creates a `task-spec.md`. The orchestrator presents the spec for user approval. After approval, the orchestrator reads the spec's `## Execution` section and spawns the listed agents — typically the **implementer** first, then the **validator**. The implementer writes `implementation-report.md`, the validator writes `validation-report.md`, and the orchestrator summarises the outcome.

### Test-First Feature

Similar to the substantial feature route, but the task spec's `## Execution` section lists **test-writer** before **implementer**. The test writer creates test files from the task spec's testable acceptance criteria. The implementer then implements against those tests. The **validator** runs last.

### Research-Backed Change

The user requests a change that depends on external facts. The orchestrator first routes to the **research** agent, which gathers source-backed evidence (documentation, vendor behaviour, pricing, best practices). Research findings are reported back to the orchestrator, which then routes to the **task-planner** for a spec, followed by **implementer** and **validator**.

### Documentation Task

The user requests substantial documentation work (README updates, project context updates, decision notes, changelog entries, or documentation reports). The orchestrator routes to the **task-planner** for a spec. After approval, the spec's `## Execution` section lists the **documentation** agent. The documentation agent writes `documentation-report.md`. The **validator** runs last, verifying the documentation matches the spec.

### Commit or Push

The user explicitly requests a git commit or push. The orchestrator routes to the **shipper** only when the intended file changes already exist. The shipper handles the git operations and reports back. This route is never selected automatically.

## Single-Unit vs Multi-Unit Decomposition

The task-planner assesses whether work is single-unit or multi-unit on every invocation:

- **Single-unit**: A focused change that touches a small set of related files. The task-planner writes a single `task-spec.md` with a straightforward `## Execution` pipeline.
- **Multi-unit**: A complex request spanning multiple unrelated modules, independent deliverables, or phases. The task-planner decomposes the work into discrete units, detecting file conflicts (two units touching the same file cannot run in parallel) and true dependencies (unit Y needs unit X's output before starting). It presents a unit table to the user for approval:

```
| # | Unit      | Delivers             | Depends on | Parallel with |
|---|-----------|----------------------|------------|---------------|
| 1 | slug-name | one-line deliverable | —          | 2             |
| 2 | slug-name | one-line deliverable | —          | 1             |
```

After user approval, the task-planner writes a parent manifest at `.ai/tasks/<NNN>-<task-id>/task-spec.md` containing the unit table and execution order, then creates one child `task-spec.md` per unit under numeric-prefixed subdirectories:

```text
.ai/tasks/<NNN>-<task-id>/
    task-spec.md              ← parent manifest (unit table + execution order)
    01-unitslug/
        task-spec.md
    02-unitslug/
        task-spec.md
```

Multi-unit decomposition requires explicit user approval before child specs are created. The orchestrator does not auto-proceed into multi-unit execution without that approval.
