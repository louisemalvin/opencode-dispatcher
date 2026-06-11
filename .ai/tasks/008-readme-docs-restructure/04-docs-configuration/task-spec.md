# Unit 4: docs/configuration.md

## Scope

Create `docs/configuration.md` covering model configuration, agy integration, opencode config locations, and install locations.

### Sections

1. **Model Configuration** — Describe the model-config agent and its MED/LOW group system:
   - MED group: `validator`, `test-writer`, `documentation`, `init` (intended for DeepSeek Pro class)
   - LOW group: `implementer`, `research`, `executor`, `shipper`, `model-config` (intended for Flash/cheap class)
   - Orchestrator and task-planner are excluded — their models are chosen directly by the user.
   - Config is written to `opencode.jsonc` or `.opencode/opencode.jsonc` as `agent.<name>.model` entries.
   - Mention the `opencode models --verbose` discovery flow and variant selection.

2. **Agy Integration** — Explain `agy` (Antigravity CLI integration):
   - What it is: offloads implementer work through `agy` to split quota across models.
   - How it's enabled: `agy: enabled` flag in `.ai/context.md` under `## Workflow`.
   - How the implementer uses it: constructs a prompt with persona + task spec + relevant files, runs `agy --dangerously-skip-permissions --print "<prompt>"`.
   - The flag is user-owned; agents do not modify it.

3. **OpenCode Config Locations** — Document where opencode configuration files live:
   - Project-level: `opencode.jsonc` (preferred) or `.opencode/opencode.jsonc`.
   - Global/user-level: `~/.config/opencode/` — contains `agents/`, `skills/`, `templates/`, and user-owned `AGENTS.md`.
   - Dispatcher installs into `~/.config/opencode/agents/`, `~/.config/opencode/skills/`, `~/.config/opencode/templates/`.

4. **Install Locations and Payloads** — From README and `bin/install.js`:
   - What the installer copies: agents, skills, templates under `~/.config/opencode/`.
   - What the installer does NOT manage: provider config, model settings, secrets, project dependencies, git config, `opencode.jsonc`, `node_modules`, global skills, project templates.
   - The global `~/.config/opencode/AGENTS.md` is user-owned and never touched.

5. **Install Safety** — Backup behavior:
   - Before overwriting a managed path, the installer backs it up with a timestamped `.bak-*` suffix (e.g., `agents.bak-2026-06-07T12-34-56-789Z`).
   - Same-named files may be overwritten; unrelated pre-existing files may remain; backups are kept beside the managed path.

6. **Restore and Uninstall** — Steps for restoring backups and uninstalling:
   - Stop OpenCode, rename current managed path, move `.bak-*` back, restart.
   - Uninstall: restore backups if pre-existing agents existed. Only remove managed paths outright if you don't need any current contents.

7. **Package Commands** — From `package.json`:
   - `npm run check` / `npx opencode-dispatcher check` — validates agent frontmatter and cross-references.
   - `npm run install:local` / `npx opencode-dispatcher install` — installs payloads.
   - `npx opencode-dispatcher` (no args) defaults to `install`.

### Source material

- README sections: Installation, Install from Source, What Gets Installed, Install Safety, Restore or Uninstall, Package Commands, Publication Status
- `workflow/agents/model-config.md`
- `workflow/agents/init.md` (agy section)
- `workflow/agents/implementer.md` (agy usage)
- `bin/install.js` (installer behavior, backup logic, payloads)
- `package.json` (bin entry, scripts)
- `.ai/context.md` (agy: enabled flag, conventions)

## Execution

- `documentation`

## Non-Goals

- Do not create or edit any files other than `docs/configuration.md` and this unit's `documentation-report.md`.
- Do not edit implementation files (`package.json`, `bin/install.js`, agent definitions).
- Do not duplicate agent role descriptions (those go in `docs/agents.md`) or workflow routing (those go in `docs/workflow.md`).
- Do not cover development/release processes (those go in `docs/development.md`).

## Testable Acceptance Criteria

None. Documentation-only.

## Inspectable Acceptance Criteria

1. `docs/configuration.md` exists.
2. All seven sections listed in Scope are present.
3. Model config section accurately describes MED/LOW groups, excluded agents (orchestrator, task-planner), config file locations, and the `opencode models --verbose` discovery flow.
4. Agy section explains what agy is, how it's enabled (`agy: enabled` in `.ai/context.md`), how the implementer uses it, and that the flag is user-owned.
5. OpenCode config locations section accurately lists `opencode.jsonc` vs `.opencode/opencode.jsonc` (priority order) and `~/.config/opencode/` contents.
6. Install locations section accurately lists what Dispatcher installs (agents, skills, templates) and what it does NOT install/manage.
7. Backup behavior matches `bin/install.js` (timestamped `.bak-*` suffixes, overlay semantics, non-merge behavior).
8. Restore/uninstall instructions are accurate and non-destructive. The distinction between restoring backups and fully removing paths is clear.
9. Package commands section lists `check`, `install`, and the default behavior (no args = install).
10. `~/.config/opencode/AGENTS.md` user-ownership is clearly stated.
11. Links to `docs/agents.md` and `docs/development.md` are included where relevant.

## Relevant Files

- `README.md` (sections: Installation, Install from Source, What Gets Installed, Install Safety, Restore or Uninstall, Package Commands, Publication Status)
- `workflow/agents/model-config.md`
- `workflow/agents/init.md`
- `workflow/agents/implementer.md`
- `bin/install.js`
- `package.json`
- `.ai/context.md`
