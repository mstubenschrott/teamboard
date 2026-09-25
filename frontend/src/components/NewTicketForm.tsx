import { useState, type FormEvent } from 'react'
import type { NewTicket } from '../ticket'

interface NewTicketFormProps {
  onAdd: (ticket: NewTicket) => Promise<void>,
}

function NewTicketForm({ onAdd }: NewTicketFormProps) {
  const [title, setTitle] = useState('')
  const [assignee, setAssignee] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    setLoading(true)
    try {
      await onAdd({
        title: trimmedTitle,
        ...(assignee.trim() && { assignee: assignee.trim() }),
        ...(description.trim() && { description: description.trim() }),
        status: 'To Do',
      })

      setTitle('')
      setAssignee('')
      setDescription('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create ticket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="card card-body mb-4 text-start" onSubmit={handleSubmit}>
      <h2 className="h5 mb-3">New Ticket</h2>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <div className="mb-3">
        <label htmlFor="ticket-title" className="form-label">Title</label>
        <input
          id="ticket-title"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="ticket-assignee" className="form-label">Assignee</label>
        <input
          id="ticket-assignee"
          className="form-control"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="Unassigned"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="ticket-description" className="form-label">Description</label>
        <textarea
          id="ticket-description"
          className="form-control"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Adding…' : 'Add ticket'}
      </button>
    </form>
  )
}

export default NewTicketForm
