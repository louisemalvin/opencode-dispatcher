# Documentation Report

## Outcome

**Audit scope**: Read-only documentation audit of the full public-facing documentation surface for the `opencode-dispatcher` npm package, ahead of first public publishing. Every file listed in the in-scope table was read and checked against its cross-reference sources (11 agent definitions in `workflow/agents/*.md`, `bin/install.js`, `package.json`, `opencode.jsonc`, `.github/workflows/publish.yml`). No file was edited.

**Top-line findings**:

1. **P0 — Broken relative links on npm**: `README.md` links to `CHANGELOG.md`, `docs/`, and `LICENSE` via relative paths, but none of these files are included in `package.json` `"files"`. The npm registry rendering will show a README with dead links — a blocking issue for public publishing.

2. **P1 — Stale group-tier contradiction**: `docs/configuration.md` documents a two-tier model group system (MED = DeepSeek Pro class, LOW = Flash/cheap class), but the actual `opencode.jsonc` assigns every agent in both groups to `opencode-go/deepseek-v4-flash` (Flash class). A reader of the docs will expect a clear Pro/Flash split that the config does not deliver.

3. **P1 — Missing prerequisites**: Nowhere does the documentation explicitly state that OpenCode itself must be installed before using Dispatcher. The `npx opencode-dispatcher install` command is shown as the first step, but it will fail or behave unexpectedly without OpenCode present. A first-time npm visitor has no way to know this.

4. **P1 — Undefined jargon in npm description**: The `package.json` description calls Dispatcher a "low-context OpenCode dispatcher workflow" — the term "low-context" is never defined in README or the description itself, and "OpenCode" is assumed known.

5. **P2 — Unnecessary duplication**: `.ai/context.md` conventions are repeated nearly verbatim in `docs/development.md` (Project Context) and `docs/workflow.md` (Project Context). CI auto-publish details appear in three places.

---

## Files Changed

(none — read-only audit)

---

## Context Or Decisions Updated

None. No `.ai/context.md` or `.ai/decisions/` files were changed.

---

## Verification

The following audit dimensions were covered. Each was checked against the ground-truth sources listed in the task spec.

| Dimension | How It Was Verified |
|-----------|-------------------|
| **Accuracy** | Every `docs/*.md` claim about agent modes, permissions, routing, and configuration was cross-referenced against the 11 `workflow/agents/*.md` frontmatter blocks, `bin/install.js` `check()` logic, `opencode.jsonc` agent entries, `package.json` version/scripts/files, and `.github/workflows/publish.yml` trigger and steps. |
| **Completeness** | The full documentation surface was evaluated against five audience personas: first-time npm visitor, first-time user, prospective contributor, release maintainer, and security evaluator. Each persona's likely questions were enumerated and checked for coverage. |
| **Clarity** | Every document was read for undefined jargon ("agy", "low-context", "task artifacts", "zero-padded numeric prefix"), contradictory statements, missing cross-links, and buried critical information. |
| **Redundancy** | Content blocks that appear in multiple files were identified by comparing section-by-section across `README.md`, `docs/development.md`, `docs/workflow.md`, `.ai/context.md`, and agent YAML descriptions. |
| **Prioritized Recommendations** | Each finding was scored by its impact on first public publishing readiness and ordered accordingly. |

**Read-only confirmation**: No documentation, metadata, source, configuration, or context file was modified during this audit. The deliverable is this report only.

---

## Findings and Recommendations

### 1. Accuracy (Stale / Outdated Content)

#### 1.1 Group system model-tier contradiction (P1)

- **What the docs say**: `docs/configuration.md` describes a hardcoded two-tier group system where the MED group (`validator`, `test-writer`, `documentation`, `init`) uses "DeepSeek Pro class" models and the LOW group (`implementer`, `research`, `executor`, `shipper`, `model-config`) uses "Flash / cheap class" models. The same division is repeated in `workflow/agents/model-config.md` frontmatter prompt.
- **What the config shows**: `opencode.jsonc` assigns every agent in both the MED and LOW groups to the exact same model: `opencode-go/deepseek-v4-flash` with variant `max`. Not a single agent uses a Pro-class model.
- **Severity**: Material. The docs describe a tiered architecture that does not match the shipped configuration. A public evaluator reading the docs will expect a clear Pro/Flash split and find a uniform Flash assignment instead, eroding trust in the documentation's accuracy.

