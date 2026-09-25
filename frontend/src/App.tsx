import { useState } from 'react'
import './App.css'
//import './styles/main.css'
import Column from './components/Column'
import LoginForm from './components/LoginForm'
import NewTicketForm from './components/NewTicketForm'
import { createTicket, getTickets, updateTicket } from './api'
import type { NewTicket, Ticket, TicketStatus } from './ticket'

const nextStatus: Record<TicketStatus, TicketStatus> = {
  'To Do': 'In Progress',
  'In Progress': 'Done',
  'Done': 'Done',
}

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function loadTickets(authToken: string) {
    try {
      setTickets(await getTickets(authToken))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load tickets')
    }
  }

  function handleLogin(newToken: string) {
    setToken(newToken)
    loadTickets(newToken)
  }

  async function advance(id: string) {
    const ticket = tickets.find((t) => t._id === id)
    if (!token || !ticket) return
    try {
      const updated = await updateTicket(token, id, { status: nextStatus[ticket.status] })
      setTickets((tickets) => tickets.map((ticket) => ticket._id === id ? updated : ticket))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not advance ticket')
    }
  }

  async function addTicket(ticket: NewTicket) {
    if (!token) return
    await createTicket(token, ticket)
    await loadTickets(token)
  }

  return (
    <>
      <section id="center">
        <div className="container-fluid py-4">
          <h1 className="display-5 mb-4">TeamBoard</h1>

          {token
            ? <div className="alert alert-success">Logged in</div>
            : <LoginForm onLogin={handleLogin} />}

          {error && <div className="alert alert-danger">{error}</div>}

          {token && <NewTicketForm onAdd={addTicket} />}

          {token &&
            <div className="row g-3">
              <Column status='To Do' className='todo' tickets={tickets} onAdvance={advance} />
              <Column status='In Progress' className='in-progress' tickets={tickets} onAdvance={advance} />
              <Column status='Done' className='done' tickets={tickets} onAdvance={advance} />
            </div>
          }
        </div>
      </section>

    </>
  )
}

export default App
