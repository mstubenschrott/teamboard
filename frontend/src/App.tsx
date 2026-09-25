import { useState } from 'react'
import './App.css'
//import './styles/main.css'
import Column from './components/Column'
import LoginForm from './components/LoginForm'
import { sampleTickets, type TicketStatus } from './ticket'

const nextStatus: Record<TicketStatus, TicketStatus> = {
  'To Do': 'In Progress',
  'In Progress': 'Done',
  'Done': 'Done',
}

function App() {
  const [tickets, setTickets] = useState(sampleTickets)
  const [token, setToken] = useState<string | null>(null)

  function advance(id: number) {
    setTickets((tickets) =>
      tickets.map((ticket) =>
        ticket.id === id ? { ...ticket, status: nextStatus[ticket.status] } : ticket
      )
    )
  }

  return (
    <>
      <section id="center">
        <div className="container-fluid py-4">
          <h1 className="display-5 mb-4">TeamBoard</h1>

          {token
            ? <div className="alert alert-success">Logged in</div>
            : <LoginForm onLogin={setToken} />}

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
