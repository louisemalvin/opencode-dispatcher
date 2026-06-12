## Source Artifacts / Handoff Context

- **User Intent**: The user has approved a file-based agent handoff workflow. The core design:
  1. **Implementer→agy**: The implementer writes a task-local `agy-handoff.md` markdown artifact containing all context agy needs (persona, task spec, files, verification, constraints, stop conditions), then invokes `agy --dangerously-skip-permissions --print "Read and execute the handoff file: <absolute path>"`. The skip-permissions flag is **intentional** because agy is a bounded implementer backend and subagents cannot approve interactive prompts. The fix is the handoff file itself — the flag is correct when bounded by an inspected, pre-approved handoff document.
  2. **Orchestrator→task-planner**: For non-trivial task planning, the orchestrator materializes the rich structured handoff as a persistent `planning-handoff.md` artifact before delegating to task-planner. Since orchestrator has `edit: deny`, it delegates the materialization to documentation agent. Task-planner reads this artifact as canonical source context.

- **Conversation-Derived Context**:
  - Previous task 014 (`014-safer-agy-delegation`) correctly tightened agy prompting requirements but **incorrectly removed the skip-permissions invocation entirely**. This task corrects that: skip-permissions is restored as intentional for agy backend mode, but only after a complete file-based handoff is written.
  - Task 014 also changed docs to say "Permission-bypassing flags are never used." This must be corrected to explain bounded backend mode.
  - Previous task `014-orchestrator-task-planner-contract` established the Rich Handoff Contract with 10 structured fields, but the handoff currently lives only in the Task tool prompt (chat-only). It must be materialized as a disk artifact for auditable, non-lossy delegation.
  - Task `015-orchestrator-task-planner-cleanup` slimmed the orchestrator prompt and added docs-first routing through documentation agent.

- **Decision Artifact**: `.ai/decisions/2026-06-12-file-based-agent-handoffs.md` records the approved decision and must be cited by implementer when constructing handoff files. It leaves implementation details (file naming, invocation convention, schema, validation, docs) to this task spec.

- **Source Context**:
  - `.ai/context.md`: npm project, `npm run check` validation, agents in `workflow/agents/`, agy enabled.
  - `workflow/agents/implementer.md` (current): Uses `agy --print "<prompt>"` without skip-permissions. Requires rich prompt in CLI args (persona, spec, files, etc.). Has length-gate and permissions-gate fallback to manual. Explicitly forbids permission-bypassing flags. **Needs full rewrite of agy section**.
  - `workflow/agents/orchestrator.md` (current): Rich Handoff Contract with 10 fields, but delivered only as Task prompt text. ROUTE section says "Use task-planner only WITH a rich structured handoff." **Needs update to require persistent handoff artifact for non-trivial work**, with documentation agent as materialization mechanism.
  - `workflow/agents/task-planner.md` (current): Expects handoff in invocation prompt. Has planning-blocked behavior. Has assigned-path support. **Needs update to accept/read a planning handoff file path** and block if missing or too thin for non-trivial work.
  - `workflow/agents/documentation.md` (current): Owns durable source artifacts. Can write to `docs/**`, `README.md`, `.ai/tasks/*/documentation-report.md`, `.ai/decisions/**`. **Needs permission addition for `.ai/tasks/**/planning-handoff.md`** and instruction update to own writing planning handoff artifacts when delegated by orchestrator.
  - `docs/configuration.md` (current): Agy Integration section documents `agy --print` without skip-permissions and says "Permission-bypassing flags are never used." **Must be rewritten** to describe file handoff and intentional bounded backend invocation with skip-permissions.
  - `docs/workflow.md` (current): Rich Handoff Concept section describes the 10 fields but does not mention file materialization. **Needs update** for the planning-handoff.md artifact and optional agy-handoff.md artifact.
  - `docs/agents.md` (current): Role summaries for orchestrator, task-planner, implementer, documentation. **Needs update** for new handoff behaviors.
  - `bin/install.js`: Read-only validation gate (`npm run check`). No changes needed.

## Scope

### 1. `workflow/agents/implementer.md` — File-based agy handoff

Rewrite the entire agy integration instruction (current lines 22–38). The new behavior:

