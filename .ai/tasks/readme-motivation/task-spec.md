# Task Spec

## Scope

Replace the existing introductory section of README.md and add a comprehensive "What It Does" section early in the README, plus a table of contents. The goal is to give readers an immediate, clear picture of what the Dispatcher workflow is, how it works, and when to use it.

The new section must include:

### 1. Table of Contents
A TOC at the top of the README (after the title) linking to every top-level `##` section heading with correct Markdown anchors.

### 2. "What It Does" section (heading: `## What It Does`)
A concise opening paragraph explaining what OpenCode Dispatcher is in plain terms — a workflow pack that replaces the single-agent approach with a team of specialist agents coordinated through file-based task artifacts.

### 3. Agent Roles table
A table listing each agent, its responsibility, and when it's used:

| Agent | Role | When |
|---|---|---|
| Orchestrator | User-facing coordinator; routes work, synthesizes results | Always |
| Task Planner | Creates auditable `.ai/tasks/<id>/task-spec.md` | Before implementation |
| Implementer | Edits source code per task spec | After spec approved |
| Validator | Checks results against task spec | After implementation |
| Documentation | Updates docs, context, decision artifacts | When docs are needed |
| Research | Gathers external facts, comparisons, best practices | When facts are needed |
| Release / Shipper | Git commit and push only | When explicitly requested |

### 4. Workflow graph (Mermaid)
A Mermaid flowchart showing the typical flow:

```
User → Orchestrator → Task Planner → Implementer → Validator → Orchestrator → User
                                                                   ↓
                                                              Documentation
                                                                   ↓
                                                              Research
```

(With branching for research and documentation paths.)

### 5. Comparison table
A table contrasting plain OpenCode vs OpenCode Dispatcher across dimensions like:
- Task scope
- Role separation
- Validation
- Resumability
- Audit trail
- Best for...

## Non-Goals

- No changes to install commands, safety, uninstall, limitations sections (except updating TOC anchors)
- No restructuring beyond the intro / TOC / "What It Does" section
- No changes to `package.json`, `bin/`, `workflow/`, or any file outside `README.md`
- No badges, contributor guides, license files

## Acceptance Criteria

1. A `## Table of Contents` is present near the top, listing all `##` headings with working anchor links.
2. A `## What It Does` section follows, covering:
   - What the dispatcher is
   - Each agent's role (via table)
   - The workflow flow (via Mermaid diagram)
   - How it compares to plain OpenCode (via comparison table)
3. All content is written in a direct, substantive, engineering-friendly tone — no marketing language, no hype.
4. Existing README content from "Install from a local clone" onward is preserved in its current order.

## Constraints

- Mermaid diagram syntax must be correct for GitHub Flavored Markdown.
- Agent role descriptions must match the actual agent definitions in `workflow/agents/`.
- Tone must match the existing README: direct, minimal, no fluff.

## Relevant Files

- `README.md`

## Validation Plan

1. Read the final `README.md` in full.
2. Verify TOC lists every `##` heading and anchors are correct.
3. Verify "What It Does" section includes agent roles table, Mermaid workflow graph, and comparison table.
4. Verify existing content from "Install from a local clone" onward is unchanged.
5. Render the README in a Markdown viewer and confirm Mermaid renders correctly.
6. Verify no hype or marketing language in the new section.
