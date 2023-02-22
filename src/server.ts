/* External dependencies */
import http from 'http';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { typeDefs, resolvers } from './graphql';
import cors from "./server/cors";
import { Request, Response } from "express";

/* Local dependencies */
import app from './app';
import sequelize from "./database";
import auth from './server/auth';
import session from './server/session';

/* Schemas */
import { User } from "./database/models/user";


dotenv.config();

const port = process.env.PORT || 443

// Stop the server from crashing when an unhandled promise is rejected
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason)
})

// Stop the server from crashing when an uncaught exception is thrown
process.on('uncaughtException', (err) => {
    console.error(err.stack)
    console.log("Uncaught Exception thrown! Node is still running, but a restart may be required.")
})

const httpServer = http.createServer(app)

interface Context {
    req: Request;
    res: Response;
    user?: User;
}

const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
    introspection: true,
});

server.start().then(async () => {
    app.use(session);

    await sequelize.sync();
    console.log("[Database] Database setup complete!")

    app.use(
        cors,
        expressMiddleware(server, {
            context: auth
    }));

    await new Promise<void>((resolve) => httpServer.listen({port}, resolve));
    console.log(`[HTTP] Server running at http://localhost:${port}`);
})