**Handoff file creation** (before any agy invocation):
- Create `.ai/tasks/<NNN>-<task-id>/agy-handoff.md` (resolve `<NNN>-<task-id>` from the task spec path).
- The handoff file must include, at minimum, these sections:
  - **Implementer Persona and Boundaries** — the full contents of this agent definition file.
  - **Orchestrator Command** — the original command received from orchestrator.
  - **Task Spec** — path to `task-spec.md` and its full contents.
  - **Project Context** — relevant `.ai/context.md` workflow/test information.
  - **Relevant Files** — all files to inspect/edit, with full contents where needed (or explicit paths with instructions to read before editing).
  - **Report Path** — exact absolute path to `implementation-report.md`.
  - **Verification Commands** — from the task spec's Validation Plan or project's test runner.
  - **Constraints and Non-Goals** — from the task spec.
  - **Stop Conditions** — when to halt and report back.
  - **Explicit Instructions** — preserve unrelated changes; write the implementation report at the specified path after completing all edits; do not commit, amend, or push.
- The handoff must contain everything agy needs. A vague or partial handoff is not sufficient.

**agy invocation** (only after the handoff file is written and verified complete):
- Run: `agy --dangerously-skip-permissions --print "Read and execute the handoff file at <absolute path to agy-handoff.md>"`
- The `--dangerously-skip-permissions` flag is **intentional and required**: agy is operating as a bounded implementer backend under an approved task spec. Subagents cannot interactively approve agy permission prompts, so skip-permissions is correct when work is fully bounded by the handoff file.
- Do NOT stuff large context into the `--print` argument. The `--print` argument is only a short instruction pointing at the handoff file.
- If agy is not enabled or not available, proceed with manual implementation.

**Post-agy verification**:
- After agy finishes, verify changes satisfy the task spec.
- Run verification commands.
- Write the implementation report.
- Report back to orchestrator.

Remove the current content that:
- Recommends `agy --print "<prompt>"` without skip-permissions.
- Says to stuff full context into the CLI argument.
- Says "Do **not** add any permission-bypassing flags" or any prohibition against skip-permissions.
- Has the length/feasibility gate for CLI arguments (irrelevant when using a handoff file — the file has no quoting limits).

Keep unchanged:
- The requirement to read `.ai/context.md` and `task-spec.md` first.
- The fallback to manual implementation when agy is not enabled/available.
- The Boundaries section (do not edit `.ai/tasks/**` except implementation-report and agy-handoff; do not edit `.ai/context.md` or `.ai/decisions/**`; do not commit/amend/push).
- The boundary about not modifying agy config (`agy: enabled` is user-owned).

**Permissions update**: Add `".ai/tasks/**/agy-handoff.md": allow` to the `edit` permission block. This allows implementer to write the handoff file but not other task artifacts (the blanket `.ai/tasks/**` deny + implementation-report allow remain).

### 2. `workflow/agents/orchestrator.md` — Persistent planning handoff artifact

Update the **Rich Handoff Contract** section (current lines 139–153) and **ROUTE** section (line 117):

**Route section**: Change "Use task-planner only WITH a rich structured handoff" to "Use task-planner only WITH a persistent planning handoff artifact for non-trivial work." For trivial/mechanical single-step planning, materialization may be skipped.

**Rich Handoff Contract section**: Add the materialization requirement:
- For non-trivial work, the structured handoff MUST be materialized as a persistent markdown artifact at `.ai/tasks/<NNN>-<task-id>/planning-handoff.md` before delegating to task-planner.
- The handoff file contains the 10 structured fields (User Intent, Conversation-Derived Context, Source Artifacts / Source Context, Proposed Task Shape, Assigned Output Path(s), Scope and Non-Goals, Constraints, Acceptance Signals, Authority Boundary, Open Questions / Stop Conditions).
- Since the orchestrator has `edit: deny`, it CANNOT write the handoff file itself. Instead, delegate to **documentation agent** to write the `planning-handoff.md` artifact with the composed handoff content.
- The orchestrator determines the task number by listing/reading `.ai/tasks/` before delegating to documentation.
- After documentation writes the handoff, delegate to task-planner with the handoff file path and the assigned output path.
- Include the path to the decision artifact `.ai/decisions/2026-06-12-file-based-agent-handoffs.md` when relevant.

Keep unchanged:
- The 10 structured handoff fields.
- The orchestration routing, state machine, decomposition ownership.
- The no-edit boundary (preserved by delegating file creation to documentation).

### 3. `workflow/agents/task-planner.md` — Read planning handoff file

Add a new section (before or within Planning Flow) that instructs task-planner to read a planning handoff file when provided:

