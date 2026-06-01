---
name: twick-build
description: Twick monorepo build, test, lint, and dev commands. Use when a task mentions "build", "test", "lint", "dev server", "preview", "turbo", "watch", or any per-package pnpm script in the Twick repo.
---

# Twick Build / Test / Lint / Dev

All commands run from the repo root unless noted. The repo is a pnpm + Turbo monorepo; per-package scripts in the root `package.json` are turbo filters.

## Install

| Command | Purpose |
| --- | --- |
| `pnpm install` | Install all workspace dependencies. Run once after clone; rerun when `pnpm-lock.yaml` changes. |

## Build

| Command | Purpose |
| --- | --- |
| `pnpm build` | Build all packages via `turbo run build`. |
| `pnpm build:<name>` | Build one package, e.g. `pnpm build:timeline`, `pnpm build:studio`, `pnpm build:browser-render`, `pnpm build:render-server`, `pnpm build:examples`, `pnpm build:mcp-agent`, `pnpm build:visualizer`, `pnpm build:video-editor`, `pnpm build:live-player`, `pnpm build:media-utils`, `pnpm build:workflow`. |
| `pnpm build:documentation` | Build the `@twick/documentation` site (runs docs first). |
| `pnpm build:cloud-functions` | Build every `packages/cloud-functions/*` package. |
| `pnpm rebuild` | "Start over": `clean:packages` + `clean` + `install` + `build`. |

Per-package build is usually `tsc --noEmit && vite build`. Don't edit `dist/` — it's generated.

## Dev / watch

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Watch all packages concurrently. |
| `pnpm dev:<name>` | Watch one package, e.g. `pnpm dev:studio`, `pnpm dev:examples`, `pnpm dev:canvas`, `pnpm dev:timeline`. |
| `pnpm preview` | Serve the `@twick/examples` Vite preview at `http://localhost:3000`. |

`dev:*` tasks are long-running watch processes. Stop with `Ctrl+C`. Don't run multiple `dev:*` tasks in parallel — they conflict on Vite ports.

## Lint

| Command | Purpose |
| --- | --- |
| `pnpm lint` | Lint every package. |
| `pnpm lint:fix` | Lint with auto-fix. |
| `pnpm turbo run lint --filter=@twick/<name>` | Lint one package. |

ESLint flat config is the standard. Each leaf package has its own `eslint.config.js` or `.eslintrc.json`; the root devDeps pin `eslint@^9.25.0` and `typescript-eslint@^8.30.1`.

## Test

| Command | Purpose |
| --- | --- |
| `pnpm test` | Run all tests via `turbo run test`. |
| `pnpm test:smoke` | Smoke test for `@twick/cloud-export-video`. |
| `pnpm turbo run test --filter=@twick/<name>` | Test one package. |

Most leaf packages currently declare `"test": "echo \"No tests for @twick/<name>\" && exit 0"`. Real tests live in `cloud-transcript` (Node `--test` in `test/transcriber.test.js`) and a few others. If you're adding tests, prefer colocated `*.test.ts(x)` next to source OR a `test/` folder for Node `--test`.

## Clean

| Command | Purpose |
| --- | --- |
| `pnpm clean:packages` | Remove `dist`, `.turbo`, `node_modules` in every package. |
| `pnpm clean` | Remove root `node_modules` and `.turbo`. |
| `pnpm rebuild` | The "nuke and rebuild" combo. |

If a build fails with stale `dist/`, run `pnpm clean:packages && pnpm install && pnpm build:<name>`.

## Changesets (required for user-facing changes)

| Command | Purpose |
| --- | --- |
| `pnpm changeset` | Interactive: pick packages + bump level + write a summary. Writes `.changeset/<random>.md`. |
| `pnpm version` | Consume pending changesets, bump versions. |
| `pnpm release` | `turbo run build && changeset publish` — the canonical publish flow. |
| `pnpm pack:cloud-export-video:aws` | Build the AWS Lambda container tarball. |
| `pnpm release:cloud-export-video:aws` | Publish the AWS container to npm under the `aws` tag. |

## OneDrive reminder

This repo is on OneDrive. `pnpm install` and rebuilds can be several minutes the first time. If you see `EBUSY`/`EPERM`, pause OneDrive sync for the folder and retry.
