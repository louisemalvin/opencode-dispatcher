---
name: task-artifact-workflow
description: Use when coordinating non-trivial OpenCode work through project .ai/ artifacts, task specs, implementation reports, documentation reports, validation reports, /ai-init, or custom task-based agents.
---

# Task Artifact Workflow

Use this skill for non-trivial work that should not depend on chat-only memory. Also use it when the user asks to initialize `.ai/`, create or implement an approved task spec, validate completed task work, or write task-scoped reports. The workflow creates file-based artifacts under the current project's `.ai/` directory and routes work through custom task agents.

## Artifact roles

- Global `AGENTS.md`: how agents behave across projects.
- Project `.ai/context.md`: what is true about this project: shared language, architecture facts, constraints, conventions, and durable decisions.
- `.ai/tasks/<task-id>/task-spec.md`: what is true for one task: scope, non-goals, acceptance criteria, constraints, relevant files, and validation plan.
- `.ai/tasks/<task-id>/implementation-report.md`: what implementer changed and how it was verified.
- `.ai/tasks/<task-id>/documentation-report.md`: what documentation/context/decision artifacts changed and why.
- `.ai/tasks/<task-id>/validation-report.md`: validator's check against the task spec.
- `.ai/decisions/`: durable project decision notes.
- `.ai/research/`: optional research artifacts when explicitly requested.

## Initialize a project

When the user runs `/ai-init`, create only missing files and preserve existing content:

```text
.ai/context.md
.ai/templates/task-spec.md
.ai/templates/implementation-report.md
.ai/templates/documentation-report.md
.ai/templates/validation-report.md
.ai/tasks/README.md
.ai/decisions/README.md
.ai/research/README.md
```

Use project-local task artifact templates from `.ai/templates/` when creating task specs or reports. Do not use global templates under `~/.config/opencode/templates/`; reading templates from the workspace avoids cross-boundary permission prompts.

During `/ai-init`, also capture test-specific project information by asking the user:

1. What test framework does the project use? (e.g., pytest, jest, vitest, go test)
2. What is the test runner command? (e.g., `npm test`, `pytest`, `cargo test`)
3. Where do test files live? (e.g., `tests/`, `__tests__/`, alongside source)

Record the answers in `.ai/context.md` under a `## Test Setup` section:

```markdown
## Test Setup
- Framework: <user answer>
- Runner: `<user answer>`
- Test file convention: `<user answer>`
```

Suggested initial file contents should be concise headings, not project facts invented by the agent.

## Routing pattern

1. Orchestrator clarifies the request and inspects existing context.
2. Research gathers external/source-backed facts when needed.
3. Task-planner creates `.ai/tasks/<task-id>/task-spec.md` for non-trivial work.
4. Implementer changes implementation files and writes `implementation-report.md`.
5. Documentation updates docs/context/decision artifacts and writes `documentation-report.md` when delegated.
6. Validator checks results against the task spec and writes `validation-report.md`.
7. Shipper commits/pushes only when explicitly requested.

## Rules

- Do not rely on chat-only plans for substantial implementation or documentation.
- Do not use OpenCode's default build or plan agents for this custom workflow.
- Keep task specs auditable: explicit scope, non-goals, acceptance criteria, constraints, and validation steps.
- Keep reports factual and tied to files changed or checks run.
- Preserve existing `.ai/` content; append or create new task folders rather than overwriting unrelated artifacts.
