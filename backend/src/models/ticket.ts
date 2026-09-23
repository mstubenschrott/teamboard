import type { z } from "zod"
import type { ticketSchema } from "../validation/ticket-validation.ts"

export type Ticket = z.infer<typeof ticketSchema>
