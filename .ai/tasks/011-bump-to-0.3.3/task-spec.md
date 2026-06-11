# Bump opencode-dispatcher from 0.3.2 to 0.3.3

## Scope

Bump the package version from **0.3.2 → 0.3.3** across all version-bearing files and update release documentation as required by `.ai/context.md`. This is a single-unit task encompassing:

### Package Metadata

- **`package.json`**: `"version": "0.3.2"` → `"version": "0.3.3"`
- **`package-lock.json`**: top-level `"version": "0.3.2"` → `"0.3.3"`, and nested `"packages"."":{"version":"0.3.2"}` → `"0.3.3"`

### Release Documentation

- **`CHANGELOG.md`**: prepend a `## [v0.3.3]` entry before `## [v0.3.2]` describing the no-glob-for-`.ai` workflow fix (see Inspectable Acceptance Criteria).
- **`README.md`**: add a `## Version History` section between `## Further Reading` and `## License` with entries for v0.3.3, v0.3.2, v0.3.1, and v0.3.0 — each a one-line bullet summarising the release — plus a link to `CHANGELOG.md` for the complete history.

### Validation Gate

- `npm run check` must pass with exit code 0.

## Execution

- implementer
- validator

## Non-Goals

- No agent or workflow file changes.
- No `.ai/context.md` edits.
- No edits to `CHANGELOG.md` entries prior to v0.3.2 — only the new v0.3.3 entry is added; existing entries are left untouched.
- Do **not** commit or push — the shipper agent handles the `chore(release): bump to v0.3.3` commit and push separately.
- No changes to `docs/` files, `workflow/` files, `bin/install.js`, or CI configuration.

## Testable Acceptance Criteria

### Version String Accuracy

- `jq -r '.version' package.json` returns `"0.3.3"`.
- `jq -r '.name + " " + .version' package.json` returns `"opencode-dispatcher 0.3.3"`.
- `jq -r '.version + " " + (.packages[""].version // "missing")' package-lock.json` returns `"0.3.3 0.3.3"` — both top-level and nested `packages[""]` versions are bumped.
- `grep -c "0.3.2" package.json package-lock.json` returns `0` — no stale `0.3.2` version strings remain in version fields.
- `grep -c "0.3.3" package.json package-lock.json` in version-bearing lines returns the expected count (3 total: one in `package.json`, two in `package-lock.json`).

### Validation Gate

- `npm run check` exits 0 with no errors.

### Changelog Integrity

- `grep -q "## \[v0.3.3\]" CHANGELOG.md` succeeds — the new entry exists.
- `grep -n "## \[v0\.3\." CHANGELOG.md` confirms `## [v0.3.3]` appears on a line-number **lower** than `## [v0.3.2]` (i.e., it is the first changelog entry, above all prior versions).

### README Version History

- `grep -q "## Version History" README.md` succeeds — the section heading exists.
- `grep -q "v0.3.3" README.md` succeeds — the new version is listed.
- `grep -q "v0.3.2\|v0.3.1\|v0.3.0" README.md` succeeds — prior recent versions are listed.
- `grep -q "CHANGELOG.md" README.md` succeeds both in the `## Further Reading` link and in the new Version History section link — the delegate link to full changelog is preserved in both places.

### Test File Paths

- `package.json`
- `package-lock.json`
- `CHANGELOG.md`
- `README.md`

## Inspectable Acceptance Criteria

### CHANGELOG.md

- `CHANGELOG.md` opens with a `## [v0.3.3]` heading followed by a bullet describing the no-glob-for-`.ai` fix, then `## [v0.3.2]` (existing entry). No other entries are altered.
- The v0.3.3 entry explains that agent instructions (orchestrator, task-planner, implementer, validator, shipper, test-writer, documentation) and project docs now use the `read` tool (or `ls`) instead of `glob` for `.ai/` file access, because `glob` does not match dot-directories reliably across environments.

### README.md

- A `## Version History` section appears between `## Further Reading` and `## License`.
- The section lists v0.3.3, v0.3.2, v0.3.1, and v0.3.0 as bullets, each with a one-line summary of the release.
- The section ends with a "See CHANGELOG.md for complete version history" link.
- The existing `## Further Reading` link to `CHANGELOG.md` is preserved and not duplicated redundantly.

### Overall

- `git diff` shows **only** the four files above changed, with no unintended modifications.
- All edits follow existing formatting conventions (Markdown heading style, bullet style, indentation) observed in the files.

## Relevant Files

- `package.json` — sole source of truth for the npm package version.
- `package-lock.json` — mirrors the version in two places (top-level `version` and `packages[""].version`).
- `CHANGELOG.md` — canonical version-history document, linked from `README.md`.
- `README.md` — project-level readme; `.ai/context.md` requires Version History entries here on every version bump.
- `.ai/context.md` — defines version-bump conventions (Conventional Commits message `chore(release): bump to vX.Y.Z`, validation gate `npm run check`, README Version History requirement).
