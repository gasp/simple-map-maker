'use client'

import type { CellData } from '@/types/map'

const GRID_SIZE = 16
const CELL_SIZE = 32

type Props = {
  layers: [CellData[][], CellData[][], CellData[][]]
  collision: boolean[][]
  showGrid: boolean
  showCollision: boolean
  onCellClick: (row: number, col: number) => void
  onCellRightClick: (row: number, col: number) => void
}

function Cell({
  layerData,
  isWall,
  showGrid,
  showCollision,
  onClick,
  onRightClick,
}: {
  layerData: CellData[]
  isWall: boolean
  showGrid: boolean
  showCollision: boolean
  onClick: () => void
  onRightClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      onContextMenu={(e) => { e.preventDefault(); onRightClick() }}
      style={{
        position: 'relative',
        width: CELL_SIZE,
        height: CELL_SIZE,
        boxSizing: 'border-box',
        border: showGrid ? '1px solid #2a2a2a' : 'none',
        cursor: 'crosshair',
        backgroundColor: '#111',
      }}
    >
      {layerData.map((data, i) =>
        data ? (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${data.tilesetPath})`,
              backgroundPosition: `-${data.col * CELL_SIZE}px -${data.row * CELL_SIZE}px`,
              backgroundSize: `${data.tilesetCols * CELL_SIZE}px ${data.tilesetRows * CELL_SIZE}px`,
              backgroundRepeat: 'no-repeat',
              imageRendering: 'pixelated',
            }}
          />
        ) : null
      )}
      {showCollision && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: isWall ? 'rgba(220, 50, 50, 0.55)' : 'rgba(60, 200, 60, 0.15)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}

export function MapGrid({ layers, collision, showGrid, showCollision, onCellClick, onCellRightClick }: Props) {
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
            layerData={[layers[0][row][col], layers[1][row][col], layers[2][row][col]]}
            isWall={collision[row][col]}
            showGrid={showGrid}
            showCollision={showCollision}
            onClick={() => onCellClick(row, col)}
            onRightClick={() => onCellRightClick(row, col)}
          />
        ))
      )}
    </div>
  )
}
