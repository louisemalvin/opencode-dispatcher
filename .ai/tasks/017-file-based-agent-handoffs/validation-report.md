# Validation Report — 017 File-Based Agent Handoffs

## Result

**PASS** — All testable acceptance criteria pass, `npm run check` exits 0, all 7 modified files are consistent with the task spec, and blast-radius is clean.

## Checks Performed

### 1. Structural Check (`npm run check`)

| Check | Result |
|-------|--------|
| `npm run check` exit code 0 | ✅ Pass |
| Frontmatter integrity | ✅ Valid |
| Orchestrator cross-references | ✅ Intact |

### 2. Testable Acceptance Criteria (grep-based)

| # | Criterion | Command | Expected | Actual | Result |
|---|---|---|---|---|---|
| AC2 | agy-handoff.md in implementer | `grep -q "agy-handoff.md" implementer.md` | Found | Found | ✅ |
| AC3a | Persona/persona in implementer | `grep -c "Persona\|persona" implementer.md` | >= 1 | 1 | ✅ |
| AC3b | Orchestrator Command in implementer | `grep -c "Orchestrator Command\|orchestrator command\|original command"` | >= 1 | 1 | ✅ |
| AC3c | Task Spec in implementer | `grep -c "Task Spec\|task spec"` | >= 1 | 13 | ✅ |
| AC3d | Relevant Files in implementer | `grep -c "Relevant Files\|relevant files"` | >= 1 | 2 | ✅ |
| AC3e | Report Path in implementer | `grep -c "Report Path\|report path"` | >= 1 | 2 | ✅ |
| AC3f | Verification in implementer | `grep -c "Verification\|verification"` | >= 1 | 6 | ✅ |
| AC3g | Constraints in implementer | `grep -c "Constraints\|constraints"` | >= 1 | 1 | ✅ |
| AC3h | Stop Conditions in implementer | `grep -c "Stop Condition\|stop condition\|halt"` | >= 1 | 1 | ✅ |
| AC4a | skip-permissions in implementer | `grep -q "dangerously-skip-permissions"` | Found | Found | ✅ |
| AC4b | handoff file instruction | `grep -q "Read and execute the handoff file"` | Found | Found | ✅ |
| AC5 | agy-handoff.md permission | `grep -q '".ai/tasks/**/agy-handoff.md": allow'` | Found | Found | ✅ |
| AC6 | No permission-bypass prohibition | `grep -c` prohibition patterns | 0 | 0 | ✅ |
| AC7a | planning-handoff.md in orchestrator | `grep -q "planning-handoff.md"` | Found | Found | ✅ |
| AC7b | documentation in orchestrator | `grep -q "documentation"` | Found | Found | ✅ |
| AC8a | planning-handoff.md in task-planner | `grep -q "planning-handoff.md"` | Found | Found | ✅ |
| AC8b | canonical/read handoff in task-planner | `grep -q "canonical\|source of truth\|read.*handoff\|handoff.*read"` | Found | Found | ✅ |
| AC9 | planning-handoff permission in documentation | `grep -q '".ai/tasks/**/planning-handoff.md": allow'` | Found | Found | ✅ |
| AC10a | skip-permissions in docs | `grep -q "dangerously-skip-permissions" docs/configuration.md` | Found | Found | ✅ |
| AC10b | bounded/handoff file in docs | `grep -q "bounded\|handoff file" docs/configuration.md` | Found | Found | ✅ |
| AC11 | No blanket prohibition in docs | `grep -c` prohibition patterns | 0 | 0 | ✅ |
| AC12a | planning-handoff in workflow docs | `grep -q "planning-handoff.md" docs/workflow.md` | Found | Found | ✅ |
| AC12b | agy-handoff in workflow docs | `grep -q "agy-handoff.md" docs/workflow.md` | Found | Found | ✅ |
| AC13 | handoff mention in agents docs | `grep -q "agy-handoff\|handoff.*file\|file.*handoff"` | Found | Found | ✅ |

### 3. Inspectable Acceptance Criteria Audit

#### `workflow/agents/implementer.md`
| # | Criterion | Result |
|---|---|---|
| 1 | Two-step process: write handoff, then invoke agy | ✅ Clear write-before-invoke structure |
| 2 | Handoff schema described with specificity | ✅ 10 required sections enumerated |
| 3 | skip-permissions presented as intentional/required, not shortcut | ✅ "intentional and required" with rationale |
| 4 | Rationale for skip-permissions | ✅ Subagents cannot approve interactive agy prompts |
| 5 | --print contains only short instruction | ✅ "Do NOT stuff large context into the --print argument" |
| 6 | Old CLI length/feasibility gate removed | ✅ No length/quoting gate present |
| 7 | Post-agy verification preserved | ✅ Verification, report writing, reporting all preserved |
| 8 | Boundaries allow agy-handoff.md writes | ✅ `.ai/tasks/**` deny with agy-handoff.md exception |
| 9 | YAML frontmatter valid | ✅ description, mode, hidden, permission blocks intact |
| 10 | agy config boundary preserved | ✅ "Do not modify the agy configuration or toggle" present |

