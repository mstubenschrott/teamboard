import type { NewTicket, Ticket } from './ticket'

async function apiFetch(path: string, init: RequestInit = {}, token?: string) {
  let response: Response
  try {
    response = await fetch(path, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...init.headers,
      },
    })
  } catch {
    throw new Error('Could not reach the server')
  }

  const data = response.status === 204 ? null : await response.json()
  if (!response.ok)
    throw new Error(data?.error ?? `Request failed (${response.status})`)
  return data
}

export async function login(username: string, password: string): Promise<string> {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  return data.token
}

export function getTickets(token: string): Promise<Ticket[]> {
  return apiFetch('/tickets', {}, token)
}

export async function createTicket(token: string, ticket: NewTicket): Promise<void> {
  await apiFetch('/tickets', { method: 'POST', body: JSON.stringify(ticket) }, token)
}

export function updateTicket(token: string, id: string, changes: Partial<NewTicket>): Promise<Ticket> {
  return apiFetch(`/tickets/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }, token)
}
