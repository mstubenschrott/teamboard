import { type Ticket } from "./models/ticket.ts"
import { Repository } from "./repository.ts"
import type { WithId } from "mongodb"

const VALID_STATUSES: Ticket["status"][] = ["To Do", "In Progress", "Done"]

export class TicketRepository<T extends Ticket> extends Repository<T> {
	override async update(id: string, changes: Partial<T>): Promise<WithId<T> | undefined> {
		if ("title" in changes && (changes.title === undefined || changes.title.trim() === ""))
			throw new Error("Field 'title' is required and cannot be empty")

		if ("status" in changes && !VALID_STATUSES.includes(changes.status as Ticket["status"]))
			throw new Error(`Field 'status' must be one of: ${VALID_STATUSES.join(", ")}`)

		return super.update(id, changes)
	}
}