# Implementation Report

## Outcome

Stopped the installer from copying templates to `~/.config/opencode/templates/`. Agents now reference project-local `.ai/templates/` instead. The `workflow/templates/` directory has been fully removed, and all references to `"templates"` in `bin/install.js` have been updated or removed.

## Files Changed

- **`bin/install.js`** — 5 edits:
  - Line 12: `installPayloads` changed from `["agents", "skills", "templates"]` to `["agents", "skills"]`
  - Removed `"workflow/templates/task-artifact-workflow/task-spec.md"` from `requiredInstallPayloads` array (was line 92)
  - Line 70: Install success message updated from "agents, skills, and templates" to "agents and skills"
  - Line 103: Check success message updated from "agents, skills, templates" to "agents, skills"
  - Lines 113-115: Usage help updated from "agents, skills, and templates" to "agents and skills"

- **`workflow/templates/`** — Entire directory tree deleted (contained `task-artifact-workflow/task-spec.md`)

## Decisions

- Left `~/.config/opencode/templates/` (from prior installs) untouched — the installer no longer manages it, but existing copies remain valid for projects that still reference the global path.
- Did not change `package.json` description ("reusable templates" reference) — that describes the project's overall purpose including `.ai/templates/` which still exists.

## Verification

1. **`npm run check`** — passed with exit 0: "Workflow package check passed. Required files: agents, skills."
2. **`npm run install:local`** — installed cleanly without errors: "Installed OpenCode Dispatcher agents and skills to /home/loum/.config/opencode"
3. **`workflow/templates/`** — confirmed deleted (only `agents/` and `skills/` remain under `workflow/`)
4. **`~/.config/opencode/templates/`** — confirmed still exists from prior install (installer no longer manages it)
5. **No remaining references** to `"templates"` in `bin/install.js` — confirmed via grep

## Known Issues

None.
