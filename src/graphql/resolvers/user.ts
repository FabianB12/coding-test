/* External dependencies */
const bcrypt = require('bcrypt');
import lds from 'lodash';

/* Local dependencies */
import passport from "../../server/auth/passport";

/* Schemas */
import { User } from "../../database/models/user";

const resolver = {
    Query: {
        hello: () => 'Hello world!',
        me: (_, __, context) => {
            // check if user has session
            console.log("Is authenticated: " + context.isAuthenticated())
            console.log("Is authenticated2: " + context.req.isAuthenticated())

            if (context.isAuthenticated() || context.getUser()) {
                return context.getUser();
            }
        }
    },
    Mutation: {
        register: async (_, { username, password }) => {
            // Check if user already exists
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                throw new Error('User already exists');
            }

            // Hash the password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create the user
            const user = await User.create({
                username,
                password: passwordHash,
                balance: 0
            });

            return user;
        },
        login: async (_, { username, password }, context) => {
            const { user } = await context.authenticate("graphql-local", {
                username,
                password
            });

            context.login(user);

            return user;
        }
    }
}

export default resolver;