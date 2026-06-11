# Unit 6: README Cleanup

## Scope

Aggressively cut `README.md` from ~560 lines to a concise user-facing quickstart/overview. The current README is a monolithic document that mixes user quickstart with deep internal documentation. After units 1–5 have extracted internal content into `CHANGELOG.md` and `docs/*.md`, this unit rewrites README.md as a tight, scannable entry point.

### What to keep (concise versions)

1. **Title and one-line description** — "OpenCode Dispatcher" and what it is.
2. **Quick intro** — 2–3 sentences. What it does (specialist agents + file-based task artifacts), who it's for (substantial coding work), and the core concept (`.ai/tasks/` artifacts instead of chat history).
3. **Installation** — Keep the two install methods concisely:
   - `npx opencode-dispatcher install` (from npm)
   - `npm run check && npm run install:local` (from source)
   - Mention restarting OpenCode.
4. **First use** — 3–5 bullet points covering: init context, create task spec for substantial work, review/approve, implement, validate. Include the example commands.
5. **Why use it** — 3–4 bullet points of key benefits (inspectable, resumable, git-tracked, validated against scope).
6. **When not to use it** — 2–3 bullet points (quick edits, exploratory coding, one-off questions).
7. **Further reading** — Link list to:
   - `CHANGELOG.md`
   - `docs/workflow.md`
   - `docs/agents.md`
   - `docs/configuration.md`
   - `docs/development.md`
8. **License** — `MIT` (already in repo).

### What to remove entirely (now covered by docs)

- `## What Dispatcher Changes` (mermaid + agent overview table) — in `docs/workflow.md` and `docs/agents.md`
- `## Compared to Plain OpenCode` (comparison table) — in `docs/workflow.md`
- `## Core Idea` (mermaid) — in `docs/workflow.md`
- `## Workflow Layers` (full agent tables: Always Active, Fast Path, Full Task Workflow, Conditional Agents, Bootstrap/Config/Shipping) — in `docs/agents.md`
- `## Common Routes` (6 mermaid flowcharts) — in `docs/workflow.md`
- `## Project Artifacts` (`.ai/` structure detail) — in `docs/workflow.md`
- `## What Gets Installed` — in `docs/configuration.md`
- `## Install Safety` — in `docs/configuration.md`
- `## Restore or Uninstall` — in `docs/configuration.md`
- `## Package Commands` — in `docs/configuration.md`
- `## Publication Status` — in `docs/configuration.md`
- `## Security & Permissions` — in `docs/agents.md`
- `## Version History` — in `CHANGELOG.md`
- All mermaid diagrams — the cleaned README has no mermaid.
- The full Limitations list — keep a concise one-liner about "best for substantial work, overhead for tiny edits".

### Tone

- Direct, minimal, no marketing language, no hype.
- Write for an engineer who wants to know: what is this, how do I install it, how do I start, where's the detailed docs.
- Target: ~50–80 lines total (down from ~560).

### Cross-references

The `## Further reading` section should link to the five doc files using relative Markdown links:
```markdown
- [CHANGELOG.md](CHANGELOG.md) — version history
- [docs/workflow.md](docs/workflow.md) — orchestrator/subagent flow and task artifacts
- [docs/agents.md](docs/agents.md) — subagent reference and permission model
- [docs/configuration.md](docs/configuration.md) — model config, agy, opencode config, install details
- [docs/development.md](docs/development.md) — validation, conventions, releases, publishing
```

## Execution

- `documentation`

## Non-Goals

- Do not create or edit any files other than `README.md` and this unit's `documentation-report.md`.
- Do not change `package.json`, `bin/`, `workflow/`, `.github/`, `.ai/`, `CHANGELOG.md`, or any `docs/*.md` file.
- Do not add new content, claims, badges, diagrams, or features that aren't already in the original README.
- Do not add installation methods, commands, or workflows that don't already exist.

## Testable Acceptance Criteria

None. Documentation-only.

## Inspectable Acceptance Criteria

1. `README.md` is substantially shorter than the original (~50–80 lines vs ~560 lines).
2. The README has a clear, scannable structure: title → intro → install → first use → why → when not → further reading → license.
3. All removed sections have corresponding content in `CHANGELOG.md` or the appropriate `docs/*.md` file (i.e., no information is lost — it has been relocated, not deleted from the project).
4. No mermaid diagrams remain in the README.
5. No agent role tables, workflow layer tables, or comparison tables remain.
6. No version history entries remain.
7. No detailed install safety, backup/restore, or payload lists remain.
8. No security/permissions details remain.
9. The `## Further reading` section links to all five doc files (`CHANGELOG.md`, `docs/workflow.md`, `docs/agents.md`, `docs/configuration.md`, `docs/development.md`) with working relative paths.
10. Installation commands are accurate (`npx` and local source).
11. First use steps are accurate and reference `.ai/` conventions correctly.
12. Tone is direct and minimal — no marketing language, no fluff, no AI-sounding filler.
13. License is mentioned (MIT, link to LICENSE file in repo).
14. No claims that are not supported by the current repository state.

## Relevant Files

- `README.md` (the file to rewrite)
- `CHANGELOG.md` (must exist before this unit runs — to verify cross-reference)
- `docs/workflow.md` (must exist — to verify cross-reference)
- `docs/agents.md` (must exist — to verify cross-reference)
- `docs/configuration.md` (must exist — to verify cross-reference)
- `docs/development.md` (must exist — to verify cross-reference)
