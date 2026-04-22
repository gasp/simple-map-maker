'use client'

import { useEffect, useState } from 'react'
import { TilesSet } from './tiles-set'
import type { TileRef } from '@/types/map'

type Tileset = {
  name: string
  path: string
  width: number
  height: number
}

type Sprite = { col: number; row: number }

const TILE_SIZE = 16

type Props = {
  onTileSelect?: (tile: TileRef) => void
}

export function TilesetBrowser({ onTileSelect }: Props) {
  const [tilesets, setTilesets] = useState<Tileset[]>([])
  const [activeTileset, setActiveTileset] = useState<Tileset | null>(null)
  const [selectedSprite, setSelectedSprite] = useState<Sprite | null>(null)

  useEffect(() => {
    fetch('/api/tilesets')
      .then((r) => r.json())
      .then((data: Tileset[]) => {
        setTilesets(data)
        setActiveTileset(data[0] ?? null)
      })
  }, [])

  function handleSelect(sprite: Sprite) {
    setSelectedSprite(sprite)
    if (!activeTileset) return
    const cols = Math.floor(activeTileset.width / TILE_SIZE)
    const rows = Math.floor(activeTileset.height / TILE_SIZE)
    onTileSelect?.({
      tilesetPath: activeTileset.path,
      tilesetCols: cols,
      tilesetRows: rows,
      col: sprite.col,
      row: sprite.row,
    })
  }

  function handleTilesetChange(path: string) {
    setActiveTileset(tilesets.find((t) => t.path === path) ?? null)
    setSelectedSprite(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px' }}>
      <select
        value={activeTileset?.path ?? ''}
        onChange={(e) => handleTilesetChange(e.target.value)}
        style={{ padding: '4px' }}
      >
        {tilesets.map((t) => (
          <option key={t.path} value={t.path}>
            {t.name}
          </option>
        ))}
      </select>
      {activeTileset && (
        <TilesSet
          src={activeTileset.path}
          cols={Math.floor(activeTileset.width / TILE_SIZE)}
          rows={Math.floor(activeTileset.height / TILE_SIZE)}
          selectedSprite={selectedSprite}
          onSelect={handleSelect}
        />
      )}
    </div>
  )
}
