import type { Ticket, TicketStatus } from '../ticket'
import TicketCard from './TicketCard'

interface ColumnProps {
  status: TicketStatus,
  className: string,
  tickets: Ticket[],
  onAdvance: (id: number) => void,
}

function Column({ status, className, tickets, onAdvance }: ColumnProps) {
  return (
    <div className="col-12 col-md-4">
      <div className={`column ${className}`}>
        <h2>{status}</h2>
        {tickets
          .filter((ticket) => ticket.status === status)
          .map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} className={className} onAdvance={onAdvance} />
          ))}
      </div>
    </div>
  )
}

export default Column
