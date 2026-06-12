## Source Artifacts / Handoff Context

The user identified that `workflow/agents/orchestrator.md` became too long and now duplicates task-planner responsibilities after task 014. The current 213-line orchestrator prompt contains detailed field-by-field handoff templates, exact path algorithm detail, parent/child manifest mechanics, and multi-unit parallel planning flow steps that belong in task-planner. The user also identified a gap: there is no "docs-first routing" rule — when correctness depends on cross-cutting/reusable context (UX, product, domain, architecture), the orchestrator should route to documentation before task-planner so task-planner has an approved source artifact to cite.

Target responsibility split:
- **Orchestrator** = conversation/context router, high-level decomposition coordinator, user-facing owner. Concise rules, no detailed spec format mechanics.
- **Documentation** = durable source artifact author for reusable/cross-cutting context. Reports when user approval is needed before task-planning.
- **Task-planner** = task artifact author and planning mechanics owner. Owns detailed path behavior, parent/child manifests, self-directed fallback, required spec sections.
- **Implementer** = executes approved task specs (no changes in this task).
- **Validator** = checks task spec plus cited source artifacts (expanded from current "against task spec").

## Scope

1. **Slim `workflow/agents/orchestrator.md`**:
   - Remove or greatly compress: long field-by-field handoff field definitions, exact Path Allocation Procedure with per-step detail, parent/child manifest mechanics, multi-unit parallel planning flow step-by-step breakdown, execution pipeline field explanation detail.
   - Keep concise rules: no brief summary for non-trivial task-planner handoff; use structured handoff checklist; orchestrator owns route and high-level decomposition; use docs-first routing when durable context is needed; assign non-conflicting paths when parallel planners are used; run execution pipeline after task specs.
   - Must not be a giant policy document. Target: significantly shorter, focused on routing and coordination.

2. **Add docs-first routing in orchestrator**:
   - If correctness depends on cross-cutting/reusable context not already captured, route to documentation before task-planner.
   - Examples of triggering context: UX/design intent, product behavior, interaction model, information architecture, domain/business rules, architecture decisions, API/data contracts, security/privacy requirements, integration behavior, operational rules, testing strategy, conventions.
   - Flow: chat → documentation artifact → user approval if meaningful decisions introduced → task-planner citing artifact → implementation → validation.

3. **Strengthen `workflow/agents/documentation.md`**:
   - Explicitly own durable source artifacts: UX design brief, product brief, interaction model, feature behavior spec, ADR, domain model, business rules doc, API contract, integration spec, migration plan, runbook, testing strategy, convention guide.
   - If artifact introduces meaningful decisions, report that user approval is needed before task-planning.

4. **Keep/move planning mechanics in `workflow/agents/task-planner.md`**:
   - Task-planner owns: assigned path behavior, parent manifest/child spec format, self-directed fallback, planning-blocked behavior, source artifact citation, task spec structure.
   - Ensure task spec section requirements include: Source Artifacts / Handoff Context, Scope, Execution, Non-Goals, Testable Acceptance Criteria, Inspectable Acceptance Criteria, Relevant Files, Validation Plan, Open Questions.
   - Move any detailed path allocation logic here if it currently lives in orchestrator (the NNN computation procedure already lives here; ensure orchestrator does not duplicate it).

5. **Update `workflow/agents/validator.md`**:
   - Expand validation scope: validate against task spec AND cited source artifacts / durable docs when task spec cites them.
   - Concise addition; do not inflate the validator prompt.

6. **Update docs**:
   - `docs/workflow.md`: document concise role split, docs-first routing, rich handoff (concept, not field-by-field template), and note that detailed task artifact mechanics belong to task-planner. Remove stale claims that do not match the new split. Do NOT duplicate agent prompt content at length — keep docs as a workflow reference.
   - `docs/agents.md`: update role summaries/boundaries in the Agent Reference table and Role Boundaries section to reflect the refined split (orchestrator routes/docs-first, documentation owns durable artifacts, task-planner owns planning mechanics, validator checks cited artifacts).

## Execution

- `implementer`

## Non-Goals

- Do not change model assignments.
- Do not add/remove agents.
- Do not alter orchestrator frontmatter permissions.
- Do not implement parallel implementation.
- Do not remove rich handoff concept; just make orchestrator concise and avoid duplication.
- Do not make documentation mandatory for all tasks; only when durable/cross-cutting context is needed.
- Do not change `bin/install.js` or its validation logic.
- Do not alter the `## Execution` pipeline format in task-planner.
- Do not add new permission rules to any agent.

