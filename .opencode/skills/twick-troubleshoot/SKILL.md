---
name: twick-troubleshoot
description: Common Twick monorepo issues and one-line fixes. Use when a task reports an "error", "broken", "doesn't work", "fail", "ENOENT", "ESM", "CORS", "WebCodecs", "FFmpeg", "wasm", "Vertex", "Lambda", or a `pnpm install` / build / runtime symptom in the Twick repo.
---

# Twick Troubleshoot (top issues, one-line fixes)

Full reference: `TROUBLESHOOTING.md` in the repo root. The list below is the fast triage.

## Install / build

- **`pnpm install` is slow on OneDrive** — expected. Pause OneDrive sync for the repo folder for the first install. Subsequent runs are faster.
- **`EBUSY` / `EPERM` during install or build on Windows** — OneDrive has a file lock. Pause sync, retry, resume.
- **`pnpm install` fails on Windows with path errors** — enable long paths: `git config core.longpaths true` and turn on Windows Developer Mode.
- **Stale `dist/` after a build error** — `pnpm clean:packages && pnpm install && pnpm build:<name>`. Or `pnpm rebuild` for a full nuke.
- **`Cannot find module '@twick/...'` after a fresh clone** — you didn't run `pnpm build` first. Some packages consume each other via `workspace:*` and need a build to produce `dist/`.

## TypeScript / types

- **`Cannot find type definition file for '...'`** — your local `node_modules/typescript` is missing. `pnpm install` from the root.
- **Editor uses a different TS version than the repo** — install the **TypeScript Workspace Version** extension, or set `typescript.tsdk` in `.vscode/settings.json` to `./node_modules/typescript/lib`.
- **`noUnusedLocals` / `noUnusedParameters` errors** — the root `tsconfig.json` has both on. Prefix intentionally-unused args with `_`.

## Lint

- **`pnpm lint` fails after a UI edit** — likely a `react-hooks/exhaustive-deps` warning that's been promoted. Run `pnpm lint:fix` first, then fix what remains.
- **Flat config (`eslint.config.js`) in one package, legacy (`.eslintrc.json`) in another** — this is real. The repo is mid-migration. Use the config that lives in the package you're editing.
- **Missing `eslint-plugin-react-hooks`** — install the matching devDep in the package (the flat-config example in `packages/studio/eslint.config.js` shows the right wiring).

## React / Studio

- **Studio shows nothing / black canvas** — `INITIAL_TIMELINE_DATA` isn't being passed. Check the provider tree: `LivePlayerProvider` → `TimelineProvider` → `TwickStudio`. See `AI_Builder.md` §2.2.
- **`currentTime` is out of sync between canvas and player** — your canvas subscription isn't reading from `@twick/live-player`. See `AI_Builder.md` §5 ("Keep canvas in sync with player").
- **Studio CSS not loaded** — you forgot `import "@twick/studio/dist/studio.css"`. The CSS is a side-effect import, not a named export.

## Canvas / Fabric.js

- **Custom element handler doesn't render in studio** — register it on `ElementController` and re-export from `src/index.ts`. Check `packages/canvas/` for the registry pattern.
- **Fabric object updates are lost on re-mount** — persist via the timeline model (`@twick/timeline`), not by mutating the Fabric object directly.

## WebGL / effects (`@twick/effects`)

- **Effect renders black on Safari** — precision qualifiers. Use `mediump` for colors, `highp` for positions.
- **`discard` abuse / performance hit** — effects must be GPU-safe. Prefer blend math to `discard` where possible.
- **Effect uniform not applied** — the program binding is recreated on uniform-set, not on every frame. Re-create the binding in the right hook.

## Render (browser)

- **WebCodecs not supported** — Safari < 16.4 and most mobile browsers. Fall back to `render-server` or `cloud-export-video`.
- **FFmpeg.wasm `SharedArrayBuffer is not defined`** — your Vite dev server needs COOP/COEP headers. In `vite.config.ts` add `server.headers: { "Cross-Origin-Opener-Policy": "same-origin", "Cross-Origin-Embedder-Policy": "require-corp" }`.
- **Browser-render audio is silent or out of sync** — FFmpeg.wasm worker init is racing the video encode. Await the worker ready promise before muxing.

## Render (server)

- **render-server OOM on long videos** — stream the timeline to the encoder instead of materializing the full frame buffer. Reduce FFmpeg `-crf` and use a faster preset.
- **Puppeteer can't launch in Docker** — pass `--no-sandbox` and the right `--disable-dev-shm-usage`. See `packages/cloud-functions/cloud-export-video/platform/aws/Dockerfile` for the working flags.

## Cloud functions / Lambda

- **Vertex AI returns empty captions** — wrong model name (Gemini versions matter), missing `GOOGLE_CLOUD_PROJECT`, or the GCP service account secret is unset. Check the env vars listed in `packages/cloud-functions/transcript/README.md`.
- **CORS error on S3 upload** — the bucket CORS config is missing. Use the template in `packages/cloud-functions/cors/s3-cors.json`.
- **`pnpm pack:cloud-export-video:aws` fails on `verify:aws`** — `platform/aws/Dockerfile` or `platform/aws/handler.js` is missing. The build expects both.

## MCP (`@twick/mcp-agent`)

- **Claude Desktop can't find the server** — `claude_desktop_config.json` has the wrong `command` or `args`. See the example in `packages/agents/mcp-agent/`.
- **Tool result too large for the LLM context window** — paginate or add a `summary` mode. Don't dump the full timeline.

## OneDrive

- **`node_modules` is huge / slow to sync** — `pnpm install` creates thousands of tiny files. Consider excluding the repo from OneDrive sync and using a non-synced clone.
- **`git status` shows files you didn't touch** — that's OneDrive adding `Zone.Identifier` / `desktop.ini` files. Add them to `.git/info/exclude`.

## Still stuck?

- Read `TROUBLESHOOTING.md` in the repo root.
- Search the relevant package's README (`packages/<name>/README.md`).
- For cloud function / Lambda issues, delegate to the `twick-cloud` or `twick-render` subagent.
- For effect / shader issues, delegate to the `twick-effects` subagent.
