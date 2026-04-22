# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev      # start dev server at localhost:3000
pnpm build    # production build
pnpm lint     # run ESLint
```

No test suite is configured.

## Architecture

Two-panel layout: a server-rendered map canvas (`src/app/page.tsx`) and a client-side tileset picker sidebar (`src/components/tiles-set.tsx`).

**Tileset rendering** — sprites are rendered via CSS `background-image` + `background-position` to crop a specific tile from a spritesheet PNG. Tiles are 16×16px; all tilesets live in `public/Tilesets/`. Use `imageRendering: pixelated` on any upscaled tile.

**React Compiler** is enabled (`next.config.ts` + `babel-plugin-react-compiler`). Avoid manual `useMemo`/`useCallback` — the compiler handles memoization.

**Path alias:** `@/*` → `src/*`
