export type TileRef = {
  tilesetPath: string
  tilesetCols: number
  tilesetRows: number
  col: number
  row: number
}

export type CellData = TileRef | null
