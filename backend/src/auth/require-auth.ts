import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "../http-error.ts";

const jwtSecret = process.env.JWT_SECRET ?? "dev-secret";

declare global {
	namespace Express {
		interface Locals {
			user?: { username: string }
		}
	}
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
	const authHeader = req.header("Authorization")
	const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : undefined
	if (!token)
		throw new HttpError(401, "Missing or invalid Authorization header")

	try {
		const payload = jwt.verify(token, jwtSecret)
		if (typeof payload === "string" || typeof payload.sub !== "string")
			throw new HttpError(401, "Invalid token")

		res.locals.user = { username: payload.sub }
		next()
	} catch (err) {
		if (err instanceof HttpError) throw err
		throw new HttpError(401, "Invalid or expired token")
	}
}