#### `workflow/agents/orchestrator.md`
| # | Criterion | Result |
|---|---|---|
| 11 | Handoff materialization instruction | ✅ Materialization requirement section added |
| 12 | Documentation agent named as mechanism | ✅ "...delegate to documentation agent to write..." |
| 13 | 10 structured fields preserved | ✅ All 10 fields listed (lines 144-153) |
| 14 | Task number determined before delegation | ✅ Explicit instruction to list/read .ai/tasks/ |
| 15 | ROUTE distinguishes non-trivial vs trivial | ✅ Non-trivial requires persistent artifact; trivial may skip |
| 16 | No edit permission change to orchestrator | ✅ `edit: deny` unchanged (line 5) |
| 17 | State machine/routing/decomposition intact | ✅ All existing sections preserved |

#### `workflow/agents/task-planner.md`
| # | Criterion | Result |
|---|---|---|
| 18 | Handoff file as canonical source context | ✅ Rule 1: "Read the handoff file first...canonical source" |
| 19 | Missing/thin handoff → planning-blocked | ✅ Rule 2: missing/empty/thin → STOP planning-blocked |
| 20 | Existing planning-blocked preserved | ✅ Rule 3: no handoff path → existing rule applies |
| 21 | Both file+prompt → file canonical | ✅ Rule 4: handoff file canonical for planning substance |
| 22 | Decision artifacts read when cited | ✅ Rule 5: Read cited decision artifacts |

#### `workflow/agents/documentation.md`
| # | Criterion | Result |
|---|---|---|
| 23 | Permission scoped precisely | ✅ `".ai/tasks/**/planning-handoff.md": allow` |
| 24 | Responsibilities entry for handoff writing | ✅ 3 sub-bullets: create, write fields, confirm path |
| 25 | No invention/alteration of strategic content | ✅ "Do not invent or alter strategic content" + report ambiguous |
| 26 | Existing responsibilities intact | ✅ All prior permissions and responsibilities preserved |

#### `docs/configuration.md`
| # | Criterion | Result |
|---|---|---|
| 27 | File-based handoff (not CLI argument) | ✅ Describes handoff file creation, not CLI prompt |
| 28 | skip-permissions intentional with rationale | ✅ Bounded backend mode stated with full rationale |
| 29 | Handoff file contents listed | ✅ Contents enumerated matching implementer schema |
| 30 | Fallback subsection accurate | ✅ Handoff completeness + agy availability triggers |
| 31 | No contradictory language | ✅ No "never use" or blanket prohibition |

#### `docs/workflow.md`
| # | Criterion | Result |
|---|---|---|
| 32 | Rich Handoff Concept materialization | ✅ Materialization paragraph describes planning-handoff.md via doc agent |
| 33 | Task Artifact Layout includes optional artifacts | ✅ Both planning-handoff.md and agy-handoff.md listed in tree + table |
| 34 | Substantial Feature/Fix flow updated | ✅ Documentation → planning-handoff → task-planner flow described |
| 35 | No stale language | ✅ No contradictory old language found |

#### `docs/agents.md`
| # | Criterion | Result |
|---|---|---|
| 36 | Role summaries updated | ✅ All 4 relevant rows updated (orchestrator, task-planner, implementer, documentation) |
| 37 | Practical Allowances updated | ✅ Implementer entry explains bounded backend skip-permissions mode |

### 4. Blast-Radius Check: `--dangerously-skip-permissions`

Searched across entire project (excluding `.git/`, `node_modules/`):

