import { Router } from "express";
import type { Collection } from "mongodb";
import { HttpError, schemaError } from "../http-error.ts";
import type { Ticket } from "../models/ticket.ts";
import { TicketService } from "../services/ticket-service.ts";
import { TicketRepository } from "../ticket-repository.ts";
import { sampleTickets } from "../data/sample-tickets.ts";
import { createTicketSchema, updateTicketSchema } from "../validation/ticket-validation.ts";

function withoutUndefined<T extends object>(obj: T): { [K in keyof T]?: Exclude<T[K], undefined> } {
	return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as { [K in keyof T]?: Exclude<T[K], undefined> }
}

export async function createTicketRoutes(ticketsCollection: Collection<Ticket>): Promise<Router> {
	const ticketRepository = new TicketRepository(ticketsCollection)

	if ((await ticketRepository.getAll()).length === 0)
		for (const t of sampleTickets) await ticketRepository.add(t)

	const ticketService = new TicketService(ticketRepository)

	const router = Router();

	router.get("/", async (req, res) => {
		res.status(200).json(await ticketRepository.getAll());
	});

	router.get("/:id", async (req, res) => {
		const t = await ticketRepository.findById(req.params.id)
		if (!t)
			throw new HttpError(404, "Ticket does not exist")

		res.status(200).json(t)
	});

	router.patch("/:id", async (req, res) => {
		if (!(await ticketRepository.findById(req.params.id)))
			throw new HttpError(404, "Ticket does not exist")

		const result = updateTicketSchema.safeParse(req.body ?? {})
		if (!result.success)
			throw schemaError(result.error)

		const t = await ticketRepository.update(req.params.id, withoutUndefined(result.data))
		if (!t)
			throw new HttpError(400, "Could not update ticket")

		res.status(200).json(t)
	});

	router.post("/", async (req, res) => {
		const result = createTicketSchema.safeParse(req.body ?? {})
		if (!result.success)
			throw schemaError(result.error)

		const { title, description, assignee, status } = result.data
		const newTicket: Ticket = {
			title,
			...(assignee !== undefined && { assignee }),
			status,
			...(description !== undefined && { description }),
		}
		const created = await ticketRepository.add(newTicket)
		res.status(201).json({ success: true, url: `${req.originalUrl}/${created._id}` })
	});

	router.delete("/:id", async (req, res) => {
		if (await ticketService.deleteTicket(req.params.id))
			res.status(204).end()
		else
			throw new HttpError(404, "Ticket " + req.params.id + " existiert nicht")
	});

	return router;
}
