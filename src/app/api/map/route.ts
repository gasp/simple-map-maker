import { writeFileSync } from 'node:fs'
import path from 'node:path'

const FILES = ['map-floor.json', 'map-low.json', 'map-high.json'] as const

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
