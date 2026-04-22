import { TilesetBrowser } from '@/components/tileset-browser'

export default function Home() {
  return (
    <div style={{ display: 'flex' }}>
      <main style={{ flex: 1, padding: '20px' }}>
        <h1>Map</h1>
      </main>
      <aside>
        <TilesetBrowser />
      </aside>
    </div>
  )
}
