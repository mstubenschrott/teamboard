# TeamBoard — Ticket Management System

[![CI](https://github.com/mstubenschrott/teamboard/actions/workflows/ci.yml/badge.svg)](https://github.com/mstubenschrott/teamboard/actions/workflows/ci.yml)

## Overview

TeamBoard is a lightweight ticket management system for small teams. It allows users to create, manage, and track work items (tickets) through a simple workflow.

---

## Features

- **Create tickets** with a title, description, assignee, and status
- **Delete tickets** that are no longer needed
- **Assign tickets** to team members (or reassign to others)
- **Change ticket status** between `To Do`, `In Progress`, and `Done`
- **View all tickets** in a board overview

---

## Ticket Model

Each ticket contains the following fields:

| Field         | Type     | Description                                   |
| ------------- | -------- | --------------------------------------------- |
| `id`          | string   | Unique identifier (auto-generated)            |
| `title`       | string   | Short summary of the work item                |
| `description` | string   | Detailed explanation of the task              |
| `assignee`    | string   | Name of the person responsible for the ticket |
| `status`      | enum     | One of: `To Do` · `In Progress` · `Done`      |
| `createdAt`   | datetime | Timestamp of ticket creation                  |

---

## User Actions

- `Create Ticket` — Fill in title, description, and optionally assign it to someone; status defaults to `To Do`
- `Delete Ticket` — Remove a ticket permanently
- `Assign Ticket` — Set or change the assignee of a ticket
- `Change Status` — Move a ticket to `To Do`, `In Progress`, or `Done`

---

## Planned Tech Stack

| Layer    | Technology                                  |
| -------- | ------------------------------------------- |
| Frontend | HTML / CSS / JS (vanilla or React)          |
| Backend  | Node.js + Express                           |
| Storage  | In-memory (MVP) → JSON file or SQLite later |

---

## Project Structure (planned)

```
teamboard/
├── README.md
├── backend/
│   ├── server.js          # Express server & API routes
│   ├── ticketStore.js     # In-memory ticket storage logic
│   └── models/
│       └── ticket.js      # Ticket model / factory
├── frontend/
│   ├── index.html         # Board UI
│   ├── style.css          # Styling
│   └── app.js             # Frontend logic & API calls
└── package.json
```

---

## API Endpoints (planned)

| Method   | Path                        | Description                |
| -------- | --------------------------- | -------------------------- |
| `GET`    | `/api/tickets`              | List all tickets           |
| `POST`   | `/api/tickets`              | Create a new ticket        |
| `PATCH`  | `/api/tickets/:id/status`   | Update ticket status       |
| `PATCH`  | `/api/tickets/:id/assignee` | Reassign ticket to someone |
| `DELETE` | `/api/tickets/:id`          | Delete a ticket            |

My addition:
| `GET` | `/api/tickets/:id` | Get details of a ticket |

---

## Open Questions / To Decide

- [ ] Should users be able to filter/sort tickets (by status, assignee)?
- [ ] Is authentication needed, or is it open for all team members?
- [ ] Should tickets support priorities or due dates in a later version?
- [ ] Persist data in a file or a database (SQLite/PostgreSQL)?
- [ ] Use a frontend framework (React/Vue) or keep it vanilla JS?
