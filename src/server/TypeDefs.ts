import { gql } from 'apollo-server-express'

export const typeDefs = gql`
    type Query {
        users: [User!]!
        channels: [Channel!]!
    }

    type User {
        id: ID!
        name: String!
    }

    type Channel {
        id: ID!
        title: String!
        messages: [Message!]
    }

    type Message {
        id: ID!
        body: String!
        createdAt: String!
    }

    type Mutation {
        sendMessage(userId: ID!, channelId: ID!, body: String!): Message
    }

    type Subscription {
        messageOnChannel(channelId: ID!): Message
    }
`
