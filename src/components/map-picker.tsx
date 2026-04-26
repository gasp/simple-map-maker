'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  currentMap: string | null
  onSelect: (name: string) => void
  onClose: () => void
}

export function MapPicker({ currentMap, onSelect, onClose }: Props) {
  const [maps, setMaps] = useState<string[]>([])
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/maps')
      .then((r) => r.json())
      .then((data) => setMaps(data.maps))
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    const res = await fetch('/api/maps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    })
    const data = await res.json()
    setCreating(false)
    if (data.name) onSelect(data.name)
  }

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        zIndex: 100,
        background: '#1a1a1a',
        border: '1px solid #444',
        minWidth: 200,
        marginTop: 4,
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      }}
    >
      {maps.length === 0 && (
        <div style={{ padding: '8px 12px', color: '#666', fontSize: 13 }}>No maps yet</div>
      )}
      {maps.map((name) => (
        <button
          key={name}
          onClick={() => onSelect(name)}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: '7px 12px',
            background: name === currentMap ? '#2a4a6a' : 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          {name}
        </button>
      ))}
      <div style={{ borderTop: '1px solid #333', padding: '8px' }}>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: 6 }}>
          <input
            ref={inputRef}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="new map name"
            autoFocus
            style={{
              flex: 1,
              background: '#111',
              border: '1px solid #444',
              color: 'inherit',
              padding: '4px 8px',
              fontSize: 13,
            }}
          />
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            style={{
              padding: '4px 10px',
              background: '#2a4a6a',
              border: '1px solid #444',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {creating ? '…' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  )
}