#### 1.2 Agent frontmatter completeness (no issues)

All 11 agent definition files in `workflow/agents/*.md` have valid YAML frontmatter with `description` and `mode`. The orchestrator's `task` permission block lists every subagent, and every subagent file (except the orchestrator itself) is present. This was cross-checked against the `check()` logic in `bin/install.js` lines 127–184. No accuracy issues.

#### 1.3 Mode and description consistency (no issues)

`docs/agents.md` agent table roles, modes, and summaries match the `workflow/agents/*.md` frontmatter `description` and `mode` fields exactly. Every agent's `mode` (one `primary`, ten `subagent`) is correctly documented.

#### 1.4 Permission descriptions vs YAML blocks (no significant issues)

The permission descriptions in `docs/agents.md` accurately reflect each agent's YAML permission blocks. The orchestrator's `bash` whitelist, `edit: deny`, and `task` scoping are correctly described. The executor's broad `*: allow` scope is correctly noted. The denial-by-default pattern and escape-hatch sealing are accurately characterized.

#### 1.5 Package commands vs actual scripts (no issues)

The `docs/configuration.md` "Package Commands" table matches `package.json` `"scripts"` and `bin/install.js` behavior exactly:
- `npm run check` → `node ./bin/install.js check` ✓
- `npm run install:local` → `node ./bin/install.js install` ✓
- Default command (`npx opencode-dispatcher` without args) → `install` ✓
- Invalid commands → usage message + non-zero exit ✓

#### 1.6 Check validation logic (no issues)

`docs/development.md` describes the check validation as enforcing frontmatter completeness (`description`, `mode`) and orchestrator cross-references. This matches `bin/install.js` `check()` function (lines 127–184), which also validates `workflow/skills` and `workflow/templates` are empty — the docs note this check explicitly.

#### 1.7 Version history consistency (no issues)

- `package.json` `"version": "0.3.3"`
- `README.md` Version History: v0.3.3 — correct.
- `CHANGELOG.md` latest entry: v0.3.3 — correct, same description.
- All three are consistent.

#### 1.8 Orchestrator state machine and routing (no issues)

`docs/workflow.md` describes the six-state machine (INTAKE → CLARIFY → ROUTE → DELEGATE → REVIEW → DONE), routing logic, and common routes. These match `workflow/agents/orchestrator.md` exactly, including the "smallest safe workflow" principle, subagent dispatch rules, and the review-then-DONE sequence.

#### 1.9 Multi-unit decomposition format (no issues)

The unit table format and child task-spec directory layout in `docs/workflow.md` match `workflow/agents/task-planner.md` exactly.

#### 1.10 CI trigger and publication conventions (no issues)

- `.ai/context.md` describes auto-publish as: push to `master` with `"bump to v"` in commit message, using `NPM_TOKEN`.
- `.github/workflows/publish.yml` trigger: `on: push: branches: [master]`, condition: `contains(github.event.head_commit.message, 'bump to v')`, auth: `NODE_AUTH_TOKEN` from `secrets.NPM_TOKEN`. ✓

---

### 2. Completeness (Missing Public-Publishing Guidance)

#### 2.1 Missing: prerequisites not stated anywhere (P1)

Nowhere in the README, `package.json`, or any doc does it state that **OpenCode itself must be installed** before using Dispatcher. The installation instructions show `npx opencode-dispatcher install` as the first step, but that command copies agents into `~/.config/opencode/agents/` — a directory that only exists if OpenCode has been installed and initialized. A first-time npm visitor will have no context for why the install "succeeds" but nothing appears to happen. **Files affected**: `README.md`, `package.json`.

#### 2.2 Missing: docs directory excluded from npm package (P0)

The `package.json` `"files"` field lists only `bin/`, `workflow/`, and `README.md`. The `docs/` directory, `CHANGELOG.md`, and `LICENSE` are **not** published to npm. This means:
- `README.md`'s relative links to `CHANGELOG.md`, `docs/workflow.md`, `docs/agents.md`, `docs/configuration.md`, `docs/development.md`, and `LICENSE` will all be **broken on the npm registry page**.
- npm users who install the package get the agent payload but none of the supporting documentation.
- **Files affected**: `package.json` (`"files"`), `README.md` (all relative links).

#### 2.3 Missing: first-invocation guidance gap (P2)

