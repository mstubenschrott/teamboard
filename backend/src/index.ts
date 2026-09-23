import express from "express";
import { errorHandler } from "./error-handler.ts";
import { HttpError } from "./http-error.ts";
import { createTicketRoutes } from "./routes/ticket-routes.ts";


console.log("TeamBoard backend starting...")

const app = express();
const port = process.env.PORT ?? 3000;

app.use(express.json());

app.use(createTicketRoutes());

app.get("/users", (req, res) => {
	throw Error("Users not supported yet")
});

app.use((req, res) => {
	throw new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`)
});

app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});