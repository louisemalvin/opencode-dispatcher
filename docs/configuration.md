# Configuration

## Model Configuration

Dispatcher supports per-agent model assignment through a two-tier group system managed by the **model-config** agent.

### Group System

The configurable subagents are divided into two recommendation tiers:

| Group | Agents | Recommended Model Class |
|-------|--------|------------------------|
| **MED** | `validator`, `test-writer`, `documentation`, `init` | Medium reasoning model |
| **LOW** | `implementer`, `research`, `executor`, `shipper`, `model-config` | Cheaper / lower reasoning model |

The **orchestrator** and **task-planner** are excluded from group assignment — their models are chosen directly by the user in OpenCode itself. The task-planner is intended to use the same model as the orchestrator.

These are recommendation tiers, not hardcoded assignments — you choose the actual model for each group through the model-config agent. The `opencode.jsonc` file included in this repository is the maintainer's preset: a ready-to-use starting point that you can override with your own model choices.

### Configuration Flow

1. The orchestrator delegates model configuration to the **model-config** agent.
2. The model-config agent runs `opencode models --verbose` to discover available models and their variants on the system.
3. It checks for an existing opencode config at `opencode.jsonc` or `.opencode/opencode.jsonc` (in that order of preference).
4. It presents both groups to the user with their intended model tiers and asks the user to pick one model (and optionally a variant) for each group — not per-agent.
5. For the chosen model, if it has variants (non-empty `variants` object in verbose output), the user is prompted to select one or skip. Models with no variants (`{}`) skip the variant prompt silently.
6. The model-config agent writes `agent.<name>.model` (and optionally `agent.<name>.variant`) entries for every agent in each group into the project's opencode config, preserving all existing content.

### Config File Format

The model assignments are written to `opencode.jsonc` or `.opencode/opencode.jsonc`:

```jsonc
{
  "agent": {
    "orchestrator": {
      "model": "opencode-go/deepseek-v4-pro",
      "variant": "medium"
    },
    "implementer": {
      "model": "opencode-go/deepseek-v4-flash"
    }
  }
}
```

If no opencode config exists, the model-config agent creates one with only the agent entries.

## Agy Integration

**Agy** (Antigravity CLI integration) is an optional mechanism that offloads implementer work to a separate CLI tool called `agy`, allowing quota usage to be split across different models.

### How It Works

- The implementer agent reads `.ai/context.md` and checks for an `agy: enabled` flag under the `## Workflow` section.
- If `agy` is enabled and available (verified via `which agy`), the implementer creates a task-local handoff file (`.ai/tasks/<task>/agy-handoff.md`) containing:
  - Implementer persona and boundaries (the full agent definition file contents)
  - The orchestrator command that spawned the work
  - The full task spec path and contents
  - Project context from `.ai/context.md`
  - All relevant files with their contents (or explicit paths with read-before-edit instructions)
  - The exact report path
  - Verification commands
  - Constraints, non-goals, and stop conditions
  - Explicit instructions (preserve unrelated changes, write the implementation report, do not commit/amend/push)
- The implementer then invokes `agy --dangerously-skip-permissions --print "Read and execute the handoff file at <path>"`.
- The `--dangerously-skip-permissions` flag is **intentional for this bounded backend mode**: agy operates under an approved, inspected handoff file that defines the complete scope of work. Since agy is invoked as a subagent and cannot interactively approve permission prompts, skip-permissions is the correct mechanism when work is fully bounded by the handoff file.
- This is NOT unbounded/permissionless execution — it is bounded by the handoff file which the implementer writes, inspects, and verifies against.
- After agy returns, the implementer verifies the output against the task spec, runs validation, and writes the implementation report.

### Enabling Agy

Add the following flag to `.ai/context.md` under `## Workflow`:

```markdown
## Workflow

- **agy**: enabled
```

The flag is **user-owned** — agents never modify it. During project initialization, the **init** agent asks the user whether they want to enable agy integration.

### Fallback

If agy is not enabled (`agy: enabled` missing or set to a falsy value), or the `agy` binary is not available, or the handoff cannot be constructed with sufficient completeness, the implementer falls back to manual implementation. The handoff file approach replaces the previous CLI argument approach. Large context is no longer stuffed into shell-quoted command strings.

## OpenCode Config Locations

Dispatcher's configuration spans two levels:

### Project-Level Config

