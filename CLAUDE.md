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

**State flow** — `MapEditor` holds `selectedTile: TileRef | null`, `activeLayer: LayerIndex`, and `layers: [CellData[][], CellData[][], CellData[][]]` (three 16×16 grids). `TilesetBrowser` calls `onTileSelect`; `MapGrid` calls `onCellClick(row, col)` which writes to `layers[activeLayer]`.

**Layers** — three named layers: Floor (0), Low (1), High (2). A connected button group above the grid switches `activeLayer`. Cells render all three layers stacked with `position: absolute` in order. Save writes all three to `map-floor.json`, `map-low.json`, `map-high.json`.

**Shared types** live in `src/types/map.ts`: `TileRef = { tilesetPath, tilesetCols, tilesetRows, col, row }`, `CellData = TileRef | null`, `LayerIndex = 0 | 1 | 2`, `LAYER_NAMES = ['Floor', 'Low', 'High']`.

**Tileset rendering** — sprites are rendered via CSS `background-image` + `background-position` to crop a specific tile from a spritesheet PNG. Tiles are 16×16px; all tilesets live in `public/Tilesets/`. Always use `imageRendering: pixelated` on upscaled tiles. cols/rows are derived as `Math.floor(width / 16)`.

**Collision layer** — a separate `boolean[][]` (16×16) tracking walkability: `false` = land, `true` = wall. Toggled via a "Collision" button; when active, left-click toggles a cell's state and right-click is a no-op (tile interactions are fully disabled). Rendered as a semi-transparent overlay (red for wall, faint green for land). Saved to `map-collision.json`.

**APIs**
- `GET /api/tilesets` — scans `public/Tilesets/` recursively, reads PNG dimensions from file headers (no extra deps), returns `{ name, path, width, height }[]`.
- `GET /api/map` — returns `{ layers: [cells, cells, cells], collision: boolean[][] }`, reading from the four JSON files (empty grids if files don't exist yet).
- `POST /api/map` — accepts `{ layers: [cells, cells, cells], collision: boolean[][] }` and writes `map-floor.json`, `map-low.json`, `map-high.json`, `map-collision.json`. Each tile cell is `null | { tilesetPath, col, row }`.

**Map grid** — `MapGrid` renders a 16×16 grid of 32px cells (`CELL_SIZE = 32`). Each cell is `position: relative` with up to three absolutely-positioned tile divs stacked floor→low→high, plus an optional collision overlay div. "Grid" toggle button shows/hides cell borders. Both toggles use a highlighted button style when active.

**TilesetBrowser** — the tileset selector is a custom scrollable list (not a `<select>`), required because native `<option>` elements don't fire mouse events reliably. Hovering an item shows the full tileset PNG at 1:1 pixel ratio in a `position: fixed` floating panel to the left of the list (`pointerEvents: none`, viewport-clamped). Clicking an item sets it as the active tileset.

**React Compiler** is enabled (`next.config.ts` + `babel-plugin-react-compiler`). Avoid manual `useMemo`/`useCallback` — the compiler handles memoization.

**Path alias:** `@/*` → `src/*`
