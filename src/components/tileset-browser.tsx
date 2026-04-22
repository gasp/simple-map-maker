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

type Preview = {
  tileset: Tileset
  top: number
  right: number
}

function addRecent(prev: Tileset[], tileset: Tileset): Tileset[] {
  return [tileset, ...prev.filter((t) => t.path !== tileset.path)].slice(0, 3)
}

export function TilesetBrowser({ onTileSelect }: Props) {
  const [tilesets, setTilesets] = useState<Tileset[]>([])
  const [activeTileset, setActiveTileset] = useState<Tileset | null>(null)
  const [selectedSprite, setSelectedSprite] = useState<Sprite | null>(null)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [recent, setRecent] = useState<Tileset[]>([])

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
    setRecent((prev) => addRecent(prev, activeTileset))
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

  function handleTilesetClick(t: Tileset) {
    setActiveTileset(t)
    setSelectedSprite(null)
  }

  function handleMouseEnter(t: Tileset, e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const top = Math.min(rect.top, window.innerHeight - t.height - 8)
    setPreview({ tileset: t, top: Math.max(8, top), right: window.innerWidth - rect.left })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px' }}>

      {recent.length > 0 && (
        <div style={{ display: 'flex', gap: '4px' }}>
          {recent.map((t) => (
            <div
              key={t.path}
              title={t.name}
              onClick={() => handleTilesetClick(t)}
              style={{
                width: 100,
                height: 100,
                backgroundImage: `url(${t.path})`,
                backgroundSize: `${t.width}px ${t.height}px`,
                backgroundPosition: '0 0',
                backgroundRepeat: 'no-repeat',
                imageRendering: 'pixelated',
                cursor: 'pointer',
                border: t.path === activeTileset?.path ? '2px solid #4af' : '1px solid #444',
                boxSizing: 'border-box',
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      )}

      <div
        style={{
          border: '1px solid #444',
          maxHeight: '220px',
          overflowY: 'auto',
          fontSize: '12px',
        }}
      >
        {tilesets.map((t) => (
          <div
            key={t.path}
            onClick={() => handleTilesetClick(t)}
            onMouseEnter={(e) => handleMouseEnter(t, e)}
            onMouseLeave={() => setPreview(null)}
            style={{
              padding: '4px 8px',
              cursor: 'pointer',
              backgroundColor: t.path === activeTileset?.path ? '#2a4a6a' : 'transparent',
              whiteSpace: 'nowrap',
            }}
          >
            {t.name}
          </div>
        ))}
      </div>

      {activeTileset && (
        <TilesSet
          src={activeTileset.path}
          cols={Math.floor(activeTileset.width / TILE_SIZE)}
          rows={Math.floor(activeTileset.height / TILE_SIZE)}
          selectedSprite={selectedSprite}
          onSelect={handleSelect}
        />
      )}

      {preview && (
        <div
          style={{
            position: 'fixed',
            top: preview.top,
            right: preview.right,
            zIndex: 200,
            border: '1px solid #555',
            pointerEvents: 'none',
            background: '#111',
          }}
        >
          <img
            src={preview.tileset.path}
            width={preview.tileset.width}
            height={preview.tileset.height}
            style={{ display: 'block', imageRendering: 'pixelated' }}
            alt={preview.tileset.name}
          />
        </div>
      )}
    </div>
  )
}
