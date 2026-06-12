# Implementation Report — 017 File-Based Agent Handoffs

## Outcome

All changes specified in the task spec have been applied successfully across 7 files. The file-based agent handoff protocol is now implemented:

1. **Implementer** writes a task-local `agy-handoff.md` file with full context before invoking `agy --dangerously-skip-permissions` with a short handoff-file pointer.
2. **Orchestrator** materializes the Rich Handoff Contract as a `planning-handoff.md` file via documentation agent for non-trivial work.
3. **Task-planner** reads `planning-handoff.md` as canonical source context when provided.
4. **Documentation** has permission and responsibility to write `planning-handoff.md` artifacts when delegated.
5. **Docs** updated to describe file-based handoffs and intentional bounded backend skip-permissions mode.

All 13 testable acceptance criteria pass, `npm run check` passes, and blast-radius is clean.

## Files Changed

### 1. `workflow/agents/implementer.md` — Primary: agy handoff protocol rewrite

- **Permissions**: Added `".ai/tasks/**/agy-handoff.md": allow` to the edit permission block.
- **Agy section (lines 23–50)**: Complete rewrite from CLI-argument-based agy invocation to file-based handoff protocol:
  - Handoff file creation with 10 required sections (Persona, Orchestrator Command, Task Spec, Project Context, Relevant Files, Report Path, Verification Commands, Constraints/Non-Goals, Stop Conditions, Explicit Instructions).
  - `agy --dangerously-skip-permissions --print "Read and execute the handoff file at <path>"` invocation with intentional bounded-backend rationale.
  - Post-agy verification and reporting preserved.
  - Old CLI length-gate, permissions-gate, and `--print "<prompt>"` invocation removed.
  - No prohibition against permission-bypassing flags remains.
- **Boundaries**: Updated from `except the task's 'implementation-report.md'` to `except the task's 'implementation-report.md' and 'agy-handoff.md'`.

### 2. `workflow/agents/orchestrator.md` — Primary: persistent planning handoff artifact

- **ROUTE section (line 117)**: Changed from "Use task-planner only WITH a rich structured handoff" to "Use task-planner only WITH a persistent planning handoff artifact for non-trivial work." Added note that trivial/mechanical planning may skip materialization.
- **Rich Handoff Contract section**: Added materialization requirement sub-section specifying:
  - Handoff MUST be materialized as `.ai/tasks/<NNN>-<task-id>/planning-handoff.md` for non-trivial work.
  - Orchestrator delegates file writing to documentation agent (preserving `edit: deny`).
  - Orchestrator determines task number before delegating to documentation.
  - Task-planner receives handoff file path after materialization.
- Preserved: 10 structured handoff fields, state machine, decomposition ownership, no-edit boundary.

### 3. `workflow/agents/task-planner.md` — Primary: planning handoff file reading

- Added new **Planning Handoff File** section with 5 rules:
  1. Read handoff file as canonical source context.
  2. Missing/empty/thin handoff triggers planning-blocked.
  3. No handoff path → existing prompt-only planning-blocked rule applies.
  4. Both handoff file and prompt → handoff file is canonical for planning substance.
  5. Read cited decision artifacts when referenced.
- Preserved: assigned output path behavior, planning-blocked logic, decision authority constraints, self-directed decomposition, required spec sections.

### 4. `workflow/agents/documentation.md` — Primary: planning-handoff permission and responsibility

- **Permissions**: Added `".ai/tasks/**/planning-handoff.md": allow` to the edit permission block.
- **Responsibilities**: Added writing planning handoff artifacts when delegated by orchestrator:
  - Create file at specified path with provided handoff content; create parent directories as needed.
  - Write 10 structured fields as provided; report missing/ambiguous fields back.
  - Confirm artifact path after writing.
- Preserved: all existing responsibilities, boundaries, and permissions.

### 5. `docs/configuration.md` — Secondary: Agy Integration section rewrite

- **How It Works**: Rewritten to describe file-based handoff:
  - Handoff file contents (matching implementer agent instructions).
  - `agy --dangerously-skip-permissions` invocation with bounded backend rationale.
  - Explanation that this is not unbounded execution — bounded by the handoff file.
