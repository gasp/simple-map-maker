import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const LAYER_FILES = ['floor.json', 'low.json', 'high.json'] as const
const COLLISION_FILE = 'collision.json'
const EMPTY_GRID = Array.from({ length: 16 }, () => Array(16).fill(null))
const EMPTY_COLLISION = Array.from({ length: 16 }, () => Array(16).fill(false))

function mapDir(mapName: string) {
  return path.join(process.cwd(), 'creations', mapName)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mapName = searchParams.get('map')
  if (!mapName) {
    return Response.json({ layers: [EMPTY_GRID, EMPTY_GRID, EMPTY_GRID], collision: EMPTY_COLLISION })
  }
  const dir = mapDir(mapName)
  const layers = LAYER_FILES.map((file) => {
    const filePath = path.join(dir, file)
    if (!existsSync(filePath)) return EMPTY_GRID
    const { cells } = JSON.parse(readFileSync(filePath, 'utf-8'))
    return cells
  })
  const collisionPath = path.join(dir, COLLISION_FILE)
  const collision = existsSync(collisionPath)
    ? JSON.parse(readFileSync(collisionPath, 'utf-8')).cells
    : EMPTY_COLLISION
  return Response.json({ layers, collision })
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const mapName = searchParams.get('map')
  if (!mapName) return Response.json({ error: 'map name required' }, { status: 400 })
  const { layers, collision } = await request.json()
  const dir = mapDir(mapName)
  for (let i = 0; i < 3; i++) {
    writeFileSync(path.join(dir, LAYER_FILES[i]), JSON.stringify({ cells: layers[i] }, null, 2))
  }
  writeFileSync(path.join(dir, COLLISION_FILE), JSON.stringify({ cells: collision }, null, 2))
  return Response.json({ ok: true })
}
