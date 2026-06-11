## Test Setup

- **Framework**: None. The project uses `npm run check` (`node ./bin/install.js check`) as its sole validation mechanism. This verifies agent frontmatter integrity and orchestrator cross-references.
- **Runner**: `npm run check`
- **Glob**: N/A

## Conventions

- **Language**: Node.js (ESM — `"type": "module"` in package.json).
- **JS Style**: StandardJS / Prettier defaults (semicolons, double quotes, trailing commas).
- **Naming**: kebab-case for files, camelCase for JavaScript identifiers and functions.
- **Imports**: ESM imports. No strict conventions on import ordering or file extensions.
- **File Layout**: Flat structure. CLI scripts live in `bin/`. No `src/` directory — new JS code goes at root or in `bin/`.
- **UI Framework**: None. This is a CLI/agent-workflow npm package with no browser UI.
- **Styling**: Not applicable.
- **Agent Files**: Markdown files in `workflow/agents/` use YAML frontmatter with required fields: `description`, `mode` (one of `primary`, `subagent`, or `all`), and `permission` blocks.
- **Validation Gate**: `npm run check` must pass before releases. It enforces frontmatter completeness and that every agent permitted by the orchestrator has a corresponding markdown file, and vice-versa.
- **Publication**: This package is published to npm as `opencode-dispatcher`. Version bumps follow semver in `package.json`. Every version bump commit must also update `README.md` Version History with a new entry describing the changes.
- **Auto-publish**: `.github/workflows/publish.yml` triggers `npm publish` on push to `master` when the commit message contains "bump to v". Uses `NPM_TOKEN` secret.

## Workflow

- **agy**: enabled
- **Commit messages**: Conventional Commits v1.0.0 format. Version bumps use `chore(release): bump to vX.Y.Z`. The shipper agent handles commits and pushes.
