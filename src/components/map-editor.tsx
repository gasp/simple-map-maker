'use client'

import { useState } from 'react'
import { TilesetBrowser } from './tileset-browser'
import { MapGrid } from './map-grid'
import type { TileRef, CellData, LayerIndex } from '@/types/map'
import { LAYER_NAMES } from '@/types/map'

const GRID_SIZE = 16

type Layers = [CellData[][], CellData[][], CellData[][]]

function emptyGrid(): CellData[][] {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null))
}

function emptyLayers(): Layers {
  return [emptyGrid(), emptyGrid(), emptyGrid()]
}

export function MapEditor() {
  const [selectedTile, setSelectedTile] = useState<TileRef | null>(null)
  const [layers, setLayers] = useState<Layers>(emptyLayers)
  const [activeLayer, setActiveLayer] = useState<LayerIndex>(0)
  const [saving, setSaving] = useState(false)

  function handleCellClick(row: number, col: number) {
    if (!selectedTile) return
    setLayers((prev) => {
      const next: Layers = [
        prev[0].map((r) => [...r]),
        prev[1].map((r) => [...r]),
        prev[2].map((r) => [...r]),
      ]
      next[activeLayer][row][col] = selectedTile
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    const payload = layers.map((grid) =>
      grid.map((row) =>
        row.map((cell) =>
          cell ? { tilesetPath: cell.tilesetPath, col: cell.col, row: cell.row } : null
        )
      )
    )
    await fetch('/api/map', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ layers: payload }),
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
            marginBottom: '12px',
          }}
        >
          <h1 style={{ margin: 0 }}>Map</h1>
          {selectedTile && (
            <div
              title={`${selectedTile.tilesetPath} (${selectedTile.col}, ${selectedTile.row})`}
              style={{
                width: 32,
                height: 32,
                backgroundImage: `url(${selectedTile.tilesetPath})`,
                backgroundPosition: `-${selectedTile.col * 32}px -${selectedTile.row * 32}px`,
                backgroundSize: `${selectedTile.tilesetCols * 32}px ${selectedTile.tilesetRows * 32}px`,
                backgroundRepeat: 'no-repeat',
                imageRendering: 'pixelated',
                border: '1px solid #444',
                flexShrink: 0,
              }}
            />
          )}
          <button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

        <div style={{ display: 'flex', marginBottom: '8px' }}>
          {LAYER_NAMES.map((name, i) => (
            <button
              key={i}
              onClick={() => setActiveLayer(i as LayerIndex)}
              style={{
                padding: '4px 14px',
                cursor: 'pointer',
                color: 'inherit',
                backgroundColor: activeLayer === i ? '#2a4a6a' : 'transparent',
                border: '1px solid #444',
                borderRight: i < 2 ? 'none' : '1px solid #444',
              }}
            >
              {name}
            </button>
          ))}
        </div>

        <MapGrid layers={layers} onCellClick={handleCellClick} />
      </main>
      <aside style={{ borderLeft: '1px solid #333', overflow: 'auto', flexShrink: 0 }}>
        <TilesetBrowser onTileSelect={setSelectedTile} />
      </aside>
    </div>
  )
}