| Location | Result |
|---|---|
| `workflow/agents/implementer.md` (lines 41-42) | ✅ Intentional — agy invocation and rationale |
| `docs/configuration.md` (lines 66-67) | ✅ Intentional — bounded backend mode documentation |
| `docs/agents.md` (line 76) | ✅ Intentional — Practical Allowances explanation |
| `workflow/agents/orchestrator.md` | ✅ Not present |
| `workflow/agents/task-planner.md` | ✅ Not present |
| `workflow/agents/documentation.md` | ✅ Not present |
| `workflow/agents/validator.md` | ✅ Not present |
| `workflow/agents/init.md` | ✅ Not present |
| `workflow/agents/research.md` | ✅ Not present |
| `workflow/agents/shipper.md` | ✅ Not present |
| `workflow/agents/executor.md` | ✅ Not present |
| `workflow/agents/model-config.md` | ✅ Not present |
| Task spec (`task-spec.md`) | ✅ Expected (this document) |
| Implementation report | ✅ Expected (this task's artifact) |
| Decision artifact | ✅ Expected (cited artifact) |

**Result: Clean.** The flag appears only in intended locations and does not leak into any agent prompt where it would be inappropriate.

### 5. Restart Note Check

`docs/configuration.md` Restore/Uninstall section (lines 179-205) contains restart language:
- "Stop OpenCode so global config is reloaded afterward" (line 185)
- "Restart OpenCode so it reloads the global configuration" (line 194)
- "After any restore or uninstall, restart OpenCode so it reloads" (line 205)

✅ Consistent with existing restart language pattern.

### 6. Non-Goals Verification

| Non-Goal | Result |
|---|---|
| No agy invocation or testing | ✅ No agy CLI code added |
| No changes to `.ai/context.md` | ✅ Not in diff |
| No model config / opencode.jsonc changes | ✅ No changes |
| No new agents removed | ✅ No agent files added/removed |
| No orchestrator task permission change | ✅ `task:` block unchanged |
| No new CLI implementation code | ✅ No new JS files |
| `bin/install.js` unchanged | ✅ Not in diff |
| No broad workflow redesign | ✅ Changes scoped to handoff mechanism |
| No committing/pushing/releasing | ✅ Changes are uncommitted |
| No new test files | ✅ No test files added |

### 7. Decision Artifact Consistency

`.ai/decisions/2026-06-12-file-based-agent-handoffs.md` is present and cited by:
- `workflow/agents/orchestrator.md` line 159
- `workflow/agents/task-planner.md` line 27
- `docs/workflow.md` (cross-reference to configuration.md)

### 8. Permission Pattern Consistency

The permission patterns use both `*` and `**`:
- Existing: `".ai/tasks/*/implementation-report.md": allow` (single wildcard)
- New: `".ai/tasks/**/agy-handoff.md": allow` (double wildcard)
- Existing: `".ai/tasks/**": deny` (double wildcard)
- New (documentation): `".ai/tasks/**/planning-handoff.md": allow` (double wildcard)

This matches the Open Question in the spec (lines 361-362). The `**` wildcard is consistent with the existing deny pattern and the implementation report notes it works as the deny pattern already uses it. The `*` in `implementation-report.md` is pre-existing and not introduced by this task.

## Acceptance Criteria Review

| # | Description | Result |
|---|---|---|
| AC1 | `npm run check` passes | ✅ |
| AC2-AC13 | All 12 testable grep-based criteria | ✅ All pass |
| IC1-IC37 | All inspectable criteria | ✅ All verified |
| N1-N10 | All non-goals respected | ✅ |

## Issues Found

**No blocking issues found.**

### Non-Blocking Observations

1. **Permission wildcard inconsistency**: The implementer's existing permission `".ai/tasks/*/implementation-report.md"` uses a single `*` while new patterns use `**`. This is pre-existing and harmless, but the inconsistency could be confusing. The `**` was chosen because the deny pattern already uses `**`. (Spec open question lines 361-362.)

2. **Restart note scope**: The existing restart notes in `docs/configuration.md` Restore/Uninstall section discuss restart after backup restoration, not explicitly after agent file edits. The language is present and consistent with the "existing restart language" the spec references, but there is no explicit statement that editing `workflow/agents/*.md` files requires an OpenCode restart. This is a minor gap not required by any acceptance criterion.

## Residual Risks

- **Permission model semantics**: If the OpenCode permission engine interprets `**` differently than expected (e.g., requiring explicit `*` and `*/*` fallback patterns), the handoff file writes may fail at runtime. This matches the existing pattern risk for `".ai/tasks/**": deny` which is already in use. No change from this task.
- **agy CLI flag order**: The spec notes (line 363) that flag ordering `agy --dangerously-skip-permissions --print "..."` may need adjustment for the actual `agy` CLI. The acceptance criteria focus on presence of the flag and short prompt, not exact ordering. No issue.

## Verification Run

```
$ npm run check
> opencode-dispatcher@0.4.0 check
> node ./bin/install.js check
Workflow package check passed. Agents: documentation, executor, implementer, init, model-config, orchestrator, research, shipper, task-planner, test-writer, validator.
```

All 13 testable acceptance criteria were verified via grep commands from the spec. Full inspectable criteria audit completed. Blast-radius check done.