## Testable Acceptance Criteria

### Test File Paths

No dedicated test files. Validation uses `npm run check` plus manual grep assertions described below. Run these commands from the project root.

### Acceptance Criteria

1. **`npm run check` passes** with zero errors after all edits.
   - Command: `npm run check`

2. **Orchestrator prompt is shorter and no longer contains task-planner mechanics.**
   - Command: `wc -l workflow/agents/orchestrator.md`
   - Must be noticeably shorter than the current ~213 lines (aim for significant reduction).
   - Command: `grep -c "Path.*Allocat" workflow/agents/orchestrator.md || true`
   - Must return 0 or 1 (no detailed path allocation procedure section; at most a brief mention in routing context).
   - Command: `grep "parent manifest" workflow/agents/orchestrator.md || true`
   - Must not contain detailed parent/child manifest mechanics.

3. **Orchestrator prompt contains docs-first routing rule.**
   - Command: `grep -qi "docs-first\|documentation.*before.*task-planner\|route.*documentation\|cross-cutting.*context\|durable.*context\|reusable.*context" workflow/agents/orchestrator.md`
   - Must find language describing that the orchestrator routes to documentation before task-planner when durable/cross-cutting context is needed.

4. **Documentation agent owns durable source artifacts.**
   - Command: `grep -qi "durable source\|UX design brief\|product brief\|ADR\|domain model\|business rules\|API contract\|integration spec\|migration plan\|runbook\|testing strategy\|convention guide" workflow/agents/documentation.md`
   - Must find language that the documentation agent explicitly owns durable source artifact types.
   - Command: `grep -qi "user approval\|meaningful decision" workflow/agents/documentation.md`
   - Must find language that documentation reports when user approval is needed before task-planning.

5. **Task-planner prompt contains required task spec sections.**
   - Command: `grep -c "Source Artifacts\|Handoff Context" workflow/agents/task-planner.md`
   - Must find "Source Artifacts / Handoff Context" referenced as a required section.
   - Command: `grep -c "Validation Plan" workflow/agents/task-planner.md`
   - Must find "Validation Plan" as a required section.
   - Command: `grep -c "Open Questions" workflow/agents/task-planner.md`
   - Must find "Open Questions" as a required section.

6. **Task-planner prompt retains planning-blocked behavior and decision authority.**
   - Command: `grep -q "planning-blocked" workflow/agents/task-planner.md`
   - Must still contain planning-blocked behavior.
   - Command: `grep -q "must not invent" workflow/agents/task-planner.md`
   - Must still constrain decision authority.

7. **Validator prompt references cited source artifacts.**
   - Command: `grep -qi "cited source\|source artifacts\|durable.*doc" workflow/agents/validator.md`
   - Must find language that the validator checks against cited source artifacts / durable docs.

8. **Workflow docs reflect the new split.**
   - Command: `grep -qi "docs-first\|documentation.*before.*task-planner" docs/workflow.md`
   - Must document the docs-first routing concept.
   - Command: `grep -q "task-planner.*owns.*planning" docs/workflow.md || grep -qi "planning mechanics.*task-planner" docs/workflow.md`
   - Must note that task-planner owns detailed planning mechanics.

9. **Agent reference docs updated.**
   - Command: `grep -qi "durable.*artifact\|source.*artifact" docs/agents.md`
   - Must find updated role summaries referencing the new boundaries (documentation as durable artifact owner, validator checking source artifacts).

## Inspectable Acceptance Criteria

### `workflow/agents/orchestrator.md`

- Significantly shorter than current 213 lines. No long per-field handoff definitions. The rich handoff concept is preserved as a checklist (field names only) or concise paragraph, not a detailed template with per-field explanations.
- No "Path Allocation Procedure" with step-by-step instructions like "1. Run `ls .ai/tasks/` ... 4. For multi-unit work, allocate child subdirectory paths." That procedure belongs to task-planner.
- No "Multi-Unit Parallel Planning Flow" with per-step detail like "Spawn one task-planner to create the parent manifest ..." in 6 sub-bullets. High-level concepts only.
- Docs-first routing is clearly described: when durable/cross-cutting context is needed, route to documentation before task-planner.
- Structured handoff is still required for non-trivial work, but described as a concise checklist, not a field-by-field reference document.
- The execution pipeline rule remains: after task-planner, read `## Execution` and spawn agents sequentially, validator last.
- Decomposition ownership remains: orchestrator owns single/multi-unit classification and high-level decomposition.

