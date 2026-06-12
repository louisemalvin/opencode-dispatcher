## Source Artifacts / Handoff Context

- **User Intent**: The user rejected the previous design as overcomplicated. Specifically, they do not want the orchestrator to delegate planning-handoff materialization to the documentation agent. They said: "let orchestrator write on .ai/tasks". Implement this simplification: orchestrator gets a narrowly scoped write permission for planning handoff files under `.ai/tasks`, and writes them directly before invoking task-planner.

- **Conversation-Derived Context**:
  - Previous task 017 (`017-file-based-agent-handoffs`) implemented file-based handoffs but routed orchestrator → documentation → task-planner for planning handoff materialization to preserve orchestrator `edit: deny`.
  - User clarified that is overcomplication; a narrow `.ai/tasks` exception for orchestrator is preferred.
  - Keep the implementer → agy `agy-handoff.md` design from task 017 untouched. This request only changes how orchestrator writes planning handoffs.
  - Documentation agent should no longer be in the normal planning-handoff materialization path. It may still write docs/decisions/reports, but is not required just to create `planning-handoff.md`.

- **Decision Artifact**: `.ai/decisions/2026-06-12-file-based-agent-handoffs.md`, section "Orchestrator writes planning handoffs directly" (line 32): states orchestrator has narrowly scoped permission to write `.ai/tasks/**/planning-handoff.md` artifacts. Documentation agent is not part of the normal planning-handoff materialization path.

- **Source Context**:
  - `.ai/context.md`: npm project, `npm run check` validation, agents in `workflow/agents/`.
  - `workflow/agents/orchestrator.md` (current, from task 017): has `edit: deny`, Rich Handoff Contract says delegate to documentation agent for planning handoff materialization (lines 155–159). Hard boundary language says "Direct edits are disabled by design" (line 57).
  - `workflow/agents/documentation.md` (current, from task 017): has permission `".ai/tasks/**/planning-handoff.md": allow` (line 13), responsibility to write planning handoff artifacts when delegated (lines 36–39).
  - `workflow/agents/task-planner.md` (current): is writer-agnostic — it references reading `planning-handoff.md` as canonical source context but does not mention who writes it. **No changes needed.**
  - `docs/workflow.md` (current, from task 017): Rich Handoff Concept section (line 98) says orchestrator delegates to documentation agent. Task Artifact Layout table (line 63) lists "Written by" as "Documentation" for `planning-handoff.md`. Substantial Feature or Fix section (line 82) says "delegates to documentation to write a `planning-handoff.md` artifact."
  - `docs/agents.md` (current, from task 017): Orchestrator row (line 15) says "materializes planning handoffs via documentation agent." Documentation row (line 21) says "writes planning handoff artifacts when delegated by orchestrator." Permission Philosophy section (line 39) says orchestrator has `edit: deny`.
  - `docs/configuration.md`: has no planning-handoff references. **No changes needed.**
  - `bin/install.js`: validation gate only. **No changes needed.**

## Scope

Single-unit simplification. Update orchestrator permissions and prompt so orchestrator writes `planning-handoff.md` directly, remove documentation agent from the planning-handoff materialization path, and update docs to match.

### 1. `workflow/agents/orchestrator.md` — Permission change + prompt rewrite

**Permission change** (YAML frontmatter, line 5):
- Change `edit: deny` from a flat string to a map with a narrow exception:
  ```yaml
  edit:
    "*": deny
    ".ai/tasks/**/planning-handoff.md": allow
  ```
- The `*: deny` baseline preserves the no-edit boundary for all other files (source code, docs, configuration, task specs, reports, and any other `.ai/tasks/**` files).
- The single `.ai/tasks/**/planning-handoff.md: allow` carves out only planning handoff files. The `**` matches any depth under `.ai/tasks/` (multi-unit child paths).
- All other permissions (`read`, `glob`, `grep`, `webfetch`, `bash`, `task`) remain unchanged.

**Hard boundary language** (current line 57, "Hard boundary: do not implement... Direct edits are disabled by design"):
- Update to acknowledge the narrow `.ai/tasks/**/planning-handoff.md` exception while preserving the general no-edit stance.
- The updated text should convey: direct edits are disabled by design except for the single narrow exception of writing `planning-handoff.md` files under `.ai/tasks/`. Source code, docs, configuration, task specs, reports, and all other task artifacts remain off-limits.

