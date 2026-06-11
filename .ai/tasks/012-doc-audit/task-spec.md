# Task Spec: Documentation Audit for Public Publishing

## Scope

Perform a **read-only** audit of all repository documentation and public-facing package metadata to produce a findings-first `documentation-report.md`. The audit must identify stale content, confusing direction, missing public-publishing guidance, redundant or unneeded documentation, and prioritized recommendations. No documentation or source changes may be made during this task — the deliverable is strictly the report.

### In-Scope Files (Documentation Surface)

All files that a first-time public visitor, prospective user, or contributor would encounter:

| File | Audience | Note |
|------|----------|------|
| `README.md` | Public landing page | npm listing, GitHub front page |
| `CHANGELOG.md` | Returning users / contributors | Version history |
| `docs/agents.md` | Users wanting agent details | Agent reference and permission model |
| `docs/configuration.md` | Users configuring models/agy | Model config, agy, install details |
| `docs/development.md` | Contributors / maintainers | Validation, conventions, releases, CI |
| `docs/workflow.md` | Users wanting workflow internals | Orchestrator state machine, task artifacts |
| `LICENSE` | Everyone | Legal |
| `package.json` | npm consumers / tools | Package metadata (description, keywords, repo, homepage, bugs) |
| `opencode.jsonc` | Users via OpenCode | Per-agent model config — doubles as structural documentation of agent tiers |
| `.github/workflows/publish.yml` | Contributors / CI consumers | Auto-publish trigger and steps |
| `.ai/context.md` | Agent developers, project contributors | Project conventions, workflow flags, publication settings |

### Cross-Reference Sources for Consistency Checking

The following files define ground-truth behavior that documentation must be consistent with:

| File(s) | Truth Source For |
|---------|------------------|
| `workflow/agents/*.md` (11 agents) | Agent roles, permissions, mode, tool grants, routing rules |
| `bin/install.js` | Installer behavior, `check` validation logic, payload names |
| `package.json` `"scripts"`, `"bin"`, `"version"`, `"files"` | Commands, current version, published files |
| `opencode.jsonc` `"agent"` block | Currently configured agent models and tiers |

### Out of Scope

- Agent definition files themselves (`workflow/agents/*.md`) — they are audited only for consistency against docs, not for internal correctness.
- Source code beyond what is listed above.
- `.ai/tasks/` history, `.ai/decisions/`, `.gitignore`, or any internal task artifacts.
- Actual editing of any file. This is strictly read-only.

---

## Execution

- documentation
- validator

---

## Non-Goals

- Editing any documentation, metadata, or source file.
- Proposing new document contents or a restructure plan (recommendations are directional, not prescriptive rewrites).
- Auditing `.ai/tasks/` history, decision notes, or internal agent implementation correctness.
- Assessing SEO, npm ranking, or marketing.
- Validating the technical accuracy of agent definitions beyond consistency checks.

---

## Testable Acceptance Criteria

1. **Documentation-report structure**: The report at `.ai/tasks/012-doc-audit/documentation-report.md` must contain all five required sections:
   - `## Outcome` — summary of audit scope and top-line findings.
   - `## Files Changed` — must be empty or state `(none — read-only audit)`.
   - `## Context Or Decisions Updated` — must state none were changed.
   - `## Verification` — self-assessment that each audit dimension was covered.
   - `## Findings and Recommendations` — the core findings body (see Inspectable Acceptance Criteria below).

2. **Files-surfaced completeness**: The report must reference every file listed in the In-Scope Files table above, either as a finding or as an explicit "no issues found" entry.

3. **Read-only compliance**: The report must explicitly confirm that no documentation, metadata, or source files were modified during the audit.

4. **Prioritized recommendations**: The report must contain a prioritized recommendations list ordered by impact (highest first), with a one-line rationale for each priority assignment.

### Test File Paths

- `.ai/tasks/012-doc-audit/documentation-report.md` (the report itself, validated structurally)

---

## Inspectable Acceptance Criteria

The audit must address the following dimensions. Each dimension must have a dedicated subsection in `## Findings and Recommendations`:

### 1. Accuracy (Stale / Outdated Content)

Identify any content that is:
- Factually incorrect when compared against current source files (agent definitions, installer, package.json version, opencode.jsonc, CI workflow).
- Referencing removed features, old version numbers, or changed behaviors.
- Stating permissions, commands, or routing rules that differ from the current agent YAML frontmatter or orchestrator prompt.

