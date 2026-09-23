import express from "express";
import { sampleTickets } from "./data/sample-tickets.ts";
import type { Ticket } from "./models/ticket.ts";
import { TicketService } from "./services/ticket-service.ts";
import { TicketRepository } from "./ticket-repository.ts";


console.log("TeamBoard backend starting...")

const ticketRepository = new TicketRepository()
for (const t of sampleTickets) ticketRepository.add(t)

const ticketService = new TicketService(ticketRepository)

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());

app.get("/tickets", (req, res) => {
	res.status(200).json(ticketRepository.getAll());
});

app.get("/tickets/:id", (req, res) => {
	const t = ticketRepository.findById(req.params.id)
	if (!t)
		return res.status(404).json({ success: false, error: "Ticket does not exist" })

	res.status(200).json(t)
});


app.patch("/tickets/:id", (req, res) => {
	if (!ticketRepository.findById(req.params.id))
		return res.status(404).json({ success: false, error: "Ticket does not exist" })

	let t;
	try {
		t = ticketRepository.update(req.params.id, req.body ?? {})
	} catch (err) {
		return res.status(400).json({ success: false, error: err instanceof Error ? err.message : "Could not update ticket" })
	}

	if (!t)
		return res.status(400).json({ success: false, error: "Could not update ticket" })

	res.status(200).json(t)
});

app.post("/tickets", (req, res) => {
	const { title, description, assignee, status } = req.body
	if (!title || !status)
		return res.status(400).json({ success: false, error: "One of the required fields 'title', 'assignee' or 'status' is missing" })

	const newTicket: Ticket = { id: crypto.randomUUID(), title, description, assignee, status }
	ticketRepository.add(newTicket)
	res.status(201).json({ success: true, url: `${req.originalUrl}/${newTicket.id}` })
});

app.delete("/tickets/:id", (req, res) => {
	if (ticketService.deleteTicket(req.params.id))
		res.status(204).json({})
	else
		res.status(404).json({ success: false, error: "Ticket " + req.params.id + " existiert nicht" })
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
// 
// 
// console.log(countByStatus(sampleTickets))
// 
// const notification = new Notification("New user created")
// console.log(notification.send())
// 
// const emailNotification = new EmailNotification("New ticket created", "user@example.com")
// console.log(emailNotification.send())
// 
// 
// ticketRepository.add(sampleTickets[0] as Ticket)
// ticketRepository.add(sampleTickets[1] as Ticket)
// //ticketRepository.tickets; // Accessing the internal tickets map directly doesn't work
// console.log("Exists: " + JSON.stringify(ticketRepository.findById((sampleTickets[0] as Ticket).id)))
// console.log("Does not exist: " + JSON.stringify(ticketRepository.findById("non-existent-id")))
// 
// // Add ticket service
// const firstId = ((sampleTickets[0] as Ticket).id)
// console.log("State: " + JSON.stringify(ticketRepository.findById(firstId)))
// ticketService.moveToNextStatus(firstId)
// console.log("State: " + JSON.stringify(ticketRepository.findById(firstId)))
// ticketService.moveToNextStatus(firstId)
// console.log("State: " + JSON.stringify(ticketRepository.findById(firstId)))
// 
// // Remove an item
// ticketService.deleteTicket(firstId)
// console.log("State: " + JSON.stringify(ticketRepository.findById(firstId)))
// 
// console.log("Server exited successfully")