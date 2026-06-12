# OpenCode Dispatcher

OpenCode Dispatcher is a workflow pack for OpenCode that adds specialist development agents coordinated through file-based task artifacts. It is designed for substantial coding work where you want the agent workflow to be easier to inspect, resume, and validate. This package is for developers using OpenCode who want structured, auditable workflows for complex coding sessions.

Instead of relying on long chat history, Dispatcher keeps durable task state in your project under `.ai/tasks/` (task specs, implementation reports, validation reports, documentation reports). For tiny one-off edits or quick questions, plain OpenCode is often enough.

## Prerequisites

- **OpenCode** — Dispatcher is a workflow add-on for OpenCode. You must have OpenCode installed and configured before using Dispatcher.
- **Node.js >= 18** — Required for running the installer.

## Installation

Install from the npm registry:

```bash
npx opencode-dispatcher install
```

Or install from source:

```bash
npm run check
npm run install:local
```

After installing, restart OpenCode so it reloads your global configuration. For details on what the installer copies, backup behavior, and uninstall, see [Configuration](docs/configuration.md).

## First Use

1. Install Dispatcher and restart OpenCode.
2. Open your project and ask the orchestrator to initialize `.ai/context.md`. For example: *"Set up my project context."*
3. For substantial work, ask the orchestrator to create a task spec:

   ```text
   Create a task spec for improving the settings page, then wait for approval.
   ```

4. Review and approve the task spec.
5. Ask the orchestrator to implement and validate the approved task:

   ```text
   Implement the approved task spec at .ai/tasks/001-settings-page/task-spec.md and run validation.
   ```

## Why Use It?

- Task state is **durable and inspectable** — specs, reports, and scope are stored in `.ai/tasks/` files, not chat history.
- Work is **resumable** — any agent can pick up where another left off by reading the task artifacts.
- Artifacts are **git-tracked** — you can review what was planned, what changed, and what was validated.
- Each task is **validated against its approved scope** — the validator checks that the implementation matches the task spec.

## When Not to Use It

- Quick explanations or one-off questions.
- Tiny mechanical edits that do not benefit from task planning.
- Exploratory prototyping where formal task artifacts would slow you down.

## Further Reading

- [CHANGELOG.md](https://github.com/louisemalvin/opencode-dispatcher/blob/master/CHANGELOG.md) — version history
- [docs/workflow.md](https://github.com/louisemalvin/opencode-dispatcher/blob/master/docs/workflow.md) — orchestrator/subagent flow and task artifacts
- [docs/agents.md](https://github.com/louisemalvin/opencode-dispatcher/blob/master/docs/agents.md) — subagent reference and permission model
- [docs/configuration.md](https://github.com/louisemalvin/opencode-dispatcher/blob/master/docs/configuration.md) — model config, agy, opencode config, install details
- [docs/development.md](https://github.com/louisemalvin/opencode-dispatcher/blob/master/docs/development.md) — validation, conventions, releases, publishing

## Version History

- **v0.5.0** — File-based agent handoffs: orchestrator writes planning-handoff.md artifacts directly for task-planner, implementer writes agy-handoff.md for bounded Antigravity delegation, and docs explain the intentional agy backend permission model.
- **v0.4.0** — Workflow improvements: stronger orchestrator-task-planner handoff, parallel planning, docs-first routing, documentation owns durable artifacts, validator checks cited source artifacts.
- **v0.3.3** — Workflow fix: agents now use direct reads/directory listings for `.ai/` files instead of `glob`, preventing missed `.ai/context.md` checks.

## License

MIT. See [LICENSE](https://github.com/louisemalvin/opencode-dispatcher/blob/master/LICENSE) for details.