- If the orchestrator provides a `planning-handoff.md` path in the invocation, **read that file first** using the `read` tool and treat it as the canonical source of planning context.
- If the handoff file path is provided but the file is missing, empty, or too thin to create an accurate spec without inventing strategic/product/architecture/domain/security/business decisions, STOP and return a **planning-blocked** report citing the gap.
- If no handoff file path is provided (orchestrator-provided prompt-only delegation), apply the existing planning-blocked rule: if the invocation prompt is too thin, stop planning-blocked.
- When both a handoff file path AND invocation prompt context exist, the handoff file is canonical; the invocation prompt may contain routing instructions (assigned output path, parent manifest path) but the planning substance comes from the file.
- Read cited decision artifacts (like `.ai/decisions/2026-06-12-file-based-agent-handoffs.md`) when referenced in the handoff.

Keep unchanged:
- Assigned output path behavior.
- Planning-blocked logic for thin handoffs.
- Decision authority constraints.
- Self-directed decomposition (fallback).
- Required spec sections.

### 4. `workflow/agents/documentation.md` — Planning handoff artifact ownership

**Permissions update**: Add `".ai/tasks/**/planning-handoff.md": allow` to the `edit` permission block. The `**` wildcard is necessary because planning handoffs may be at task root or nested within multi-unit subdirectories.

**Responsibilities update**: Add an explicit instruction that documentation agent owns writing planning handoff artifacts:
- When delegated by orchestrator to write a `planning-handoff.md` artifact, create the file at the specified path with the provided handoff content. Create parent directories as needed.
- Write the 10 structured fields as provided. Do not invent or alter strategic content. If fields are missing or ambiguous, report back to orchestrator before writing.
- After writing, confirm the artifact path back to orchestrator.

Keep unchanged:
- All existing responsibilities and boundaries.
- The requirement to report when user approval is needed before task-planning.

### 5. `docs/configuration.md` — Agy Integration section rewrite

Rewrite the **Agy Integration** section (current lines 49–83) to describe file-based handoff:

**How It Works** subsection:
- The implementer checks `agy: enabled` in `.ai/context.md` and verifies `agy` availability via `which agy`.
- If enabled and available, the implementer creates a task-local handoff file (`.ai/tasks/<task>/agy-handoff.md`) containing: implementer persona/boundaries, the orchestrator command, full task spec contents, project context, relevant files, report path, verification commands, constraints, non-goals, and stop conditions.
- The implementer then invokes `agy --dangerously-skip-permissions --print "Read and execute the handoff file at <path>"`.
- The `--dangerously-skip-permissions` flag is **intentional for this bounded backend mode**: agy operates under an approved, inspected handoff file that defines the complete scope of work. Since agy is invoked as a subagent and cannot interactively approve permission prompts, skip-permissions is the correct mechanism when work is fully bounded.
- This is NOT unbounded/permissionless execution — it is bounded by the handoff file which the implementer writes, inspects, and verifies against.
- After agy returns, the implementer verifies the output against the task spec, runs validation, and writes the implementation report.

**Fallback** subsection:
- If agy is not enabled, not available, or the handoff cannot be constructed with sufficient completeness, the implementer falls back to manual implementation.
- The handoff file approach replaces the previous CLI argument approach. Large context is no longer stuffed into shell-quoted command strings.

Remove all content that:
- Says `--dangerously-skip-permissions` is never used or that permission-bypassing flags are forbidden.
- Describes the old `agy --print "<prompt>"` invocation (without skip-permissions, with context in CLI args).
- Describes CLI length/quoting gates (irrelevant with file handoff).

### 6. `docs/workflow.md` — Document file-based handoff artifacts

**Rich Handoff Concept section** (current lines 86–92):
- Update to describe that for non-trivial work, the orchestrator materializes the handoff as a `planning-handoff.md` file in the task directory via documentation agent before delegating to task-planner.
- The task-planner reads this artifact as canonical source context.

**Task Artifact Layout section** (current lines 43–62):
- Add optional/conditional artifacts to the layout:
  - `planning-handoff.md` — Written by documentation agent when delegated by orchestrator. Contains the structured handoff for task-planner.
  - `agy-handoff.md` — Written by implementer before agy delegation. Contains the full bounded context for agy execution.
- These are handoff artifacts, distinct from formal reports. They may appear alongside other task artifacts.

**Substantial Feature or Fix section** (current lines 74–76):
- Update to reflect the new flow: orchestrator delegates to documentation for planning handoff, then to task-planner.

### 7. `docs/agents.md` — Update role summaries

