import type { WithId } from "mongodb";
import type { Ticket } from "../models/ticket.ts";
import type { TicketRepository } from "../ticket-repository.ts";

export class TicketService {
	private repository: TicketRepository<Ticket>;

	constructor(repository: TicketRepository<Ticket>) {
		this.repository = repository;
	}

	async moveToNextStatus(id: string): Promise<WithId<Ticket> | undefined> {
		const t = await this.repository.findById(id)
		if (!t)
			return undefined

		let status = t.status
		switch (t.status) {
			case "To Do":
				status = "In Progress"
				break;
			case "In Progress":
				status = "Done";
				break;
			default:
			// Keep the current state
		}

		return this.repository.update(id, { status })
	}

	async deleteTicket(id: string): Promise<boolean> {
		return this.repository.remove(id)
	}

	async assign(id: string, assignee: string): Promise<WithId<Ticket> | undefined> {
		return this.repository.update(id, { assignee })
	}

	async setStatus(id: string, status: string): Promise<WithId<Ticket> | undefined> {
		if ((["To Do", "In Progress", "Done"].indexOf(status) < 0))
			return undefined

		return this.repository.update(id, { status: status as Ticket["status"] })
	}
}