**Rich Handoff Contract — Materialization requirement** (current lines 155–159):
- Remove the three points that delegate to documentation agent.
- Replace with instructions for orchestrator to write the file directly:
  - Write the `planning-handoff.md` directly yourself using the narrow `.ai/tasks/**/planning-handoff.md` edit exception. This is the only file type you may write.
  - Determine the task number by listing/reading `.ai/tasks/` before writing.
  - Create the task directory as needed (e.g., `mkdir -p`), then write the handoff file with the composed 10-field structured handoff.
  - After writing the handoff, delegate to task-planner with the handoff file path and the assigned output path.
- Preserve the instruction to include the decision artifact path when relevant.

**ROUTE section** (current line 117): The wording "Use task-planner only WITH a persistent planning handoff artifact for non-trivial work" is already correct and does not mention documentation agent. No change needed.

**Other sections**: DELEGATE, REVIEW, DONE sections do not need changes (they don't mention documentation-as-materializer). The orchestrator still delegates docs/context/decision updates to documentation agent for other purposes — that is unchanged.

### 2. `workflow/agents/documentation.md` — Remove planning-handoff responsibility

**Permission change** (YAML frontmatter):
- Remove line 13: `".ai/tasks/**/planning-handoff.md": allow`

**Responsibilities change** (current lines 36–39):
- Remove the bullet "Write planning handoff artifacts when delegated by orchestrator:" and its three sub-bullets (lines 36–39).
- The documentation agent retains all other responsibilities: writing durable source artifacts, updating `.ai/context.md`, writing decision notes, writing `documentation-report.md`, and keeping docs concise.

**Description** (line 2): Already does not mention planning handoffs. No change needed.

**Boundaries**: Already correct. No change needed.

### 3. `docs/workflow.md` — Update planning-handoff authorship

**Task Artifact Layout table** (line 63):
- Change `planning-handoff.md` row: "Written by" from "Documentation" to "Orchestrator".
- Update the description text to say orchestrator writes it directly rather than "Written by documentation agent when delegated."

**Substantial Feature or Fix** (current lines 80–83):
- Change "the orchestrator then delegates to documentation to write a `planning-handoff.md` artifact" to describe orchestrator writing it directly, then routing to task-planner.

**Rich Handoff Concept — Materialization** (current lines 98–99):
- Replace "Since the orchestrator has `edit: deny`, it delegates the file writing to the **documentation agent**" with explanation that orchestrator writes the file directly using a narrow `.ai/tasks/**/planning-handoff.md` edit permission.

### 4. `docs/agents.md` — Update role summaries

**Agent Reference table**:
- **Orchestrator row** (line 15): Change "materializes planning handoffs via documentation agent for non-trivial work" to "writes planning handoff artifacts directly for non-trivial work."
- **Documentation row** (line 21): Remove "writes planning handoff artifacts when delegated by orchestrator;" from the role summary.

**Permission Philosophy — Deny-by-Default** (line 39):
- Update the Orchestrator bullet from `edit: deny` to describe the narrow exception: `edit: deny` with a single exception for `.ai/tasks/**/planning-handoff.md`.

**Role Boundaries** (line 53):
- The orchestrator bullet says "Orchestrator coordinates, routes (including docs-first routing), and decomposes but never implements, documents, or validates." This is still correct — writing a planning handoff is coordination, not documentation. No change needed.

### 5. Files confirmed to need NO changes

- `workflow/agents/task-planner.md` — Already writer-agnostic; says "If the orchestrator provides a `planning-handoff.md` path" without naming who wrote it.
- `docs/configuration.md` — Contains no references to planning handoff or documentation-agent-as-materializer.
- `bin/install.js` — Validation gate only, not touched.

## Execution

- implementer

## Non-Goals

- Changing implementer → agy handoff behavior or `agy-handoff.md` design.
- Changing agy skip-permissions design.
- Changing `.ai/context.md`.
- Changing `bin/install.js`.
- Changing task-planner agent (already writer-agnostic).
- Changing orchestrator `task:` permission list or `bash` whitelist.
- Adding new agents or removing existing agents.
- Committing, pushing, or releasing.
- Broad redesign beyond the specified planning-handoff materialization path change.

## Testable Acceptance Criteria

1. **`npm run check` passes** after all edits.
   - Command: `npm run check`
   - Must exit with status 0.

2. **Orchestrator permission map includes narrow planning-handoff allow.**
   - `grep -q '".ai/tasks/\*\*/planning-handoff.md": allow' workflow/agents/orchestrator.md` must succeed.
   - `grep -c '"\\*": deny' workflow/agents/orchestrator.md` >= 1 (found within the `edit:` block).

3. **Orchestrator Rich Handoff Contract no longer delegates to documentation agent for materialization.**
   - `grep -c "delegate to.*documentation.*agent.*write.*planning.handoff\|delegate to.*documentation.*planning.handoff" workflow/agents/orchestrator.md` returns 0.
   - The orchestrator no longer instructs itself to delegate planning-handoff materialization to documentation agent.

4. **Orchestrator Rich Handoff Contract instructs direct writing.**
   - `grep -c "write.*planning-handoff.md.*directly\|write.*planning-handoff.md.*yourself\|write.*planning handoff.*directly" workflow/agents/orchestrator.md` >= 1.
   - The orchestrator now describes writing the file itself.

5. **Documentation agent permission no longer includes planning-handoff.md.**
   - `grep -c '".ai/tasks/\*\*/planning-handoff.md"' workflow/agents/documentation.md` returns 0.
   - The permission line from task 017 is removed.

6. **Documentation agent no longer has planning handoff writing responsibility.**
   - `grep -c "planning handoff artifact\|write.*planning.handoff.*when delegated" workflow/agents/documentation.md` returns 0.
   - The responsibility paragraph from task 017 (lines 36–39) is removed.

7. **Docs/workflow.md table says Orchestrator writes planning-handoff.md.**
   - `grep -c "planning-handoff.md.*Orchestrator\|Orchestrator.*planning-handoff.md" docs/workflow.md` >= 1.
   - The Written by column or nearby text credits the orchestrator.

8. **Docs/workflow.md no longer says documentation agent writes planning handoffs.**
   - `grep -c "documentation.*agent.*planning.handoff\|planning.handoff.*documentation.*agent" docs/workflow.md` returns 0.
   - No stale materialization-via-documentation language remains.

9. **Docs/agents.md orchestrator row credits direct writing.**
   - `grep -c "materializes planning handoffs via documentation agent" docs/agents.md` returns 0.
   - `grep -c "writes planning handoff.*directly\|directly.*writes planning handoff" docs/agents.md` >= 1.

10. **Docs/agents.md documentation row no longer mentions planning handoff writing.**
    - `grep -c "writes planning handoff artifacts when delegated" docs/agents.md` returns 0.

11. **Task-planner is unchanged.** (Confirms we didn't touch a file that didn't need changes.)
    - `git diff --name-only` after all edits does not include `workflow/agents/task-planner.md`.

12. **Orchestrator hard boundary language acknowledges the exception.**
    - `grep -c "\.ai/tasks/\*\*/planning-handoff.md" workflow/agents/orchestrator.md` >= 2 (once in permission block, once in prompt body explaining the exception).

### Test File Paths

- `workflow/agents/orchestrator.md`
- `workflow/agents/documentation.md`
- `docs/workflow.md`
- `docs/agents.md`
- `bin/install.js` (`npm run check` entry point, read-only)

## Inspectable Acceptance Criteria

### orchestrator.md

1. The YAML frontmatter `edit:` block is a map with `"*": deny` and exactly one allow entry: `".ai/tasks/**/planning-handoff.md": allow`.
2. All other frontmatter fields (`read`, `glob`, `grep`, `webfetch`, `bash`, `task`) are unchanged.
3. The hard boundary paragraph (near line 57) explains the narrow `.ai/tasks/**/planning-handoff.md` exception while preserving the general prohibition against editing source code, docs, configuration, task specs, and other task artifacts.
4. The Rich Handoff Contract **Materialization requirement** no longer delegates planning handoff file creation to documentation agent.
5. Instead, it instructs orchestrator to: (a) determine task number, (b) create task directory if needed, (c) write `planning-handoff.md` directly using the narrow edit exception, (d) then delegate to task-planner.
6. The 10 structured handoff fields are preserved as the content to materialize.
7. All other sections (INTAKE, CLARIFY, ROUTE, DELEGATE, REVIEW, DONE, Multi-Unit Coordination, Decomposition Ownership) remain intact and consistent with the change.
8. The orchestrator still delegates to documentation agent for other purposes (docs/context/decision updates) — that delegation path is preserved.

### documentation.md

9. The `".ai/tasks/**/planning-handoff.md": allow` permission line is removed from the YAML frontmatter.
10. All other frontmatter fields are unchanged.
11. The planning handoff artifact writing responsibility (the three sub-bullets under "Write planning handoff artifacts when delegated") is removed.
12. All other responsibilities (durable source artifacts, `.ai/context.md`, decision notes, `documentation-report.md`, concise docs) are preserved.
13. Boundaries section is unchanged.

### docs/workflow.md

14. The Task Artifact Layout table's `planning-handoff.md` row says "Written by" Orchestrator (not Documentation).
15. The Rich Handoff Concept **Materialization** paragraph no longer says orchestrator delegates to documentation agent; instead it explains orchestrator writes directly.
16. The Substantial Feature or Fix paragraph no longer says "delegates to documentation to write a `planning-handoff.md`"; instead it describes orchestrator writing the handoff, then routing to task-planner.
17. All other sections (Role Split, State Machine, Routing Logic, etc.) remain consistent.

### docs/agents.md

18. The Orchestrator row in the Agent Reference table says the orchestrator writes planning handoff artifacts directly (not via documentation agent).
19. The Documentation row no longer mentions writing planning handoff artifacts.
20. The Permission Philosophy — Deny-by-Default section's Orchestrator bullet describes the narrow planning-handoff exception.
21. All other rows and sections remain accurate.

## Relevant Files

### Files to edit
- `workflow/agents/orchestrator.md` — Permission change (edit map with narrow exception), hard boundary language update, Rich Handoff Contract materialization rewrite.
- `workflow/agents/documentation.md` — Remove planning-handoff permission, remove planning-handoff writing responsibility.
- `docs/workflow.md` — Update table, Substantial Feature or Fix, Rich Handoff Concept.
- `docs/agents.md` — Update orchestrator and documentation role summaries, update permission philosophy.

### Files to read (no edits)
- `.ai/context.md` — Project conventions, validation via `npm run check`.
- `.ai/decisions/2026-06-12-file-based-agent-handoffs.md` — Canonical decision artifact; confirms orchestrator writes planning handoffs directly.
- `workflow/agents/task-planner.md` — Confirm no changes needed (writer-agnostic).
- `docs/configuration.md` — Confirm no changes needed (no planning-handoff references).
- `bin/install.js` — Read-only; `npm run check` validation gate.

## Validation Plan

1. **Structural check**: Run `npm run check` — must pass with zero errors.
2. **Orchestrator permission audit**: Read `workflow/agents/orchestrator.md` YAML frontmatter. Verify `edit` block is a map with `"*": deny` and exactly `".ai/tasks/**/planning-handoff.md": allow`. Verify all other permission blocks unchanged.
3. **Orchestrator prompt audit**: Read the full prompt. Verify Rich Handoff Contract materialization no longer mentions delegating to documentation. Verify it instructs writing the file directly. Verify hard boundary language acknowledges the narrow exception.
4. **Documentation agent audit**: Read `workflow/agents/documentation.md`. Verify `".ai/tasks/**/planning-handoff.md"` is absent from permissions. Verify planning handoff writing responsibility is absent from Responsibilities. Verify all other responsibilities and permissions intact.
5. **Docs consistency audit**: Read `docs/workflow.md` and `docs/agents.md`. Verify no instance of orchestrator delegating planning-handoff materialization to documentation agent. Verify orchestrator credited as direct writer.
6. **Grep acceptance criteria**: Run each grep command from `### Testable Acceptance Criteria` and verify correct match counts.
7. **Blast-radius check**: Verify `git diff --name-only` shows only the four intended files. Verify `workflow/agents/task-planner.md`, `docs/configuration.md`, `bin/install.js`, and all other files are unchanged.
8. **Decision artifact consistency**: Read `.ai/decisions/2026-06-12-file-based-agent-handoffs.md` and verify the implemented changes are consistent with the decision's "Orchestrator writes planning handoffs directly" clause.

## Open Questions

1. **OpenCode permission syntax for `**`**: The spec uses `".ai/tasks/**/planning-handoff.md"` with `**` (double-star) for arbitrary depth matching under `.ai/tasks/`. If the opencode permission engine only supports single `*` (one directory level), the implementer must verify the correct wildcard semantics. The documentation agent in task 017 was given the same `**` pattern, suggesting it works. If it does not, fallback to two explicit patterns: `".ai/tasks/*/planning-handoff.md"` and `".ai/tasks/*/*/planning-handoff.md"` to cover both root and nested (multi-unit child) task directories.

2. **None** — all other design decisions are resolved by the approved decision artifact and user direction.
