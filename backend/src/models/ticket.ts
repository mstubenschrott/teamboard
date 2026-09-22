export interface Ticket {
	id: string;
	title: string;
	description: string;
	assignee: string;
	status: "To Do" | "In Progress" | "Done";
}
