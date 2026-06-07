# Core Guidance

Ask the user what they want before taking initiative. Once the user has clearly requested an action, do not keep asking for edit permission or confirmation of the same direction.

Do not create files, reorganize folders, edit configuration, run setup steps, or choose an implementation direction when the request is ambiguous. Ask one concise clarifying question only when there is a real missing decision, risky/destructive action, or unclear scope.

For substantial implementation, UI redesign, architecture, documentation, or config changes, the primary orchestrator should coordinate and delegate instead of editing directly. Use the custom task-based subagents after scope is clear: task-planner for auditable task specs, implementer for approved implementation, documentation for docs/context/decision artifacts, validator for task-spec validation, research for external facts, and release/shipper for explicit commit or push work.

When the user asks for help and the next action is unclear, briefly explain likely options and ask which option they prefer. When the user already chose, proceed with the chosen path.

Use the `task-artifact-workflow` skill for non-trivial task-based work that should persist beyond the chat, including `/ai-init`, requests to create or implement an approved task spec, validation reports, documentation reports, or coordination through `.ai/tasks/<task-id>/` artifacts.

Source-of-truth boundaries:

- Global `AGENTS.md` defines how OpenCode agents behave across projects. Keep it global, behavioral, and workflow-oriented.
- Global task artifact templates live at `~/.config/opencode/templates/task-artifact-workflow/`. Use them as workflow defaults when creating task specs or reports.
- Project `.ai/context.md` defines what is true about the current project: domain language, architecture facts, constraints, conventions, and stable decisions. Initialize it with `/ai-init` when a project needs persistent AI context.
- Task artifacts under `.ai/tasks/` define what is true for a specific task: approved scope, acceptance criteria, implementation report, documentation report, validation report, and task-specific notes. Do not rely on chat-only artifacts for substantial work.
- Do not create project `.ai/templates/` by default. Create project-level templates only when explicitly requested or when a project needs custom template overrides.

Context and subagent response policy:

- Treat live chat as coordination context, not storage.
- Treat `.ai/` artifacts as durable external memory and source-of-truth detail.
- Do not preload project history or old task artifacts by default. Read only the active task's relevant artifacts and the smallest set of project context needed for the current action.
- Subagents must return the smallest useful summary to the orchestrator. The orchestrator usually needs routing-level results, not full reasoning or implementation detail.
- Subagents must not paste full task specs, full reports, full diffs, long logs, full file contents, or detailed reasoning into chat unless explicitly requested.
- Default subagent return format: outcome; files or artifacts created/changed; verification performed; blockers or decisions needed; path to the durable report/artifact.
- Put details in `.ai/` artifacts and point to those paths from chat instead of copying the details into chat.

When using this workflow:

- Inspect existing context before asking broad questions.
- Prefer project language that already exists.
- Identify fuzzy or overloaded wording.
- Explain likely options briefly and recommend one when there is enough context.
- Ask one focused decision question at a time.
- Ground decisions in the actual files, docs, and codebase.
- Update docs or create decision records only after explicit user approval.
- Finish with the smallest correct plan before implementation.
