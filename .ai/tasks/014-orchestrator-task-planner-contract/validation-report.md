# Validation Report: 014-orchestrator-task-planner-contract

## Result

**PASS** — All acceptance criteria meet requirements. No blocking or non-blocking issues found.

## Checks Performed

### 1. `npm run check` (AC #1)

- **Command**: `npm run check`
- **Result**: PASS — zero errors. Frontmatter integrity and cross-reference validation passed for all 11 agents.

### 2. Grep-Based Acceptance Criteria (AC #2–#10)

| # | Criterion | Command | Result |
|---|-----------|---------|--------|
| 2 | Orchestrator prompt forbids brief summary delegation | `grep -q "brief summary" workflow/agents/orchestrator.md` | PASS |
| 3 | Orchestrator prompt contains structured handoff fields | `grep -c "User Intent" workflow/agents/orchestrator.md` — found 1 occurrence | PASS |
| 4 | Orchestrator prompt references path allocation | `grep -q "assigned.*path\|path.*allocat\|allocat.*path" workflow/agents/orchestrator.md` | PASS |
| 5 | Task-planner prompt contains assigned-path behavior | `grep -q "assigned.*output path\|assigned.*path.*provided\|provided.*path" workflow/agents/task-planner.md` | PASS |
| 6 | Task-planner prompt contains planning-blocked behavior | `grep -q "planning-blocked\|too thin\|insufficient\|not enough context" workflow/agents/task-planner.md` | PASS |
| 7 | Task-planner prompt constrains decision authority | `grep -q "must not invent\|must not change\|strategic.*decision\|authority bound" workflow/agents/task-planner.md` | PASS |
| 8 | `docs/workflow.md` references handoff contract | `grep -q "handoff\|handoff contract\|rich.*handoff" docs/workflow.md` | PASS |
| 9 | `docs/workflow.md` references parallel planning | `grep -q "parallel.*task-planner\|parallel.*planning" docs/workflow.md` | PASS |
| 10 | `docs/agents.md` role summaries updated | `grep -q "context\|decomposition\|handoff" docs/agents.md` | PASS |

### 3. Inspectable Acceptance Criteria — Orchestrator Prompt (`workflow/agents/orchestrator.md`)

#### Handoff Template Completeness
All 10 required fields are present:
- ✅ **User Intent** — "What the user explicitly asked for. Quote the user's own words when possible."
- ✅ **Conversation-Derived Context** — Preferences, corrections, rejected ideas, rationale, chat-vs-file provenance
- ✅ **Source Artifacts / Source Context** — `.ai/context.md`, task specs, ADRs, `.ai/decisions/`, source files; chat-only vs file-backed distinction
- ✅ **Proposed Task Shape** — Single/multi-unit classification with unit descriptions, dependencies, parallelizability
- ✅ **Assigned Output Path(s)** — Exact paths for single-unit, parent manifest, and child units
- ✅ **Scope and Non-Goals** — In-scope and out-of-scope for the planning invocation
- ✅ **Constraints** — Technical, project, style, architecture, safety
- ✅ **Acceptance Signals** — Observable outcomes / criteria seeds
- ✅ **Authority Boundary** — Allowed vs must-not-invent decisions
- ✅ **Open Questions / Stop Conditions** — Unknowns task-planner must not guess

#### Delegation Rules
- ✅ Explicit prohibition: "MUST NOT delegate to task-planner using only a brief summary" (line 139)
- ✅ "brief summary risks context loss" language present
- ✅ Required structured handoff for non-trivial work (lines 139–161)

#### Decomposition Ownership
- ✅ "You own the single-unit vs multi-unit classification and the high-level decomposition" (line 165)
- ✅ "Task-planner formalizes from your handoff; it does not re-decompose unless you failed to provide a unit split" (line 165)

#### Path Allocation
- ✅ Instructions to run `ls .ai/tasks/` or `read` on `.ai/tasks/` (line 174)
- ✅ Find highest zero-padded `<NNN>` prefix (line 175)
- ✅ Allocate next number (line 176)
- ✅ Child subdirectory path allocation (line 177)
- ✅ Note that orchestrator cannot edit files — delegate manifest to task-planner (line 179)

#### Multi-Unit Parallel Planning Flow
All 6 steps present:
1. ✅ Clarify and decompose with user approval (line 185)
2. ✅ Allocate parent number and child paths (line 186)
3. ✅ Spawn one task-planner for parent manifest (line 187)
4. ✅ Spawn parallel task-planners for parallelizable units (lines 188–191)
5. ✅ Dependency-aware sequencing (line 193)
6. ✅ Sequential execution after specs are written (line 194)

### 4. Inspectable Acceptance Criteria — Task-Planner Prompt (`workflow/agents/task-planner.md`)

