import { ObjectId, type Collection, type WithId } from "mongodb";

export class Repository<T extends object> {
	private collection: Collection<T>;

	constructor(collection: Collection<T>) {
		this.collection = collection;
	}

	async add(element: T): Promise<WithId<T>> {
		const result = await this.collection.insertOne(element as never);
		return { ...element, _id: result.insertedId } as WithId<T>;
	}

	async findById(id: string): Promise<WithId<T> | undefined> {
		if (!ObjectId.isValid(id))
			return undefined;

		const element = await this.collection.findOne({ _id: new ObjectId(id) } as never);
		return element ?? undefined;
	}

	async remove(id: string): Promise<boolean> {
		if (!ObjectId.isValid(id))
			return false;

		const result = await this.collection.deleteOne({ _id: new ObjectId(id) } as never);
		return result.deletedCount > 0;
	}

	async update(id: string, changes: Partial<T>): Promise<WithId<T> | undefined> {
		if (!ObjectId.isValid(id))
			return undefined;

		if ("_id" in changes)
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
			{ _id: new ObjectId(id) } as never,
			update,
			{ returnDocument: "after" }
		);

		return result ?? undefined;
	}

	async getAll(): Promise<WithId<T>[]> {
		return this.collection.find({} as never).toArray();
	}
}