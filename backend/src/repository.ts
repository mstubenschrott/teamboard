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

	update(id: string, changes: Partial<T>): T | undefined {
		const element = this.elements.get(id);
		if (!element)
			return undefined;

		for (const key of Object.keys(changes) as (keyof T)[]) {
			if (key === "id")
				throw Error("Cannot change ID")

			if (changes[key] === undefined || changes[key] === null)
				delete element[key];
			else
				element[key] = changes[key] as T[keyof T];
		}

		return element;
	}

	getAll(): T[] {
		return Array.from(this.elements.values())
	}
}