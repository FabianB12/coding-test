/* External dependencies */
import dotenv from "dotenv";
import sha256 from "sha256";

/* Local dependencies */
import randomSeed from "../../utils/randomSeed";

/* Schemas */
import { User } from "../../database/models/user";

const bcrypt = require("bcrypt");

dotenv.config();

const resolver = {
    Query: {
        me: (_, __, { req, res, user }) => {
            if (!user) {
                throw new Error("Not authenticated");
            }

            return { ...user, private_seed_hash: sha256(user.private_seed) };
        },
        getUser: async (_, { id }: { id: number }, { req, res, user }) => {
            try {
                let user = await User.findOne({ where: { id }, raw: true });
                return {
                    ...user,
                    private_seed_hash: sha256(user.private_seed),
                };
            } catch (err) {
                console.log(err);
                throw new Error("User not found");
            }
        },
        getUserList: async (_, __, { req, res, user }) => {
            try {
                let users = await User.findAll({ raw: true });
                return users.map((user) => {
                    return {
                        ...user,
                        private_seed_hash: sha256(user.private_seed),
                    };
                });
            } catch (err) {
                console.log(err);
                throw new Error("Error while fetching users!");
            }
        },
    },
    Mutation: {
        register: async (
            _,
            { username, password }: { username: string; password: string },
            { req, res, user }
        ) => {
            if (user) throw new Error("User already logged in");

            // Check if user already exists
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                throw new Error("User already exists");
            }

            // Hash the password
            const passwordHash = await bcrypt.hash(password, 10);

            let sid = crypto.randomUUID();
            let expires = new Date(Date.now() + 604800000);

            let private_seed = randomSeed(32);
            let client_seed = randomSeed(10);

            // Create the user
            const newUser = await User.create({
                username,
                password: passwordHash,
                balance: 100,
                sid,
                expires,
                private_seed,
                client_seed,
            });

            res.cookie("sid", sid);

            return newUser;
        },
        login: async (
            _,
            { username, password }: { username: string; password: string },
            { req, res, user }
        ) => {
            return new Promise((resolve, reject) => {
                if (user) {
                    return reject(new Error("User already logged in"));
                }

                // Check if user exists
                User.findOne({ where: { username } }).then((user) => {
                    if (!user) {
                        return reject(new Error("User does not exist"));
                    }

                    // Check the password
                    bcrypt
                        .compare(password, user.password)
                        .then(async (isPasswordValid) => {
                            if (!isPasswordValid) {
                                return reject(new Error("Incorrect password"));
                            }

                            let sid = crypto.randomUUID();
                            let expires = new Date(Date.now() + 604800000);

                            await User.update(
                                { sid, expires },
                                { where: { id: user.id } }
                            );

                            res.cookie("sid", sid);

                            // Return the user object
                            return resolve(user);
                        });
                });
            });
        },
        logout: async (_, __, { req, res, user }) => {
            if (!user) throw new Error("User not logged in");

            await User.update(
                { sid: null, expires: null },
                { where: { id: user.id } }
            );

            res.clearCookie("sid");

            return true;
        },
        updateSeed: async (
            _,
            { client_seed }: { client_seed: string },
            { req, res, user }
        ) => {
            if (!user) throw new Error("User not logged in");

            if (client_seed.length < 3)
                throw new Error(
                    "Client seed must be at least 3 characters long!"
                );
            if (client_seed.length > 12)
                throw new Error(
                    "Client seed must be at most 12 characters long!"
                );

            await User.update({ client_seed }, { where: { id: user.id } });

            return true;
        },
    },
};

export default resolver;
