'use client'

import { useState } from 'react'

const TILE_SIZE = 16
const SCALE = 2
const OVERLAY_SCALE = 12

type Sprite = { col: number; row: number }

type Props = {
  src: string
  cols: number
  rows: number
}

function SpriteCell({
  sprite,
  src,
  cols,
  rows,
  onClick,
}: {
  sprite: Sprite
  src: string
  cols: number
  rows: number
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{
        width: TILE_SIZE * SCALE,
        height: TILE_SIZE * SCALE,
        backgroundImage: `url(${src})`,
        backgroundPosition: `-${sprite.col * TILE_SIZE * SCALE}px -${sprite.row * TILE_SIZE * SCALE}px`,
        backgroundSize: `${cols * TILE_SIZE * SCALE}px ${rows * TILE_SIZE * SCALE}px`,
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

export function TilesSet({ src, cols, rows }: Props) {
  const [selected, setSelected] = useState<Sprite | null>(null)

  const sprites: Sprite[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      sprites.push({ col, row })
    }
  }

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${TILE_SIZE * SCALE}px)`,
          gap: 0,
          width: 'fit-content',
        }}
      >
        {sprites.map((sprite) => (
          <SpriteCell
            key={`${sprite.col}-${sprite.row}`}
            sprite={sprite}
            src={src}
            cols={cols}
            rows={rows}
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
              width: TILE_SIZE * OVERLAY_SCALE,
              height: TILE_SIZE * OVERLAY_SCALE,
              backgroundImage: `url(${src})`,
              backgroundPosition: `-${selected.col * TILE_SIZE * OVERLAY_SCALE}px -${selected.row * TILE_SIZE * OVERLAY_SCALE}px`,
              backgroundSize: `${cols * TILE_SIZE * OVERLAY_SCALE}px ${rows * TILE_SIZE * OVERLAY_SCALE}px`,
              backgroundRepeat: 'no-repeat',
              imageRendering: 'pixelated',
            }}
          />
        </div>
      )}
    </>
  )
}
