export class Repository<T extends { "id": string }> {
	private elements: Map<string, T>;

	constructor() {
		this.elements = new Map<string, T>();
	}

	add(element: T): void {
		// Add the ticket to the repository, overwriting an existing ticket with the same ID if it exists
		// Change, if it should throw an exception instead of overwriting an existing ticket
		this.elements.set(element.id, element);
	}

	findById(id: string): T | undefined {
		return this.elements.get(id);
	}
}