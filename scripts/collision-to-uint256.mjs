import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const { cells } = JSON.parse(
  readFileSync(resolve(__dirname, "../map-collision.json"), "utf8")
);

let bits = 0n;
for (let row = 0; row < 16; row++) {
  for (let col = 0; col < 16; col++) {
    if (cells[row][col]) {
      bits |= 1n << BigInt(row * 16 + col);
    }
  }
}

console.log("0x" + bits.toString(16).padStart(64, "0"));