Key consistency checks:
- `docs/agents.md` agent table vs `workflow/agents/*.md` frontmatter `mode` and `description`.
- `docs/agents.md` permission descriptions vs actual `workflow/agents/*.md` YAML permission blocks.
- `docs/configuration.md` group system (MED/LOW) and excluded agents vs `opencode.jsonc`.
- `docs/configuration.md` package commands vs `package.json` scripts and `bin/install.js`.
- `docs/development.md` check validation logic vs `bin/install.js` `check()`.
- `README.md` version history entry vs `CHANGELOG.md` latest version and `package.json` version.
- `docs/workflow.md` orchestrator state machine and routing vs `workflow/agents/orchestrator.md` prompt.
- `docs/workflow.md` multi-unit decomposition format vs `workflow/agents/task-planner.md` prompt.
- `.ai/context.md` publication conventions vs `.github/workflows/publish.yml` trigger and steps.

### 2. Completeness (Missing Public-Publishing Guidance)

Identify gaps that would confuse or block:
- A first-time user finding this package on npm who wants to understand what it does and how to install it.
- A user who wants to contribute back (fork, PR, local dev setup).
- A maintainer who needs to cut a release (version bump, changelog, CI trigger).
- Someone evaluating whether the agent permission model is safe for their project.

Expected coverage areas to audit for:
- Installation instructions (npm vs source) — are both present and correct?
- First-use / getting-started guidance — does it exist and work?
- Contributing / development guide — is there a clear path?
- Release / publish documentation — are the steps and CI trigger documented?
- Security / permission model overview — is it accessible to evaluators?
- License — is it clearly stated and consistent?

### 3. Clarity (Confusing Direction)

Identify content that is:
- Ambiguous about what the project is and when to use it.
- Using internal jargon without definition (e.g., "agy", "task artifacts", "validator", "zero-padded numeric prefix").
- Contradictory across documents (two docs saying different things about the same topic).
- Missing navigational cross-links between related topics.
- Structured in a way that buries critical information (e.g., first-use instructions not prominent, agent reference mixed with implementation details).

### 4. Redundancy (Duplicate / Unneeded Documentation)

Identify:
- Content that appears in multiple places with no clear single source of truth.
- Documentation files or sections that are irrelevant to the project's public audience.
- Sections that should be collapsed or cross-referenced instead of duplicated.
- Documentation that has been superseded by agent definitions or other canonical sources.

### 5. Prioritized Recommendations

A ranked list of recommended fixes, ordered by impact on public publishing readiness. Each entry must include:
- Priority (P0 = blocks publishing, P1 = materially harms first impression, P2 = nice to have)
- One-line summary
- Which files are affected
- Brief rationale for the priority

---

## Validation Plan

After the documentation agent writes `documentation-report.md`, the validator must:

1. Confirm the report exists at `.ai/tasks/012-doc-audit/documentation-report.md`.
2. Verify all five required sections are present (`## Outcome`, `## Files Changed`, `## Context Or Decisions Updated`, `## Verification`, `## Findings and Recommendations`).
3. Verify every in-scope file is referenced (either as a finding or explicit "no issues" statement).
4. Verify the report explicitly states no files were modified.
5. Verify `## Findings and Recommendations` contains a dedicated subsection for each of the five audit dimensions (Accuracy, Completeness, Clarity, Redundancy, Prioritized Recommendations).
6. Verify the Prioritized Recommendations subsection contains at least one entry per priority level found, with rationale.
7. Spot-check at least three consistency claims by reading the referenced ground-truth files and confirming the finding is accurate.

---

## Relevant Files

All files listed in the In-Scope Files and Cross-Reference Sources tables above:

- `README.md`
- `CHANGELOG.md`
- `docs/agents.md`
- `docs/configuration.md`
- `docs/development.md`
- `docs/workflow.md`
- `LICENSE`
- `package.json`
- `opencode.jsonc`
- `.github/workflows/publish.yml`
- `.ai/context.md`
- `workflow/agents/orchestrator.md`
- `workflow/agents/documentation.md`
- `workflow/agents/executor.md`
- `workflow/agents/implementer.md`
- `workflow/agents/init.md`
- `workflow/agents/model-config.md`
- `workflow/agents/research.md`
- `workflow/agents/shipper.md`
- `workflow/agents/task-planner.md`
- `workflow/agents/test-writer.md`
- `workflow/agents/validator.md`
- `bin/install.js`
