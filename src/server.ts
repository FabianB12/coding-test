/* External dependencies */
import http from "http";
import dotenv from "dotenv";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "./server/cors";

/* Local dependencies */
import app from "./app";
import sequelize from "./database";
import auth from "./server/auth";
import apollo from "./server/apollo";

/* Schemas */
import { User } from "./database/models/user";

dotenv.config();

const port = process.env.PORT || 443;

// Stop the server from crashing when an unhandled promise is rejected
process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

// Stop the server from crashing when an uncaught exception is thrown
process.on("uncaughtException", (err) => {
    console.error(err.stack);
    console.log(
        "Uncaught Exception thrown! Node is still running, but a restart may be required."
    );
});

const httpServer = http.createServer(app);
const apolloServer = apollo(httpServer);

apolloServer.start().then(async () => {
    await sequelize.sync();
    console.log("[Database] Database setup complete!");

    app.use(cors, expressMiddleware(apolloServer, { context: auth }));

    await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
    console.log(`[HTTP] Server running at http://localhost:${port}`);
});
