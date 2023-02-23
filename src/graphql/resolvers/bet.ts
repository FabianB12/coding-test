/* External dependencies */
import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";

/* Local dependencies */
import updateBalance from "../../utils/updateBalance";

/* Schemas */
import { Bet } from "../../database/models/bet";
import crypto from "crypto";
import { User } from "../../database/models/user";
import randomSeed from "../../utils/randomSeed";

dotenv.config();

const resolver = {
    Query: {
        getBet: async (_, { id }, { req, res, user }) => {
            try {
                return await Bet.findOne({ where: { id }, raw: true });
            } catch (err) {
                console.log(err);
                throw new Error("Bet not found");
            }
        },

        getBetList: async (_, __, { req, res, user }) => {
            try {
                return await Bet.findAll({ raw: true });
            } catch (err) {
                console.log(err);
                throw new Error("Error while fetching bets!");
            }
        },

        getBestBetPerUser: async (_, { limit }, { user }) => {
            try {
                const bets = await Bet.findAll({
                    attributes: [
                        "id",
                        "userID",
                        "amount",
                        "chance",
                        "payout",
                        "win",
                    ],
                    where: {
                        win: true,
                    },
                    order: [[Sequelize.literal("chance"), "ASC"]],
                    limit,
                    raw: true,
                });

                const filteredBets = bets.reduce((acc, bet) => {
                    if (!acc[bet.userID]) acc[bet.userID] = bet;
                    return acc;
                }, {});

                return Object.values(filteredBets);
            } catch (err) {
                console.error(err);
                throw new Error("Error while fetching bets!");
            }
        },
    },
    Mutation: {
        createBet: async (_, { amount, chance }, { req, res, user }) => {
            if (!user) throw new Error("Not logged in!");

            user = await User.findByPk(user.id, {
                raw: true,
            });

            if (amount < 1) throw new Error("Amount must be greater than 0!");
            if (chance < 1 || chance > 99)
                throw new Error("Chance must be between 1 and 99!");

            if (user.balance < amount) throw new Error("Not enough balance!");

            try {
                await updateBalance(user.id, -amount);

                let hmac = crypto.createHmac(
                    "SHA512",
                    `${user.client_seed}:${user.private_seed}`
                );
                let buffer = hmac.digest();
                let ticket = buffer.readUInt32BE() / Math.pow(2, 32);

                let payout = -amount;
                let win = false;

                if (ticket * 100 < chance) {
                    win = true;
                    payout = amount * (100 / chance);
                }

                let bet = await Bet.create({
                    userID: user.id,
                    amount,
                    chance,
                    payout,
                    win,
                    createdAt: new Date(),
                    hash: `${user.client_seed}:${user.private_seed}`,
                    ticket,
                });

                await User.update(
                    {
                        private_seed: randomSeed(32),
                    },
                    { where: { id: user.id } }
                );

                if (win) await updateBalance(user.id, payout);

                return bet;
            } catch (e) {
                console.error(e);
                throw new Error("Error while creating bet!");
            }
        },
    },
};
export default resolver;
