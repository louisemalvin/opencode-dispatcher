# Unit 3: docs/agents.md

## Scope

Create `docs/agents.md` as the subagent reference and permission philosophy document.

### Part 1: Agent Reference

List all 11 agents with their role, mode (primary/subagent), and a concise description. Use a table:

| Agent | Mode | Role Summary |
|---|---|---|
| Orchestrator | primary | User-facing coordinator and state-machine router |
| Executor | subagent | Simple single-file atomic edits, no task spec |
| Task Planner | subagent | Creates auditable task specs, decomposes multi-unit work |
| Implementer | subagent | Edits source code per approved task spec |
| Validator | subagent | Checks completed work against task spec, runs tests |
| Test Writer | subagent | Writes tests from testable acceptance criteria |
| Documentation | subagent | Writes docs, context, decision artifacts, doc reports |
| Research | subagent | Gathers external facts and source-backed evidence |
| Shipper | subagent | Git commit and push, only when explicitly requested |
| Init | subagent | Bootstraps `.ai/context.md` for new projects |
| Model Config | subagent | Assigns models to agents in project config |

### Part 2: Permission Philosophy

Explain the permission model:

- **Deny-by-default**: agents only get permissions they need. The orchestrator has `edit: deny` and a tight bash whitelist of read-only commands. The implementer can edit source code but cannot edit `.ai/tasks/`, `.ai/context.md`, or `.ai/decisions/`. The shipper can only run specific git commands.
- **Role boundaries**: each agent owns a specific layer — planning, implementation, validation, documentation. No agent is allowed to cross roles (e.g., implementer doesn't write tests, validator doesn't fix issues).
- **Escape hatch sealing**: `edit: deny` on orchestrator, coupled with read-only bash whitelist, prevents shell-based file writes. Subagents with `bash: allow` have edit scoped to their role.
- **Practical allowances**: implementer and validator have broad `bash: allow` to run dev commands (test, build) without excessive prompts, but their `edit` scopes prevent them from touching `.ai/` artifacts.
- **Task gating**: the orchestrator has task delegation explicitly scoped to named agents; no wildcard task permission.

### Source material

- README `## What Dispatcher Changes` (agent overview table)
- README `## Security & Permissions` section
- README `## Workflow Layers` (all agent role descriptions)
- Each agent's frontmatter YAML in `workflow/agents/*.md` (permission blocks)
- Each agent's persona description (first few lines of the body)

## Execution

- `documentation`

## Non-Goals

- Do not create or edit any files other than `docs/agents.md` and this unit's `documentation-report.md`.
- Do not duplicate workflow routing logic (that goes in `docs/workflow.md`). Reference it when needed.
- Do not cover configuration, model assignment, agy, or install locations (those go in `docs/configuration.md`).
- Do not cover development workflow or release processes (those go in `docs/development.md`).
- Do not change any agent definitions or permissions.

## Testable Acceptance Criteria

None. Documentation-only.

## Inspectable Acceptance Criteria

1. `docs/agents.md` exists.
2. All 11 agents are listed in the reference table with accurate mode (primary vs subagent) and a short role summary.
3. Permission philosophy section explains deny-by-default, role boundaries, escape hatch sealing, practical allowances (implementer/validator bash), and task gating.
4. Permission descriptions are accurate — each claim about an agent's permissions can be verified against the agent's YAML frontmatter.
5. The orchestrator's `edit: deny` + read-only bash whitelist is described accurately.
6. The implementer's edit scope (can edit source, cannot edit `.ai/tasks/`, `.ai/context.md`, `.ai/decisions/`) is described accurately.
7. The shipper's git-only permissions and strict bash whitelist are described accurately.
8. Links to `docs/workflow.md` are included where relevant.
9. No configuration, development, or workflow content bleeds in beyond what's needed to explain permissions.

## Relevant Files

- `README.md` (sections: What Dispatcher Changes, Workflow Layers, Security & Permissions)
- `workflow/agents/orchestrator.md`
- `workflow/agents/executor.md`
- `workflow/agents/task-planner.md`
- `workflow/agents/implementer.md`
- `workflow/agents/validator.md`
- `workflow/agents/test-writer.md`
- `workflow/agents/documentation.md`
- `workflow/agents/research.md`
- `workflow/agents/shipper.md`
- `workflow/agents/init.md`
- `workflow/agents/model-config.md`
