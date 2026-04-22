'use client'

const TILE_SIZE = 16
const SCALE = 2

type Sprite = { col: number; row: number }

type Props = {
  src: string
  cols: number
  rows: number
  selectedSprite?: Sprite | null
  onSelect?: (sprite: Sprite) => void
}

function SpriteCell({
  sprite,
  src,
  cols,
  rows,
  isSelected,
  onClick,
}: {
  sprite: Sprite
  src: string
  cols: number
  rows: number
  isSelected: boolean
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
        outline: isSelected ? '2px solid #4af' : '1px solid transparent',
        outlineOffset: isSelected ? '-2px' : '-1px',
        boxSizing: 'border-box',
      }}
    />
  )
}

export function TilesSet({ src, cols, rows, selectedSprite, onSelect }: Props) {
  const sprites: Sprite[] = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      sprites.push({ col, row })
    }
  }

  return (
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
          isSelected={
            selectedSprite?.col === sprite.col &&
            selectedSprite?.row === sprite.row
          }
          onClick={() => onSelect?.(sprite)}
        />
      ))}
    </div>
  )
}
