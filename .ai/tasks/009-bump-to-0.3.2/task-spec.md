# Bump opencode-dispatcher from 0.3.1 to 0.3.2

## Scope

Bump the package version from **0.3.1 → 0.3.2** in all version-bearing files and record the change in the changelog. This is a single-unit task:

- **`package.json`**: `"version": "0.3.1"` → `"version": "0.3.2"`
- **`package-lock.json`**: top-level `"version": "0.3.1"` and nested `"packages"."":{"version": "0.3.1"` → `"0.3.2"`
- **`CHANGELOG.md`**: prepend a `## [v0.3.2]` entry before `## [v0.3.1]` describing the model-config consent fix (see Acceptance Criteria below). `README.md` delegates the version-history role to `CHANGELOG.md` via its "Further Reading" link; no direct edit to `README.md` is needed.

## Execution

- implementer

## Non-Goals

- No agent or workflow file changes.
- No `.ai/context.md` edits.
- No `CHANGELOG.md` entries before v0.3.2 — only the new v0.3.2 entry is added.
- Do not commit or push — the shipper agent handles that separately.

## Testable Acceptance Criteria

- `jq -r '.version' package.json` returns `"0.3.2"`.
- `jq -r '.name + " " + .version' package.json` returns `"opencode-dispatcher 0.3.2"`.
- `jq -r '.version + " " + (.packages[""].version // "missing")' package-lock.json` returns `"0.3.2 0.3.2"` — i.e., both top-level and nested package versions are bumped.
- `npm run check` exits 0 with no errors.
- `grep -c "0.3.1" package.json package-lock.json` returns 0 (no stale old version strings remain in version fields).
- `grep -q "## \[v0.3.2\]" CHANGELOG.md` succeeds (the new entry exists as the first changelog entry above `## [v0.3.1]`).

### Test File Paths

- `package.json`
- `package-lock.json`
- `CHANGELOG.md`

## Inspectable Acceptance Criteria

- `CHANGELOG.md` opens with a `## [v0.3.2]` heading followed by a bullet summarising the model-config consent fix, then `## [v0.3.1]` (existing entry). No other entries are altered.
- The v0.3.2 entry explains that the `model-config` agent no longer silently accepts default model selections without explicit user consent — it now requires the user to confirm before applying default models.

## Relevant Files

- `package.json` — sole source of truth for the npm package version.
- `package-lock.json` — mirrors the version in two places (top-level and `packages[""]`).
- `CHANGELOG.md` — canonical version-history document, linked from `README.md`.
- `.ai/context.md` — defines the version-bump conventions (Conventional Commits message format, validation gate `npm run check`).
