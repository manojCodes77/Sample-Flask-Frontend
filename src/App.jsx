import { useEffect, useState } from 'react'
import './App.css'
import { fetchNotes, createNote, updateNote, deleteNote } from './api'

function App() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', content: '' })
  const [editingId, setEditingId] = useState(null)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchNotes()
      setNotes(data)
    } catch (e) {
      setError(e.message || 'Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function onChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    try {
      if (editingId) {
        const updated = await updateNote(editingId, form)
        setNotes((ns) => ns.map((n) => (n.id === editingId ? updated : n)))
        setEditingId(null)
      } else {
        const created = await createNote(form)
        setNotes((ns) => [created, ...ns])
      }
      setForm({ title: '', content: '' })
      setError('')
    } catch (e) {
      setError(e.message || 'Request failed')
    }
  }

  async function onEdit(note) {
    setEditingId(note.id)
    setForm({ title: note.title, content: note.content || '' })
  }

  async function onDelete(id) {
    try {
      await deleteNote(id)
      setNotes((ns) => ns.filter((n) => n.id !== id))
    } catch (e) {
      setError(e.message || 'Delete failed')
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <h1>Notes</h1>
      {error && (
        <div style={{ color: 'red', marginBottom: 12 }}>Error: {error}</div>
      )}
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={onChange}
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={onChange}
          rows={4}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit">
            {editingId ? 'Update Note' : 'Add Note'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm({ title: '', content: '' })
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <hr style={{ margin: '16px 0' }} />
      {loading ? (
        <p>Loading...</p>
      ) : notes.length === 0 ? (
        <p>No notes yet. Add one above.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
          {notes.map((n) => (
            <li key={n.id} style={{ border: '1px solid #444', padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{n.title}</strong>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => onEdit(n)}>Edit</button>
                  <button onClick={() => onDelete(n.id)}>Delete</button>
                </div>
              </div>
              {n.content && <p style={{ marginTop: 8 }}>{n.content}</p>}
              <small style={{ color: '#888' }}>
                Created: {new Date(n.created_at).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
