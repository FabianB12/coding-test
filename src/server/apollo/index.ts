/* External dependencies */
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { Request, Response } from "express";

/* Local dependencies */
import { resolvers, typeDefs } from "../../graphql";

/* Schemas */
import { User } from "../../database/models/user";

interface Context {
    req: Request;
    res: Response;
    user?: User;
}

const apollo = (httpServer) => {
    const server = new ApolloServer<Context>({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        introspection: true,
    });

    return server;
};

export default apollo;
