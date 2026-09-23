import { Router } from "express";
import { HttpError } from "../http-error.ts";
import type { Ticket } from "../models/ticket.ts";
import { TicketService } from "../services/ticket-service.ts";
import { TicketRepository } from "../ticket-repository.ts";
import { sampleTickets } from "../data/sample-tickets.ts";

const ticketRepository = new TicketRepository()
for (const t of sampleTickets) ticketRepository.add(t)

const ticketService = new TicketService(ticketRepository)

export function createTicketRoutes(): Router {
	const router = Router();

	router.get("/tickets", (req, res) => {
		res.status(200).json(ticketRepository.getAll());
	});

	router.get("/tickets/:id", (req, res) => {
		const t = ticketRepository.findById(req.params.id)
		if (!t)
			throw new HttpError(404, "Ticket does not exist")

		res.status(200).json(t)
	});

	router.patch("/tickets/:id", (req, res) => {
		if (!ticketRepository.findById(req.params.id))
			throw new HttpError(404, "Ticket does not exist")

		let t;
		try {
			t = ticketRepository.update(req.params.id, req.body ?? {})
		} catch (err) {
			throw new HttpError(400, err instanceof Error ? err.message : "Could not update ticket")
		}

		if (!t)
			throw new HttpError(400, "Could not update ticket")

		res.status(200).json(t)
	});

	router.post("/tickets", (req, res) => {
		const { title, description, assignee, status } = req.body
		if (!title || !status)
			throw new HttpError(400, "One of the required fields 'title', 'assignee' or 'status' is missing")

		const newTicket: Ticket = { id: crypto.randomUUID(), title, description, assignee, status }
		ticketRepository.add(newTicket)
		res.status(201).json({ success: true, url: `${req.originalUrl}/${newTicket.id}` })
	});

	router.delete("/tickets/:id", (req, res) => {
		if (ticketService.deleteTicket(req.params.id))
			res.status(204).end()
		else
			throw new HttpError(404, "Ticket " + req.params.id + " existiert nicht")
	});

	return router;
}
