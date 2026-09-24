import http from "http";
import express from "express";
import { MongoClient } from "mongodb";
import { ApolloServer } from "@apollo/server"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { expressMiddleware } from "@as-integrations/express5"

import { errorHandler } from "./error-handler.ts";
import { HttpError } from "./http-error.ts";
import { createTicketRoutes } from "./routes/ticket-routes.ts";
import { createAuthRoutes } from "./auth/auth-routes.ts";
import type { Ticket } from "./models/ticket.ts";
import { createSchema } from "./graphql/schema.ts";
import { requireAuth } from "./auth/require-auth.ts";


console.log("TeamBoard backend starting...")

const mongoUrl = process.env.MONGO_URL ?? "mongodb://localhost:27017/teamboard";
const mongoClient = new MongoClient(mongoUrl);
await mongoClient.connect();
const db = mongoClient.db();
console.log("Connected to MongoDB");

const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT ?? 3000;

app.use(express.json());

app.use("/auth", createAuthRoutes());

app.use("/tickets", requireAuth, await createTicketRoutes(db.collection<Ticket>("tickets")));

const apolloServer = new ApolloServer({
	...createSchema(db.collection<Ticket>("tickets")),
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

await apolloServer.start()

app.use("/graphql", requireAuth, expressMiddleware(apolloServer, {
	context: async ({ res }) => ({ user: res.locals.user! }),
}));

app.use((req, res) => {
	throw new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`)
});

app.use(errorHandler);

httpServer.listen(port, () => {
	console.log(`Server listening on port ${port}`);
	console.log(`GraphQL endpoint at /graphql`);
});