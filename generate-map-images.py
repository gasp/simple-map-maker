#!/usr/bin/env python3
import argparse
import json
import os
from PIL import Image, ImageDraw

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

def render_layer(json_file):
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

    return canvas

def save(img, path):
    img.save(os.path.join(BASE_DIR, path))
    print(f"Saved {path}")

parser = argparse.ArgumentParser(description="Render map JSON layers to PNG images.")
parser.add_argument("--input",  default="map", help="Base name for input JSON files (default: map)")
parser.add_argument("--output", default=None,  help="Base name for output PNG files (default: same as --input)")
args = parser.parse_args()

out = args.output if args.output is not None else args.input

floor = render_layer(f"{args.input}-floor.json")
low   = render_layer(f"{args.input}-low.json")
high  = render_layer(f"{args.input}-high.json")

save(floor, f"{out}-floor.png")
save(low,   f"{out}-low.png")
save(high,  f"{out}-high.png")

# Composite preview: floor → low → high
preview = floor.copy()
preview.alpha_composite(low)
preview.alpha_composite(high)
save(preview, f"{out}-preview.png")

# Collision preview: composite + red 50% overlay on blocked cells
collision_path = os.path.join(BASE_DIR, f"{args.input}-collision.json")
if os.path.exists(collision_path):
    with open(collision_path) as f:
        collision = json.load(f)

    overlay = Image.new("RGBA", preview.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for row_idx, row in enumerate(collision["cells"]):
        for col_idx, blocked in enumerate(row):
            if blocked:
                x = col_idx * TILE_SIZE
                y = row_idx * TILE_SIZE
                draw.rectangle([x, y, x + TILE_SIZE - 1, y + TILE_SIZE - 1], fill=(255, 0, 0, 128))

    preview_collision = preview.copy()
    preview_collision.alpha_composite(overlay)
    save(preview_collision, f"{out}-preview-collision.png")
else:
    print(f"No collision file found for '{args.input}', skipping preview-collision.")
