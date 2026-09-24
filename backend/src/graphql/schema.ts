import { GraphQLError } from "graphql";
import type { Collection, WithId } from "mongodb";
import type { Ticket } from "../models/ticket.ts";
import { TicketRepository } from "../ticket-repository.ts";
import { TicketService } from "../services/ticket-service.ts";
import { createTicketSchema, updateTicketSchema } from "../validation/ticket-validation.ts";

function withoutUndefined<T extends object>(obj: T): { [K in keyof T]?: Exclude<T[K], undefined> } {
	return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as { [K in keyof T]?: Exclude<T[K], undefined> }
}

export const typeDefs = `#graphql
	enum TicketStatus {
		TODO
		IN_PROGRESS
		DONE
	}

	type Ticket {
		id: ID!
		title: String!
		description: String
		assignee: String
		status: TicketStatus!
	}

	type Query {
		tickets: [Ticket!]!
		ticket(id: ID!): Ticket
	}

	type Mutation {
		addTicket(title: String!, description: String, assignee: String, status: TicketStatus!): Ticket!
		updateTicket(id: ID!, title: String, description: String, assignee: String, status: TicketStatus): Ticket
		deleteTicket(id: ID!): Boolean!
	}
`

const STATUS_TO_GRAPHQL: Record<Ticket["status"], string> = {
	"To Do": "TODO",
	"In Progress": "IN_PROGRESS",
	"Done": "DONE",
}

const STATUS_FROM_GRAPHQL: Record<string, Ticket["status"]> = {
	TODO: "To Do",
	IN_PROGRESS: "In Progress",
	DONE: "Done",
}

function toGraphQLTicket(ticket: WithId<Ticket>) {
	return { ...ticket, id: String(ticket._id), status: STATUS_TO_GRAPHQL[ticket.status] }
}

export interface GraphQLContext {
	user: { username: string }
}

export function createSchema(ticketsCollection: Collection<Ticket>) {
	const ticketRepository = new TicketRepository(ticketsCollection)
	const ticketService = new TicketService(ticketRepository)

	const resolvers = {
		Query: {
			tickets: async () => (await ticketRepository.getAll()).map(toGraphQLTicket),
			ticket: async (_parent: unknown, args: { id: string }) => {
				const t = await ticketRepository.findById(args.id)
				return t ? toGraphQLTicket(t) : null
			},
		},
		Mutation: {
			addTicket: async (_parent: unknown, args: { title: string, description?: string, assignee?: string, status: string }, context: GraphQLContext) => {
				const result = createTicketSchema.safeParse({
					title: args.title,
					...(args.description !== undefined && { description: args.description }),
					...(args.assignee !== undefined && { assignee: args.assignee }),
					status: STATUS_FROM_GRAPHQL[args.status],
				})
				if (!result.success)
					throw new GraphQLError("Wrong schema for ticket", { extensions: { details: result.error.issues.map(i => i.message) } })

				const created = await ticketRepository.add({ ...result.data, createdBy: context.user.username })
				return toGraphQLTicket(created)
			},
			updateTicket: async (_parent: unknown, args: { id: string, title?: string, description?: string, assignee?: string, status?: string }, context: GraphQLContext) => {
				const existing = await ticketRepository.findById(args.id)
				if (!existing)
					return null

				if (existing.createdBy !== context.user.username)
					throw new GraphQLError("Only the ticket creator can update this ticket", { extensions: { status: 403, code: "FORBIDDEN" } })

				const result = updateTicketSchema.safeParse({
					...(args.title !== undefined && { title: args.title }),
					...(args.description !== undefined && { description: args.description }),
					...(args.assignee !== undefined && { assignee: args.assignee }),
					...(args.status !== undefined && { status: STATUS_FROM_GRAPHQL[args.status] }),
				})
				if (!result.success)
					throw new GraphQLError("Wrong schema for ticket", { extensions: { details: result.error.issues.map(i => i.message) } })

				const t = await ticketRepository.update(args.id, withoutUndefined(result.data))
				return t ? toGraphQLTicket(t) : null
			},
			deleteTicket: async (_parent: unknown, args: { id: string }, context: GraphQLContext) => {
				const existing = await ticketRepository.findById(args.id)
				if (!existing)
					return false

				if (existing.createdBy !== context.user.username)
					throw new GraphQLError("Only the ticket creator can delete this ticket", { extensions: { status: 403, code: "FORBIDDEN" } })

				return ticketService.deleteTicket(args.id)
			},
		},
	}

	return { typeDefs, resolvers }
}
