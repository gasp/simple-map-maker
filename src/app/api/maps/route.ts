import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const CREATIONS_DIR = path.join(process.cwd(), 'creations')

function ensureCreationsDir() {
  if (!existsSync(CREATIONS_DIR)) mkdirSync(CREATIONS_DIR)
}

export async function GET() {
  ensureCreationsDir()
  const entries = readdirSync(CREATIONS_DIR)
  const maps = entries.filter((name) => statSync(path.join(CREATIONS_DIR, name)).isDirectory())
  return Response.json({ maps })
}

export async function POST(request: Request) {
  const { name } = await request.json()
  if (!name || typeof name !== 'string') {
    return Response.json({ error: 'invalid name' }, { status: 400 })
  }
  const sanitized = name.trim().replace(/[^a-z0-9_-]/gi, '-')
  if (!sanitized) return Response.json({ error: 'invalid name' }, { status: 400 })
  ensureCreationsDir()
  const dir = path.join(CREATIONS_DIR, sanitized)
  if (!existsSync(dir)) mkdirSync(dir)
  return Response.json({ name: sanitized })
}