The README "First Use" section says "let the orchestrator initialize `.ai/context.md`" but does not explain *how* to invoke the orchestrator. A new user who installed from npm and opened their project has no explicit instruction on what to type or how to trigger the orchestrator. **Files affected**: `README.md`.

#### 2.4 Missing: Node.js version requirement (P2)

The CI workflow uses `node-version: 24`, and the package uses ESM (`"type": "module"`). No document states the minimum Node.js version required to run the installer or use the package from source. **Files affected**: `README.md`, `docs/development.md`, `package.json`.

#### 2.5 Present: installation instructions (both paths)

Both npm (`npx opencode-dispatcher install`) and source (`npm run check && npm run install:local`) installation paths are documented in README. ✓

#### 2.6 Present: getting-started guidance

README "First Use" provides a 5-step walkthrough. ✓

#### 2.7 Present: contributing / development guide

`docs/development.md` covers validation, conventions, release workflow, and CI. ✓

#### 2.8 Present: release and publish documentation

`docs/development.md` has a full Release Workflow section and CI Auto-Publish section. ✓

#### 2.9 Present: security / permission model overview

`docs/agents.md` has a dedicated Permission Philosophy section covering deny-by-default, role boundaries, escape hatch sealing, practical allowances, and task gating. ✓

#### 2.10 Present: license

`LICENSE` is MIT, `README.md` says "MIT. See LICENSE", `package.json` has `"license": "MIT"`. ✓

---

### 3. Clarity (Confusing Direction)

#### 3.1 Undefined npm description jargon (P1)

`package.json` description: *"A low-context OpenCode dispatcher workflow with orchestrator agents and task artifacts."*
- **"low-context"**: This term is never defined in any document. A first-time npm browser cannot tell what "low-context" means without reading the full README, and even the README does not use this phrase. The README uses "durable task state" and "resumable" to describe the value proposition. The npm description should mirror that accessible language.
- **"OpenCode"**: The description assumes knowledge of OpenCode. For a public npm listing, a brief parenthetical or one-liner defining what OpenCode is would help.
- **Files affected**: `package.json` (description field), `README.md`.

#### 3.2 "agy" jargon not defined in README (P1)

The term "agy" (Antigravity CLI integration) is defined only in `docs/configuration.md` (lines 48–75). It does not appear in `README.md` or `docs/agents.md`. A reader who encounters "agy" in the context of the init agent interview or implementer workflow has to know to look in `docs/configuration.md`. **Files affected**: `README.md`, `docs/agents.md`.

#### 3.3 Missing cross-link from README install to configuration details (P2)

The README "Installation" section shows the command but does not link to `docs/configuration.md` or explain what the installer actually does. The cross-link at the bottom ("Further Reading") lists `docs/configuration.md` but the installation section itself has no direct link to the detailed install/backup/restore documentation. **Files affected**: `README.md`.

#### 3.4 Group system described as "hardcoded" but actually user-configurable (P2)

`docs/configuration.md` says the groups are "hardcoded." While the tier division is indeed an architectural constant (which agents belong to MED vs LOW), the description could be read as implying the model assignments themselves are fixed, which contradicts the whole point of the model-config agent allowing user choice. The `opencode.jsonc` being different from the documented "Intended Model Class" column exacerbates this confusion. **Files affected**: `docs/configuration.md`.

#### 3.5 No statement about who the project is for (P2)

The README says what the project does but not who it is for. A clear "who should use this" statement (e.g., "for developers using OpenCode who want structured, auditable task workflows") would help first-time evaluators self-select. **Files affected**: `README.md`.

---

### 4. Redundancy (Duplicate / Unneeded Documentation)

#### 4.1 Duplicate: `.ai/context.md` description in two doc files (P2)

Both `docs/workflow.md` (lines 55–63) and `docs/development.md` (lines 88–93) contain a "Project Context" section describing `.ai/context.md` — its purpose, contents, who creates it, and how it is version-controlled. The descriptions are nearly verbatim. One of these should cross-reference the other instead of duplicating.
- **Files affected**: `docs/workflow.md`, `docs/development.md`.

#### 4.2 Duplicate: CI auto-publish documentation in three places (P2)

The auto-publish trigger and steps are documented in:
1. `.ai/context.md` (lines 18–19) — concise summary.
2. `docs/development.md` (lines 70–84) — detailed walkthrough.
3. `.github/workflows/publish.yml` (full YAML) — canonical source.
- The `docs/development.md` section is a near-verbatim English rendering of the YAML. It could be shortened to a cross-reference to the workflow file.
- **Files affected**: `docs/development.md`, `.ai/context.md`, `.github/workflows/publish.yml`.

