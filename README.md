# OpenCode Dispatcher

OpenCode Dispatcher is a workflow pack for OpenCode. It installs specialist agents, the `task-artifact-workflow` skill, and task-report templates so substantial coding work can run from explicit task specs instead of long chat history.

It is useful when you want agent work to be easier to inspect, resume, and validate:

- task scope in `.ai/tasks/<task-id>/task-spec.md`
- durable project facts in `.ai/context.md`
- role boundaries between planning, implementation, documentation, validation, research, and release work
- short handoffs in chat, with details kept in task artifacts
- validation reports checked against the approved scope

For tiny one-off edits, plain OpenCode is often enough.

## Install from a local clone

```bash
npm run check
npm run install:local
```

Equivalent direct commands:

```bash
node ./bin/install.js check
node ./bin/install.js install
```

The default installer command is `install`, so this is also valid:

```bash
node ./bin/install.js
```

After installing, restart OpenCode so it reloads `~/.config/opencode`.

## First use in a project

1. Open a project in OpenCode after restarting.
2. If the project does not already have `.ai/` artifacts, ask the orchestrator to run `/ai-init`.
3. For substantial work, ask for a task spec first. Example: `Create a task spec for improving the settings page, then wait for approval.`
4. After approving the task spec, ask the orchestrator to implement and validate it. Example: `Implement the approved task spec at .ai/tasks/settings-page/task-spec.md and run validation.`

The workflow treats live chat as coordination. Durable details belong in `.ai/context.md`, `.ai/tasks/<task-id>/task-spec.md`, and task reports such as `implementation-report.md`, `documentation-report.md`, and `validation-report.md`.

## What gets installed

The installer copies these managed payloads into `~/.config/opencode`:

```text
~/.config/opencode/agents/
~/.config/opencode/skills/
~/.config/opencode/templates/
```

Current package payloads include:

- agents for orchestration, planning, implementation, documentation, validation, research, review, release, shipping, and compatibility build work
- `skills/task-artifact-workflow/SKILL.md`
- `templates/task-artifact-workflow/` report and task-spec templates

The installer does not install or manage provider config, model settings, secrets, dependencies, git config, `opencode.jsonc`, or `node_modules`.

## Install safety

Before copying a managed path, the installer backs up any existing path beside it with a timestamped `.bak-*` suffix, then recursively copies the Dispatcher payload into that path. It does not remove the existing path first, so same-named files may be overwritten and unrelated pre-existing files may remain.

Example backup names:

```text
~/.config/opencode/agents.bak-2026-06-07T12-34-56-789Z
~/.config/opencode/skills.bak-2026-06-07T12-34-56-789Z
~/.config/opencode/templates.bak-2026-06-07T12-34-56-789Z
```

Your global `~/.config/opencode/AGENTS.md` is user-owned. OpenCode Dispatcher does not install, overwrite, back up, restore, remove, or rename it. The repository file `workflow/AGENTS.md` is checked as package reference material only; it is not copied into your global config by the installer.

## Restore or uninstall

To restore a backed-up managed path:

1. Stop OpenCode.
2. Remove or rename the current managed path.
3. Move the matching `.bak-*` path back to its original name.
4. Restart OpenCode.

Example for agents:

```bash
mv ~/.config/opencode/agents ~/.config/opencode/agents.dispatcher
mv ~/.config/opencode/agents.bak-<timestamp> ~/.config/opencode/agents
```

Use the same pattern for `skills` and `templates`.

To uninstall Dispatcher, restore your backups if you had pre-existing global agents, skills, or templates. Only remove managed paths outright if you do not need any current contents, including files that may have existed before install.

## Package commands

From `package.json`:

```bash
npm run check          # node ./bin/install.js check
npm run install:local  # node ./bin/install.js install
```

The package also defines this binary when installed as an npm package:

```bash
opencode-dispatcher [install|check]
```

Invalid commands print usage and exit with a non-zero status.

## Publication status

This repository is npm-package shaped (`name: opencode-dispatcher`, `version: 0.1.0`, `license: MIT`, packaged files: `bin/`, `workflow/`, `README.md`), but this README does not assume the package has been published to a registry.

Use the local clone commands above today. If the package is published in the registry you use, the equivalent package command would be:

```bash
npx opencode-dispatcher install
```

## Limitations

- Managed `agents`, `skills`, and `templates` paths are backed up, then overlaid with Dispatcher files; unrelated pre-existing files may remain.
- Restart OpenCode after install, restore, or uninstall so global config is reloaded.
- Providers, models, secrets, project dependencies, and git remotes are not configured by this package.
- The workflow is designed for substantial tasks with scope, artifacts, and validation; it may be unnecessary overhead for tiny edits.
