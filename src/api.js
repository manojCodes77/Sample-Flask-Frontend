// Vite exposes env variables via import.meta.env
const BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8080'

export async function fetchNotes() {
  const res = await fetch(`${BASE}/api/notes`)
  if (!res.ok) throw new Error('Failed to fetch notes')
  return res.json()
}

export async function createNote({ title, content }) {
  const res = await fetch(`${BASE}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  })
  if (!res.ok) throw new Error('Failed to create note')
  return res.json()
}

export async function updateNote(id, { title, content }) {
  const res = await fetch(`${BASE}/api/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
  })
  if (!res.ok) throw new Error('Failed to update note')
  return res.json()
}

export async function deleteNote(id) {
  const res = await fetch(`${BASE}/api/notes/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete note')
  return res.json()
}