import type { Ticket } from "../models/ticket.ts"

const ticket1: Ticket = {
	title: "Create frontend",
	description: "Simple frontend for the TeamBoard",
	assignee: "Ömer",
	status: "In Progress"
}

const ticket2: Ticket = {
	title: "Create backend",
	description: "Simple backend for the TeamBoard",
	assignee: "Martin",
	status: "To Do"
}

const ticket3: Ticket = {
	title: "Create tests",
	description: "Simple tests for the TeamBoard",
	assignee: "Martin",
	status: "To Do"
}

export const sampleTickets = [ticket1, ticket2, ticket3]

export function countByStatus(tickets: Ticket[]): Record<Ticket["status"], number> {
	return tickets.reduce((counts, ticket) => {
		counts[ticket.status] = (counts[ticket.status] ?? 0) + 1
		return counts
	}, {} as Record<Ticket["status"], number>)
}