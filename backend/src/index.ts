import { sampleTickets, countByStatus } from "./data/sample-tickets.ts"
import type { Ticket } from "./models/ticket.ts"
import { Notification, EmailNotification } from "./notifications.ts"
import { TicketRepository } from "./ticket-repository.ts"
import { TicketService } from "./services/ticket-service.ts"
import { Repository } from "./repository.ts"


console.log("TeamBoard backend starting...")

console.log(countByStatus(sampleTickets))

const notification = new Notification("New user created")
console.log(notification.send())

const emailNotification = new EmailNotification("New ticket created", "user@example.com")
console.log(emailNotification.send())


const ticketRepository = new TicketRepository()
ticketRepository.add(sampleTickets[0] as Ticket)
ticketRepository.add(sampleTickets[1] as Ticket)
//ticketRepository.tickets; // Accessing the internal tickets map directly doesn't work
console.log("Exists: " + JSON.stringify(ticketRepository.findById((sampleTickets[0] as Ticket).id)))
console.log("Does not exist: " + JSON.stringify(ticketRepository.findById("non-existent-id")))

// Add another repository
const labelRepository = new Repository<{ "id": string, "label": string }>()
labelRepository.add({ id: "1", label: "First item" })
labelRepository.add({ id: "2", label: "Second item" })


// Add ticket service
const ticketService = new TicketService(ticketRepository)
const firstId = ((sampleTickets[0] as Ticket).id)
console.log("State: " + JSON.stringify(ticketRepository.findById(firstId)))
ticketService.moveToNextStatus(firstId)
console.log("State: " + JSON.stringify(ticketRepository.findById(firstId)))
ticketService.moveToNextStatus(firstId)
console.log("State: " + JSON.stringify(ticketRepository.findById(firstId)))