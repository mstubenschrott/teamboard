import http from "http";
import express from "express";
import { MongoClient } from "mongodb";
import { ApolloServer } from "@apollo/server"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer"
import { expressMiddleware } from "@as-integrations/express5"

import { errorHandler } from "./error-handler.ts";
import { HttpError } from "./http-error.ts";
import { createTicketRoutes } from "./routes/ticket-routes.ts";
import type { Ticket } from "./models/ticket.ts";
import { typeDefs, resolvers } from "./graphql/schema.ts";


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

app.use("/tickets", await createTicketRoutes(db.collection<Ticket>("tickets")));

app.get("/users", (req, res) => {
	throw Error("Users not supported yet")
});

const apolloServer = new ApolloServer({
	typeDefs,
	resolvers,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

await apolloServer.start()

app.use("/graphql", express.json(), expressMiddleware(apolloServer));

app.use((req, res) => {
	throw new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`)
});

app.use(errorHandler);

httpServer.listen(port, () => {
	console.log(`Server listening on port ${port}`);
	console.log(`GraphQL endpoint at /graphql`);
});