# Development

This document covers repository maintenance, validation, release conventions, and publishing for the OpenCode Dispatcher package.

## Validation

The project uses a single check command as its validation gate:

```bash
npm run check
```

This is equivalent to:

```bash
node ./bin/install.js check
```

The check validates the following:

- **Agent frontmatter completeness** — Every agent markdown file in `workflow/agents/` must contain YAML frontmatter (delimited by `---`) with required fields:
  - `description` — A summary of the agent's role.
  - `mode` — One of `primary`, `subagent`, or `all`.
  - `permission` — Permission blocks that define what the agent may read, edit, or execute.
- **Cross-reference integrity** — Every agent that the orchestrator permits (via its `permission.task` block) must have a corresponding `.md` file in `workflow/agents/`, and every agent file (except the orchestrator itself) must be listed in the orchestrator's permitted set.

The check also verifies that `workflow/skills/` and `workflow/templates/` are empty or absent, since workflow behavior has been consolidated into agent definitions.

`npm run check` must pass before any release.

For a full list of package commands, see [Configuration](configuration.md).

## Repository Structure

| Path | Purpose |
|------|---------|
| `bin/install.js` | CLI installer and checker — supports `install` and `check` commands |
| `workflow/agents/` | Agent markdown definitions with YAML frontmatter |
| `workflow/skills/` | Skill definitions (currently unused; must remain empty) |
| `workflow/templates/` | Task artifact templates (currently unused; must remain empty) |
| `.ai/` | Project-level task artifacts and project context (git-tracked) |
| `.github/workflows/publish.yml` | CI auto-publish workflow |

## Conventions

The project follows these conventions, defined in `.ai/context.md`:

| Aspect | Convention |
|--------|------------|
| **Language** | Node.js (ESM — `"type": "module"` in `package.json`) |
| **JS style** | StandardJS / Prettier defaults (semicolons, double quotes, trailing commas) |
| **Naming** | kebab-case for files; camelCase for JavaScript identifiers and functions |
| **File layout** | Flat structure — CLI scripts live in `bin/`; no `src/` directory |
| **Commit messages** | [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) format |
| **Version bumps** | `chore(release): bump to vX.Y.Z` |

## Release Workflow

The end-to-end release process follows these steps:

1. **Prepare metadata** — Bump the version number in `package.json` following semver.
2. **Prepare documentation** — Update the Version History section in `README.md` with a description of the changes included in the release. Any changelog updates should also be prepared at this stage.
3. **Invoke the shipper agent** — The shipper handles the git commit and push. All metadata and documentation changes must be ready before the shipper is invoked.
4. **Commit format** — The shipper uses the commit message `chore(release): bump to vX.Y.Z`, which matches the CI auto-publish trigger pattern.

Per the [project conventions](#conventions), version bump preparation (metadata and README changes) must be completed by the responsible agent (implementer, executor, or documentation) before the shipper is called.

## CI Auto-Publish

The repository includes a GitHub Actions workflow at `.github/workflows/publish.yml` that handles automated publishing.

**Trigger**: Push to the `master` branch when the head commit message contains `bump to v`.

**Workflow steps**:

1. `actions/checkout@v6` — Checks out the repository.
2. `actions/setup-node@v6` — Sets up Node.js version 24 with the npm registry URL.
3. `npm ci` — Installs dependencies from the lockfile.
4. `npm run check` — Runs the validation gate.
5. `npm publish` — Publishes the package to the npm registry.

**Authentication**: The publish step uses the `NODE_AUTH_TOKEN` environment variable set from the repository's `NPM_TOKEN` secret.

The published package name on npm is `opencode-dispatcher`.

## Project Context

The project's durable context file (`.ai/context.md`) is maintained as follows:

- **Creation** — Created by the **init agent** on first use in a project. The init agent interviews the user to capture test setup, conventions, and workflow preferences, then writes `.ai/context.md`.
- **Updates** — Updated by the **documentation agent** when delegated by the orchestrator for documentation tasks.
- **Contents** — Contains test setup (framework, runner, glob patterns), conventions (language, style, naming, file layout), workflow flags (e.g., `agy: enabled`), and publication settings.
- **Version control** — Git-tracked as part of the repository, making project conventions inspectable and reviewable alongside code.
