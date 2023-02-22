/* External dependencies */
import {UUIDV4} from "sequelize";

const bcrypt = require('bcrypt');
import dotenv from 'dotenv';

/* Local dependencies */

/* Schemas */
import { User } from "../../database/models/user";

dotenv.config();

const resolver = {
    Query: {
        hello: () => 'Hello world!',
        me: (_, __, {req, res, user}) => {
            if (!user) {
                throw new Error('Not authenticated');
            }

            return user;
        }
    },
    Mutation: {
        register: async (_, { username, password }, { req, res, user}) => {
            if (user) throw new Error('User already logged in');

            // Check if user already exists
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                throw new Error('User already exists');
            }

            // Hash the password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create the user
            const newUser = await User.create({
                username,
                password: passwordHash,
                balance: 0
            });

            let sid = crypto.randomUUID();
            let expires = new Date(Date.now() + 604800000);

            await User.update({ sid, expires }, { where: { id: newUser.id } })

            res.cookie("sid", sid)

            return newUser;
        },
        login: async (_, { username, password }, { req, res, user}) => {
            return new Promise((resolve, reject) => {

                if (user) {
                    return reject(new Error('User already logged in'));
                }

                // Check if user exists
                User.findOne({ where: { username } }).then(user => {
                    if (!user) {
                        return reject(new Error('User does not exist'));
                    }

                    // Check the password
                    bcrypt.compare(password, user.password).then(async isPasswordValid => {
                        if (!isPasswordValid) {
                            return reject(new Error('Incorrect password'));
                        }


                        let sid = crypto.randomUUID();
                        let expires = new Date(Date.now() + 604800000);

                        await User.update({ sid, expires }, { where: { id: user.id } })

                        res.cookie("sid", sid)

                        // Return the user object
                        return resolve(user);
                    });
                });
            })
        },
        logout: async (_, __, { req, res, user }) => {
            if (!user) throw new Error('User not logged in');

            await User.update({ sid: null, expires: null }, { where: { id: user.id } })

            res.clearCookie("sid")

            return true;
        }
    }
}

export default resolver;