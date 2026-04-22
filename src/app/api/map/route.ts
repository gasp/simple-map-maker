import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const FILES = ['map-floor.json', 'map-low.json', 'map-high.json'] as const
const EMPTY_GRID = Array.from({ length: 16 }, () => Array(16).fill(null))

export async function GET() {
  const layers = FILES.map((file) => {
    const filePath = path.join(process.cwd(), file)
    if (!existsSync(filePath)) return EMPTY_GRID
    const { cells } = JSON.parse(readFileSync(filePath, 'utf-8'))
    return cells
  })
  return Response.json({ layers })
}

export async function POST(request: Request) {
  const { layers } = await request.json()
  for (let i = 0; i < 3; i++) {
    writeFileSync(
      path.join(process.cwd(), FILES[i]),
      JSON.stringify({ cells: layers[i] }, null, 2)
    )
  }
  return Response.json({ ok: true })
}
