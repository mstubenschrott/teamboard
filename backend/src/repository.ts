export class Repository<T extends { "id": string }> {
	private elements: Map<string, T>;

	constructor() {
		this.elements = new Map<string, T>();
	}

	add(element: T): void {
		this.elements.set(element.id, element);
	}

	findById(id: string): T | undefined {
		return this.elements.get(id);
	}

	remove(id: string): boolean {
		return this.elements.delete(id);
	}

	getAll(): T[] {
		return Array.from(this.elements.values())
	}
}