### `workflow/agents/task-planner.md`

- Required task spec sections explicitly listed as: Source Artifacts / Handoff Context, Scope, Execution, Non-Goals, Testable Acceptance Criteria (with `### Test File Paths`), Inspectable Acceptance Criteria, Relevant Files, Validation Plan, Open Questions.
- Path allocation logic (computing next NNN by listing `.ai/tasks/`) lives entirely in task-planner; orchestrator does not duplicate it.
- Planning-blocked behavior, decision authority constraints, assigned-path behavior, and self-directed decomposition fallback all preserved.

### `workflow/agents/documentation.md`

- Contains explicit ownership of durable source artifacts like UX design briefs, product briefs, ADRs, domain models, business rules docs, API contracts, integration specs, migration plans, runbooks, testing strategies, and convention guides.
- Contains a rule: if the artifact introduces meaningful decisions, report that user approval is needed before task-planning.
- Existing responsibilities and boundaries preserved.

### `workflow/agents/validator.md`

- References that validation scope includes cited source artifacts and durable docs when the task spec cites them.
- Existing responsibilities and boundaries preserved; the expansion is a concise addition.

### `docs/workflow.md`

- Documents the concise role split (orchestrator routes/coordinates, documentation owns durable artifacts, task-planner owns planning mechanics).
- Documents docs-first routing as a standard route: when cross-cutting/durable context is needed, orchestrator routes to documentation before task-planner.
- References the rich handoff concept without duplicating its field-by-field detail (the detail lives in agent prompts).
- Notes that detailed task artifact mechanics (path allocation, parent/child manifest format, spec section requirements) belong to task-planner.
- No stale text contradicts the new split.

### `docs/agents.md`

- Orchestrator role summary mentions docs-first routing and decomposition ownership.
- Documentation role summary mentions durable source artifact ownership and approval-needed reporting.
- Task-planner role summary mentions planning mechanics ownership.
- Validator role summary mentions validating against cited source artifacts.
- Role Boundaries section updated if needed for consistency.

### Structural Integrity

- `npm run check` passes — this validates all frontmatter and cross-references.
- No agent frontmatter changes (no permission expansions, no mode changes, no agent additions/removals).

## Relevant Files

- `workflow/agents/orchestrator.md` — primary: slim down, add docs-first routing, compress handoff to checklist.
- `workflow/agents/task-planner.md` — primary: ensure required spec sections include all listed fields; ensure path allocation lives here not in orchestrator.
- `workflow/agents/documentation.md` — primary: add durable source artifact ownership and approval-needed reporting.
- `workflow/agents/validator.md` — secondary: add cited source artifact validation scope.
- `docs/workflow.md` — secondary: document new role split, docs-first routing, and that planning mechanics belong to task-planner.
- `docs/agents.md` — secondary: update role summaries.
- `.ai/context.md` — read-only: project conventions.
- `bin/install.js` — read-only: understand `npm run check` validation.

## Validation Plan

1. Run `npm run check` and confirm zero errors (covers frontmatter and cross-references).
2. Run `wc -l workflow/agents/orchestrator.md` and confirm significant line reduction from ~213.
3. Run each grep-based acceptance criterion command from the `### Acceptance Criteria` table above and confirm non-zero matches.
4. Manual inspection checklist:
   - Orchestrator: no detailed path allocation procedure, no detailed multi-unit parallel flow breakdown, docs-first routing present, concise handoff checklist present, decomposition ownership preserved, execution pipeline trigger preserved.
   - Task-planner: required spec sections complete, path allocation procedure present, planning-blocked preserved, decision authority preserved.
   - Documentation: durable artifact types named, approval-needed reporting present.
   - Validator: cited source artifact validation mentioned.
   - `docs/workflow.md`: role split, docs-first routing, planning mechanics ownership noted.
   - `docs/agents.md`: role summaries updated.
5. Spot-check for stale/contradictory language: search for "brief summary" in orchestrator (should still be mentioned as prohibited); search for "path allocation" in orchestrator (should not have detailed procedure); search for "orchestrator owns" in orchestrator and docs (should be preserved).

## Open Questions

- None. The scope, boundaries, and acceptance criteria are fully specified.
