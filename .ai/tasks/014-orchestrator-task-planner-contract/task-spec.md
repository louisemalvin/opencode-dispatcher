## Source Artifacts / Handoff Context

This task was requested by the user after a detailed discussion about the orchestrator→task-planner workflow gap. The user's core concern is **context loss**: orchestrator currently discusses many details with the user, then compresses that into a brief summary when delegating to task-planner. Task-planner may then produce overconfident or under-contextualized specs because it lacks the full conversation-derived nuance.

Key user directives preserved in this spec:
- Orchestrator should own conversation-context preservation and high-level task split/decomposition.
- Task-planner should formalize the plan into task artifacts from a rich handoff; it should not have to infer missing nuance from a thin summary.
- For multi-unit work, orchestrator should be able to split the work into units and spawn multiple task-planner agents in parallel for speed.
- If task-planner receives a rich structured handoff and one assigned unit, task-planner can run on a lower/mid model; the frontier model can be concentrated on orchestrator.
- Do NOT require model config changes as part of this task; document that lower/mid task-planner models become safer after the handoff contract exists.
- The biggest gap is not "durable artifacts before UX/product work" — it is the lossy orchestrator-to-task-planner delegation itself.
- Do NOT over-scope into generic durable artifact creation for every request. The primary goal is the delegation contract.

## Scope

Update the orchestrator and task-planner agent prompts and supporting documentation so that:

1. **Orchestrator prompt** (`workflow/agents/orchestrator.md`):
   - Explicitly forbids delegating non-trivial planning to task-planner using only a brief summary.
   - Contains a required structured handoff template that orchestrator must fill out for non-trivial work.
   - States orchestrator owns high-level single-unit vs multi-unit classification and multi-unit decomposition (unit boundaries, dependencies, parallelizability, assigned output paths).
   - States orchestrator must preserve conversation-derived context in the handoff (user preferences, corrections, rejected options, rationale, chat-only vs durable-file context).
   - Adds a multi-unit parallel planning flow: orchestrator first spawns one task-planner to create the parent manifest + directory structure, then spawns parallel task-planners (one per parallelizable unit) each writing to an assigned child subdirectory.
   - Adds a path allocation procedure: orchestrator determines the next `.ai/tasks/<NNN>-<task-id>` number (by listing `.ai/tasks/`), then assigns child unit subdirectory paths before spawning planners.
   - Documents that the orchestrator cannot edit files and must delegate manifest creation to task-planner.

2. **Task-planner prompt** (`workflow/agents/task-planner.md`):
   - Accepts an orchestrator-assigned output path (for single-unit or per-unit planning). When an assigned path is provided, uses it exactly — does **not** compute the next `<NNN>` itself.
   - When assigned a single unit (child of multi-unit decomposition): writes only that unit's `task-spec.md` and does **not** re-decompose the full request into new units unless the unit boundary is provably unsafe or impossible.
   - Returns a **planning-blocked** report (not a spec) when non-trivial work is delegated with a too-thin handoff — specifically when the delegation lacks enough context to create an accurate spec without inventing strategic, product, architecture, domain, security, or business decisions.
   - Constrains decision-making authority: implementation-local decisions (patterns, file placement, naming within conventions) are allowed. Strategic, product, architecture, domain, security, and business decisions must come from the handoff, source artifacts, or be reported as blockers.
   - Does not silently change user intent or invent missing requirements.
   - Reads any cited source artifacts / handoff context before planning. When handoff references durable artifacts (`.ai/context.md`, existing task specs, ADRs, source files), reads those as canonical truth.
   - For multi-unit decomposition owned by orchestrator: task-planner only performs decomposition when orchestrator has NOT already provided a unit split. If orchestrator provides a unit split, task-planner writes its assigned unit spec; if it finds the boundary unsafe it reports the issue rather than silently restructuring.

3. **Workflow documentation** (`docs/workflow.md`):
   - Documents the rich handoff contract between orchestrator and task-planner.
   - Documents that the orchestrator owns high-level decomposition (replacing the current description that task-planner assesses single vs multi-unit).
   - Documents the parallel task-planner planning flow and path allocation.
   - Updates the Single-Unit vs Multi-Unit Decomposition section to reflect orchestrator ownership.

4. **Agent reference documentation** (`docs/agents.md`):
   - Updates orchestrator role summary to mention context preservation, decomposition ownership, and rich handoff.
   - Updates task-planner role summary to mention formalizing from rich handoff rather than inventing decisions, and accepting assigned paths.

5. **Validation gate** (`bin/install.js` `check` command or `npm run check`):
   - Existing `npm run check` must continue to pass with the updated agent frontmatter.
   - No new mechanical checks are required unless they add clear safety value without fragility. The frontmatter validation and cross-reference check already covers agent file integrity.

## Execution

- `implementer`

## Non-Goals

