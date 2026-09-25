export type TicketStatus = 'To Do' | 'In Progress' | 'Done'

export interface Ticket {
  id: number,
  title: string,
  assignee: string,
  description?: string,
  status: TicketStatus,
}

export const sampleTickets: Ticket[] = [
  { id: 1, title: 'Set up project repository', assignee: 'Alice', status: 'To Do' },
  { id: 2, title: 'Write API specification', assignee: 'Unassigned', status: 'To Do' },
  { id: 3, title: 'Design database schema', assignee: 'Bob', status: 'To Do' },
  { id: 4, title: 'Implement ticket creation endpoint', assignee: 'Carol', status: 'In Progress' },
  { id: 5, title: 'Build board UI layout', assignee: 'Alice', status: 'In Progress' },
  { id: 6, title: 'Define ticket data model', assignee: 'Bob', status: 'Done' },
  { id: 7, title: 'Set up Node.js + Express boilerplate', assignee: 'Carol', status: 'Done' },
]
