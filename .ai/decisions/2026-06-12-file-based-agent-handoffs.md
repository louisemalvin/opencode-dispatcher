# Decision: File-Based Agent Handoffs

**Status:** Approved by user in conversation on 2026-06-12.

## Context

The implementer agent delegates bounded implementation work to `agy` (an exact implementation backend / quota-splitting replacement). Historically this handoff was done via chat prompts and command-line arguments only. This led to two problems:

1. **Fragile, non-auditable delegation.** Context lived ephemerally in the Task tool prompt or CLI arguments with no durable record of what was handed off.
2. **Vague agy prompts.** The existing `--skip-permissions` mode (necessary because a subagent cannot interactively approve agy permission prompts) passed too little context, making agy's behavior underspecified.

The `--skip-permissions` mode itself is not the root problem — it is correct for bounded, pre-approved work. The problem is the *lack of a bounded, inspectable handoff document*.

Separately, the orchestrator-to-task-planner handoff also relied solely on prompt text, losing planning context when prompts are regenerated or replayed.

## Decision

Adopt auditable **markdown handoff files** as the mechanism for non-trivial agent-to-agent delegation:

- **Implementer → agy:** The implementer writes a markdown handoff file containing the implementer persona, task spec, relevant file/read instructions, the orchestrator command that spawned the work, report path, verification commands, constraints/non-goals, and stop conditions. agy is invoked with a short command pointing at this single handoff file.
- **Orchestrator → Task-Planner:** Substantial planning handoff context is persisted as a markdown artifact that the task-planner reads, rather than existing only in the Task tool prompt. The orchestrator writes this artifact directly.

Chat/CLI-only prompts remain acceptable for trivial, single-step handoffs where the full context fits in a few lines. The decision is to *prefer* file-based handoffs when context is non-trivial.

## Consequences

- **Handoff files become task artifacts.** They are stored under `.ai/tasks/<NNN>-<task-id>/` (or equivalent) and serve as an auditable record of what was delegated.
- **No secrets or unrelated payloads.** Handoff files must contain only the information needed for the bounded task; they are not dumping grounds.
- **Validated and inspectable.** Handoff files are written before the subagent is invoked, so the delegating agent and (in future) automated validation can inspect them for completeness.
- **Subagents still verify outputs.** The handoff file does not replace output verification; the delegating agent still checks results against the spec.
- **Skip-permissions mode stays.** agy's `--skip-permissions` mode remains intentional when work is bounded by an approved handoff file; the fix is the handoff file itself, not the removal of the flag.
- **Orchestrator writes planning handoffs directly.** The orchestrator has narrowly scoped permission to write `.ai/tasks/**/planning-handoff.md` artifacts. This is a narrow exception to the no-source-edit boundary — not permission to edit source code, documentation, specs, reports, or arbitrary task artifacts. The documentation agent is not part of the normal planning-handoff materialization path.
- **Implementation details (exact permission pattern and prompt changes) remain for task spec.** The precise scoping of the orchestrator's write access (file glob, tool configuration) is a follow-up implementation concern, not a decision reopened here.

## Open Implementation Details

(To be resolved by task spec.)

1. **File naming and location** — e.g., `.ai/tasks/<id>/handoff.md`, `.ai/tasks/<id>/plan.md`.
2. **Handoff file schema** — required sections (persona, task, files, command, report path, verification, constraints, stop conditions).
3. **agy invocation convention** — exact CLI flag or convention for pointing at the handoff file.
4. **Validation** — `npm run check` or a new check to validate handoff file structure.
5. **Docs updates** — workflow docs in `docs/` or inline agent prompts to describe the new handoff protocol.
