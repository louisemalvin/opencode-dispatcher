# Bump opencode-dispatcher from 0.3.3 to 0.4.0

## Scope

Bump the package version from **0.3.3 → 0.4.0** across all version-bearing files and update release documentation as required by `.ai/context.md`. This is a single-unit task encompassing:

### Package Metadata

- **`package.json`**: `"version": "0.3.3"` → `"version": "0.4.0"`
- **`package-lock.json`**: top-level `"version": "0.3.3"` → `"0.4.0"`, and nested `"packages"."":{"version":"0.3.3"}` → `"0.4.0"`

### Release Documentation

- **`CHANGELOG.md`**: prepend a `## [v0.4.0]` entry before `## [v0.3.3]` describing the workflow improvements from tasks 014 and 015.
- **`README.md`**: add a `v0.4.0` entry at the top of the `## Version History` list, before the existing `v0.3.3` entry.

### Validation Gate

- `npm run check` must pass with exit code 0.

## Execution

- `implementer`
- `validator`

## Non-Goals

- Do **not** commit or push — the shipper agent handles the `chore(release): bump to v0.4.0` commit and push separately.
- Do **not** publish manually with `npm publish` — auto-publish is triggered by push of release commit to `master` via `.github/workflows/publish.yml`.
- Do **not** change agent behavior, prompts, or model assignments — the functional prompt/docs changes already exist from tasks 014 and 015.
- Do **not** edit `CHANGELOG.md` entries prior to v0.3.3 — only the new v0.4.0 entry is added; existing entries are left untouched.
- Do **not** change `docs/` files, `workflow/` files, `bin/install.js`, or CI configuration.
- Do **not** change `.ai/context.md`.

## Testable Acceptance Criteria

### Version String Accuracy

- `jq -r '.version' package.json` returns `"0.4.0"`.
- `jq -r '.name + " " + .version' package.json` returns `"opencode-dispatcher 0.4.0"`.
- `jq -r '.version + " " + (.packages[""].version // "missing")' package-lock.json` returns `"0.4.0 0.4.0"` — both top-level and nested `packages[""]` versions are bumped.
- `grep -c "0.3.3" package.json package-lock.json` returns `0` — no stale `0.3.3` version strings remain in version fields.
- `grep -c "0.4.0" package.json package-lock.json` in version-bearing lines returns the expected count (3 total: one in `package.json`, two in `package-lock.json`).

### Validation Gate

- `npm run check` exits 0 with no errors.

### Changelog Integrity

- `grep -q "## \[v0.4.0\]" CHANGELOG.md` succeeds — the new entry exists.
- `grep -n "## \[v0\.4\.0\]\|## \[v0\.3\.3\]" CHANGELOG.md` confirms `## [v0.4.0]` appears on a line-number **lower** than `## [v0.3.3]` (i.e., it is the first changelog entry, above all prior versions).

### README Version History

- `grep -q "## Version History" README.md` succeeds — the section heading exists.
- `grep -q "v0.4.0" README.md` succeeds — the new version is listed.
- `grep -n "v0.4.0\|v0.3.3" README.md` confirms `v0.4.0` appears on a line-number **lower** than `v0.3.3` (i.e., it is the first entry under `## Version History`).

### Release Notes Content (CHANGELOG.md and README.md)

- `grep -qi "handoff\|handoff contract" CHANGELOG.md README.md` succeeds — release notes mention the stronger orchestrator-to-task-planner handoff contract.
- `grep -qi "decomposition\|multi-unit\|parallel.*plan" CHANGELOG.md README.md` succeeds — release notes mention orchestrator-owned decomposition and support for parallel task-planner planning.
- `grep -qi "docs-first" CHANGELOG.md README.md` succeeds — release notes mention docs-first routing for cross-cutting durable context.
- `grep -qi "documentation.*durable\|durable.*source" CHANGELOG.md README.md` succeeds — release notes mention documentation agent durable source artifact ownership.
- `grep -qi "validator.*source\|validator.*cited\|cited.*artifact" CHANGELOG.md README.md` succeeds — release notes mention validator checks cited source artifacts.

### Test File Paths

- `package.json`
- `package-lock.json`
- `CHANGELOG.md`
- `README.md`

## Inspectable Acceptance Criteria

### CHANGELOG.md

- `CHANGELOG.md` opens with a `## [v0.4.0]` heading followed by bullet items describing the key workflow improvements from this release, then `## [v0.3.3]` (existing entry). No other entries are altered.
- The v0.4.0 entry covers:
  - Stronger orchestrator-to-task-planner handoff contract to avoid lossy brief-summary delegation.
  - Orchestrator-owned high-level decomposition and support for parallel task-planner planning with assigned paths.
  - Docs-first routing for cross-cutting durable context such as UX, product, domain, architecture, API, and security decisions.
  - Documentation agent durable source artifact ownership.
  - Validator checks cited source artifacts when task specs cite them.
  - Orchestrator prompt cleanup with clearer responsibility split so task-planner owns detailed planning mechanics.

### README.md

- The `## Version History` section has a new `v0.4.0` entry at the top, before `v0.3.3`.
- The v0.4.0 bullet follows the existing format: `- **v0.4.0** — ` followed by a concise one-line summary (e.g., "Workflow improvements: stronger orchestrator-task-planner handoff, parallel planning, docs-first routing, documentation owns durable artifacts, validator checks cited source artifacts.").
- The v0.3.3 entry and any other version entries below it are unchanged.
- The existing `## Further Reading` link to `CHANGELOG.md` is preserved.

### Overall

- `git diff` shows **only** the four files above changed (`package.json`, `package-lock.json`, `CHANGELOG.md`, `README.md`), with no unintended modifications to other files.
- All edits follow existing formatting conventions (Markdown heading style, bullet style, indentation) observed in the files.

## Relevant Files

- `package.json` — sole source of truth for the npm package version.
- `package-lock.json` — mirrors the version in two places (top-level `version` and `packages[""].version`).
- `CHANGELOG.md` — canonical version-history document, linked from `README.md`.
- `README.md` — project-level readme; `.ai/context.md` requires Version History entries here on every version bump.
- `.ai/context.md` — defines version-bump conventions (Conventional Commits message `chore(release): bump to vX.Y.Z`, validation gate `npm run check`, README Version History requirement).
- `.github/workflows/publish.yml` — auto-publish trigger on push to `master` when commit message contains "bump to v".
- `.ai/tasks/014-orchestrator-task-planner-contract/task-spec.md` — reference for release note content (orchestrator→task-planner handoff contract, parallel planning).
- `.ai/tasks/015-orchestrator-task-planner-cleanup/task-spec.md` — reference for release note content (docs-first routing, documentation durable artifacts, validator cited source check, orchestrator cleanup).
- `.ai/tasks/011-bump-to-0.3.3/task-spec.md` — reference for version bump procedure and formatting conventions.
