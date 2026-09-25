import '../App.css'
import type { Ticket } from '../ticket'

interface TicketCardProps {
  ticket: Ticket,
  className: string,
  onAdvance: (id: number) => void,
}

function TicketCard({ ticket, className, onAdvance }: TicketCardProps) {
  return (
    <div className={`card ticket ${className}`}>
      <div className="card-body">
        <p className="card-text">{ticket.title}</p>
        {ticket.description && <p className="card-text">{ticket.description}</p>}
        <div className="d-flex justify-content-between align-items-center">
          <small className="assignee">{ticket.assignee}</small>
          {ticket.status !== 'Done' && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => onAdvance(ticket.id)}
              aria-label="Advance ticket"
            >
              &gt;
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TicketCard
