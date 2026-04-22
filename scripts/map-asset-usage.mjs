import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const layers = ["map-floor.json", "map-low.json", "map-high.json"].map((f) =>
  JSON.parse(readFileSync(resolve(__dirname, "..", f), "utf8"))
);

const uniqueTiles = new Map(); // "tilesetPath:col:row" -> count

for (const { cells } of layers) {
  for (const row of cells) {
    for (const cell of row) {
      if (!cell) continue;
      const key = `${cell.tilesetPath}:${cell.col}:${cell.row}`;
      uniqueTiles.set(key, (uniqueTiles.get(key) ?? 0) + 1);
    }
  }
}

const byTileset = new Map();
for (const [key, count] of uniqueTiles) {
  const tileset = key.split(":")[0];
  if (!byTileset.has(tileset)) byTileset.set(tileset, []);
  byTileset.get(tileset).push({ key, count });
}

console.log(`Total unique tiles used: ${uniqueTiles.size}\n`);
for (const [tileset, tiles] of byTileset) {
  console.log(`${tileset} — ${tiles.length} unique tile(s)`);
  for (const { key, count } of tiles.sort((a, b) => b.count - a.count)) {
    const [, col, row] = key.split(":");
    console.log(`  col=${col} row=${row}  ×${count}`);
  }
}
