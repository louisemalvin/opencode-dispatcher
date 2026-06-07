# Task Spec: Publish to npm

## Scope

Publish `opencode-dispatcher` to the npm registry and update the README to reflect published status.

## Steps

1. Update `package.json`: Add `repository`, `homepage`, `bugs` fields
2. Verify package: Run `npm pack --dry-run`
3. Publish: Run `npm publish`
4. Update README `Publication status` section

## Acceptance Criteria

- Package is published at https://www.npmjs.com/package/opencode-dispatcher
- README accurately states published status with `npx opencode-dispatcher install` command

## Relevant Files

- `package.json`
- `README.md`
