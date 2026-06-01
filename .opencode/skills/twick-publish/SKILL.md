---
name: twick-publish
description: Twick release flow using changesets and npm publish. Use when a task mentions "release", "publish", "changeset", "version bump", "npm publish", or "Lambda container release".
---

# Twick Publish / Release

Twick uses [Changesets](https://github.com/changesets/changesets) for versioning and npm publishing. The full release is `pnpm release` (which is `turbo run build && changeset publish`). AWS Lambda containers get their own flow.

## Standard library release (npm)

1. **Pick a bump level.** `patch` for fixes, `minor` for features, `major` for breaking. Default to `minor` if the user says "release" without a level.
2. **Create a changeset.** Run `pnpm changeset` interactively. The CLI:
   - Asks which packages changed.
   - Asks the bump level per package.
   - Asks for a one-line summary (and optional longer body).
3. **Inspect the generated file.** It lands in `.changeset/<random>.md`. Read it back, confirm with the user, edit if needed.
4. **Commit + PR.** Commit the `.changeset/*.md` to a branch, push, get review, merge to `main`. PR target is the user's fork `main`.
5. **Bump versions.** After merge, `pnpm version` consumes the changeset, bumps `package.json` versions, and updates the CHANGELOG.
6. **Publish.** `pnpm release` (or `turbo run build && changeset publish`) builds every package and publishes to npm under the `latest` dist-tag.

Do **not** run `pnpm version` or `pnpm release` until the changeset has been reviewed and merged. Always confirm with the user first.

## AWS Lambda container release (cloud functions)

`@twick/cloud-export-video` ships as an AWS Lambda container image. The npm publish is tagged `aws`, not `latest`.

```bash
# Inside packages/cloud-functions/cloud-export-video
pnpm run verify:aws     # confirm Dockerfile + handler.js exist
pnpm run pack:aws       # build the tarball via npm pack
pnpm run release:aws    # publish to npm under the `aws` tag
```

The root script `pnpm release:cloud-export-video:aws` wraps this from the repo root.

Other cloud functions (e.g. `cloud-transcript`) follow the same pattern: `verify:aws`, `pack:aws`, `release:aws`. The `release:aws` script always uses `--tag aws` and `--access public`.

## Required artifacts per cloud function

- `platform/aws/Dockerfile`
- `platform/aws/handler.js` (the Lambda entry point)
- `bin/<name>.js` (the deploy helper)

`verify:aws` checks that all three are present before any pack or release runs.

## Changeset hygiene

- **One changeset per logical change.** Don't lump unrelated features together.
- **Write for the user, not the maintainer.** "Adds an `onProgress` callback to the renderer" is better than "refactor: progress reporting".
- **Mention breaking changes explicitly.** Bump `major` and put `**BREAKING**` in the summary.

## Don't

- Don't publish without a changeset.
- Don't skip the review step.
- Don't force-push or rewrite history during a release.
- Don't use the npm `latest` tag for Lambda containers — it's `aws`.
