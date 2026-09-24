import { z } from "zod"

export const loginSchema = z.object({
	username: z.string().trim().min(1, "Field 'username' is required and cannot be empty"),
}).strict()
