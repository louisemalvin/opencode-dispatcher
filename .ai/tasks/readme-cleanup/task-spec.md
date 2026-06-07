# Task Spec: README cleanup after npm publish

## Scope

Update two sections of README.md to reflect the npm publish and current agent lineup.

### 1. `## What gets installed`
The bullet "agents for orchestration, planning, implementation, documentation, validation, research, review, shipper, shipping, and compatibility build work" references `builder.md`, `release.md`, `reviewer.md` which no longer exist. Update to reflect only the actual 7 agents.

### 2. `## Install from a local clone`
Rename section to `## Install` and restructure to put npm install first, local clone second.

## Non-Goals

- No changes to other sections
- No restructuring beyond the two sections above

## Acceptance Criteria

1. Agent list in "What gets installed" matches actual agents (no builder/release/reviewer references)
2. Install section restructured with npm first, then local clone
3. TOC updated if section headings change
4. All existing content preserved
