export type TileRef = {
  tilesetPath: string
  tilesetCols: number
  tilesetRows: number
  col: number
  row: number
}

export type CellData = TileRef | null
export type LayerIndex = 0 | 1 | 2
export const LAYER_NAMES = ['Floor', 'Low', 'High'] as const