- **Fallback**: Rewritten to describe handoff file approach replacing old CLI argument approach; mentions handoff completeness as fallback trigger.
- Removed: All references to `--print "<prompt>"` without skip-permissions, CLI length/quoting gates, blanket prohibition of permission-bypassing flags.

### 6. `docs/workflow.md` — Secondary: handoff artifact documentation

- **Task Artifact Layout**: Added optional `planning-handoff.md` and `agy-handoff.md` entries to the directory tree and table, with descriptions and writers.
- **Substantial Feature or Fix**: Updated to describe documentation → planning-handoff materialization → task-planner flow.
- **Rich Handoff Concept**: Added materialization paragraph describing `planning-handoff.md` via documentation agent, and cross-reference to Configuration > Agy Integration for agy delegation.

### 7. `docs/agents.md` — Secondary: role summary updates

- **Agent Reference table**: Updated summaries for:
  - Orchestrator: mentions materializing planning handoffs via documentation agent.
  - Task Planner: mentions reading planning handoff file as canonical source context.
  - Implementer: mentions file-based agy handoff with bounded backend skip-permissions mode.
  - Documentation: mentions writing planning handoff artifacts when delegated.
- **Practical Allowances**: Updated Implementer entry to mention `agy-handoff.md` as an allowed exception and explain bounded backend skip-permissions mode.

## Decisions

1. **`**` wildcard for permission patterns**: Used `".ai/tasks/**/agy-handoff.md"` and `".ai/tasks/**/planning-handoff.md"` with double-wildcard (`**`) matching any depth, consistent with the existing `".ai/tasks/**": deny` pattern. The opencode permission model appears to support `**` as the deny pattern already uses it.

2. **`--dangerously-skip-permissions` restored with bounded rationale**: Task 014 correctly identified that vague agy prompts were unsafe but incorrectly removed the flag entirely. This task restores it with a complete handoff file protocol that makes the flag intentional and bounded.

3. **No new files beyond task artifacts**: No new agent files, tests, or implementation code were created. All changes are in-place edits to existing workflow agents and documentation.

4. **Prompt-only delegation preserved for trivial work**: Both orchestrator and task-planner preserve the ability to skip materialization for trivial/mechanical single-step planning, maintaining existing low-friction paths.

## Verification

| Step | Method | Result |
|------|--------|--------|
| 1. Structural check | `npm run check` | ✅ Passed (frontmatter valid, orchestrator cross-references intact) |
| 2. AC2 — agy-handoff.md in implementer | `grep -q` | ✅ Found |
| 3. AC3 — Required handoff sections | `grep -c` on 8 terms | ✅ All >=1 (Persona:1, Orchestrator Command:1, Task Spec:13, Relevant Files:2, Report Path:2, Verification:6, Constraints:1, Stop Condition:1) |
| 4. AC4 — skip-permissions and handoff instruction | `grep -q` | ✅ Both found |
| 5. AC5 — agy-handoff.md permission | `grep -q` | ✅ Found |
| 6. AC6 — No permission-bypass prohibition | `grep -c` | ✅ 0 matches |
| 7. AC7 — orchestrator planning-handoff and documentation | `grep -q` | ✅ Both found |
| 8. AC8 — task-planner planning-handoff and canonical | `grep -q` | ✅ Both found |
| 9. AC9 — documentation planning-handoff permission | `grep -q` | ✅ Found |
| 10. AC10 — docs bounded skip-permissions | `grep -q` | ✅ Both found |
| 11. AC11 — No blanket prohibition in docs | `grep -c` | ✅ 0 matches |
| 12. AC12 — workflow docs reference both artifacts | `grep -q` | ✅ Both found |
| 13. AC13 — agent docs mention handoff behavior | `grep -q` | ✅ Found |
| 14. Blast-radius: --dangerously-skip-permissions | `rg` across project | ✅ Only in implementer.md, docs/configuration.md, docs/agents.md (intended locations) |
| 15. Restart notes present | `grep` on docs/configuration.md | ✅ Present in Restore/Uninstall section |
| 16. Orchestrator edit:deny preserved | `grep -q` | ✅ Intact |
| 17. Documentation existing permissions intact | `grep -q` | ✅ docs/**, decisions/**, deny rules all preserved |
| 18. Implementer agy config boundary preserved | `grep -q` | ✅ Intact |

## Known Issues

None. All acceptance criteria are met.
