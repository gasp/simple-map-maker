'use client'

import { useState } from 'react'
import { TilesetBrowser } from './tileset-browser'
import { MapGrid } from './map-grid'
import type { TileRef, CellData } from '@/types/map'

const GRID_SIZE = 16

function emptyGrid(): CellData[][] {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null))
}

export function MapEditor() {
  const [selectedTile, setSelectedTile] = useState<TileRef | null>(null)
  const [cells, setCells] = useState<CellData[][]>(emptyGrid)
  const [saving, setSaving] = useState(false)

  function handleCellClick(row: number, col: number) {
    if (!selectedTile) return
    setCells((prev) => {
      const next = prev.map((r) => [...r])
      next[row][col] = selectedTile
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    const payload = cells.map((row) =>
      row.map((cell) =>
        cell
          ? { tilesetPath: cell.tilesetPath, col: cell.col, row: cell.row }
          : null
      )
    )
    await fetch('/api/map', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cells: payload }),
    })
    setSaving(false)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <main style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <h1 style={{ margin: 0 }}>Map</h1>
          <button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
        <MapGrid cells={cells} onCellClick={handleCellClick} />
      </main>
      <aside style={{ borderLeft: '1px solid #333', overflow: 'auto', flexShrink: 0 }}>
        <TilesetBrowser onTileSelect={setSelectedTile} />
      </aside>
    </div>
  )
}
