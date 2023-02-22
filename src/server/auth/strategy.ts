import { GraphQLLocalStrategy } from "graphql-passport";
import bcrypt from 'bcrypt';

import { User } from "../../database/models/user";

const strategy = new GraphQLLocalStrategy(async (username: string, password: string, done) => {
    try {
        // Find the user in the database
        const user = await User.findOne({ where: { username }, raw: true });
        if (!user) {
            return done(new Error('Incorrect username or password'), false);
        }

        // Check the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return done(new Error('Incorrect username or password'), false);
        }

        // Return the user object
        return done(null, user);
    } catch (err) {
        return done(err);
    }
});

export default strategy;