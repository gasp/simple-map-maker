import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

type Tileset = {
  name: string
  path: string
  width: number
  height: number
}

function readPngSize(filePath: string) {
  const buf = readFileSync(filePath)
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
}

function scan(dir: string, root: string): Tileset[] {
  const results: Tileset[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...scan(full, root))
    } else if (entry.name.toLowerCase().endsWith('.png')) {
      const { width, height } = readPngSize(full)
      const rel = path.relative(root, full).split(path.sep).join('/')
      results.push({
        name: path.basename(entry.name, path.extname(entry.name)),
        path: `/Tilesets/${rel}`,
        width,
        height,
      })
    }
  }
  return results
}

export async function GET() {
  const root = path.join(process.cwd(), 'public', 'Tilesets')
  return Response.json(scan(root, root))
}