- Do **not** change model assignments in `opencode.jsonc`. The architecture should allow a lower/mid task-planner model later, but that is a separate follow-up task.
- Do **not** implement parallel implementation. The parallelism being added is specifically for multiple task-planner invocations creating independent unit specs, not parallel code changes. The existing sequential implementation pipeline (implementer → validator) remains unchanged.
- Do **not** add a generic "durable artifacts before all work" requirement. The user's core point is context preservation across the orchestrator/task-planner boundary, not durable artifact creation for every request. Source artifacts may be cited as context in the handoff, but do not make this primarily about UX/product/design artifact creation.
- Do **not** rewrite the full agent system. Changes are focused on the orchestrator/task-planner handoff contract and supporting docs.
- Do **not** change the implementer, validator, or other agent prompts unless a minor cross-reference correction is needed for consistency. The user confirmed these agents work well once task-planner has a good plan.
- Do **not** add new agents, remove agents, or alter the orchestrator's `task:` permission list in its frontmatter.

## Testable Acceptance Criteria

### Test File Paths

No dedicated test files. Validation uses `npm run check` plus manual text assertions described below. Run these commands from the project root.

### Acceptance Criteria

1. **`npm run check` passes** with zero errors after all edits.
   - Command: `npm run check`

2. **Orchestrator prompt contains the required handoff prohibition language.**
   - Command: `grep -q "brief summary" workflow/agents/orchestrator.md`
   - Must find explicit language that the orchestrator must not delegate non-trivial planning using only a brief summary.

3. **Orchestrator prompt contains structured handoff fields.**
   - Command: `grep -c "User Intent" workflow/agents/orchestrator.md`
   - Must find at minimum the "User Intent" heading in the handoff template section. The section should contain several structured fields (not just one).

4. **Orchestrator prompt references path allocation for multi-unit.**
   - Command: `grep -q "assigned.*path\|path.*allocat\|allocat.*path" workflow/agents/orchestrator.md`
   - Must find language about assigning/allocating output paths for task-planner.

5. **Task-planner prompt contains assigned-path behavior.**
   - Command: `grep -q "assigned.*output path\|assigned.*path.*provided\|provided.*path" workflow/agents/task-planner.md`
   - Must find language that task-planner uses an exact assigned path when provided.

6. **Task-planner prompt contains planning-blocked behavior.**
   - Command: `grep -q "planning-blocked\|too thin\|insufficient\|not enough context" workflow/agents/task-planner.md`
   - Must find language describing when task-planner should refuse to plan with insufficient context.

7. **Task-planner prompt constrains decision authority.**
   - Command: `grep -q "must not invent\|must not change\|strategic.*decision\|authority bound" workflow/agents/task-planner.md`
   - Must find language that task-planner must not invent strategic/product/architecture/domain/security/business decisions.

8. **Docs reference the new handoff contract.**
   - Command: `grep -q "handoff\|handoff contract\|rich.*handoff" docs/workflow.md`
   - Must find documentation of the orchestrator/task-planner handoff.

9. **Docs reference parallel task-planner planning.**
   - Command: `grep -q "parallel.*task-planner\|parallel.*planning" docs/workflow.md`
   - Must find documentation of the parallel planning flow.

10. **Agent docs role summaries updated.**
    - Command: `grep -q "context\|decomposition\|handoff" docs/agents.md`
    - Must find updated role descriptions in the agent reference table or nearby text that mention the new responsibilities.

## Inspectable Acceptance Criteria

### Orchestrator Prompt

- The handoff template includes at minimum these structured fields (not necessarily with these exact names, but covering these concepts):
  - User intent / what the user asked for
  - Conversation-derived context (preferences, corrections, rejected ideas, rationale, chat-vs-file provenance)
  - Source artifacts / source context (`.ai/context.md`, existing docs, task specs, ADRs, relevant source files — with explicit note when context is chat-only)
  - Proposed task shape (single/multi-unit, unit list/descriptions if multi)
  - Assigned output path(s)
  - Scope and non-goals
  - Constraints (technical, project, style, architecture, safety)
  - Acceptance signals (observable outcomes, criteria seeds)
  - Authority boundary (what task-planner may decide vs must not invent/change)
  - Open questions / stop conditions (unknowns task-planner must not invent)

- The DELEGATE section (or a new section) explicitly states: for non-trivial work, orchestrator must provide the structured handoff to task-planner; a brief summary is not sufficient and risks context loss.

- The orchestrator prompt explicitly states it owns the single-unit vs multi-unit classification and unit decomposition; task-planner formalizes from the handoff.

- For multi-unit work: orchestrator describes the flow:
  1. Clarify and decompose into units (with user approval if needed).
  2. Allocate parent task number and child paths by listing `.ai/tasks/`.
  3. Spawn one task-planner to create the parent manifest and directory structure, providing the unit table and assigned paths.
  4. Spawn task-planners in parallel for units that can be planned independently (no file-conflict or dependency constraints on planning).
  5. Each child task-planner receives: assigned output path, parent manifest path, unit-specific scope from the handoff, and full shared handoff context.

