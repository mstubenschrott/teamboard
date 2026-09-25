export type TicketStatus = 'To Do' | 'In Progress' | 'Done'

export interface Ticket {
  _id: string,
  title: string,
  assignee?: string,
  description?: string,
  status: TicketStatus,
  createdBy?: string,
}

export type NewTicket = Omit<Ticket, '_id' | 'createdBy'>
