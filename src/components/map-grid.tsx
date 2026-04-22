'use client'

import type { CellData } from '@/types/map'

const GRID_SIZE = 16
const CELL_SIZE = 32

type Props = {
  cells: CellData[][]
  onCellClick: (row: number, col: number) => void
}

function Cell({ data, onClick }: { data: CellData; onClick: () => void }) {
  const tileStyle = data
    ? {
        backgroundImage: `url(${data.tilesetPath})`,
        backgroundPosition: `-${data.col * CELL_SIZE}px -${data.row * CELL_SIZE}px`,
        backgroundSize: `${data.tilesetCols * CELL_SIZE}px ${data.tilesetRows * CELL_SIZE}px`,
        backgroundRepeat: 'no-repeat' as const,
        imageRendering: 'pixelated' as const,
      }
    : {}

  return (
    <div
      onClick={onClick}
      style={{
        width: CELL_SIZE,
        height: CELL_SIZE,
        boxSizing: 'border-box',
        border: '1px solid #2a2a2a',
        cursor: 'crosshair',
        backgroundColor: '#111',
        ...tileStyle,
      }}
    />
  )
}

export function MapGrid({ cells, onCellClick }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
        gap: 0,
        width: 'fit-content',
        border: '1px solid #444',
      }}
    >
      {Array.from({ length: GRID_SIZE }, (_, row) =>
        Array.from({ length: GRID_SIZE }, (_, col) => (
          <Cell
            key={`${row}-${col}`}
            data={cells[row][col]}
            onClick={() => onCellClick(row, col)}
          />
        ))
      )}
    </div>
  )
}
