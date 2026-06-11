# OpenCode Dispatcher

OpenCode Dispatcher is a workflow pack for OpenCode that adds specialist development agents coordinated through file-based task artifacts. It is designed for substantial coding work where you want the agent workflow to be easier to inspect, resume, and validate.

Instead of relying on long chat history, Dispatcher keeps durable task state in your project under `.ai/tasks/` (task specs, implementation reports, validation reports, documentation reports). For tiny one-off edits or quick questions, plain OpenCode is often enough.

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

After installing, restart OpenCode so it reloads your global configuration.

## First Use

1. Install Dispatcher and restart OpenCode.
2. Open your project and let the orchestrator initialize `.ai/context.md` if it does not exist.
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

- [CHANGELOG.md](CHANGELOG.md) — version history
- [docs/workflow.md](docs/workflow.md) — orchestrator/subagent flow and task artifacts
- [docs/agents.md](docs/agents.md) — subagent reference and permission model
- [docs/configuration.md](docs/configuration.md) — model config, agy, opencode config, install details
- [docs/development.md](docs/development.md) — validation, conventions, releases, publishing

## Version History

- **v0.3.3** — Workflow fix: agents now use direct reads/directory listings for `.ai/` files instead of `glob`, preventing missed `.ai/context.md` checks.

## License

MIT. See [LICENSE](LICENSE) for details.
