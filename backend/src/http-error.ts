import type { ZodError } from "zod"

export class HttpError extends Error {
	status: number
	details: unknown

	constructor(status: number, message: string, details?: unknown) {
		super(message)
		this.name = "HttpError"
		this.status = status
		this.details = details
	}
}

export function schemaError(error: ZodError): HttpError {
	return new HttpError(422, "Wrong schema for endpoint", error.issues.map(i => i.message))
}