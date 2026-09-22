import type { Ticket } from "../models/ticket.ts";
import type { TicketRepository } from "../ticket-repository.ts";

export class TicketService {
	private repository: TicketRepository<Ticket>;

	constructor(repository: TicketRepository<Ticket>) {
		this.repository = repository;
	}

	moveToNextStatus(id: string): Ticket | undefined {
		const t = this.repository.findById(id)
		if (!t)
			return undefined

		switch (t.status) {
			case "To Do":
				t.status = "In Progress"
				break;
			case "In Progress":
				t.status = "Done";
				break;
			default:
			// Keep the current state
		}

		return t
	}

	deleteTicket(id: string): boolean {
		return this.repository.remove(id)
	}
}