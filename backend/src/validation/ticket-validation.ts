import { z } from "zod"

const title = z.string().trim().min(1, "Field 'title' is required and cannot be empty")
const description = z.string().optional()
const assignee = z.string().trim().min(1, "Field 'assignee' if given cannot be empty").optional()
const status = z.enum(["To Do", "In Progress", "Done"], {
	message: "Field 'status' must be one of: To Do, In Progress, Done",
})
const createdBy = z.string().trim().min(1, "Field 'createdBy' is required and cannot be empty")

export const ticketSchema = z.object({
	title,
	description,
	assignee,
	status,
	createdBy,
})

export const createTicketSchema = ticketSchema.omit({ createdBy: true }).strict()

export const updateTicketSchema = createTicketSchema.partial().strict()
