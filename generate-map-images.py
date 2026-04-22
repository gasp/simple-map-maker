#!/usr/bin/env python3
import json
import os
from PIL import Image

TILE_SIZE = 16
GRID_SIZE = 16
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, "public")

tileset_cache = {}

def get_tileset(path):
    if path not in tileset_cache:
        full_path = PUBLIC_DIR + path
        tileset_cache[path] = Image.open(full_path).convert("RGBA")
    return tileset_cache[path]

def render_layer(json_file, output_file):
    with open(os.path.join(BASE_DIR, json_file)) as f:
        data = json.load(f)

    canvas = Image.new("RGBA", (GRID_SIZE * TILE_SIZE, GRID_SIZE * TILE_SIZE), (0, 0, 0, 0))
    cells = data["cells"]

    for row_idx, row in enumerate(cells):
        for col_idx, cell in enumerate(row):
            if cell is None:
                continue
            tileset = get_tileset(cell["tilesetPath"])
            sx = cell["col"] * TILE_SIZE
            sy = cell["row"] * TILE_SIZE
            tile = tileset.crop((sx, sy, sx + TILE_SIZE, sy + TILE_SIZE))
            canvas.paste(tile, (col_idx * TILE_SIZE, row_idx * TILE_SIZE), tile)

    canvas.save(os.path.join(BASE_DIR, output_file))
    print(f"Saved {output_file}")

render_layer("map-floor.json", "map-floor.png")
render_layer("map-low.json",   "map-low.png")
render_layer("map-high.json",  "map-high.png")
