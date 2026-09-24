import type { Collection, WithId } from "mongodb";

function withoutMongoId<T>(document: WithId<T>): T {
	const { _id, ...rest } = document;
	return rest as T;
}

export class Repository<T extends { "id": string }> {
	private collection: Collection<T>;

	constructor(collection: Collection<T>) {
		this.collection = collection;
	}

	async add(element: T): Promise<void> {
		await this.collection.insertOne(element as never);
	}

	async findById(id: string): Promise<T | undefined> {
		const element = await this.collection.findOne({ id } as never);
		return element ? withoutMongoId(element) : undefined;
	}

	async remove(id: string): Promise<boolean> {
		const result = await this.collection.deleteOne({ id } as never);
		return result.deletedCount > 0;
	}

	async update(id: string, changes: Partial<T>): Promise<T | undefined> {
		if ("id" in changes)
			throw Error("Cannot change ID")

		const setFields: Partial<T> = {};
		const unsetFields: Partial<Record<keyof T, "">> = {};

		for (const key of Object.keys(changes) as (keyof T)[]) {
			if (changes[key] === undefined || changes[key] === null)
				unsetFields[key] = "";
			else
				setFields[key] = changes[key];
		}

		const update: Record<string, unknown> = {};
		if (Object.keys(setFields).length > 0)
			update.$set = setFields;
		if (Object.keys(unsetFields).length > 0)
			update.$unset = unsetFields;

		const result = await this.collection.findOneAndUpdate(
			{ id } as never,
			update,
			{ returnDocument: "after" }
		);

		return result ? withoutMongoId(result) : undefined;
	}

	async getAll(): Promise<T[]> {
		const elements = await this.collection.find({} as never).toArray();
		return elements.map(withoutMongoId);
	}
}