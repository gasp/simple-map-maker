'use client'

import { useState } from 'react'

const TILE_SIZE = 16
const SCALE = 2
const COLS = 16
const ROWS = 15
const TILESET_SRC = '/Tilesets/TilesetElement.png'

type Sprite = { col: number; row: number }

function SpriteCell({
  sprite,
  onClick,
}: {
  sprite: Sprite
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{
        width: TILE_SIZE * SCALE,
        height: TILE_SIZE * SCALE,
        backgroundImage: `url(${TILESET_SRC})`,
        backgroundPosition: `-${sprite.col * TILE_SIZE * SCALE}px -${sprite.row * TILE_SIZE * SCALE}px`,
        backgroundSize: `${COLS * TILE_SIZE * SCALE}px ${ROWS * TILE_SIZE * SCALE}px`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        cursor: 'pointer',
        border: '1px solid transparent',
        boxSizing: 'border-box',
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.borderColor = '#888')
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.borderColor = 'transparent')
      }
    />
  )
}

export function TilesSet() {
  const [selected, setSelected] = useState<Sprite | null>(null)

  const sprites: Sprite[] = []
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      sprites.push({ col, row })
    }
  }

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, ${TILE_SIZE * SCALE}px)`,
          gap: 0,
          width: 'fit-content',
        }}
      >
        {sprites.map((sprite) => (
          <SpriteCell
            key={`${sprite.col}-${sprite.row}`}
            sprite={sprite}
            onClick={() => setSelected(sprite)}
          />
        ))}
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: TILE_SIZE * 12,
              height: TILE_SIZE * 12,
              backgroundImage: `url(${TILESET_SRC})`,
              backgroundPosition: `-${selected.col * TILE_SIZE * 12}px -${selected.row * TILE_SIZE * 12}px`,
              backgroundSize: `${COLS * TILE_SIZE * 12}px ${ROWS * TILE_SIZE * 12}px`,
              backgroundRepeat: 'no-repeat',
              imageRendering: 'pixelated',
            }}
          />
        </div>
      )}
    </>
  )
}
