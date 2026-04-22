'use client'

import { useEffect, useState } from 'react'
import { TilesSet } from './tiles-set'

type Tileset = {
  name: string
  path: string
  width: number
  height: number
}

const TILE_SIZE = 16

export function TilesetBrowser() {
  const [tilesets, setTilesets] = useState<Tileset[]>([])
  const [selected, setSelected] = useState<Tileset | null>(null)

  useEffect(() => {
    fetch('/api/tilesets')
      .then((r) => r.json())
      .then((data: Tileset[]) => {
        setTilesets(data)
        setSelected(data[0] ?? null)
      })
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <select
        value={selected?.path ?? ''}
        onChange={(e) =>
          setSelected(tilesets.find((t) => t.path === e.target.value) ?? null)
        }
        style={{ padding: '4px' }}
      >
        {tilesets.map((t) => (
          <option key={t.path} value={t.path}>
            {t.name}
          </option>
        ))}
      </select>
      {selected && (
        <TilesSet
          src={selected.path}
          cols={Math.floor(selected.width / TILE_SIZE)}
          rows={Math.floor(selected.height / TILE_SIZE)}
        />
      )}
    </div>
  )
}
