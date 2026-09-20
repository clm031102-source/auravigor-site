# AGENTS.md — working rules for coding agents (Codex)

You are the implementation engineer on the AuraVigor brand site: a scroll-driven WebGL product
showcase. The architecture, scaffold and task breakdown already exist. Your job is to implement
**one task card at a time** from `docs/TASKS.md` without eroding the architecture.

## Read first, every session

1. `docs/ARCHITECTURE.md` — layer map, data flow, the contracts you must keep.
2. `docs/TASKS.md` — find your task card (`T##`). Its scope, requirements and acceptance list are the spec.
3. `docs/REFERENCE.md` — what the target experience feels like, act by act.

## Commands

```bash
npm install        # Node >= 20
npm run dev        # http://localhost:5173
npm run check      # typecheck + unit tests + production build  ← must pass before you finish
npm run shots      # optional: headless screenshots of every act into ./.shots (needs Playwright Chromium)
```

## Non-negotiable rules

1. **One task = one branch = one PR.** Branch `t##-short-name`, PR title `T##: <card title>`.
   Paste the card's acceptance list into the PR body and tick each item (or explain why not).
   Update the task's row in the status table at the top of `docs/TASKS.md` in the same PR.
2. **Stay in scope.** Touch only the files a card lists under "Scope". If you need more, say so in
   the PR description instead of silently widening the change. No drive-by refactors.
3. **Content lives in `src/content/`.** No copy, colours, product facts or URLs hard-coded in
   components. New content needs a typed field in `src/content/types.ts` first.
4. **Never invent product claims.** All marketing copy is supplied by the brand team and is
   compliance-reviewed. If copy is missing, keep / add a `[Placeholder]` string. Do not write
   health, performance or ingredient claims yourself — not even "obvious" ones.
5. **Scroll → state goes through the director.** `src/director/useScrollDirector.ts` is the only
   place scroll is read. three.js reads `scrollState` inside `useFrame`; DOM animates from the CSS
   variables (`--p-*`, `--vis-*`, `--theme-mix`, `--burst`, `--progress`); React state (zustand)
   is for discrete values only. Never call `setState` per frame. Never add a second scroll listener.
6. **Motion numbers live in `src/experience/choreography.ts` (`TUNING`) and `src/director/acts.ts`.**
   Both are pure and unit-tested. Change behaviour → update / add tests next to them.
7. **Keep the layer contract** (backdrop 0 → slogan 1 → transparent canvas 2 → DOM 3 → header).
   The canvas never takes pointer events; every interaction has a DOM control that works with
   keyboard and screen readers.
8. **No runtime third-party requests.** No font/HDRI/script CDNs, no Google Fonts, no analytics
   snippets unless a card says so. Assets are self-hosted under `public/`.
9. **Respect `prefers-reduced-motion`** in anything you animate.
10. **Dependencies:** adding one needs a line of justification in the PR. `react` / `react-dom` are
    pinned to `~19.2` because `@react-three/fiber@9` declares `react <19.3` — do not bump them
    unless fiber's peer range allows it.

11. **Communication language:** PR descriptions, reports, and all instructions for Alan must be
    written in Chinese. Code comments remain in English.

## Code conventions

- TypeScript strict, no `any`, no non-null `!` on things that can really be null.
- Imports use the `@/` alias (→ `src/`). Named exports only.
- Components: one per file, PascalCase. Pure logic: camelCase `.ts` with a sibling `.test.ts`.
- CSS: plain CSS in `src/styles/`, BEM-ish class names, **tokens only** — raw hex / px values
  belong in `tokens.css`. No CSS-in-JS, no Tailwind.
- Dispose what you create in three.js (geometries, textures, materials) in effect cleanups.
- Comments explain *why*, in English. Docs under `docs/` are in Chinese for the brand team — keep
  them in Chinese when you update them.

## Known, harmless noise

- Console warning `THREE.Clock: This module has been deprecated` comes from inside
  `@react-three/fiber`; ignore until fiber ships the fix.

## When you are unsure

Stop and leave a question in the PR description. A wrong guess about brand, copy, legal text or
architecture costs more than a paused task.
