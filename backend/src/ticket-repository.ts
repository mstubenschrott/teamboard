import { type Ticket } from "./models/ticket.ts"
import { Repository } from "./repository.ts"

export class TicketRepository<T extends Ticket> extends Repository<T> { }