import { Router } from "express";
import jwt from "jsonwebtoken";
import { schemaError } from "../http-error.ts";
import { loginSchema } from "../validation/auth-validation.ts";
import { requireAuth } from "../require-auth.ts";

const jwtSecret = process.env.JWT_SECRET ?? "dev-secret";

export function createAuthRoutes(): Router {
	const router = Router();

	router.post("/login", (req, res) => {
		const result = loginSchema.safeParse(req.body ?? {})
		if (!result.success)
			throw schemaError(result.error)

		const { username } = result.data
		const token = jwt.sign({ sub: username }, jwtSecret, { expiresIn: "1h" })

		res.status(200).json({ success: true, token })
	});

	router.get("/profile", requireAuth, (req, res) => {
		res.status(200).json({ success: true, username: req.user!.username })
	});

	return router;
}