- Path allocation instruction: orchestrator must run `ls .ai/tasks/` (or use `read` on `.ai/tasks/`) to find the next zero-padded number, then assign paths like `.ai/tasks/<NNN>-<task-id>/<NN>-unitslug/task-spec.md`. The allocated number must not conflict with existing directories.

### Task-Planner Prompt

- The first instruction (or near-first instruction) says: if an assigned output path is provided by the orchestrator, use it exactly; do **not** compute the next `<NNN>` yourself. The path computation step (`list existing .ai/tasks/ directories...`) only applies when no path is assigned.

- The multi-unit section distinguishes between two modes:
  - **Orchestrator-assigned unit**: task-planner receives a single unit scope and an assigned child path. It writes only that unit's `task-spec.md`. It does NOT present a unit table or decompose further. If the unit boundary is provably unsafe or impossible, it reports a planning-blocked issue.
  - **Self-directed decomposition** (fallback): task-planner receives a complex undivided request from orchestrator (no assigned unit). It assesses single vs multi-unit, decomposes if needed, presents unit table for user approval, and creates all specs. This matches the current behavior but should be the secondary path, not the only one.

- A "planning-blocked" section or rule: when the handoff is too thin to create an accurate spec without inventing strategic, product, architecture, domain, security, or business decisions, task-planner stops and returns a planning-blocked report describing what context or decisions are missing. It must not fill gaps by guessing.

- Decision authority is explicitly constrained:
  - Allowed: implementation-local decisions (which patterns to use within project conventions, where to place new files within existing layout, naming within conventions, `## Execution` pipeline agent list).
  - Must-not-invent: strategic direction, product behavior, architecture changes, domain logic, security properties, business rules. If these are not provided by handoff or source artifacts, report as blockers.
  - When the handoff explicitly delegates a decision to task-planner (e.g., "choose between X and Y"), that is acceptable.

- The Relevant Files discovery step reads candidate files named in the handoff. If the handoff cites source artifacts (`.ai/context.md`, existing task specs, etc.), reads those as canonical truth before making decisions.

### Documentation

- `docs/workflow.md`:
  - A new or updated section describes the rich handoff contract and links it to the orchestrator and task-planner roles.
  - The "Single-Unit vs Multi-Unit Decomposition" section reflects that the orchestrator owns the decomposition decision and task-planner formalizes from the handoff.
  - A section (or subsection) documents the parallel task-planner planning flow: manifest creation, path allocation, parallel spec generation, and the orchestrator's role in path allocation.
  - No stale text remains claiming that task-planner alone assesses single vs multi-unit as the primary path (it may still be mentioned as a fallback when orchestrator does not provide a unit split, but the primary path is orchestrator-owned).

- `docs/agents.md`:
  - Orchestrator's role summary in the table (or nearby description) reflects it owns conversation context, decomposition, and the rich handoff to task-planner.
  - Task-planner's role summary reflects it formalizes from a rich handoff, writes specs, and does not invent missing strategic decisions.
  - No stale language contradicts the new contract (e.g., task-planner "decomposes multi-unit work" should be qualified to acknowledge it does so when orchestrator has not already decomposed).

## Relevant Files

- `workflow/agents/orchestrator.md` — primary: rich handoff contract, orchestrator-owned decomposition, assigned paths, parallel task-planner planning rules.
- `workflow/agents/task-planner.md` — primary: accept assigned path, planning-blocked behavior, constrained decision authority, single-unit-on-assignment behavior.
- `docs/workflow.md` — document new handoff contract, orchestrator-owned decomposition, parallel planning flow.
- `docs/agents.md` — update role summaries to reflect new contract.
- `.ai/context.md` — read for project conventions before editing.
- `bin/install.js` — read for understanding `npm run check` validation; no changes needed unless the frontmatter formats change (they should not).
- `opencode.jsonc` — read for context on model assignments; no changes required.

## Validation Plan

1. Run `npm run check` and confirm zero errors (covers frontmatter integrity and orchestrator cross-references).
2. Run each grep-based acceptance criterion command from `### Acceptance Criteria` above and confirm non-zero matches.
3. Manually inspect each changed file for the inspectable criteria:
   - `workflow/agents/orchestrator.md`: handoff template completeness, delegation rules, decomposition ownership, path allocation, parallel planning flow.
   - `workflow/agents/task-planner.md`: assigned path behavior, planning-blocked rules, decision authority constraints, per-unit planning behavior.
   - `docs/workflow.md`: handoff contract documentation, orchestrator-owned decomposition, parallel planning flow documentation, no stale contradictions.
   - `docs/agents.md`: updated role summaries, no stale contradictions.

## Open Questions

- None. All decisions needed for implementation are specified above. The user's core concern (context loss in orchestrator→task-planner delegation) is directly addressed by the handoff contract and constrained task-planner behavior described in this spec.
