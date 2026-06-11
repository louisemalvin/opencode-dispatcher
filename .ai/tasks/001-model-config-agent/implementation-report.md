# Implementation Report: Add model-config Subagent

## Outcome

Success. Created the new `model-config` hidden subagent and integrated it into the orchestrator's permission model and routing/delegation guidance.

## Files Changed

1. **`workflow/agents/model-config.md`** (new) — Hidden subagent definition with:
   - YAML frontmatter: `description`, `mode: subagent`, `hidden: true`, permission block (`bash:* allow`, `edit:* deny` + opencode config allow, `task:* deny`)
   - Role description paragraph explaining per-agent model assignment via `agent.<name>.model` entries
   - Responsibilities section covering: `opencode models`, reading project config, user selection of agents/models, writing entries preserving existing config, creating config if missing, reporting summary
   - Boundaries section prohibiting edits beyond opencode config, delegation to other agents, and touching code/tests/docs/.ai/artifacts
   - Default report back section describing config path, agents configured, models assigned, and any issues

2. **`workflow/agents/orchestrator.md`** (modified) — Three additions:
   - `permission.task` block: added `model-config: allow` between `init: allow` and `executor: allow` (line 16)
   - `ROUTE` section: added `- Use model-config when the user wants to configure per-agent models for this project.` after the shipper bullet (line 84)
   - `DELEGATE` section: added `- model-config: per-agent model assignment in opencode config` in alphabetical order between `implementer` and `documentation` (line 95)

No other files were created or modified.

## Decisions

- **Permission model**: Followed the exact spec — bash unrestricted, edit restricted to the two opencode config paths, task denied entirely. This matches the pattern used by `init.md` (file-scoped edit permission).
- **Routing placement**: Added after the shipper line as specified, keeping the ROUTE bullets grouped by action type (direct answer, then agent routes).
- **Delegation ordering**: Inserted in alphabetical order alongside existing agents rather than at the end, consistent with the existing DELEGATE section.
- **Style**: Matched the tone and density of `executor.md` and `init.md` — short frontmatter, focused role description, bulleted responsibilities/boundaries/report-back sections.

## Verification

- Confirmed `workflow/agents/model-config.md` exists with valid YAML frontmatter and all required sections.
- Confirmed `workflow/agents/orchestrator.md` has all three additions and no other changes.
- `git diff --name-only` shows only `workflow/agents/orchestrator.md` modified and `workflow/agents/model-config.md` as a new file.
- No existing ROUTE or DELEGATE bullets were altered or removed.
- No test suite to run (this task creates agent definition files; no executable tests exist).

## Known Issues

None.
