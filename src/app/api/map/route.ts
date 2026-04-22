import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const LAYER_FILES = ['map-floor.json', 'map-low.json', 'map-high.json'] as const
const COLLISION_FILE = 'map-collision.json'
const EMPTY_GRID = Array.from({ length: 16 }, () => Array(16).fill(null))
const EMPTY_COLLISION = Array.from({ length: 16 }, () => Array(16).fill(false))

export async function GET() {
  const layers = LAYER_FILES.map((file) => {
    const filePath = path.join(process.cwd(), file)
    if (!existsSync(filePath)) return EMPTY_GRID
    const { cells } = JSON.parse(readFileSync(filePath, 'utf-8'))
    return cells
  })
  const collisionPath = path.join(process.cwd(), COLLISION_FILE)
  const collision = existsSync(collisionPath)
    ? JSON.parse(readFileSync(collisionPath, 'utf-8')).cells
    : EMPTY_COLLISION
  return Response.json({ layers, collision })
}

export async function POST(request: Request) {
  const { layers, collision } = await request.json()
  for (let i = 0; i < 3; i++) {
    writeFileSync(
      path.join(process.cwd(), LAYER_FILES[i]),
      JSON.stringify({ cells: layers[i] }, null, 2)
    )
  }
  writeFileSync(
    path.join(process.cwd(), COLLISION_FILE),
    JSON.stringify({ cells: collision }, null, 2)
  )
  return Response.json({ ok: true })
}
