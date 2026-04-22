import { writeFileSync } from 'node:fs'
import path from 'node:path'

export async function POST(request: Request) {
  const body = await request.json()
  writeFileSync(
    path.join(process.cwd(), 'map.json'),
    JSON.stringify(body, null, 2)
  )
  return Response.json({ ok: true })
}