#### Assigned Path Behavior
- ✅ "If the orchestrator has provided an assigned output path, use it exactly. Do NOT compute the next `<NNN>` yourself." (line 17)
- ✅ Path computation fallback only applies when no path is assigned (line 17)

#### Multi-Unit Mode Distinction
- ✅ **Orchestrator-assigned unit**: "Follow the Assigned-Unit Workflow below. Do NOT present a unit table or decompose further." (line 23)
- ✅ **Self-directed decomposition (fallback)**: "No assigned unit is provided. Assess whether the work is single-unit or multi-unit" (line 24)
- ✅ Assigned-Unit Workflow section (lines 61–68): uses exact path, writes only unit's spec, no re-decomposition, reports blocking if boundary is unsafe
- ✅ Self-Directed Decomposition section (lines 70–105) preserved with fallback qualification

#### Planning-Blocked Behavior
- ✅ "If the handoff from the orchestrator is too thin to create an accurate spec without inventing strategic, product, architecture, domain, security, or business decisions, STOP and return a planning-blocked report" (lines 28–33)
- ✅ Report structure specified (3 items)

#### Decision Authority
- ✅ **Allowed**: implementation-local decisions (patterns, file placement, naming, `## Execution` list) (line 39)
- ✅ **Must not invent**: strategic direction, product behavior, architecture changes, domain logic, security properties, business rules (line 40)
- ✅ **Exception**: explicit handoff delegation (line 41)
- ✅ "Do NOT silently change user intent or invent missing requirements" (line 43)

#### Relevant Files Discovery
- ✅ "Read any source artifacts cited in the handoff before planning" (line 47)
- ✅ References `.ai/context.md`, task specs, ADRs, `.ai/decisions/`, source files as canonical truth

### 5. Inspectable Acceptance Criteria — Documentation (`docs/workflow.md`)

- ✅ **Rich Handoff Contract** section (lines 79–95) — documents the structured handoff with all fields
- ✅ **Orchestrator-Owned Decomposition** section (lines 97–105) — orchestrator owns classification, task-planner formalizes
- ✅ **Single-Unit vs Multi-Unit Decomposition** section (lines 123–150) — qualified as fallback path with cross-reference to Orchestrator-Owned Decomposition
- ✅ **Parallel Task-Planner Planning** section (lines 152–175) — path allocation, parallel flow, orchestrator coordination
- ✅ No stale text claiming task-planner alone assesses single vs multi-unit as primary path

### 6. Inspectable Acceptance Criteria — Agent Reference (`docs/agents.md`)

- ✅ **Orchestrator role**: "preserves conversation context, owns high-level task decomposition, provides a rich structured handoff to task-planner"
- ✅ **Task Planner role**: "from a rich orchestrator handoff, formalizes plans without inventing missing strategic decisions... accepts assigned output paths for unit-level planning"
- ✅ No stale contradictions — old "decomposes multi-unit work" replaced with qualified language

### 7. Non-Goals Verification

| Non-Goal | Status |
|----------|--------|
| No model config changes in `opencode.jsonc` | ✅ Verified — no diff on `opencode.jsonc` |
| No parallel implementation | ✅ Verified — orchestrator.md line 194: "as parallel implementation is not supported" |
| No generic durable artifacts requirement | ✅ Verified — handoff focuses on conversation context preservation, not generic artifact creation |
| Not rewriting the full agent system | ✅ Verified — only 4 files changed |
| Not changing implementer, validator, other agents | ✅ Verified — only `orchestrator.md` and `task-planner.md` modified in `workflow/agents/` |
| Not adding/removing agents or altering orchestrator task permission | ✅ Verified — frontmatter unchanged |

## Issues Found

**None.** No blocking or non-blocking issues identified.

### Minor Observations (not issues)

- One blank line was removed between the DELEGATE section's agent list and the "Always return control" instruction. This is a cosmetic formatting difference with no functional impact.
- The word "real architectural decisions" was changed to "implementation-local decisions" in task-planner.md, which aligns with the spec's intent.

## Acceptance Criteria Review

All 10 testable acceptance criteria pass. All inspectable acceptance criteria are satisfied. All non-goals are respected.

## Residual Risks

None identified. The implementation is complete and matches the task spec.

## Verification Run Summary

- **Runner**: `npm run check` (project's sole validation mechanism)
- **Grep commands**: All 9 grep-based AC checks executed and passed
- **Manual inspection**: All 4 modified files read and verified against inspectable criteria
- **Git diff**: Reviewed to confirm scope of changes and non-goals
- **Frontmatter**: Validated via `npm run check` (pass)

## Limitations

- No dedicated test files exist for this task (per spec design). Validation relied on the project's `npm run check` gate + manual grep assertions + manual inspection.
- The grep-based criteria are mechanical pattern matches; they confirm the presence of required language but do not validate semantic correctness beyond what manual inspection provides.
- Manual inspection was performed on all 4 relevant files and confirmed completeness.