- **Implementer row**: Mention file-based agy handoff and intentional bounded backend skip-permissions mode.
- **Orchestrator row**: Mention materializing planning handoffs via documentation agent.
- **Task Planner row**: Mention reading planning handoff file as canonical context.
- **Documentation row**: Mention writing planning handoff artifacts when delegated.
- **Permission Philosophy section**: Update the Escape Hatch Sealing or Practical Allowances subsections if the new agy skip-permissions usage needs explanation in the permission context (it is intentional and bounded, not an escape hatch).

### 8. `bin/install.js` — Read-only

No changes. `npm run check` must continue to pass.

## Execution

- implementer

## Non-Goals

- Running agy or testing agy invocation.
- Changing `.ai/context.md` (the `agy: enabled` flag is user-owned).
- Changing model configuration or `opencode.jsonc`.
- Adding new agents or removing existing agents.
- Altering the orchestrator's `task:` permission list in its frontmatter.
- Adding new CLI implementation code.
- Changing `bin/install.js` behavior.
- Broad workflow redesign beyond the specified handoff changes.
- Committing, pushing, or releasing.
- Creating new test files.

## Testable Acceptance Criteria

1. **`npm run check` passes** after all edits.
   - Command: `npm run check`
   - Must exit with status 0.

2. **Implementer agy section contains handoff file creation instructions.**
   - `grep -q "agy-handoff.md" workflow/agents/implementer.md`
   - Must find reference to the agy handoff file path.

3. **Implementer agy section explicitly lists required handoff file sections.**
   - `grep -c "Persona\|persona" workflow/agents/implementer.md` returns >= 1
   - `grep -c "Orchestrator Command\|orchestrator command\|original command" workflow/agents/implementer.md` returns >= 1
   - `grep -c "Task Spec\|task spec" workflow/agents/implementer.md` returns >= 1
   - `grep -c "Relevant Files\|relevant files" workflow/agents/implementer.md` returns >= 1
   - `grep -c "Report Path\|report path" workflow/agents/implementer.md` returns >= 1
   - `grep -c "Verification\|verification" workflow/agents/implementer.md` returns >= 1
   - `grep -c "Constraints\|constraints" workflow/agents/implementer.md` returns >= 1
   - `grep -c "Stop Condition\|stop condition\|halt" workflow/agents/implementer.md` returns >= 1

4. **Implementer invokes agy with skip-permissions and handoff file reference.**
   - `grep -q "dangerously-skip-permissions" workflow/agents/implementer.md`
   - Must find the intentional skip-permissions flag.
   - `grep -q "Read and execute the handoff file" workflow/agents/implementer.md`
   - Must find instruction to point agy at the handoff file.

5. **Implementer permissions allow agy-handoff.md writes.**
   - `grep -q '".ai/tasks/\*\*/agy-handoff.md": allow' workflow/agents/implementer.md`
   - Must find the new permission entry.

6. **Implementer does NOT prohibit skip-permissions.**
   - `grep -c "Do.*not.*add.*permission.*bypass\|Do.*not.*bypass.*permission\|never.*use.*permission.*bypass" workflow/agents/implementer.md` returns 0
   - No generic prohibition against permission-bypassing flags should remain in the agy section.

7. **Orchestrator requires persistent planning handoff artifact for non-trivial work.**
   - `grep -q "planning-handoff.md" workflow/agents/orchestrator.md`
   - Must reference the planning handoff file path.
   - `grep -q "documentation" workflow/agents/orchestrator.md`
   - Must describe delegating handoff materialization to documentation agent (search for "documentation" near the handoff section).

8. **Task-planner accepts planning handoff file.**
   - `grep -q "planning-handoff.md" workflow/agents/task-planner.md`
   - Must reference reading the planning handoff file.
   - `grep -q "canonical\|source of truth\|read.*handoff\|handoff.*read" workflow/agents/task-planner.md`
   - Must establish the handoff file as the source of planning context.

9. **Documentation agent has planning-handoff permission.**
   - `grep -q '".ai/tasks/\*\*/planning-handoff.md": allow' workflow/agents/documentation.md`
   - Must find the new permission entry.

10. **Docs describe bounded skip-permissions mode.**
    - `grep -q "dangerously-skip-permissions" docs/configuration.md`
    - Must find the intentional flag documented (not forbidden).
    - `grep -q "bounded\b\|handoff file" docs/configuration.md`
    - Must explain why skip-permissions is safe (bounded by handoff file).

11. **Docs do NOT contain blanket prohibition of permission-bypass.**
    - `grep -c "Permission-bypassing flags are never used\|never use.*permission.*bypass\|never.*add.*skip-permission" docs/configuration.md` returns 0
    - The old blanket prohibition must be replaced with the explanation of bounded backend mode.

