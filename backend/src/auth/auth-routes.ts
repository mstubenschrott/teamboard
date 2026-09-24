import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { HttpError, schemaError } from "../http-error.ts";
import { loginSchema, registerSchema, userStore } from "../users/users.ts";
import { requireAuth } from "./require-auth.ts";

const jwtSecret = process.env.JWT_SECRET ?? "dev-secret";
const bcryptSaltRounds = 10;

export function createAuthRoutes(): Router {
	const router = Router();

	router.post("/login", async (req, res) => {
		const result = loginSchema.safeParse(req.body ?? {})
		if (!result.success)
			throw schemaError(result.error)

		const { username, password } = result.data
		const user = userStore.findByUsername(username)
		if (!user || !(await bcrypt.compare(password, user.passwordHash)))
			throw new HttpError(401, "Invalid username or password")

		const token = jwt.sign({ sub: username }, jwtSecret, { expiresIn: "1h" })

		res.status(200).json({ success: true, token })
	});

	router.post("/register", async (req, res) => {
		const result = registerSchema.safeParse(req.body ?? {})
		if (!result.success)
			throw schemaError(result.error)

		const { username, password } = result.data
		if (userStore.findByUsername(username))
			throw new HttpError(409, `User '${username}' already exists`)

		const passwordHash = await bcrypt.hash(password, bcryptSaltRounds)
		try {
			userStore.add({ username, passwordHash })
		} catch {
			throw new HttpError(409, `User '${username}' already exists`)
		}

		const token = jwt.sign({ sub: username }, jwtSecret, { expiresIn: "1h" })
		res.status(201).json({ success: true, token })
	});

	router.get("/profile", requireAuth, (_req, res) => {
		res.status(200).json({ success: true, username: res.locals.user!.username })
	});

	return router;
}
