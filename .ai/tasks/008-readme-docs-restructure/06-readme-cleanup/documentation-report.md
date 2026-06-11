# Documentation Report — Unit 6: README Cleanup

## Outcome

`README.md` rewritten from 559 lines to 64 lines — a concise user-facing quickstart/overview. All deep internal documentation (agent tables, mermaid diagrams, version history, install safety, security/permissions, comparison tables, workflow layers, common routes, project artifacts, package commands, publication status) has been removed and is now covered by `CHANGELOG.md` and the `docs/*.md` files.

## Files Changed

- `README.md` — Rewritten from 559 lines to 64 lines.

## Context or Decisions Updated

None. No `.ai/context.md` or `.ai/decisions/` files were modified.

## Verification

1. **Line count**: 64 lines, down from 559. (`~50–80` target met.)
2. **Structure**: Title → Intro → Installation → First Use → Why → When Not → Further Reading → License. (Matches spec.)
3. **All removed sections have corresponding destinations**:
   - `## What Dispatcher Changes` (mermaid + agent table) → `docs/workflow.md`, `docs/agents.md`
   - `## Compared to Plain OpenCode` (comparison table) → `docs/workflow.md`
   - `## Core Idea` (mermaid) → `docs/workflow.md`
   - `## Workflow Layers` (full agent tables) → `docs/agents.md`
   - `## Common Routes` (6 mermaid flowcharts) → `docs/workflow.md`
   - `## Project Artifacts` → `docs/workflow.md`
   - `## What Gets Installed` → `docs/configuration.md`
   - `## Install Safety` → `docs/configuration.md`
   - `## Restore or Uninstall` → `docs/configuration.md`
   - `## Package Commands` → `docs/configuration.md`
   - `## Publication Status` → `docs/configuration.md`
   - `## Security & Permissions` → `docs/agents.md`
   - `## Version History` → `CHANGELOG.md`
4. **No mermaid diagrams remain** — verified by grep.
5. **No agent role tables, workflow layer tables, or comparison tables remain** — verified by read.
6. **No version history entries remain** — removed.
7. **No detailed install safety/backup/restore/payload lists remain** — removed.
8. **No security/permissions details remain** — removed.
9. **Further reading** links to all five doc files with correct relative paths:
   - `CHANGELOG.md` ✓
   - `docs/workflow.md` ✓
   - `docs/agents.md` ✓
   - `docs/configuration.md` ✓
   - `docs/development.md` ✓
10. **Installation commands**: `npx opencode-dispatcher install` (npm) and `npm run check && npm run install:local` (source) — accurate to original README.
11. **First use steps**: 5 steps referencing `.ai/context.md` init, task spec creation, review/approval, implementation, validation — accurate to original README.
12. **Tone**: Direct, minimal, no marketing language, no fluff — verified by read.
13. **License**: MIT, with link to `LICENSE` file. ✓
14. **No claims unsupported by current repository state** — all claims traceable to original README content.

## Follow-Ups

None.