OpenCode reads project configuration from the following locations, in order of preference:

1. **`opencode.jsonc`** (preferred) — in the project root
2. **`.opencode/opencode.jsonc`** — in the `.opencode/` subdirectory

The model-config agent writes per-agent model assignments to whichever file exists, preferring `opencode.jsonc` if both are present. If neither exists, it creates `opencode.jsonc`.

### Global / User-Level Config

OpenCode's global configuration lives at:

```
~/.config/opencode/
```

This directory contains:

| Directory / File | Description |
|-----------------|-------------|
| `agents/` | Installed agent definitions (managed by Dispatcher) |
| `skills/` | OpenCode skills (not managed by Dispatcher) |
| `templates/` | Prompt templates (not managed by Dispatcher) |
| `AGENTS.md` | User-owned agent documentation — never touched by Dispatcher |

Dispatcher installs managed payloads into `~/.config/opencode/agents/`. The `skills/`, `templates/`, and `AGENTS.md` under `~/.config/opencode/` are **user-owned** and never modified, backed up, or removed by Dispatcher.

## Install Locations and Payloads

### What the Installer Copies

The installer (`bin/install.js`) copies Dispatcher's managed payloads into:

```
~/.config/opencode/agents/
```

Current payloads include agent definitions for:
- Orchestration
- Initialization
- Task planning
- Test writing
- Implementation
- Documentation
- Validation
- Research
- Shipping
- Exact mechanical edits (executor)
- Model configuration

### What the Installer Does NOT Manage

The installer does **not** install or manage:

- Provider configuration
- Model settings
- Secrets (API keys, tokens)
- Project dependencies (`node_modules`)
- Git configuration
- `opencode.jsonc` (project-level config is user-managed)
- Global skills under `~/.config/opencode/skills/`
- Prompt templates under `~/.config/opencode/templates/`
- `~/.config/opencode/AGENTS.md`

For agent role descriptions, see [docs/agents.md](agents.md). For development and release processes, see [docs/development.md](development.md).

## Install Safety

Before overwriting a managed path, the installer backs up the existing path beside it using a timestamped `.bak-*` suffix.

Example backup:

```
~/.config/opencode/agents.bak-2026-06-07T12-34-56-789Z
```

The installer then overlays the Dispatcher payload into the managed path.

### Backup Semantics

- **Same-named files** may be overwritten in the managed path.
- **Unrelated pre-existing files** in the managed path may remain.
- **Backups are kept beside the managed path** and are not modified by subsequent installs.
- **`~/.config/opencode/AGENTS.md`** is never backed up, overwritten, or touched in any way — it is fully user-owned.

This is an overlay, not a merge. The installer does not attempt to diff or merge files.

## Restore and Uninstall

### Restoring a Backup

To restore a previously backed-up managed path:

1. **Stop OpenCode** so global config is reloaded afterward.
2. Remove or rename the current managed path:
   ```bash
   mv ~/.config/opencode/agents ~/.config/opencode/agents.dispatcher
   ```
3. Move the matching `.bak-*` path back to its original name:
   ```bash
   mv ~/.config/opencode/agents.bak-<timestamp> ~/.config/opencode/agents
   ```
4. **Restart OpenCode** so it reloads the global configuration.

### Uninstalling Dispatcher

- **If you had pre-existing global agents** before installing Dispatcher: restore your backups first (see above).
- **If you do not need any current contents** (including files that may have existed before Dispatcher was installed): remove the managed paths outright:
  ```bash
  rm -rf ~/.config/opencode/agents
  ```
- **`~/.config/opencode/AGENTS.md`** is never removed or modified — it remains even after uninstall.

After any restore or uninstall, restart OpenCode so it reloads `~/.config/opencode/`.

## Package Commands

The following commands are available from `package.json`:

| Command | Equivalent | Description |
|---------|-----------|-------------|
| `npm run check` | `npx opencode-dispatcher check` | Validates agent frontmatter integrity and orchestrator cross-references |
| `npm run install:local` | `npx opencode-dispatcher install` | Installs Dispatcher payloads into `~/.config/opencode/` |
| `npx opencode-dispatcher` (no args) | `npx opencode-dispatcher install` | Defaults to install |

Invalid commands print usage and exit with a non-zero status.

The package is published on the npm registry as `opencode-dispatcher`:

```bash
npx opencode-dispatcher install
```
