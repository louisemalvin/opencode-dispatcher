# Unit 5: docs/development.md

## Scope

Create `docs/development.md` covering repository maintenance, validation, release conventions, and publishing.

### Sections

1. **Validation** — The project's check system:
   - `npm run check` runs `node ./bin/install.js check`.
   - It validates agent frontmatter completeness (YAML with `description`, `mode`, `permission`).
   - It enforces cross-references: every agent permitted by the orchestrator has a corresponding `.md` file, and vice-versa.
   - `npm run check` must pass before releases.

2. **Repository Structure** — Brief overview:
   - `bin/install.js` — installer and checker.
   - `workflow/agents/` — agent markdown definitions with YAML frontmatter.
   - `workflow/skills/` — skill definitions.
   - `workflow/templates/` — task artifact templates.
   - `.ai/` — project-level task artifacts and context (git-tracked).
   - `.github/workflows/publish.yml` — CI auto-publish workflow.

3. **Conventions** — From `.ai/context.md`:
   - Language: Node.js (ESM).
   - JS style: StandardJS / Prettier defaults (semicolons, double quotes, trailing commas).
   - Naming: kebab-case for files, camelCase for JS identifiers.
   - File layout: flat, no `src/` directory.
   - Commit messages: Conventional Commits v1.0.0 format.
   - Version bumps: `chore(release): bump to vX.Y.Z`.

4. **Release Workflow** — End-to-end release process:
   - Prepare package metadata changes (`package.json` version bump).
   - Prepare README/CHANGELOG version history updates before invoking shipper (per `.ai/context.md` conventions).
   - The shipper agent handles git commit and push.
   - Commit format: `chore(release): bump to vX.Y.Z`.

5. **CI Auto-Publish** — `.github/workflows/publish.yml`:
   - Triggers on push to `master` when commit message contains "bump to v".
   - Uses `actions/checkout@v6`, `actions/setup-node@v6` with `node-version: 24`.
   - Runs `npm publish` using `NPM_TOKEN` secret.
   - Package name on npm: `opencode-dispatcher`.

6. **Project Context** — How `.ai/context.md` is maintained:
   - Created by the init agent on first use.
   - Updated by the documentation agent when delegated.
   - Contains test setup, conventions, and workflow flags.
   - Git-tracked as part of the repository.

### Source material

- `.ai/context.md`
- `package.json`
- `bin/install.js`
- `.github/workflows/publish.yml`
- README section: Package Commands (for check/install commands)

## Execution

- `documentation`

## Non-Goals

- Do not create or edit any files other than `docs/development.md` and this unit's `documentation-report.md`.
- Do not edit `.github/workflows/publish.yml`, `package.json`, `bin/install.js`, or any agent definitions.
- Do not duplicate agent roles (docs/agents.md), workflow routing (docs/workflow.md), or configuration details (docs/configuration.md).
- Do not add new conventions — document only what already exists in `.ai/context.md`.

## Testable Acceptance Criteria

None. Documentation-only.

## Inspectable Acceptance Criteria

1. `docs/development.md` exists.
2. All six sections listed in Scope are present.
3. Validation section accurately describes `npm run check`, what it validates (frontmatter, cross-references), and that it must pass before releases.
4. Repository structure section accurately describes the directory layout and key files.
5. Conventions section accurately reflects `.ai/context.md` (language, style, naming, file layout, commit format, version bump format).
6. Release workflow section describes the end-to-end release process: prepare metadata + changelog, invoke shipper, commit format.
7. CI auto-publish section accurately describes `.github/workflows/publish.yml` trigger condition, node version, actions used, and `NPM_TOKEN` usage.
8. Project context section describes `.ai/context.md` creation (init agent), updates (documentation agent), and contents.
9. Links to `docs/configuration.md` (for install/package commands) are included where relevant.

## Relevant Files

- `.ai/context.md`
- `package.json`
- `bin/install.js`
- `.github/workflows/publish.yml`
- `workflow/agents/init.md`
- `workflow/agents/shipper.md`
- `workflow/agents/documentation.md`