#### 4.3 Duplicate: agent role summaries repeat YAML descriptions (P2)

Every agent's one-line "Role Summary" in `docs/agents.md` is a rephrasing of that agent's YAML `description` frontmatter field in `workflow/agents/*.md`. For example:
- Executor YAML: `"Executes simple single-file atomic edits that do not need a task spec, tests, or validation."`
- Docs table: `"Performs exact, mechanical, single-file atomic edits that do not need a task spec, tests, or validation"`
- This is intentional (the doc is meant to be a human-readable reference), but it means every description change must be updated in two places. A generator or cross-reference note would reduce drift risk.
- **Files affected**: `docs/agents.md`, `workflow/agents/*.md` (all 11 files).

#### 4.4 No completely unneeded documentation files identified

All four files under `docs/` serve the public audience. None are purely internal. The `LICENSE` is required. The `package.json`, `opencode.jsonc`, and `.github/workflows/publish.yml` are self-evident. No stale or superseded documentation files exist.

---

### 5. Prioritized Recommendations

| Priority | Summary | Files Affected | Rationale |
|----------|---------|---------------|-----------|
| **P0** | Add `docs/`, `CHANGELOG.md`, and `LICENSE` to `package.json` `"files"` so npm README relative links resolve | `package.json`, `README.md` | Without this, the npm landing page will display a README with broken links to every supporting document. This is the single most visible defect on the public listing. |
| **P0** | Update `README.md` relative links to absolute GitHub URLs (or ensure all linked files are in the package) | `README.md` | Even if `"files"` is updated, npm's README renderer may not resolve relative paths the same way GitHub does. Absolute URLs to the GitHub blob guarantee working links everywhere. |
| **P1** | State prerequisites (OpenCode must be installed) in README Installation and `package.json` description | `README.md`, `package.json` | First-time users cannot use Dispatcher without OpenCode. Omitting this creates immediate confusion and failed-first-attempt frustration. |
| **P1** | Align `docs/configuration.md` group-tier documentation with actual `opencode.jsonc`, or add a note explaining the config is a user-configured example different from the documented intent | `docs/configuration.md`, `opencode.jsonc` | The contradiction between documented Pro-class intent and all-Flash config undermines documentation credibility. Readers will wonder which to trust. |
| **P1** | Replace "low-context" in `package.json` description with plain language ("durable task artifacts" or "structured workflow") and add a brief OpenCode definition | `package.json` | The npm description is the first thing a public visitor sees. Jargon without definition and unexplained dependencies reduce conversion from browse to install. |
| **P1** | Define "agy" in `README.md` or `docs/agents.md` (or add a cross-link to `docs/configuration.md` agy section) | `README.md`, `docs/agents.md` | "agy" appears in agent interview prompts and implementer workflows but is only defined deep in `docs/configuration.md`. A reader encountering it in the agent reference has no way to learn what it means without guessing. |
| **P2** | Add Node.js minimum version requirement to README and docs/development.md | `README.md`, `docs/development.md`, `package.json` | The project uses ESM and CI runs Node 24. Contributors and source-install users need to know the floor. |
| **P2** | Add explicit invocation guidance to README First Use step 2 (what to type/say to trigger the orchestrator) | `README.md` | "Let the orchestrator initialize" assumes knowledge of how to invoke the orchestrator. A concrete prompt example would remove ambiguity. |
| **P2** | Convert one of the duplicate "Project Context" sections into a cross-reference to the other | `docs/workflow.md`, `docs/development.md` | Duplicating the same `.ai/context.md` description in two files creates a maintenance burden where one could link to the other. |
| **P2** | Shorten CI auto-publish documentation in `docs/development.md` to a brief summary + cross-reference to the workflow YAML | `docs/development.md` | The YAML file is the single source of truth for publish steps. The docs section is a near-verbatim English copy that will drift. |
| **P2** | Add a link from README Installation section directly to install details in `docs/configuration.md` | `README.md` | The installation section currently shows the command alone. Linking to backup/restore/uninstall details in configuration.md helps users understand what `install` actually does. |
| **P2** | Add a "who this is for" statement to the README | `README.md` | Helps npm visitors self-select quickly instead of inferring from technical details. |
