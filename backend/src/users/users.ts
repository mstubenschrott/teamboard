import { z } from "zod"

const username = z.string().trim().min(1, "Field 'username' is required and cannot be empty")

export const loginSchema = z.object({
	username,
	password: z.string().min(1, "Field 'password' is required and cannot be empty"),
}).strict()

export const userSchema = z.object({
	username,
	passwordHash: z.string().trim().min(1, "Field 'passwordHash' is required and cannot be empty"),
}).strict()

export type User = z.infer<typeof userSchema>

export const registerSchema = z.object({
	username,
	password: z.string().min(8, "Field 'password' must be at least 8 characters long"),
}).strict()

class UserStore {
	private users: User[] = []

	add(user: User): User {
		if (this.users.some(u => u.username === user.username))
			throw new Error(`User '${user.username}' already exists`)

		this.users.push(user)
		return user
	}

	findByUsername(username: string): User | undefined {
		return this.users.find(u => u.username === username)
	}

	getAll(): User[] {
		return [...this.users]
	}
}

export const userStore = new UserStore()
