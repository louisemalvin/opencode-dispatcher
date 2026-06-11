# Documentation Report: docs/configuration.md

## Outcome

Created `docs/configuration.md` — a comprehensive configuration reference covering model configuration (MED/LOW group system), agy integration, opencode config file locations, install locations and payloads, install safety (backup behavior), restore/uninstall instructions, and package commands.

The document is grounded in the following source material:
- `README.md` (Installation, Install from Source, What Gets Installed, Install Safety, Restore or Uninstall, Package Commands, Publication Status)
- `workflow/agents/model-config.md` (MED/LOW groups, variant selection flow)
- `workflow/agents/init.md` (agy: enabled flag during initialization)
- `workflow/agents/implementer.md` (agy usage by implementer)
- `bin/install.js` (installer behavior, backup logic, payloads)
- `package.json` (bin entry, scripts)
- `.ai/context.md` (agy: enabled flag, workflow conventions)

All seven sections from the scope are present. Cross-references to `docs/agents.md` and `docs/development.md` are included (both files are created by sibling tasks in the same Phase 1).

## Files Changed

| File | Action |
|------|--------|
| `docs/configuration.md` | Created |

## Context or Decisions Updated

None. No existing context or decision files were modified.

## Verification

Checked against all 11 Inspectable Acceptance Criteria:

1. ✅ `docs/configuration.md` exists.
2. ✅ All seven sections (Model Configuration, Agy Integration, OpenCode Config Locations, Install Locations and Payloads, Install Safety, Restore and Uninstall, Package Commands) are present.
3. ✅ Model config section accurately describes MED/LOW groups, excluded agents (orchestrator, task-planner), config file locations (`opencode.jsonc` / `.opencode/opencode.jsonc`), and the `opencode models --verbose` discovery flow with variant selection.
4. ✅ Agy section explains what agy is, how it's enabled (`agy: enabled` in `.ai/context.md`), how the implementer uses it (constructs prompt, runs `agy --dangerously-skip-permissions --print "<prompt>"`), and that the flag is user-owned.
5. ✅ OpenCode config locations section accurately lists `opencode.jsonc` vs `.opencode/opencode.jsonc` (priority order) and `~/.config/opencode/` contents (agents, skills, templates, AGENTS.md).
6. ✅ Install locations section accurately lists what Dispatcher installs (agents) and what it does NOT install/manage (provider config, model settings, secrets, project dependencies, git config, `opencode.jsonc`, `node_modules`, global skills, project templates).
7. ✅ Backup behavior matches `bin/install.js` (timestamped `.bak-*` suffixes, overlay semantics, non-merge behavior).
8. ✅ Restore/uninstall instructions are accurate and non-destructive; the distinction between restoring backups and fully removing paths is clear.
9. ✅ Package commands section lists `check`, `install`, and the default behavior (no args = install).
10. ✅ `~/.config/opencode/AGENTS.md` user-ownership is clearly stated (in both Install Safety and Uninstall sections).
11. ✅ Links to `docs/agents.md` and `docs/development.md` are included where relevant.

**Note on skills/templates payloads**: The task spec scope mentions "agents, skills, templates" as install payloads, but the actual source code (`bin/install.js`) only installs agents (`installPayloads = ["agents"]`). The documentation accurately reflects the current code behavior. The `workflow/skills` and `workflow/templates` directories do not exist in the repository, and the `check` command explicitly validates that they must be empty or absent.

## Follow-Ups

None.
