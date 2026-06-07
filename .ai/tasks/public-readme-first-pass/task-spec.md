# Task Spec

## Scope

- Rewrite/polish `README.md` into a first public README that the user can confidently commit and push.
- Make the README read like a practical real-tool README for OpenCode Dispatcher, not AI-generated bloat or marketing filler.
- Define what OpenCode Dispatcher is using accurate project facts from `package.json`, `bin/install.js`, and the packaged `workflow/` contents.
- Explain the practical advantage over normal OpenCode use: explicit task specs, durable `.ai/` task/context artifacts, specialist workflow agents, short handoffs, and validation against scope.
- Present a concise usage-first flow covering install, package check, restart, and first use in a project.
- Accurately describe install safety based on current installer behavior, including backups of managed paths and the fact that user/global `~/.config/opencode/AGENTS.md` is not installer-managed.
- Mention `AGENTS.md` only where needed for install safety/ownership accuracy; avoid making it a central product feature or broad workflow concept in the README.
- List installed files/paths accurately for the current installer payloads: `agents`, `skills`, and `templates` under `~/.config/opencode`.
- Include backup, restore, and uninstall guidance that matches timestamped `.bak-*` behavior in `bin/install.js`.
- Include limitations and publication status, including that npm/public package publication must not be implied unless the repository state proves it.
- Keep any implementation and validation reporting under this task's `.ai/tasks/public-readme-first-pass/` folder.

## Non-Goals

- Do not edit implementation/source files such as `package.json`, `bin/install.js`, or files under `workflow/` for this README pass.
- Do not change project documentation outside `README.md`, except for required task reports under `.ai/tasks/public-readme-first-pass/`.
- Do not publish, commit, push, tag, create a release, or change npm package metadata.
- Do not add new claims, product positioning, diagrams, badges, screenshots, examples, or roadmap promises that are not supported by the current repository.
- Do not create project-level `.ai/templates/` overrides.
- Do not add broad documentation about global `AGENTS.md`; keep `AGENTS.md` references limited to install safety/untouched-user-config context.

## Acceptance Criteria

- `README.md` accurately reflects `package.json`, including package name `opencode-dispatcher`, version/publication ambiguity, bin command shape, npm scripts, packaged files, and license where mentioned.
- `README.md` accurately reflects `bin/install.js`, including default `install`, explicit `check`, managed payloads, target directory, backup behavior, restart guidance, invalid usage shape if documented, and temporary/user-owned `AGENTS.md` safety wording.
- The README has a concise usage-first structure that helps a new user quickly understand: what this is, why it is useful compared with normal OpenCode use, how to install, how to check, how to start using it, how to recover/uninstall, known limitations, and publication status.
- The README avoids unsupported claims such as "internet standard", "standard", guaranteed best practice, autonomous safety promises, or claims of npm publication unless supported by repository state.
- The README avoids duplicate bloat: no repeated install sections, repeated value propositions, inflated marketing language, long agent-by-agent prompt explanations, or unnecessary AI-sounding filler.
- The README describes the advantage over normal OpenCode use in practical terms, not hype: task artifacts, durable project context, explicit scope, validation reports, role boundaries, and smaller handoffs.
- Install safety wording is accurate and prominent enough for a public README: managed paths are backed up before replacement, managed paths are not merged, and global `~/.config/opencode/AGENTS.md` is user-owned and untouched.
- `AGENTS.md` appears only in install safety/ownership context, including any necessary distinction between repository reference `workflow/AGENTS.md` and user/global `~/.config/opencode/AGENTS.md`.
- Files installed section lists only files/paths actually installed by `bin/install.js`; it must not claim provider config, secrets, dependencies, git config, or global `AGENTS.md` are installed or managed.
- Backup, restore, and uninstall guidance matches the installer's timestamped `.bak-*` behavior and avoids destructive instructions that would remove user-owned config without warning.
- Limitations include at least: managed directories are replaced after backup rather than merged, OpenCode restart is required, providers/models/secrets are not configured, and the workflow is more useful for substantial tasks than tiny one-off edits.
- Publication status is honest: local clone/install path is valid now; `npx`/registry use is conditional unless actual publication is confirmed.
- No documentation changes outside `README.md` are made, except `.ai/tasks/public-readme-first-pass/implementation-report.md` and `.ai/tasks/public-readme-first-pass/validation-report.md` if later agents perform and validate the work.
- Implementation report records changed files, README structure decisions, accuracy checks against `package.json` and `bin/install.js`, and any deviations from this task spec.
- Validation report checks the final README against this spec, with explicit attention to accuracy, unsupported claims, duplicate bloat, `AGENTS.md` scope, installed files, backup/restore/uninstall guidance, limitations, and publication status.

## Constraints

- Preserve unrelated user changes.
- Keep edits focused on public README readiness; do not broaden into implementation, installer, workflow prompt, or release changes.
- Use project terminology consistently: OpenCode Dispatcher, OpenCode, task artifacts, `.ai/context.md`, `.ai/tasks/<task-id>/`, orchestrator, task-planner, implementer, documentation, validator, task spec, validation report.
- Prefer short, concrete README copy over exhaustive explanation.
- Do not rely on chat-only claims for accuracy; inspect repository files during implementation and validation.
- Do not run installer validation against the real `HOME` unless explicitly approved; if installer behavior must be tested, use a temporary `HOME` outside the repository.

## Relevant Files

- `README.md`
- `package.json`
- `bin/install.js`
- `workflow/agents/*.md`
- `workflow/skills/task-artifact-workflow/SKILL.md`
- `workflow/templates/task-artifact-workflow/*.md`
- `workflow/AGENTS.md`
- `.ai/tasks/first-run-usability/task-spec.md`
- `.ai/tasks/never-touch-agents-md/task-spec.md`
- `.ai/tasks/public-readme-first-pass/task-spec.md`

## Validation Plan

- Review `package.json` and confirm the README's package name, bin command, scripts, packaged files, and publication-related wording are accurate.
- Review `bin/install.js` and confirm the README's install/check commands, installed payloads, target paths, backup behavior, restart guidance, and usage wording are accurate.
- Review `workflow/` file layout as needed to confirm installed-files and workflow capability descriptions are not overstated.
- Search/read the final README for unsupported claims, duplicated sections, AI-bloat phrasing, broad `AGENTS.md` discussion, or claims that npm publication has already happened.
- Confirm the final README answers a new user's core questions in order: what it is, why use it, install/check, first use, installed files/safety, restore/uninstall, limitations, publication status.
- Confirm no files outside `README.md` and this task's `.ai/tasks/public-readme-first-pass/` reports changed during the implementation/validation passes.
- Run `npm run check` or `node ./bin/install.js check` if the implementation/validation agent needs a current package sanity check; README-only changes should not require source edits.

## Open Questions

- No blocking questions identified. The requested scope is explicit and limited to planning a README-only public documentation pass, with task reports under `.ai/` allowed.