12. **Workflow docs reference planning handoff artifact.**
    - `grep -q "planning-handoff.md" docs/workflow.md`
    - Must reference the planning handoff in the workflow description.
    - `grep -q "agy-handoff.md" docs/workflow.md`
    - Must reference the agy handoff in the workflow description.

13. **Agent reference docs mention handoff behavior.**
    - `grep -q "agy-handoff\|handoff.*file\|file.*handoff" docs/agents.md`
    - Must mention the handoff mechanism in agent role descriptions.

### Test File Paths

- `workflow/agents/implementer.md`
- `workflow/agents/orchestrator.md`
- `workflow/agents/task-planner.md`
- `workflow/agents/documentation.md`
- `docs/configuration.md`
- `docs/workflow.md`
- `docs/agents.md`
- `bin/install.js` (`npm run check` entry point, read-only)

## Inspectable Acceptance Criteria

### implementer.md

1. The agy section describes a clear two-step process: (a) write handoff file, (b) invoke agy pointing at handoff file.
2. The handoff file schema is described with enough specificity that an agent can construct it without guessing.
3. The `--dangerously-skip-permissions` flag is presented as intentional and required for bounded backend mode, not as a shortcut.
4. The rationale for skip-permissions is stated: subagents cannot approve interactive agy prompts; work is bounded by the approved handoff file.
5. The `--print` argument contains only a short instruction pointing at the handoff file, not large context.
6. The previous CLI length/feasibility gate is removed (no longer relevant with file handoff) or repurposed.
7. Post-agy verification and reporting requirements are preserved.
8. The Boundaries section explicitly allows writing `implementation-report.md` and `agy-handoff.md` under `.ai/tasks/**` but prohibits editing other task artifacts.
9. YAML frontmatter remains valid: description, mode (subagent), hidden, and permission blocks intact.
10. The `## Boundaries` section's agy-related boundary ("Do not modify the agy configuration or toggle") is preserved.

### orchestrator.md

11. The Rich Handoff Contract section instructs orchestrator to materialize the handoff as a file for non-trivial work.
12. The documentation agent is named as the materialization mechanism, preserving orchestrator's `edit: deny`.
13. The 10 structured fields are preserved as the content to materialize.
14. Orchestrator determines the task number before delegating to documentation.
15. The ROUTE section distinguishes: non-trivial work requires persistent handoff; trivial/mechanical work may use prompt-only delegation.
16. No `edit` permission change is made to orchestrator — the no-edit boundary is preserved.
17. The state machine, routing logic, and decomposition ownership remain intact and consistent with the new materialization step.

### task-planner.md

18. The planning handoff file is accepted as canonical source context when provided.
19. Missing or too-thin handoff files trigger a planning-blocked response.
20. The existing planning-blocked behavior for thin prompt-only delegations is preserved.
21. When both handoff file path and prompt context are present, the handoff file takes precedence for planning substance.
22. Crossover references to decision artifacts (e.g., `.ai/decisions/2026-06-12-file-based-agent-handoffs.md`) are read when cited.

### documentation.md

23. The new permission `.ai/tasks/**/planning-handoff.md` is scoped precisely — allows writing only planning-handoff files, not broad task artifact access.
24. The responsibilities section adds an entry for writing planning handoff artifacts when delegated.
25. The agent does not invent or alter strategic content in handoff files; it reports missing/ambiguous fields back to orchestrator.
26. All existing responsibilities and boundaries remain intact.

### docs/configuration.md

27. The Agy Integration section describes the file-based handoff, not the old CLI-argument approach.
28. `--dangerously-skip-permissions` is documented as intentional for bounded backend mode with rationale.
29. The handoff file contents are listed (matching the implementer agent instructions).
30. The Fallback subsection is accurate: manual implementation fallback when agy unavailable or handoff cannot be constructed.
31. No language contradicts the intentional skip-permissions usage (no "never use" blanket prohibition).

### docs/workflow.md

32. The Rich Handoff Concept section references materialization as a `planning-handoff.md` file via documentation agent.
33. The Task Artifact Layout includes optional `planning-handoff.md` and `agy-handoff.md` entries.
34. The substantial feature/fix route reflects the new flow (orchestrator → documentation → task-planner).
35. No stale language contradicts the new file-based handoff approach.

### docs/agents.md

