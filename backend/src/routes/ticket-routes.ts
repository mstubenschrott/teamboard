import { Router } from "express";
import { HttpError, schemaError } from "../http-error.ts";
import type { Ticket } from "../models/ticket.ts";
import { TicketService } from "../services/ticket-service.ts";
import { TicketRepository } from "../ticket-repository.ts";
import { sampleTickets } from "../data/sample-tickets.ts";
import { createTicketSchema, updateTicketSchema } from "../validation/ticket-validation.ts";

const ticketRepository = new TicketRepository()
for (const t of sampleTickets) ticketRepository.add(t)

const ticketService = new TicketService(ticketRepository)

function withoutUndefined<T extends object>(obj: T): { [K in keyof T]?: Exclude<T[K], undefined> } {
	return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as { [K in keyof T]?: Exclude<T[K], undefined> }
}

export function createTicketRoutes(): Router {
	const router = Router();

	router.get("/", (req, res) => {
		res.status(200).json(ticketRepository.getAll());
	});

	router.get("/:id", (req, res) => {
		const t = ticketRepository.findById(req.params.id)
		if (!t)
			throw new HttpError(404, "Ticket does not exist")

		res.status(200).json(t)
	});

	router.patch("/:id", (req, res) => {
		if (!ticketRepository.findById(req.params.id))
			throw new HttpError(404, "Ticket does not exist")

		const result = updateTicketSchema.safeParse(req.body ?? {})
		if (!result.success)
			throw schemaError(result.error)

		const t = ticketRepository.update(req.params.id, withoutUndefined(result.data))
		if (!t)
			throw new HttpError(400, "Could not update ticket")

		res.status(200).json(t)
	});

	router.post("/", (req, res) => {
		const result = createTicketSchema.safeParse(req.body ?? {})
		if (!result.success)
			throw schemaError(result.error)

		const { title, description, assignee, status } = result.data
		const newTicket: Ticket = {
			id: crypto.randomUUID(),
			title,
			...(assignee !== undefined && { assignee }),
			status,
			...(description !== undefined && { description }),
		}
		ticketRepository.add(newTicket)
		res.status(201).json({ success: true, url: `${req.originalUrl}/${newTicket.id}` })
	});

	router.delete("/:id", (req, res) => {
		if (ticketService.deleteTicket(req.params.id))
			res.status(204).end()
		else
			throw new HttpError(404, "Ticket " + req.params.id + " existiert nicht")
	});

	return router;
}
