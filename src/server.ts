/* External dependencies */
import http from 'http';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { typeDefs, resolvers } from './graphql';
import { buildContext } from "graphql-passport";
import cors from "./server/cors";

/* Local dependencies */
import app from './app';
import sequelize from "./database";
import passport from './server/auth/passport';
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

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
});

server.start().then(async () => {
    app.use(session);

    await sequelize.sync();
    console.log("[Database] Database setup complete!")

    app.use(passport.initialize());
    app.use(passport.session());

    console.log("[Auth] Auth setup complete!")

    app.use(
        cors,
        expressMiddleware(server, {
            context: async ({ req, res }) =>
                buildContext({ req, res, User }),
    }));

    await new Promise<void>((resolve) => httpServer.listen({port}, resolve));
    console.log(`[HTTP] Server running at http://localhost:${port}`);
})