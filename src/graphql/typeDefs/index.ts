const typeDefs = /* GraphQL */ `
    type Query {
        hello: String
        me: User
    }
    
    type Mutation {
        register(
            username: String!
            password: String!
        ): User

        login(
            username: String!
            password: String!
        ): User
        
        logout: Boolean!
    }

    type Bet {
        id: ID!
        userID: ID!
        amount: Int!
        chance: Float!
        payout: Int!
        win: Boolean!
    }

    type User {
        id: ID!
        username: String!
        balance: Int!
    }`

export default typeDefs