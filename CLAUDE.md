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

`page.tsx` renders `<MapEditor />`, a client component that owns all shared state and provides the two-panel layout.

**State flow** — `MapEditor` holds `selectedTile: TileRef | null` and `cells: CellData[][]` (16×16). `TilesetBrowser` calls `onTileSelect` when a sprite is clicked; `MapGrid` calls `onCellClick(row, col)` to stamp the selected tile into the grid.

**Shared types** live in `src/types/map.ts`: `TileRef = { tilesetPath, tilesetCols, tilesetRows, col, row }` and `CellData = TileRef | null`.

**Tileset rendering** — sprites are rendered via CSS `background-image` + `background-position` to crop a specific tile from a spritesheet PNG. Tiles are 16×16px; all tilesets live in `public/Tilesets/`. Always use `imageRendering: pixelated` on upscaled tiles. cols/rows are derived as `Math.floor(width / 16)`.

**APIs**
- `GET /api/tilesets` — scans `public/Tilesets/` recursively, reads PNG dimensions from file headers (no extra deps), returns `{ name, path, width, height }[]`.
- `POST /api/map` — saves `{ cells: (null | { tilesetPath, col, row })[][] }` to `map.json` at the project root.

**Map grid** — `MapGrid` renders a 16×16 grid of 32px cells (`CELL_SIZE = 32`). Each cell uses the same background-position technique to render its tile.

**React Compiler** is enabled (`next.config.ts` + `babel-plugin-react-compiler`). Avoid manual `useMemo`/`useCallback` — the compiler handles memoization.

**Path alias:** `@/*` → `src/*`