36. Agent role summaries in the table or nearby text reflect the new handoff behaviors.
37. The Permission Philosophy section may need a brief note that `--dangerously-skip-permissions` for agy is bounded by the handoff file and not an escape hatch (explain if the existing philosophy language would create confusion; otherwise, no change needed).

## Relevant Files

### Files to edit
- `workflow/agents/implementer.md` — Primary: agy handoff file creation, skip-permissions invocation, permissions update.
- `workflow/agents/orchestrator.md` — Primary: persistent planning handoff artifact requirement, documentation delegation.
- `workflow/agents/task-planner.md` — Primary: read planning handoff file as canonical source context.
- `workflow/agents/documentation.md` — Primary: planning-handoff permission, new responsibility.
- `docs/configuration.md` — Secondary: Agy Integration section rewrite for file handoff and bounded skip-permissions.
- `docs/workflow.md` — Secondary: document planning-handoff and agy-handoff artifacts.
- `docs/agents.md` — Secondary: update role summaries for new handoff behaviors.

### Files to read (no edits)
- `.ai/context.md` — Project conventions, agy enabled flag, validation via `npm run check`.
- `.ai/decisions/2026-06-12-file-based-agent-handoffs.md` — Approved decision artifact; cite in handoff.
- `.ai/tasks/014-safer-agy-delegation/task-spec.md` — Understand what was changed and what needs correction.
- `.ai/tasks/014-safer-agy-delegation/implementation-report.md` — Understand the specific changes made (fix cycle that removed all `--dangerously-skip-permissions` occurrences).
- `bin/install.js` — Read-only; `npm run check` validation gate. No changes needed.

## Validation Plan

1. **Structural check**: Run `npm run check` — must pass with zero errors.
2. **Implementer agy section audit**: Read `workflow/agents/implementer.md` agy section side-by-side with this spec's requirements. Verify: handoff file schema completeness, skip-permissions flag present with rationale, `--print` argument is short, post-agy verification preserved, old CLI length-gate removed, no prohibition against skip-permissions remains.
3. **Implementer permissions audit**: Verify `".ai/tasks/**/agy-handoff.md": allow` is present and `.ai/tasks/**` deny + `implementation-report.md` allow remain intact.
4. **Orchestrator handoff materialization audit**: Verify `planning-handoff.md` referenced, documentation agent named as materialization mechanism, no-edit boundary preserved.
5. **Task-planner handoff file audit**: Verify planning-handoff.md reading instruction, canonical source treatment, missing/thin file triggers planning-blocked.
6. **Documentation permissions audit**: Verify `".ai/tasks/**/planning-handoff.md": allow` present, existing permissions intact.
7. **Docs consistency audit**: Read `docs/configuration.md` Agy Integration section and verify alignment with `implementer.md` agy section: both describe file handoff, both use skip-permissions with rationale, no contradictions. Read `docs/workflow.md` and verify handoff artifacts referenced. Read `docs/agents.md` and verify role summaries updated.
8. **Grep acceptance criteria**: Run each grep command from `### Testable Acceptance Criteria` above and verify non-zero or zero matches as specified.
9. **Blast-radius check**: Grep for `--dangerously-skip-permissions` across all project files. Confirm it appears only in the intended locations (`implementer.md` agent prompt, `docs/configuration.md` documentation, this task spec at `017-file-based-agent-handoffs`, and the decision artifact). It should NOT appear in agent prompts where it would be inappropriate (orchestrator, task-planner, init, etc.).
10. **Restart note presence**: Verify that `docs/configuration.md` mentions that agent file changes require an OpenCode restart to take effect (consistent with existing restart language in the Configuration doc's Install Safety / Restore sections).

## Open Questions

1. **Documentation agent's write path confirmation**: The permission pattern `.ai/tasks/**/planning-handoff.md` uses `**` for any depth. If opencode's permission model only supports single `*` (one directory level) for task subdirectories, the pattern may need refinement. The spec assumes `**` works; if not, the implementer must use `.ai/tasks/*/planning-handoff.md` and `.ai/tasks/*/*/planning-handoff.md` explicitly or confirm the exact wildcard semantics with the opencode permission engine.

2. **agy invocation exactness**: The handoff specifies `agy --dangerously-skip-permissions --print "Read and execute the handoff file at <absolute path>"`. If `agy` CLI requires a different flag order or syntax, implementer must adjust while preserving the intentional skip-permissions mode and short prompt pointing at the handoff file. The acceptance criteria focus on the presence of `--dangerously-skip-permissions` and the short prompt, not exact flag ordering.
