# AGENTS.md — Twick SDK

> **Index file for any AI agent working in the Twick SDK monorepo.**
> Read this first. It links to the authoritative docs.

## What this project is

Twick is an open-source SDK for building in-browser and cloud video editors. This repository is a **pnpm + Turbo monorepo** of 16+ TypeScript packages, plus AWS Lambda cloud functions and MCP servers. The flagship user-facing package is `@twick/studio` — a full React video editor UI built on a layered architecture: timeline model → canvas → live player → studio shell. All non-trivial edits belong inside a single package; the package boundaries are strict.

## Required reading before you write code

| Doc | What it covers |
| --- | --- |
| [`AI_Builder.md`](./AI_Builder.md) | The official Twick guide for AI app builders. Defines integration levels (1 = Full Studio, 2 = Core editor, 3 = Headless), package boundaries (§5), coding style summary (§6), AI/LLM rules (§7). **Read §5 before touching any package.** |
| [`STYLE_GUIDE.md`](./STYLE_GUIDE.md) | Twick's coding style. TS only, 2-space, double quotes, semicolons, PascalCase classes, camelCase fns, kebab-case files, `const fn = () =>` preferred, `import type` for type-only, JSDoc on public APIs. |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Node 18+ (root says 20+ for some packages), pnpm 8.15.4+, the `pnpm install` / `pnpm dev` / `pnpm build` / `pnpm lint` / `pnpm test` scripts, changesets for versioning, Conventional Commits, branch naming `feature/*` or `fix/*`, and the "Adding a New Package" template. |
| [`packages/USER_MANUAL.md`](./packages/USER_MANUAL.md) | The public-facing Twick SDK user manual (media management, integration, configuration). Useful when answering "how do I configure Studio?" questions. |

## Package boundaries

Authorized by `AI_Builder.md` §5. **Do not cross these.**

| Concern | Allowed package(s) |
| --- | --- |
| Timeline model + operations | `@twick/timeline` |
| Canvas (Fabric.js) tools | `@twick/canvas` |
| Player state, `currentTime` sync | `@twick/live-player` |
| Full editor UI | `@twick/studio` or `@twick/video-editor` |
| MP4 rendering | `@twick/browser-render`, `@twick/render-server`, `packages/cloud-functions/cloud-export-video` |
| WebGL effects (fragment shaders) | `@twick/effects` |
| AI / LLM calls | Backend/cloud layer only — **NEVER** inside React, `@twick/timeline`, or `@twick/canvas` |
| MCP server | `packages/agents/*` |
| Cloud functions (Lambda) | `packages/cloud-functions/*` |

If a change touches more than one of the rows above, stop and hand off to the `twick-architect` subagent first.

## Provider tree

**Do not break this nesting.** It is the public API contract.

```tsx
<LivePlayerProvider>          // @twick/live-player
  <TimelineProvider           // @twick/timeline
    initialData={INITIAL_TIMELINE_DATA}
    contextId="..."
  >
    <TwickStudio ... />       // @twick/studio  (or <VideoEditor /> for level 2)
  </TimelineProvider>
</LivePlayerProvider>
```

## Command reference

All commands run from the repo root. Per-package scripts are turbo filters.

| Command | Purpose |
| --- | --- |
| `pnpm install` | Install everything. First-time only. |
| `pnpm build` | Build all packages. |
| `pnpm build:<name>` | Build one package, e.g. `pnpm build:timeline`, `pnpm build:studio`. |
| `pnpm dev` | Watch all packages (concurrent). |
| `pnpm dev:<name>` | Watch one package, e.g. `pnpm dev:studio`, `pnpm dev:examples`. |
| `pnpm preview` | Serve the `@twick/examples` Vite preview (port 3000). |
| `pnpm lint` | Lint everything. |
| `pnpm lint:fix` | Lint with autofix. |
| `pnpm test` | Run all tests. |
| `pnpm test:smoke` | Smoke test for `@twick/cloud-export-video`. |
| `pnpm build:cloud-functions` | Build every `packages/cloud-functions/*` package. |
| `pnpm pack:cloud-export-video:aws` | Build the AWS Lambda container tarball. |
| `pnpm release:cloud-export-video:aws` | Publish the AWS container to npm under the `aws` tag. |
| `pnpm changeset` | Create a changeset (required for user-facing changes). |
| `pnpm version` | Consume changesets and bump package versions. |
| `pnpm release` | `turbo run build && changeset publish` (the canonical release flow). |
| `pnpm clean:packages` | Remove `dist`, `.turbo`, `node_modules` in every package. |
| `pnpm rebuild` | `clean:packages` + `clean` + `install` + `build` — the "start over" recipe. |
| `/sync-upstream` (slash command) | Sync this fork with `ncounterspecialist/twick`. |
| `/release` (slash command) | Walk through a changesets-driven release. |

## Conventions

- **Commits** — Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
- **Branches** — `feature/<name>` or `fix/<name>`.
- **Changesets** — Required for any user-facing change. Run `pnpm changeset` before opening the PR.
- **PRs** — Target the user's fork `main`; optionally PR upstream afterward.

## OneDrive note

This repo lives under **OneDrive sync** (`OneDrive - New Light Anglican Church\Documents\antigravity\twick`). OneDrive aggressively syncs large `node_modules` directories, which makes `pnpm install`, builds, and rebuilds noticeably slower than on a local-only disk. A few practical consequences:

- `pnpm install` and the first `pnpm build` can take several minutes the first time. Subsequent runs are faster, but still slower than the equivalent on a non-synced path.
- Do **not** commit `node_modules/`, `.turbo/`, or `.pnpm-store/`. They are already in the root `.gitignore`, but be aware they will appear in OneDrive's local view.
- Add `.opencode/scratch/` to your local ignore list (its `.gitignore` already contains `*`) so agent scratch notes do not get pushed.
- If OneDrive locks a file mid-build, you will see `EBUSY` or `EPERM`. Pause sync for the repo folder, re-run the command, then resume sync.
- For faster iteration, consider cloning the repo to a non-synced path and symlinking back, or use Windows **Developer Mode** + long paths (`git config core.longpaths true`).
