const typeDefs = /* GraphQL */ `
    type Query {
        me: User
        getUser(id: Int): User
        getUserList: [User!]

        getBet(id: Int): Bet
        getBetList: [Bet!]
        getBestBetPerUser(limit: Int): [Bet!]
    }

    type Mutation {
        register(username: String!, password: String!): User

        login(username: String!, password: String!): User

        updateSeed(client_seed: String!): Boolean!

        logout: Boolean!

        createBet(amount: Int!, chance: Float!): Bet
    }

    type Bet {
        id: ID!
        userID: ID!
        amount: Float!
        chance: Float!
        payout: Float!
        win: Boolean!
    }

    type User {
        id: ID!
        username: String!
        balance: Float!
        client_seed: String
        private_seed_hash: String
    }
`;

export default typeDefs;
