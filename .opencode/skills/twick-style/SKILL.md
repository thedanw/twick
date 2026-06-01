---
name: twick-style
description: Twick coding style — naming, formatting, function style, JSDoc, TypeScript conventions. Use when a task mentions "style", "naming", "format", "lint", "code style", "PascalCase", "camelCase", "kebab-case", or asks to match the existing codebase conventions.
---

# Twick Style Guide (concise)

Full rules: `STYLE_GUIDE.md` in the repo root. The list below is the cheat-sheet — read `STYLE_GUIDE.md` for context and examples.

## Formatting

- **Indent:** 2 spaces. No tabs.
- **Strings:** double quotes `"`. No single quotes.
- **Semicolons:** at line ends. Always.
- **Line length:** readable, ~100–120 chars max.
- **End of line:** LF (`\n`). The `.vscode/settings.json` pins this — don't let editors convert to CRLF.

## Naming

| Thing | Convention | Example |
| --- | --- | --- |
| Classes | PascalCase | `Track`, `ElementController` |
| Interfaces / types | PascalCase; `interface` for object shapes, `type` for unions/aliases | `Position`, `ElementJSON`, `TrackType` |
| Constants | UPPER_SNAKE_CASE; `as const` for literal types | `TRACK_TYPES`, `WORDS_PER_PHRASE` |
| Functions / variables / methods | camelCase | `getCurrentElements`, `minDist` |
| React components | PascalCase; props type with `Props` suffix | `TextPanel` / `TextPanelProps` |
| React hooks | camelCase with `use` prefix | `useTextPanel`, `useTwickCanvas` |
| Files / folders | kebab-case | `text-panel.tsx`, `use-text-panel.ts`, `element-serializer.ts` |

## Functions

- **Prefer** `const fn = (...): ReturnType => {}` for utils, hooks, helpers, handlers.
- **`function Name()` is fine for:** top-level exported pure functions, React components.
- **Arrow functions for inline callbacks** and non-exported helpers.

## TypeScript

- **TypeScript only.** No `any` in new code; use `unknown` or a precise type.
- **`import type` for type-only imports.**
- **Prefer named exports.** Default export only for single primary exports (e.g. main app entry, a singleton controller).
- **Optional chaining + nullish coalescing** for safe defaults: `props?.x ?? 0`.
- **Export public types from `src/index.ts`** so consumers don't reach into internals.

## React

- Function components only.
- Extract logic into custom hooks (`useXxx`).
- Define props with `interface` or `type` in PascalCase + `Props` suffix.
- Use named exports for components and hooks; default export only when the file has a single primary export.

## JSDoc

Add JSDoc on public APIs (exported functions, classes, hooks, non-obvious types). Include `@param`, `@returns`, `@example` where it helps. Example:

```ts
/**
 * Snaps a time value to the nearest target within the threshold.
 *
 * @param time - The candidate time in seconds
 * @param targets - Array of snap target times in seconds
 * @param thresholdSec - Maximum distance (in seconds) to snap. Default 0.1.
 * @returns SnapResult with time, didSnap, and optional snapTarget
 */
export const snapTime = ( ... ) => { ... };
```

## File / folder layout

- `src/` for source.
- `src/index.ts` is the public API re-export.
- Group by concern: `hooks/`, `helpers/`, `components/`, `controllers/`, `elements/`, `utils/`, `context/`.
- Within a file: imports first, then constants/types, then implementation, then exports (or inline `export`).
- Canvas/visualizer element handlers are often objects keyed by type: `const TextElement: CanvasElementHandler = { add, updateFromFabricObject, ... }`.
- Controller registries (e.g. `ElementController`) are classes exported as the class plus a singleton default.

## Checklist

- [ ] `const fn = (): ReturnType => {}` for utils, hooks, helpers
- [ ] `import type` for type-only imports
- [ ] Double quotes, semicolons, 2-space indent, LF
- [ ] JSDoc with `@param` / `@returns` / `@example` on public APIs
- [ ] No `any` in new code
- [ ] PascalCase classes/types, camelCase fns, kebab-case files
