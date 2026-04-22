import { TilesSet } from '@/components/tiles-set'

export default function Home() {
  return (
    <div style={{ display: 'flex' }}>
      <main style={{ flex: 1, padding: '20px' }}>
        <h1>Map</h1>
      </main>
      <aside>
        <TilesSet />
      </aside>
    </div>
  )
}
