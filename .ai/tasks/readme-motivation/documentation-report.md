# Documentation Report — README.md TOC + "What It Does"

## Files changed

- `README.md` (lines 1–67 modified, 69–184 untouched)

## Summary of changes

**1. Added `## Table of Contents`** (lines 3–14)
Inserted after the `# OpenCode Dispatcher` title. Lists all 10 `##` headings with GitHub-compatible anchor links (lowercase, spaces → hyphens, no special chars).

**2. Added `## What It Does` section** (lines 28–67)
Inserted between the existing introductory paragraphs and `## Install from a local clone`. Contains:
- Opening paragraph explaining the specialist-agent model and artifact-based task state
- Agent Roles table (7 agents: Orchestrator, Task Planner, Implementer, Validator, Documentation, Research, Release / Shipper)
- Mermaid flowchart (`graph TD`) showing the request → orchestration → delegation → validation → result workflow
- Comparison table (6 dimensions: Task scope, Agent model, Validation, Resumability, Audit trail, Best for)

## Source of truth used

- Task spec: `.ai/tasks/readme-motivation/task-spec.md`
- Existing README content for heading list and preservation boundary

## Decisions made

| Decision | Choice | Rationale |
|---|---|---|
| TOC anchor for "What It Does" | `#what-it-does` | GitHub lowers and hyphenates; "it" stays lowercase |
| TOC anchor for "What gets installed" | `#what-gets-installed` | Reference: `bin/install.js` uses same convention |
| TOC includes self-reference | Yes, lists `#table-of-contents` itself | All `##` headings means all `##` headings; a TOC entry for the TOC is correct |
| Agent "When" column verbiage | Used "Always active", "Used before implementation", etc. | Matches the detailed requirements in the task instructions; the task spec table was a simplified version |
| Comparison table formatting | Backtick-wrapped paths for file-based entries | Consistent with existing README style |

## Verification

- All `##` headings present in TOC: Table of Contents, What It Does, Install from a local clone, First use in a project, What gets installed, Install safety, Restore or uninstall, Package commands, Publication status, Limitations
- All TOC anchors match GitHub auto-generated IDs
- Mermaid block tagged with ````mermaid` for GitHub rendering
- No content from `## Install from a local clone` (line 69) onward was modified
- Tone: direct, engineering-focused, no superlatives or marketing language

## Open questions

None.
