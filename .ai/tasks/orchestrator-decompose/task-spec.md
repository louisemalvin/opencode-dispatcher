# Task Spec: Upgrade Orchestrator with Work Decomposition and Batching

## Scope

- Add a "Decomposition and batching" section to `workflow/agents/orchestrator.md`, inserted between the existing "Core routing" section and "Clarification and routing rules" section.
- Define rules for when the orchestrator should decompose a complex user vision into discrete work units vs. when it should route a single atomic task directly.
- Define rules for identifying dependencies between work units, detecting file-based conflicts that prevent parallel execution, and presenting a decomposed execution plan as a table/overview to the user for approval before spawning anything.
- Define rules for batching: launching independent units in parallel within each phase (all task-planners at once → all implementers at once → all validators at once).
- Define rules for state tracking across multiple task chains using natural `.ai/tasks/` artifact existence checks (task-spec.md, implementation-report.md, validation-report.md) to determine which chains are done, in progress, or blocked.
- Add multi-unit parallel delegation workflow examples to the "Delegation workflow examples" section, showing the full decompose → plan → parallel execute pattern.
- Ensure the orchestrator continues to delegate per-unit detailed spec writing to task-planner (it identifies high-level unit names and dependencies, not detailed specs).

## Non-Goals

- Do NOT create new agent definitions (e.g., test-writer — this is future work).
- Do NOT modify any other agent files (`workflow/agents/task-planner.md`, `workflow/agents/implementer.md`, etc.).
- Do NOT change the artifact source-of-truth rules.
- Do NOT modify `bin/install.js`, `README.md`, `workflow/AGENTS.md`, `.ai/context.md`, or `/ai-init`.
- Do NOT add new subagent types to the permission block.

## Acceptance Criteria

- `workflow/agents/orchestrator.md` contains a new section titled "Decomposition and batching" (or equivalent) placed between "Core routing" and "Clarification and routing rules".
- The new section includes clear rules for:
  - When to decompose a complex vision into work units vs. when to route a single atomic task directly (e.g., multi-step user vision, batch of loosely related changes, user says "implement this" after a long requirements dump).
  - How to present the decomposed plan to the user: a table/overview of units with names, dependencies, and an execution order, plus a prompt for user approval before spawning.
  - How to batch independent units: all unit task-planners run in parallel in the planning phase, all implementers run in parallel in the implementation phase, all validators run in parallel in the validation phase.
  - How to track state across multiple task chains: check `.ai/tasks/<unit-id>/task-spec.md`, `implementation-report.md`, and `validation-report.md` existence to determine done/in-progress/blocked status.
  - Conflict detection: if two units touch the same file, they are not independent and must be serialized (or merged into one unit).
- The "Delegation workflow examples" section includes at least one new example showing a multi-unit parallel decomposition flow (decompose → present plan → parallel task-planners → parallel implementers → parallel validators → synthesize).
- All existing behavior remains intact: simple single-task routing, clarification rules, direct work boundaries, permission block, YAML frontmatter, mode, description, final output style, and existing delegation examples are preserved without modification.
- The orchestrator still delegates exactly the same number of times per unit to each subagent — the only difference is it can now spawn multiple subagents in parallel when units are independent.

## Constraints

- Only edit `workflow/agents/orchestrator.md`.
- Preserve all existing permission rules, mode, description, and YAML frontmatter structure exactly as-is.
- Do not add new subagent types to the permission block.
- Match the existing tone, style, and level of detail of the orchestrator definition.
- Use the same markdown section heading convention (`## Section name`) as the existing document.

## Relevant Files

- `workflow/agents/orchestrator.md` — the only file to be modified.

## Validation Plan

- Verify `workflow/agents/orchestrator.md` still exists and its YAML frontmatter (lines 1–14) is byte-for-byte identical.
- Verify the following existing sections are present and unchanged: "Artifact source-of-truth rules", "Core routing", "Clarification and routing rules", "Direct work rules", "Delegation workflow examples", "Final output style".
- Verify a new "Decomposition and batching" section exists between "Core routing" and "Clarification and routing rules" with the content rules described in Acceptance Criteria.
- Verify the "Delegation workflow examples" section includes at least one multi-unit parallel decomposition example.
- Verify no other files in the repository were modified (`git diff --name-only` shows only `workflow/agents/orchestrator.md`).
- Verify the permission block still lists the same 6 allowed subagents: task-planner, implementer, documentation, validator, research, shipper.
- Read-test the full orchestrator definition to confirm it reads coherently as a single agent prompt, with no contradictions between the new decomposition rules and the existing single-task routing rules.

## Open Questions

- None currently. Scope and constraints are well-defined from the provided brief.
