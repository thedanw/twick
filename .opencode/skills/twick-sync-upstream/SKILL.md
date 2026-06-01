---
name: twick-sync-upstream
description: Sync this Twick fork with the upstream ncounterspecialist/twick. Use when a task mentions "sync", "upstream", "fetch upstream", "fast-forward", "behind", "diverged from upstream", or "/sync-upstream".
---

# Twick Fork Sync

This fork (`thedanw/twick`) tracks upstream (`ncounterspecialist/twick`). Sync only with a **fast-forward merge** — no rebases, no force-pushes, no merge commits that rewrite history.

## Pre-flight

1. Add the upstream remote once (one-time setup):

   ```bash
   git remote add upstream https://github.com/ncounterspecialist/twick.git
   git fetch upstream
   ```

2. Confirm the remote is in place:

   ```bash
   git remote -v
   # origin    https://github.com/thedanw/twick.git (fetch)
   # origin    https://github.com/thedanw/twick.git (push)
   # upstream  https://github.com/ncounterspecialist/twick.git (fetch)
   # upstream  https://github.com/ncounterspecialist/twick.git (push)
   ```

## Sync procedure

```bash
# 1. Fetch latest from upstream
git fetch upstream

# 2. Refuse to proceed if the working tree is dirty
git status
```

If `git status` is anything other than "nothing to commit, working tree clean", **stop**. Ask the user to commit, stash, or discard the uncommitted work before continuing.

```bash
# 3. Switch to main
git checkout main

# 4. Fast-forward only — never a merge commit
git merge --ff-only upstream/main
```

If `--ff-only` fails, the local `main` has diverged from upstream. **Do not** fall back to a regular merge or a rebase. Stop and ask the user how they want to proceed. The typical answers are:

- "I want to keep my local commits — help me rebase or re-merge later."
- "I want to throw away my local commits — I'll cherry-pick what I need first."

Never `git reset --hard upstream/main` without explicit user approval.

```bash
# 5. Push the synced main back to the fork
git push origin main

# 6. Report the new HEAD SHA and how many commits came in
git rev-parse HEAD
git log --oneline upstream/main ^main@{1} 2>/dev/null | wc -l
```

## After sync

- If the upstream brought changesets into `.changeset/`, the user may want to `pnpm install` and `pnpm build` to refresh the lockfile and `dist/` outputs.
- If the upstream bumped a `@twick/*` version in a `package.json`, the user may want to re-run `pnpm version` to align the fork.

## Slash command

The `/sync-upstream` slash command (in `.opencode/opencode.json`) wraps this procedure. It will refuse to run if the working tree is dirty, and it will not force-push.
