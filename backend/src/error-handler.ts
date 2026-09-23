import type { NextFunction, Request, Response } from "express"
import { HttpError } from "./http-error.ts"

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
	if (res.headersSent) {
		next(err)
		return
	}

	if (err instanceof HttpError) {
		res.status(err.status).json({ success: false, error: err.message, details: err.details })
		return
	}

	if (err instanceof SyntaxError && "type" in err && err.type === "entity.parse.failed") {
		res.status(400).json({ success: false, error: "Malformed JSON in request body", details: err.message })
		return
	}

	console.error(err)
	res.status(500).json({ success: false, error: "Internal server error" })
}
