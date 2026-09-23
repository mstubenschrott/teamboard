import { z } from "zod"

const title = z.string().trim().min(1, "Field 'title' is required and cannot be empty")
const description = z.string().optional()
const assignee = z.string().trim().min(1, "Field 'assignee' if given cannot be empty").optional()
const status = z.enum(["To Do", "In Progress", "Done"], {
	message: "Field 'status' must be one of: To Do, In Progress, Done",
})

export const ticketSchema = z.object({
	id: z.string(),
	title,
	description,
	assignee,
	status,
})

export const createTicketSchema = ticketSchema.omit({ id: true }).strict()

export const updateTicketSchema = createTicketSchema.partial().strict()
