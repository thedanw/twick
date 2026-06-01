---
name: twick-architecture
description: Twick SDK package boundaries, dependency direction, and provider tree. Use when a question involves "package boundary", "where should this code live", "which package", "dependency direction", "import from", or "what depends on what".
---

# Twick Architecture

Authoritative source: `AI_Builder.md` §5 in the repo root.

## Package boundary matrix

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

## Provider tree (must not be broken)

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

## Hard rules

- **No React in `@twick/timeline` or `@twick/canvas`.** They are state + ops, not UI.
- **No AI/LLM SDK calls in React, timeline, canvas, or studio.** Wrap them in a provider interface and call them from a cloud function or backend route. The provider returns Twick-shaped data (captions that map to caption elements, timelines that map to `ProjectJSON`).
- **Do not mix UI logic with timeline state.** All timeline modifications go through `@twick/timeline` APIs acting on `ProjectJSON` / `TrackElement` objects. Do not hand-mutate raw JSON from inside a React component.
- **Keep canvas in sync with player.** When adding canvas-dependent features, respect `currentTime` from `@twick/live-player`.
- **Dependency direction is downward.** `@twick/studio` may import from timeline, canvas, and live-player — but not the reverse. The same holds for any cross-package import: depend only on packages listed in the same row or a row above yours.

## When you're not sure

- "Where does this function belong?" — read the matrix, find the concern column, follow it to the package. If the function touches multiple rows (e.g. UI + state), split it: state/mutation in the lower package, UI hook in the higher one.
- "Is this a new package or a new file in an existing package?" — if it doesn't match an existing row, it's a new package. Use the `twick-architect` subagent to confirm.
- "Should I add a dependency on `@twick/*` or just `import` directly?" — always go through the package boundary. No deep relative imports across packages.
