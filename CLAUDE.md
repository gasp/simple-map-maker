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

## Purpose

A map drawing app — users pick tiles from the tileset panel and paint them onto a grid canvas.

## Architecture

Two-panel layout: a server-rendered map canvas (`src/app/page.tsx`) and a client-side tileset picker sidebar (`src/components/tileset-browser.tsx`).

**Tileset rendering** — sprites are rendered via CSS `background-image` + `background-position` to crop a specific tile from a spritesheet PNG. Tiles are 16×16px; all tilesets live in `public/Tilesets/`. Use `imageRendering: pixelated` on any upscaled tile.

**Tileset API** — `GET /api/tilesets` scans `public/Tilesets/` recursively and returns `{ name, path, width, height }[]`. Dimensions are read directly from PNG file headers (no extra dependencies). `TilesetBrowser` fetches this on mount and renders a `<select>` to switch between tilesets. `TilesSet` accepts `{ src, cols, rows }` props; cols/rows are derived as `Math.floor(width / 16)` and `Math.floor(height / 16)`.

**React Compiler** is enabled (`next.config.ts` + `babel-plugin-react-compiler`). Avoid manual `useMemo`/`useCallback` — the compiler handles memoization.

**Path alias:** `@/*` → `src/*`
